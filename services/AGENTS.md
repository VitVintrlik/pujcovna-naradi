# AGENTS.md – services (backend)

> Extends the root `AGENTS.md` and never contradicts it. Applies to every service in `services/` and to `packages/server`.

## Layout

- Copy `services/example` to start a new service.
- Put one folder per entity: `src/<entity>/<entity>.routes.ts`, `<entity>.service.ts`, `<entity>.mapper.ts`.
- Keep `src/app.ts` building the app and `src/index.ts` only starting it.
- Put code two or more services share in `packages/server`; never copy it between services.

## Routes

- Keep a route handler to parsing input with its contract, calling one service function and sending the response.
- Validate every body, param and query with the endpoint contract's schema before using it.
- Register a route with its contract's `path`; never a path literal.
- Type every response body with the contract's response type.
- Require sign-in with `requireAuth()` on every route; mark a public route explicitly.
- Check a role with `requireRole(...)` on the route; never compare roles inside a handler or a service.

## Service functions

- Put the logic in `<entity>.service.ts` and call the Prisma client directly; there is no repository layer.
- Trust the input the route validated; never validate it again in the service.
- Scope every query on user-owned data by the authenticated user's id.
- Open one transaction for a change that writes more than once and pass it to every write inside it.
- Record every change with `recordAudit(...)` in the same transaction as the change.
- Signal an expected failure with `throw new AppError(code, message)`; never send an error body by hand.
- Let the central `errorHandler` turn every thrown error into `{ error: { code, message, details } }`.

## Responses

- Build every response in `<entity>.mapper.ts` with an explicit field mapping; never spread a database row.
- Convert a Prisma enum value to the shared `enum` in the mapper.

## Data

- Let a service read and write only its own database; reach another service's data through its contract and `callEndpoint()`.
- Give every call to another service a timeout.
- Keep a service's schema in its own `prisma/schema.prisma` and change it only through a migration (`prisma migrate dev`).
- Never edit a migration that is already on `main`.
- Load rows with their related rows in one query (`include` / `select`); never one query per row.
- Store a tool's state only as `AVAILABLE` or `RETIRED`; compute "Rezervované" from its active orders.
- Treat an order as active while it is `PENDING` or `CONFIRMED` and its end date has not passed.
- Make the order overlap check safe against two simultaneous requests.

## Configuration

- Read configuration only from the validated `environment` in `src/env.ts`; never read `process.env` anywhere else.
- Add every new variable to the service's `.env.example` and to the schema in `src/env.ts`.

## Sign-in

- Keep Better Auth inside `services/auth`; other services only verify its JWT with `jose` through `requireAuth()`.
- Read the caller's id and role only from what `requireAuth()` puts on the request.
- Never take a user id or a role from the request body, params or query.

## Verification

- After `pnpm check` and `pnpm build`, run `pnpm dev:be` and call every endpoint you changed with `curl`: a valid request, an invalid input, and a request without a token.
