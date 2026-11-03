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
authentication cases remain pending.

## Fresh checkout

Before checking or building a fresh checkout, run `pnpm db:generate` from the
repository root. Prisma clients are generated files and are not committed.
A clean source copy passed `pnpm check` and `pnpm build` after generation.
The CI workflow runs this generation step before lint, type checking, and build.

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
