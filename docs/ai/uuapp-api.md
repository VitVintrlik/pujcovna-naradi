# Reference: uuApp API from the browser (SprintMan, documents, attachments)

Usage: "Follow `docs/ai/uuapp-api.md` and <create the S2 tickets / read the sprint / …>."

Everything below was verified on 2026-10-21 against team 1's SprintMan and documents, unless it says "not verified".
uuApp changes; when a call fails, re-check it with "Finding commands yourself" below.

## When to use it

- Bulk work that would take dozens of clicks: creating or updating SprintMan tickets, reading a whole sprint, exporting it for a review.
- Only in the human's own browser session (Claude in Chrome), only when the human asks – see `AGENTS.md` › uuApp.
- Before any write, show the human the exact list of changes and wait for an explicit yes.

## How a call works

- Every uuApp app is a set of commands: `<app base URL>/<command>`. `GET` takes the dtoIn as a query string, `POST` as a JSON body.
- Authentication is the user's session token in `Authorization: Bearer …`. Cookies alone are not enough: the call returns 403 with `uuIdentity "0-0"`.
- The page holds the session: `UU5.Environment.getSession().getCallToken(<app base URL>)` returns the token for that app.
- Run the call **inside the page** (`javascript_tool`), so the token never leaves the browser. Never print it, never copy it into the shell, a file or a chat.
- Return only the data you need from the page script; the extension hides output that looks like a token or a long hex/base64 string (`[BLOCKED: …]`). To print an oid, split it: `oid.match(/.{1,4}/g).join(' ')`.

Helper to paste into the page (any SprintMan page):

```js
window.__sprintMan = async (command, method, dtoIn) => {
  const base = 'https://uuapp.plus4u.net/uu-sprintman-maing02/84e920ba62272a97a392decd4ed8ff49/';
  const callToken = await UU5.Environment.getSession().getCallToken(base);
  const authorization = typeof callToken === 'string' ? (callToken.includes(' ') ? callToken : 'Bearer ' + callToken) : 'Bearer ' + callToken?.token;
  const isGet = method === 'GET';
  const query = isGet && dtoIn ? '?' + new URLSearchParams(dtoIn) : '';
  const response = await fetch(base + command + query, {
    method,
    headers: { Authorization: authorization, ...(isGet ? {} : { 'Content-Type': 'application/json' }) },
    body: isGet ? undefined : JSON.stringify(dtoIn),
  });
  return { status: response.status, data: await response.json() };
};
```

For another app (e.g. the business territory) use that app's base URL – the first three path segments, e.g. `https://uuapp.plus4u.net/uu-businessterritory-maing01/<awid>/`.

## SprintMan (team 1)

- App: <https://uuapp.plus4u.net/uu-sprintman-maing02/84e920ba62272a97a392decd4ed8ff49/>
- Sprint S1: <https://uuapp.plus4u.net/uu-sprintman-maing02/84e920ba62272a97a392decd4ed8ff49/sprint?oid=6aca041eab16b7aebea4b00b>
- The sprint oid of any sprint page is in its URL (`sprint?oid=…`); on a ticket page it is in the "S1" link.

### Commands we used

| Command | Method | dtoIn | Result / note |
|---|---|---|---|
| `uuSprintMan/listBacklogRequests` | GET | – | `itemList[]` with `oid`, `name`, `priority`, `tagList` |
| `sprint/listTickets` | GET | `{ oid: sprintOid }` | `itemList[]` with `oid`, `name`, `state`, `priority`, `complexity`, `timeToComplete`, `tagList`, `solverRoleOid`, `reviewerRoleOid` |
| `ticket/load` | GET | `{ oid }` | `data` (the ticket) + `territoryData` (artifact, roles) |
| `ticket/listBacklogRequestRelations` | GET | `{ oid }` | `itemList[]` with `backlogRequestOid` |
| `uuSprintMan/createTicket` | POST | see below | creates the ticket in state `inPreparation` |
| `ticket/update` | POST | `{ oid, name, desc, tagList }` | `tagList` is required (missing → `invalidDtoIn`); send the current `name` and `tagList` to keep them |

Seen in the app's code but not called by us: `uuSprintMan/listSprints`, `createSprint`, `createBacklogRequest`, `listUnplannedTickets`, `getSprintByDate`; `ticket/setPriority`, `setComplexity`, `setTimeToComplete`, `setState`, `changeSprint`, `setReviewer`, `setSolver`, `unsetRole`.

### Creating a ticket

```json
{
  "name": "Create Categories - BUC",
  "sprintOid": "<sprint oid>",
  "backlogRequestRelationList": [{ "backlogRequestOid": "<oid from listBacklogRequests>" }],
  "desc": "",
  "priority": "4",
  "complexity": 3,
  "tagList": ["<week tag code>", "<type tag code>"]
}
```

