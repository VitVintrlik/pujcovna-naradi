# Reference data: categories

## Current integration status

`GET /categories` is public and lists categories alphabetically.
The creation handler validates `createCategoryEndpoint.body`, returns `201`,
rejects duplicate names (including concurrent requests), and writes the category
and its audit entry in one Prisma transaction.

**Category creation is not enabled for real users yet.**
The default `createApp()` used by `src/index.ts` rejects every `POST /categories`
with `401 UNAUTHORIZED`. A bearer token, a role header, or identity fields in the
body do not enable the route.

At verification on 2026-11-02, the local branch and GitHub `main` at
`0aaedf40032e7359c0ea00f159906dc1b17c0edd` had no `packages/server`,
`requireAuth`, `requireRole`, Better Auth implementation, or JWT verifier.
There were no open pull requests supplying them. Authentication is a shared
team dependency described in
[`services/AGENTS.md`](../AGENTS.md) and
[architecture sections 2.6 and 4.3](../../docs/rozhodnuti/2026-10-28-architecture.md).

## Connecting the team's authentication

Pass a `CategoryAuthorization` object to `createApp` at the service entry point:

- `requireAuth`: the team's `requireAuth()` middleware, verifying the JWT from
  `services/auth` through `jose`.
- `requireWorker`: the team's `requireRole(...)` middleware configured for
  the worker role.
- `getActorId`: an adapter reading only the verified request context populated
  by `requireAuth`. Never read identity from body, query, params, or an unverified
  header.

Both middleware run before validation and database access. A missing actor ID
is also rejected. The adapter deliberately does not invent the team's future
request-context shape. No local authentication substitute or bypass is included.

After wiring the shared implementation, verify a real worker JWT (201), a
customer JWT (403), and missing, invalid, and expired tokens (401). These real
authentication cases remain pending; injected test middleware cannot prove them.

## Database integration tests

Use an empty, disposable PostgreSQL database named
`pujcovna_categories_test_<suffix>`. The suite refuses other database names and
deletes category/audit rows in that disposable database before each test.

Set `DATABASE_URL` in the process environment, then run from the repository root:

```sh
pnpm --filter @pujcovna/reference-data-service db:generate
pnpm --filter @pujcovna/reference-data-service db:deploy
pnpm --filter @pujcovna/reference-data-service test:integration
```

The tests use the existing migration, real Prisma/PostgreSQL writes, and real
HTTP requests on loopback. Worker and rejected-user contexts are injected only
in the test module; they are not JWT authentication.

The 14 cases cover public empty/sorted lists, the default closed POST, forged
identity, middleware rejection, missing actor context, creation and audit,
contract validation, the required-name message, the length boundary, malformed JSON, duplicates,
eight concurrent duplicate requests, and rollback when the audit insert fails.

Verified on 2026-11-02: `pnpm check`, `pnpm build`, and all 14 PostgreSQL
integration tests passed. No dependencies or database schema changes were needed.

## Fresh checkout

Before checking or building a fresh checkout, run `pnpm db:generate` from the
repository root. Prisma clients are generated files and are not committed.
A clean source copy passed `pnpm check` and `pnpm build` after generation.
The existing team CI workflow currently omits this preparation step; no CI or
shared startup scripts are changed by this category implementation.

The shared contract helper and copyable endpoint template are documented in
[`packages/shared/README.md`](../../packages/shared/README.md).

## Development startup verification

The service also passed live curl checks after starting it separately with:

```sh
pnpm --filter @pujcovna/reference-data-service dev
```

Using the process-level test database connection and the default port 3002,
GET returned 200, unauthenticated POST returned 401 without writes, and malformed
JSON returned 400. The `start` script also worked on a separate test port.

The root `pnpm dev:be` and `pnpm dev` commands were attempted, but the
reference-data process did not start listening when launched concurrently with
the other services in this Windows environment. Disabling the tsx cache did
not resolve it. The root startup issue remains unresolved; use the separate
service command for a verified local run. No shared startup scripts or
dependency versions were changed to mask it.
