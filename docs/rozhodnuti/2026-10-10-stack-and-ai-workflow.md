# Stack, repo structure and working with AI

| | |
|---|---|
| **Date** | 10 Oct 2026 |
| **Status** | **proposal** – only what the assignment mandates is fixed; the team may change everything else through a PR to this document |
| **Context** | [`docs/zadani/00-shrnuti.md`](../zadani/00-shrnuti.md), [Konzultace 1 – shrnutí](../prepisy/2026-10-10_PM_Konzultace-1/shrnuti.md) |

Principle: it is a school project – **simple over perfect**; automation enforces the rules instead of long rulebooks. The repo is set up for the AI agents **Claude Code, Codex and Cursor**.

## 1. Mandated by the assignment

- Backend: Node.js + Express, **microservices**, a public REST or GraphQL API.
- Frontend: React; at least 2 routes per team; UVE → routes → components described in the Application Model.
- Sign-in through a third-party identity provider, audit log, deployed to the cloud, source code in Git.
- At least 4 business entities stored in a database (user management does not count).

## 2. Proposal – already in the repo skeleton

| Area | Proposal | Where |
|---|---|---|
| Language | **TypeScript 6**, strict (typescript-eslint supports TS < 6.1, so not TS 7). If the team rejects TS, switch to JS; structure and rules stay. | `tsconfig.base.json` |
| Monorepo | pnpm workspaces: `apps/`, `services/`, `packages/` | `pnpm-workspace.yaml`, `package.json` |
| Services | Express 5 per service; template with validated env, `/health`, central error handler returning `{ error: { code, message } }` | `services/example/` |
| Shared code | types + Zod schemas used by the frontend and services | `packages/shared/` |
| Frontend | React 19 + Vite; one API client that parses every response with its schema | `apps/web/` |
| Database | PostgreSQL 17 in Docker (port 5440); each service owns its database | `docker-compose.yml` |
| Quality | ESLint + Prettier; `pnpm check` = lint + typecheck | `eslint.config.js`, `.prettierrc.json` |
| CI | install, lint, typecheck, build on every PR and push to `main` | `.github/workflows/ci.yml` |
| Agent hook | after every file an agent writes: Prettier + ESLint, findings go back to the agent | `scripts/after-edit.mjs`, `.claude/settings.json`, `.codex/hooks.json` |
| AI rules | one `AGENTS.md`, no `CLAUDE.md` (Claude Code ≥ 2.1.281 reads `AGENTS.md` natively – [docs](https://code.claude.com/docs/en/memory)) | `AGENTS.md` |
| AI recipes | plain Markdown that every tool can follow | `docs/ai/` |

## 3. Service principles (proposal)

- At least 2 domain services in `services/`, each with its own database; they talk only over HTTP; no foreign keys across databases.
- Thin route handlers; logic in `*.service.ts`.
- Every input validated with Zod; every error in the shared format through the central handler.
- Every route behind authentication once it exists; public routes marked explicitly; user-owned data scoped to the user.
- Configuration only through the validated env module; every variable listed in `.env.example`.

## 4. GitHub workflow (proposal)

- `main` only through a PR with 1 approval from another team member; CI must pass.
- Branches `feat/…`, `fix/…`, `docs/…`, `chore/…`; squash merge; branches deleted after merge.
- `main` branch protection if the GitHub plan allows it for a private repo; otherwise a team agreement.
- **Not yet:** automated tests, PR template, uuSprintMan linking, CODEOWNERS, local git hooks, automatic deployment.

## 5. Working with AI (proposal)

**`AGENTS.md`** – one rule per line: context, Rule 0 (state nothing unverified), language, sources of truth (uuApp > extracts; teacher feedback first; `docs/analyza/` is a draft), the teacher's rule (nothing without analysis), how to read lecture transcripts, code rules (TypeScript, structure, backend, frontend, errors, comments), dependencies and secrets, verification, repo content (no names, link live uuApp content, no `CLAUDE.md`), git, changing the rules only through a PR.

**Recipes in `docs/ai/`**

| Recipe | Purpose |
|---|---|
| `shrnuti-prepisu.md` | turn `prepis.docx` into `shrnuti.md` (Czech): topics with timestamps, ➜ teacher instructions, checklist |
| `kontrola-souladu.md` | does this (code / document / user story) match the assignment and the teacher? Every finding cites a source |
| `priprava-pro-uuapp.md` | draft a user story / business use case / endpoint from the uuApp template into `docs/analyza/` |

**Keeping the material current**

| What | Who | How |
|---|---|---|
| Lecture / consultation transcript | PM of the week | new folder in `docs/prepisy/` with `prepis.docx` + `shrnuti.md` via the recipe → PR |
| Teacher feedback | PM of the week | add to `docs/tym/zpetna-vazba.md` with a date |
| Change on the school pages | whoever notices | update the extract in `docs/zadani/` and its date |
| Team decision | anyone | PR to a document in `docs/rozhodnuti/` |

**Rules for people:** small PRs (one task = one PR); no passwords, keys or personal data in AI tools; read and edit AI text before it goes into uuApp; no names in the repo except the team list; Claude Code ≥ 2.1.281, Codex or Cursor; never `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md`.

**Not yet:** subagents, agent orchestration, skill sets in `.claude/` or `.agents/`.

## 6. Local development

| Command | What it does |
|---|---|
| `pnpm dev` | database + all services + web |
| `pnpm dev:db` | database only |
| `pnpm dev:be` | database + services |
| `pnpm dev:fe` | web only |
| `pnpm check` · `pnpm build` · `pnpm format` | lint + typecheck · build · Prettier |

No `.env` is needed locally; every app has defaults and an `.env.example`. Database scripts (`db:migrate`, `db:seed`, `db:reset`) arrive with the database library (question 5); the seed is needed for the workshop demo.

## 7. Open questions

| # | Question | Options | Due / criterion |
|---|---|---|---|
| 1 | Final entities | per Business Requests in uuApp | BR due 14 Oct |
| 2 | Number and split of services | e.g. 2 by area ("catalog" vs "rental"); the skeleton only has the template `services/example` | after 1; fewest calls between services |
| 3 | Gateway | yes (sign-in, roles and audit in one place) / no | with 2 |
| 4 | Database | PostgreSQL (in the skeleton) / MySQL – switching = compose service + driver | before S1 (26 Oct) |
| 5 | Database access | ORM (e.g. Prisma) / raw SQL | with 4 |
| 6 | Sign-in library | depends on the identity provider | before S1 |
| 7 | Endpoint style | REST resources (`GET /tools/:id`) / uuApp-style commands (`tool/get` + dtoIn/dtoOut, matches the Application Model 1:1) | before writing the Application Model |
| 8 | Frontend libraries | TanStack Router + Query / React Router + own hooks (the skeleton uses plain React); UI library | before S1; what AI and the team know best |
| 9 | UI language | Czech / English | before S1 |
| 10 | Hosting / cloud | – | by S3 at the latest |
| 11 | TypeScript vs JavaScript | TS 6 (in the skeleton) / JS | before S1 |

## 8. Next steps

1. When questions 1–3 are decided: replace `services/example` with the real services (copy the template).
2. When questions 4–5 are decided: database access per service, `db:migrate` / `db:seed` / `db:reset`.
3. Question 6: sign-in with a secure-by-default middleware, then the audit log.
