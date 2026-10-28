# AGENTS.md – rules for AI agents

Team 1 semester project (BPMI 2026 winter): the "Půjčovna nářadí" tool-rental web app. Applies to Claude Code, Codex and Cursor.

> Rules only, one per line. Each part of the repo has its own `AGENTS.md` that extends this one and never contradicts it.

## Context

- Start with `docs/zadani/00-shrnuti.md` – requirements, points, deadlines, rules, known inconsistencies (Czech).
- `README.md` has the repo map, commands, uuApp links and the team list.
- The architecture is `docs/rozhodnuti/2026-10-28-architecture.md`; the other decisions live in `docs/rozhodnuti/`. They are team proposals; only what the assignment mandates is fixed.
- Before working in a part of the repo, read its `AGENTS.md`: `apps/web/AGENTS.md`, `services/AGENTS.md`, `packages/ui/AGENTS.md`.
- `packages/server` follows `services/AGENTS.md`.

## Rule 0

- State nothing as fact you have not verified this session in the repo or in a command's output.
- When the repo does not contain the answer, say so; never fill the gap with a guess.
- Verify a library's API against `package.json` and `node_modules` rather than recalling it.
- When corrected, fix the cause, never the cheapest patch.

## Language

- Code, identifiers, comments, commits, PRs, `README.md`, every `AGENTS.md` and `docs/ai/`: English.
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
- Take field names, validation rules and message texts from the user story and business use case the task implements.

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
- Derive a type from its Zod schema with `z.infer`; never write the same shape by hand a second time.
- Model a state or a status as `z.enum([...])`; never a free `string`.

## Structure

- Name files `kebab-case.ts`, React component files `PascalCase.tsx`; components and types `PascalCase`, functions, hooks and variables `camelCase`.
- Put one React component per file; `packages/ui/AGENTS.md` names the one exception.
- Split a function that does several things into named single-purpose functions.
- Prefer `map`, `filter`, `??` and optional chaining over loops with mutable accumulators.
- Extract a repeated I/O sequence into one shared helper.
- Never hide error handling in a generic `safely()` or `tryOrDefault()` wrapper.
- Place shared code at the lowest place every consumer can reach; never duplicate it.

## Contracts (`packages/shared`)

- Define every endpoint once in `packages/shared` with `defineEndpoint()`: `method`, `path` and the Zod schemas `params`, `query`, `body`, `response`.
- Start a new contract from the contract template.
- Put a type or schema in `packages/shared` only when both the frontend and a service use it.
- Keep `packages/shared` to schemas, contracts and `callEndpoint()`; no business logic.
- Never import `packages/server`, `packages/ui` or any app from `packages/shared`.
- Call a backend endpoint only through `callEndpoint()` and its contract, from the web app and from another service alike.
- Keep a contract equal to its Application Model command: dtoIn = `params` / `query` / `body`, dtoOut = `response`, errors = its `AppError` codes.
- Update every consumer of a changed contract in the same PR.

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
- Re-diagnose instead of retrying after a fix fails twice.

## Repo content

- Never write people's names, except the team list in `README.md`; use roles (vyučující, PM daného týdne, student).
- Never copy live uuApp content (vision, roles, PM rota) into the repo; link to it.
- Commit a lecture transcript only anonymized with `tools/anonymize_transcript.py` (Teacher / Student, no profile photos).
- Never create `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md`, in the repo or a parent folder; Claude Code would stop reading the `AGENTS.md` files.

## Git

- Never commit or push without the human's explicit instruction.
- Never push directly to `main`; never use `--no-verify`.
- Name a branch after its uuSprintMan ticket, lowercase with hyphens, and create it from a freshly pulled `main`.
- Title a PR with the ticket name and link the ticket in the PR description.
- Keep one task in one PR.

## Changing these rules

- The `AGENTS.md` files change only through a PR approved by the team.
- Propose a new rule to the human; never write it into an `AGENTS.md` yourself.
