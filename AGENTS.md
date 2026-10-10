# AGENTS.md – rules for AI agents

Team 1 semester project (BPMI 2026 winter): the "Půjčovna nářadí" tool-rental web app. Applies to Claude Code, Codex and Cursor.

## Context

- Start with `docs/zadani/00-shrnuti.md` – requirements, points, deadlines, rules, known inconsistencies (Czech).
- `README.md` has the repo map, commands, uuApp links and the team list.
- The stack and every open decision live in `docs/rozhodnuti/`; it is a team proposal, only what the assignment mandates is fixed.

## Rule 0

- State nothing as fact you have not verified this session in the repo or in a command's output.
- When the repo does not contain the answer, say so; never fill the gap with a guess.

## Language

- Code, identifiers, comments, commits, PRs, `README.md`, `AGENTS.md` and `docs/ai/`: English.
- School material stays Czech: `docs/zadani/`, `docs/prepisy/`, `docs/tym/`, `docs/navrh/`, `docs/analyza/` drafts and everything that goes into uuApp.
- Answer the human in the language they write in.

## Sources of truth

- The assignment and the analysis (Business Requests, Business Model, Application Model) live in uuApp; `docs/zadani/` holds dated extracts.
- Teacher instructions win: `docs/tym/zpetna-vazba.md` > `docs/prepisy/*/shrnuti.md` > `docs/zadani/`.
- `docs/analyza/` is a draft area; never treat it as approved analysis.
- When sources conflict, ask the human and quote both.

## uuApp (shared with the team and the teacher)

- uuApp works like a second git that the teacher grades: every team member edits the same documents.
- "Upravit" (top right) opens an edit session – like an open commit; edits are text, components and diagrams in the page sections.
- "Ukončit úpravy" saves and publishes the session for everyone – like commit + push.
- Enter uuApp only when the human asks, in the human's browser session.
- Change only the section the human asked for; never delete or overwrite content written by others.
- Before "Ukončit úpravy" or any other save or confirm, stop, show the human exactly what changed, and continue only after an explicit yes.

## Teacher's rule

- Never implement a feature that has not been through analysis in the Business Model.
- When you cannot tell which user story or business use case a task implements, ask.

## Questions about lectures and the assignment

- Print a lecture transcript with `python3 tools/teams_transcript_to_md.py docs/prepisy/<folder>/prepis.docx` (`py` instead of `python3` on Windows).
- Cite the source in every answer: file and section, plus the timestamp for a transcript.
- Recipes: `docs/ai/shrnuti-prepisu.md`, `docs/ai/kontrola-souladu.md`, `docs/ai/priprava-pro-uuapp.md`.

## TypeScript

- Never use `any`; use `unknown`, a type guard or a schema-derived type (`z.infer`).
- Use `type`, never `interface`.
- Use arrow functions; use `class` only for errors (`AppError`).
- Never silence the type checker with `@ts-ignore`, `@ts-expect-error`, `as any` or a non-null `!`.
- Use `const`; use `let` only for a variable that is reassigned.
- Write whole words: `request` not `req`, `response` not `res`, `error` not `err`, `index` not `i`.
- Import a workspace package by its name (`@pujcovna/shared`), never by a relative path into another package.

## Structure

- Name files `kebab-case.ts`, React component files `PascalCase.tsx`; components and types `PascalCase`, functions, hooks and variables `camelCase`.
- Put one React component per file.
- Split a function that does several things into named single-purpose functions.
- Put a type or schema in `packages/shared` only when both the frontend and a service use it.
- Build an API response with an explicit field mapping, never by spreading a database row.
- Prefer `map`, `filter`, `??` and optional chaining over loops with mutable accumulators.

## Backend (`services/*`)

- Copy `services/example` to start a new service; keep its layout: `src/<entity>/<entity>.routes.ts` and `src/<entity>/<entity>.service.ts`.
- Keep a route handler to parsing input, calling the service function and sending the response.
- Validate every request body, param and query with a Zod schema before using it.
- Signal an expected failure with `throw new AppError(code, message)`; the central `errorHandler` turns it into `{ error: { code, message } }`.
- Read configuration only from the validated `environment` in `src/env.ts`; never read `process.env` anywhere else.
- Add every new variable to the service's `.env.example` and to the schema in `src/env.ts`.
- Let a service read and write only its own database; reach another service's data over its HTTP API.
- Once authentication exists, require it on every route; mark a public route explicitly.
- Scope every query on user-owned data by the authenticated user's id.

## Frontend (`apps/web`)

- Call the backend only through `src/api/client.ts`, which parses every response with its schema; never call `fetch` in a component.
- Keep business logic in hooks or pure functions; keep components presentational.
- Use `useEffect` only for subscriptions, timers and mount-time loading; derive state during render.
- Render the loading and the error state of every data-driven screen.

## Errors

- Never swallow an error; handle it, log it with `console.error`, or rethrow.
- Never throw for control flow; use early returns.

## Comments

- Comment only a fact the code cannot state, in one line.
- Never commit commented-out code or a `// TODO`; create a task in uuSprintMan instead.

## Dependencies and secrets

- Never add a dependency without the human's approval; pin its exact version.
- Never read or write a `.env` file; `.env.example` lists what belongs in it.
- Never put a password, key or token in code.

## Verification

- After a code change run `pnpm check` (lint + typecheck) and `pnpm build`, and read the output.
- For a runtime change run `pnpm dev` and hit the endpoint or open the page; say what you checked.
- For documentation, verify links and facts against the sources in the repo.
- Never call a task done while a check fails.

## Repo content

- Never write people's names, except the team list in `README.md`; use roles (vyučující, PM daného týdne, student).
- Never copy live uuApp content (vision, roles, PM rota) into the repo; link to it.
- Never create `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md`, in the repo or a parent folder; Claude Code would stop reading this file.

## Git

- Never commit or push without the human's explicit instruction.
- Never push directly to `main`; never use `--no-verify`.

## Changing these rules

- This file changes only through a PR approved by the team.
- Propose a new rule to the human; never write it into this file yourself.
