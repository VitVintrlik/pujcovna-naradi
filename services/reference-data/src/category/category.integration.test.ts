import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, beforeEach, describe, it } from 'node:test';
import type { ErrorCode } from '@pujcovna/shared';
import { createCategoryEndpoint, listCategoriesEndpoint } from '@pujcovna/shared';
import type { Request } from 'express';
import { createApp } from '../app';
import { environment } from '../env';
import { AppError } from '../errors';
import { prisma } from '../prisma';
import type { CategoryAuthorization } from './category.routes';
import { createCategory } from './category.service';

const TEST_DATABASE_PREFIX = '/pujcovna_categories_test_';
const TEST_HOST = '127.0.0.1';
const DYNAMIC_PORT = 0;
const REQUEST_TIMEOUT_MS = 5_000;
const WORKER_ID = 'integration-worker';
const MAX_CATEGORY_NAME_LENGTH = 100;
const CONCURRENT_REQUESTS = 8;
const INVALID_POSTGRES_TEXT = '\u0000';

if (!new URL(environment.DATABASE_URL).pathname.startsWith(TEST_DATABASE_PREFIX)) {
  throw new Error('Integration tests require a disposable pujcovna_categories_test_* database.');
}

// These injected test middleware do not verify tokens and are never used by index.ts.
const testAuthorization = ({
  isSignedIn = true,
  isWorker = true,
  hasActor = true,
} = {}): CategoryAuthorization => {
  const actors = new WeakMap<Request, string>();
  return {
    requireAuth: (request, _response, next) => {
      if (!isSignedIn) {
        throw new AppError('UNAUTHORIZED', 'Sign-in is required.');
      }
      if (hasActor) {
        actors.set(request, WORKER_ID);
      }
      next();
    },
    requireWorker: (_request, _response, next) => {
      if (!isWorker) {
        throw new AppError('FORBIDDEN', 'Worker role is required.');
      }
      next();
    },
    getActorId: (request) => actors.get(request),
  };
};