- `backlogRequestOid` at the top level is rejected (`unsupportedKeyList`); the relation goes into `backlogRequestRelationList`.
- `solver` is silently ignored. Set the solver afterwards (below).
- `priority`: `"4"` = MUST HAVE. The other values (SHOULD / COULD / WON'T HAVE) are not verified – load a ticket that has one before you use it.
- `complexity` accepts only `0.25, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144` (the same list as the PBS Estimation column). `timeToComplete` starts equal to it.
- `desc` is plain text. URLs in it are shown but are not clickable.
- An invalid dtoIn returns 400 with `missingKeyMap` / `unsupportedKeyList` and writes nothing – a safe way to learn the shape.
- The user who created a ticket was its Responsible role in every ticket we checked.

### Tags

- A ticket's `tagList` holds full tag codes: `<tagSet.code>-<tag code>-<tagSet.artifactId>-workspace`.
- Tag sets come from the business territory: `uuOrganizationIfc/loadAvailableTagSetsByUuType`. Copy the request URL the page already made (`performance.getEntriesByType('resource')`, it carries `id`, `awscId` and `pageInfo.pageSize`), set `uuType=uu-sprintman-maing02/ticket` and call it with the territory's token.
- Each set has `name`, `code`, `artifactId` and `tagMap { <tag code>: { name, desc, … } }`. Map tag names (e.g. `S1W1-Deadline 01.11.`, `ANA`) to full codes before creating tickets.
- Tag sets are managed in SprintMan › Control panel › Správa tag setů.

### Solver and roles

- The solver is a personal role (`ticket/setSolver` takes `{ oid, roleOid }`, not a uuIdentity). Setting it in the UI is simpler: ticket › ⋮ › Set solver › search the name › pick › Save.
- Any member of the team's *Operatives* group can set the solver, state and time to complete on any ticket. Only the Responsible role (the creator) can change Responsible role and Sprint manager.
- Control panel › Nastavení oprávnění artefaktu: group *Operatives* gets the profiles Authorities, Operatives, Readers and Sprint Team.

### Writing safely

- Make the loop idempotent: load the sprint's tickets first and skip names that already exist.
- After every write, load the object again and compare the fields you did not mean to change.
- Stop at the first non-200 response and show the error.
- Export the result (name, backlog request, complexity, tags, solver set yes/no) and give it to a fresh read-only reviewer agent.

## Finding commands yourself

1. `performance.getEntriesByType('resource')` lists every command the page has called (with the query string of GET calls).
2. Fetch the app's JS bundle (for SprintMan `uu_sprintmang02-core.min.js`) inside the page and search it for `uuSprintMan/` and `"ticket/` to list commands, and for `Object.freeze({NAME:"name",…` to get field names.
3. Send a dtoIn and read the `invalidDtoIn` error.

## Browser gotchas

- SprintMan's Create ticket dialog resets while you fill it (it re-renders when the window size changes). Clicking through dozens of tickets is unreliable – use `uuSprintMan/createTicket`.
- `location.href = …` reloads the page and drops your helpers; clicking the app's own menu keeps them (single-page app).
- Refs from `find` / `read_page` change every time a dialog opens; look them up again.
- A second download from uuApp may not start (Chrome's multiple-download prompt). For an attached video, open the page where it is embedded (e.g. Projekt › Informace k projektu › Hodnocení › Plánování sprintu › Vytvoření úkolů ve Sprintmanovi), `fetch(video.currentSrc, { credentials: 'include' })` into a blob, set it as `video.src`, then step with `video.currentTime` and take screenshots. Reload the page afterwards.

## Team documents (uuApp managementkit)

- A page is `…/document?oid=<document oid>&pageOid=<page oid>`; switch pages with the arrow next to the page title.
- Business Requests: Vision, Dictionary, Context, User story (all user stories on one page, no anchor per story) – [User story page](https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6abb8e54128fd3cc6abb50ff&pageOid=6abb8e5928078481aebcf31f).
- Business Model: Business discipline, Processes, Business actors, Products, Business use cases – [Business use cases page](https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6abb8e36128fd3cc6abb50ce&pageOid=6abb8e43128fd3cc6abb50f6).
- Application Model: [document](https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6abb8e1628078481aebcf26d).
- Editing these documents: `docs/ai/priprava-pro-uuapp.md`.

## Excel files (PBS, capacity plan)

- Read: `python3 tools/xlsx_dump.py <file> [--sheet S1] [--validations]`.
- Edit without openpyxl: an .xlsx is a zip of XML. Replace only the cell elements you change in `xl/worksheets/sheet1.xml` (`<c r="E8" s="6"/>` → `<c r="E8" s="6"><v>1</v></c>`; text as `t="inlineStr"><is><t>…</t></is>`), keep the style `s`, write a new zip with the same entries, and update the cached value of any `SUM` you affect. Dump the result and diff it against the original.
- PBS allowed values: Sprint and Week `1, 2, 3`; Estimation the complexity list above; Status `Waiting, In progress, To assessment, Solved, Transferred, Blocked, Cancelled`; type `ANA, IMP, TST, MNG`.
- Never upload a file to the team portal without the human's yes; upload a new version and never delete the old one.
