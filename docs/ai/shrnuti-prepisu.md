# Recipe: summarize a lecture transcript

Usage: "Follow `docs/ai/shrnuti-prepisu.md` for `docs/prepisy/<folder>/`."

## Input

- `docs/prepisy/<YYYY-MM-DD_SUBJECT_Name>/prepis.docx` – the original transcript from Teams.

## Steps

1. Print the transcript: `python3 tools/teams_transcript_to_md.py docs/prepisy/<folder>/prepis.docx` (`py` on Windows).
2. Read `docs/zadani/00-shrnuti.md` and `docs/tym/zpetna-vazba.md` so you know what is new.
3. Write `docs/prepisy/<folder>/shrnuti.md` **in Czech** with the structure below (example: `docs/prepisy/2026-10-10_PM_Konzultace-1/shrnuti.md`).
4. Add a row to the "Seznam" table in `docs/prepisy/README.md`.
5. If the teacher changed a rule, deadline or requirement compared to `docs/zadani/`, list it for the human; never edit the extracts yourself.

## Structure of `shrnuti.md`

- Heading `# Shrnutí – <název>, <předmět> (<datum>)`.
- Intro quote: where the transcript comes from, how to print it, who speaks ("Speaker 1" = vyučující).
- `## Co v přepisu je a co ne` – what is missing (e.g. an unrecorded part).
- Numbered sections by topic, each with the timestamp of the utterance, e.g. (`19:38`).
- Mark the teacher's instructions (what we must do) with ➜.
- End with `## Pokyny vyučující v kostce (checklist)` as `- [ ]` items.

## Rules

- No names of people – students, teacher, or names from examples; use roles ("student se zeptal", "vyučující").
- Add nothing that is not in the transcript; mark an unclear passage "(nejasné v přepisu)".
- Fix a speech-recognition error only when the meaning is certain (e.g. "PVS" = PBS), and say so.
- Leave out personal and off-topic talk.