const withApp = async (
  authorization: CategoryAuthorization | undefined,
  run: (baseUrl: string) => Promise<void>,
) => {
  const server = createApp(authorization).listen(DYNAMIC_PORT, TEST_HOST);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');

  try {
    await run(`http://${TEST_HOST}:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
};

const postCategory = async (baseUrl: string, body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${baseUrl}${createCategoryEndpoint.path}`, {
    method: createCategoryEndpoint.method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

const expectError = async (response: Response, status: number, code: ErrorCode) => {
  assert.equal(response.status, status);
  const body: unknown = await response.json();
  assert.partialDeepStrictEqual(body, { error: { code } });
};

const expectNoWrites = async () => {
  assert.equal(await prisma.category.count(), 0);
  assert.equal(await prisma.auditLogEntry.count(), 0);
};

describe('category API against disposable PostgreSQL', () => {
  beforeEach(async () => {
    await prisma.$transaction([prisma.auditLogEntry.deleteMany(), prisma.category.deleteMany()]);
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it('keeps GET public and returns an empty list', async () => {
    await withApp(undefined, async (baseUrl) => {
      const response = await fetch(`${baseUrl}${listCategoriesEndpoint.path}`);
      assert.equal(response.status, 200);
      assert.deepEqual(listCategoriesEndpoint.response.parse(await response.json()), []);
    });
  });

  it('keeps POST closed without shared auth, including forged identity headers and fields', async () => {
    await withApp(undefined, async (baseUrl) => {
      await expectError(await postCategory(baseUrl, { name: 'Blocked' }), 401, 'UNAUTHORIZED');
      await expectError(
        await postCategory(
          baseUrl,
          { name: 'Blocked', actorId: WORKER_ID, userId: WORKER_ID, role: 'worker' },
          { Authorization: 'Bearer invalid', 'X-User-Id': WORKER_ID, 'X-Role': 'worker' },
        ),
        401,
        'UNAUTHORIZED',
      );
      await expectNoWrites();
    });
  });

  it('runs the supplied authentication middleware before validation or writes', async () => {
    await withApp(testAuthorization({ isSignedIn: false }), async (baseUrl) => {
      await expectError(await postCategory(baseUrl, {}), 401, 'UNAUTHORIZED');
      await expectNoWrites();
    });
  });

  it('runs the supplied worker guard before validation or writes', async () => {
    await withApp(testAuthorization({ isWorker: false }), async (baseUrl) => {
      await expectError(await postCategory(baseUrl, {}), 403, 'FORBIDDEN');
      await expectNoWrites();
    });
  });

  it('rejects a missing authenticated actor even when middleware passes', async () => {
    await withApp(testAuthorization({ hasActor: false }), async (baseUrl) => {
      await expectError(await postCategory(baseUrl, { name: 'Blocked' }), 401, 'UNAUTHORIZED');
      await expectNoWrites();
    });
  });

  it('creates a trimmed category and records the authenticated worker in the same transaction', async () => {
    await withApp(testAuthorization(), async (baseUrl) => {
      const response = await postCategory(baseUrl, {
        name: '  Vrtačky  ',
        id: 'client-supplied-id',
        actorId: 'forged-actor',
        role: 'customer',
      });
      assert.equal(response.status, 201);
      const rawBody: unknown = await response.json();
      const category = createCategoryEndpoint.response.parse(rawBody);
      assert.deepEqual(rawBody, { id: category.id, name: 'Vrtačky' });

      const stored = await prisma.category.findUniqueOrThrow({ where: { id: category.id } });
      assert.deepEqual(stored, category);
      const audit = await prisma.auditLogEntry.findMany({ where: { entityId: category.id } });
      assert.equal(audit.length, 1);
      assert.partialDeepStrictEqual(audit[0], {
        actorId: WORKER_ID,
        actorRole: 'worker',
        action: 'category.create',
        entityType: 'category',
        entityId: category.id,
      });
    });
  });

  it('rejects invalid contract bodies without writing anything', async () => {
    const invalidBodies = [
      {},
      { name: '' },
      { name: '  ' },
      { name: null },
      { name: 123 },
      { name: 'x'.repeat(MAX_CATEGORY_NAME_LENGTH + 1) },
      [],
      null,
    ];
    await withApp(testAuthorization(), async (baseUrl) => {
      for (const body of invalidBodies) {
        await expectError(await postCategory(baseUrl, body), 400, 'VALIDATION_FAILED');
      }
      await expectNoWrites();
    });
  });

  it('accepts a name at the contract length limit', async () => {
    await withApp(testAuthorization(), async (baseUrl) => {
      const name = 'x'.repeat(MAX_CATEGORY_NAME_LENGTH);
      const response = await postCategory(baseUrl, { name });
      assert.equal(response.status, 201);
      assert.equal(createCategoryEndpoint.response.parse(await response.json()).name, name);
    });
  });

  it('returns a validation error for malformed JSON', async () => {
    await withApp(testAuthorization(), async (baseUrl) => {
      const response = await fetch(`${baseUrl}${createCategoryEndpoint.path}`, {
        method: createCategoryEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: '{"name":',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await expectError(response, 400, 'VALIDATION_FAILED');
      await expectNoWrites();
    });
  });

  it('rejects a duplicate after trimming and creates no extra audit entry', async () => {
    await withApp(testAuthorization(), async (baseUrl) => {
      assert.equal((await postCategory(baseUrl, { name: 'Pily' })).status, 201);
      const duplicate = await postCategory(baseUrl, { name: '  Pily  ' });
      assert.equal(duplicate.status, 400);
      assert.partialDeepStrictEqual(await duplicate.json(), {
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Kategorie s tímto názvem již existuje. Zadejte jiný název.',
        },
      });
      assert.equal(await prisma.category.count(), 1);
      assert.equal(await prisma.auditLogEntry.count(), 1);
    });
  });

  it('allows exactly one concurrent creation of the same name', async () => {
    await withApp(testAuthorization(), async (baseUrl) => {
      const responses = await Promise.all(
        Array.from({ length: CONCURRENT_REQUESTS }, () =>
          postCategory(baseUrl, { name: 'Concurrent category' }),
        ),
      );
      assert.equal(responses.filter(({ status }) => status === 201).length, 1);
      const rejected = responses.filter(({ status }) => status !== 201);
      assert.equal(rejected.length, CONCURRENT_REQUESTS - 1);
      await Promise.all(
        rejected.map((response) => expectError(response, 400, 'VALIDATION_FAILED')),
      );
      assert.equal(await prisma.category.count(), 1);
      assert.equal(await prisma.auditLogEntry.count(), 1);
    });
  });

  it('rolls back the category when the audit insert fails', async () => {
    // PostgreSQL text rejects NUL, forcing the audit insert to fail after category creation.
    await assert.rejects(createCategory('Rollback category', INVALID_POSTGRES_TEXT));
    await expectNoWrites();
  });

  it('returns created categories alphabetically with only contract fields', async () => {
    const last = await createCategory('Z category', WORKER_ID);
    const first = await createCategory('A category', WORKER_ID);
    await withApp(undefined, async (baseUrl) => {
      const response = await fetch(`${baseUrl}${listCategoriesEndpoint.path}`);
      assert.equal(response.status, 200);
      const rawBody: unknown = await response.json();
      assert.deepEqual(rawBody, [first, last]);
      listCategoriesEndpoint.response.parse(rawBody);
    });
  });

  it('returns the required-name message from the agreed business use case', async () => {
    await withApp(testAuthorization(), async (baseUrl) => {
      for (const body of [{}, { name: null }, { name: '' }, { name: '   ' }]) {
        const response = await postCategory(baseUrl, body);
        assert.equal(response.status, 400);
        assert.partialDeepStrictEqual(await response.json(), {
          error: { code: 'VALIDATION_FAILED', message: 'Název kategorie je povinný.' },
        });
      }
      await expectNoWrites();
    });
  });
});
