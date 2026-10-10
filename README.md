# Půjčovna nářadí – Team 1 (BPMI 2026 winter)

Semester project (Project management + BE + FE): a web app for reserving and lending tools.
Monorepo for the code and for the course material – assignment extracts, lecture transcripts and teacher feedback – so any AI agent
(Claude Code, Codex, Cursor) can answer *"What did the teacher say?"*, *"Does this match the assignment?"*, *"What is due on Sunday?"*

## Links

| What | Where |
|---|---|
| **Team portal** (roles, PM rota, meeting notes, reports, links to all deliverables) | [uuApp – Tým 1](https://uuapp.plus4u.net/uu-openbusinessbrickkit-maing01/e16d7ca1433c4a5d8b40d7be5723da39/uuOpenBusinessBrick?oid=6abb8d8149b0da91fb17b586&pageOid=6abb8d8249b0da91fb17b59b) |
| **Business Requests** (vision, user stories – the team's live results) | [uuApp – BR Tým 1](https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6abb8e54128fd3cc6abb50ff) |
| Business Model, Application Model, uuSprintMan, Teams channel | "Výstupy projektu" table on the team portal |
| Assignment (BPMI Project Assignment) | [uuApp](https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6a61d14de4c6fd72c8736606&pageOid=6a61d151e4c6fd72c873662d) |
| PM rules, schedule, grading | [uuApp – Projekt](https://uuapp.plus4u.net/uu-openbusinessbrickkit-maing01/e16d7ca1433c4a5d8b40d7be5723da39/uuOpenBusinessBrick?oid=6a61d165adfd9e65265c0d6d&pageOid=6a61d167adfd9e65265c0d7e) |

## Team

10 members – see "Členové týmu" on the [team portal](https://uuapp.plus4u.net/uu-openbusinessbrickkit-maing01/e16d7ca1433c4a5d8b40d7be5723da39/uuOpenBusinessBrick?oid=6abb8d8149b0da91fb17b586&pageOid=6abb8d8249b0da91fb17b59b).

## Quick start

Prerequisites: **Node.js 24** (`.nvmrc`), **pnpm 10** (`corepack enable` installs the pinned version), **Docker**. Reading lecture transcripts needs **Python 3** (`py` on Windows).

```bash
git clone <repo-url> && cd pujcovna-naradi
corepack enable
pnpm install
pnpm dev          # database + all services + web
```

Open http://localhost:5173 – the page shows whether `example-service` is reachable.
No `.env` is needed for local development; every app has defaults and lists its variables in `.env.example`.

| Command | What it does |
|---|---|
| `pnpm dev` | database (Docker) + all services + web |
| `pnpm dev:db` | database only (PostgreSQL on port 5440) |
| `pnpm dev:be` | database + services |
| `pnpm dev:fe` | web only (http://localhost:5173) |
| `pnpm check` | lint + typecheck – run before opening a PR |
| `pnpm lint` · `pnpm typecheck` · `pnpm build` · `pnpm format` | the individual checks; `format` rewrites files with Prettier |

## Stack

TypeScript 6 (strict) · Node.js + Express 5 microservices · React 19 + Vite · Zod · PostgreSQL in Docker · ESLint + Prettier · pnpm workspaces · GitHub Actions CI.
**This is a proposal** – what the assignment mandates is fixed, the rest the team may change. Rationale and open decisions (number of services, database library, authentication, frontend libraries, …): [`docs/rozhodnuti/`](docs/rozhodnuti/README.md).

## Repo map

```
AGENTS.md                  # rules for AI agents (Claude Code, Codex, Cursor)
apps/web/                  # React frontend (Vite)
services/example/          # template microservice (Express) – copy it for real services
packages/shared/           # types + Zod schemas shared by the frontend and services
scripts/after-edit.mjs     # agent hook: formats + lints every file an agent writes
.claude/ · .codex/         # hook configuration for Claude Code and Codex
docker-compose.yml         # local PostgreSQL
docs/
├── zadani/                # extracts from the school's uuApp (CZ) – start with 00-shrnuti.md
├── prepisy/               # lecture transcripts: one folder per meeting, prepis.docx + shrnuti.md (CZ)
├── tym/                   # zpetna-vazba.md – teacher feedback and answers (CZ)
├── ai/                    # recipes for AI agents
├── analyza/               # optional drafts for uuApp (CZ) – uuApp is the source of truth
├── navrh/                 # original topic proposal (CZ)
└── rozhodnuti/            # stack and team rules proposal + open questions
tools/teams_transcript_to_md.py   # prints a .docx transcript as text (for AI)
```

The extracts in `docs/zadani/` are a **snapshot from 10 Oct 2026**. When the school pages change, the web wins – update the extract and its date.

## Working with AI

**Tools:** Claude Code (**2.1.281 or newer**), Codex or Cursor. All of them read [`AGENTS.md`](AGENTS.md) – start the agent in the repo root.

- **Never use `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md`** – in the repo or a parent folder – Claude Code would stop reading `AGENTS.md`.
- Just ask: *"Co řekla vyučující o workshopu?"*, *"Co máme odevzdat do neděle?"*
- Recipes: tell the agent "follow `docs/ai/<recipe>.md`".

| Recipe | For |
|---|---|
| [`shrnuti-prepisu.md`](docs/ai/shrnuti-prepisu.md) | turn a lecture transcript into a summary |
| [`kontrola-souladu.md`](docs/ai/kontrola-souladu.md) | does this match the assignment and the teacher's instructions? |
| [`priprava-pro-uuapp.md`](docs/ai/priprava-pro-uuapp.md) | draft a user story / business use case / endpoint for uuApp |

**Rules for people** – _team proposal (see [`docs/rozhodnuti/`](docs/rozhodnuti/README.md)); valid until the team changes it via PR._
- Small PRs: one task = one PR.
- Never paste passwords, keys or personal data into an AI tool.
- Read and edit AI-generated text before you put it into uuApp.
- Never write people's names into the repo (except the team list above) – git shows who did what.

**Keeping the material current** (PM of the week) – _team proposal; valid until the team changes it via PR._
- After a lecture or consultation: a new folder in `docs/prepisy/` with `prepis.docx` + a summary made with the recipe → PR.
- Teacher feedback (Diskuze on the portal, Teams): add it to [`docs/tym/zpetna-vazba.md`](docs/tym/zpetna-vazba.md).
- A change on the school pages: update the extract in `docs/zadani/` and its date.

## Contributing

_Team proposal (see [`docs/rozhodnuti/`](docs/rozhodnuti/README.md)); valid until the team changes it via PR._

- `main` only through a Pull Request with 1 approval from another team member; CI (lint, typecheck, build) must pass.
- Branches `feat/…`, `fix/…`, `docs/…`, `chore/…`; squash merge.
