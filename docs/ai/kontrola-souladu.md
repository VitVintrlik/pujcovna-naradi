# Recipe: check compliance with the assignment and the teacher's instructions

Usage: "Follow `docs/ai/kontrola-souladu.md` and check <file / PR / text>."

## Sources (in order of precedence)

1. `docs/tym/zpetna-vazba.md`
2. `docs/prepisy/*/shrnuti.md` (details in the transcript via `python3 tools/teams_transcript_to_md.py`)
3. `docs/zadani/00-shrnuti.md` and the extracts `docs/zadani/01`–`03`
4. `docs/rozhodnuti/` – team proposals, not mandated by the assignment

## Steps

1. Find out what is being checked and which user story, business use case or part of the assignment it belongs to; ask if unclear.
2. Collect every related requirement from the sources: assignment mandates, deadlines, teacher instructions, PM rules.
3. Compare point by point.
4. Return the table below; fix nothing until the human asks.

## Output

| Requirement | Source (file › section / timestamp) | Status | Note |
|---|---|---|---|
| … | … | ✅ met / ⚠️ partly / ❌ not met / ❓ cannot verify | … |

Below the table list at most 3 most important next steps.

## Rules

- Every row has a source; never write a row without one.
- Mark what cannot be verified from the repo (e.g. current uuApp content) ❓ and say where the human can find it.
- Distinguish "mandated by the assignment" from "team proposal".
- Answer in the language of the question (usually Czech).
