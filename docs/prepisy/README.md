# Lecture and consultation transcripts (Czech)

Every lecture or consultation has its own folder:

```
YYYY-MM-DD_SUBJECT_Name/
├── prepis.docx     # original transcript from MS Teams (never edit)
└── shrnuti.md      # summary: topics with timestamps, ➜ teacher instructions, checklist
```

- `SUBJECT`: `PM` (project management), `BE`, `FE` – e.g. `2026-11-07_PM_Konzultace-2/`.
- Transcript from Teams: meeting recording → Transcript → Download `.docx`.
- AI cannot read `.docx` directly – print it (from the repo root) with `python3 tools/teams_transcript_to_md.py docs/prepisy/<folder>/prepis.docx`; `py` instead of `python3` on Windows.
- The summary is made with [`docs/ai/shrnuti-prepisu.md`](../ai/shrnuti-prepisu.md).

## Seznam

| Date | Subject | Folder | Note |
|---|---|---|---|
| 10 Oct 2026 | PM | [2026-10-10_PM_Konzultace-1](2026-10-10_PM_Konzultace-1/shrnuti.md) | shared part: course organisation, schedule, grading, workshop; the team part (topic approval) was not recorded |
