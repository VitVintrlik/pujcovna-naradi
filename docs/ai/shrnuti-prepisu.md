# Recipe: summarize a lecture transcript

Usage: "Follow `docs/ai/shrnuti-prepisu.md` for `docs/prepisy/<folder>/`."

## Input

- `docs/prepisy/<YYYY-MM-DD_SUBJECT_Name>/prepis.docx` – the anonymized transcript from Teams.

## Steps

1. If `prepis.docx` is not in the repo yet, anonymize the Teams download first: `python3 tools/anonymize_transcript.py <download>.docx docs/prepisy/<folder>/prepis.docx --teacher "<teacher's speaker label>"`, add `--replace "name=student"` for every name the tool lists, and run it again until it reports none.
2. Print the transcript: `python3 tools/teams_transcript_to_md.py docs/prepisy/<folder>/prepis.docx` (`py` on Windows).
3. Read `docs/zadani/00-shrnuti.md` and `docs/tym/zpetna-vazba.md` so you know what is new.
4. Write `docs/prepisy/<folder>/shrnuti.md` **in Czech** with the structure below (example: `docs/prepisy/2026-10-10_PM_Konzultace-1/shrnuti.md`).
5. Add a row to the "Seznam" table in `docs/prepisy/README.md`.
6. If the teacher changed a rule, deadline or requirement compared to `docs/zadani/`, list it for the human; never edit the extracts yourself.

## Structure of `shrnuti.md`

- Heading `# Shrnutí – <název>, <předmět> (<datum>)`.
- Intro quote: where the transcript comes from, how to print it, who speaks (anonymized: "Teacher" = vyučující, "Student" = students).
- `## Co v přepisu je a co ne` – what is missing (e.g. an unrecorded part).
- Numbered sections by topic, each with the timestamp of the utterance, e.g. (`19:38`).
- Mark the teacher's instructions (what we must do) with ➜.
- End with `## Pokyny vyučující v kostce (checklist)` as `- [ ]` items.

## Rules

- No names of people – students, teacher, or names from examples; use roles ("student se zeptal", "vyučující").
- Add nothing that is not in the transcript; mark an unclear passage "(nejasné v přepisu)".
- Fix a speech-recognition error only when the meaning is certain (e.g. "PVS" = PBS), and say so.
- Leave out personal and off-topic talk.
