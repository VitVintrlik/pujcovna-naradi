# Recipe: draft content for uuApp

Usage: "Follow `docs/ai/priprava-pro-uuapp.md` and draft <user story / business use case / endpoint> <name>."

## Steps

1. Identify the type: user story (Business Requests), business use case (Business Model) or endpoint/command (Application Model).
2. Read the template in `docs/zadani/03-tym-1-portal.md` › "Šablony týmových dokumentů".
3. Read the requirements in `docs/zadani/01-bpmi-project-assignment.md`, `docs/zadani/00-shrnuti.md` and `docs/tym/zpetna-vazba.md`.
4. Ask the human for the current vision and entities – they live in Business Requests in uuApp (link in `README.md`), not in the repo.
5. Fill in every section of the template **in Czech**, in the same order and with the same headings as in uuApp.
6. Save it as `docs/analyza/<type>/<name>.md` (type: `user-stories`, `business-use-cases`, `commands`); the file's first line is `> Draft – zdroj pravdy je uuApp.`
7. Remind the human to read it and edit it. To get it into uuApp, the human copies it in; if the human asks you to enter it, follow `AGENTS.md` › uuApp and the section below.

## Entering the draft into uuApp (only when the human asks, in their browser)

1. Open the document; switch pages with the arrow next to the page title; scroll to your own section (check the `h1` above it is your user story).
2. "Upravit" (top right) opens the edit session; the page splits into "Sekce" blocks.
3. **Text block:** click into its text – an inline editor opens for that block only; Cmd/Ctrl+A selects just that block; type the new text (Enter = new paragraph). Section headings are separate and stay.
4. **Scenario** (`BusinessScenario` component): select it → "Editace komponenty" → per step click "Step", put the sentence into **Název** (leave Popis empty), confirm with ✓. "N. Step" adds the next step.
5. **Diagram** (`UuBmlDraw.Diagram`): select it → "Editace komponenty" opens a full-screen editor.
   - Copy/paste uses the editor's own clipboard in `localStorage["uuBmlDrawClipboard"]` (`{ pasteCount, selectedElementList }`), not the system clipboard.
   - To reuse another diagram's icons and layout: open it, click the canvas, Cmd+A, Cmd+C, close it with **X without saving**; then paste into your diagram and change texts, icons (`sourceUuBmlStencil` + `uuBmlIconCode`) and connector labels.
   - Escape asks to close and discard ("Unsaved changes") – answer **Cancel**.
   - "Save & Close" stores the diagram in the open edit session.
6. Never edit another member's section, not even temporarily.
7. Stop before "Ukončit úpravy" (publishes for everyone): show the human what changed and wait for an explicit yes.

## Rules

- Never invent entities, roles or rules that are not in the vision or the assignment; ask.
- Describe uuBml diagrams in text as nodes and relations; they are drawn in uuApp.
- For an endpoint keep the Command template structure: dtoIn, validation, dtoOut, algorithm, error list.
- No names of people.
