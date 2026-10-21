# Recipe: plan a sprint (PBS → SprintMan → capacity plan)

Usage: "Follow `docs/ai/planovani-sprintu.md` for sprint S2."

This is how S1 was planned on 2026-10-21. API details: [`uuapp-api.md`](uuapp-api.md).

## Rules from the assignment

- Planning covers **one sprint, all three of its weeks**; S2 and S3 rows stay untouched until their own planning (`docs/zadani/02-projekt-pm-informace.md:92–94`, deadline in the schedule).
- PBS: for every task of the sprint fill in **Week, Solver, Estimation** (`02:256–258`).
- Capacity plan: hours per member per week; capacity ≥ that member's estimates, reserve at most 20 % (`02:262–266`).
- SprintMan: every task of the sprint as a ticket with a clear name, priority, a **week tag and a type tag**, estimate and solver; meeting tickets have no solver (`02:269–272`).
- Exactly one solver per task (`docs/zadani/00-shrnuti.md:97`); for a meeting the PM of the week or a sub-group representative may be named (`docs/prepisy/2026-10-10_PM_Konzultace-1/shrnuti.md`, section 6).
- A task that moves to another week gets the new week tag added (`02:290`). Solved only after review and tests (`02:289`).
- Meetings are priced as length × number of members (`02:214`).
- Implement only what has been analysed in the Business Model (`AGENTS.md` › Teacher's rule).

What the teacher's own video shows (`CreateTask.mov`, Projekt › Informace k projektu › Hodnocení › Plánování sprintu › Vytvoření úkolů ve Sprintmanovi; older SprintMan version): she fills name, backlog request, a one-line **description** of what the task should produce, complexity, one week tag + one type tag and the solver, and leaves the priority at the default **MUST HAVE**.

## Steps

1. Get the team's latest PBS and dump it: `python3 tools/xlsx_dump.py <PBS> --validations`.
2. Preparation-phase rows (Business Requests, PBS, SprintMan set-up, roles) are not sprint work: no Sprint, Status Solved, Worked Hours filled. The teacher criticised having them in S1.
3. Fill **Week** for every row of the sprint. Order: analysis (Business Model, BUCs of the features built in this sprint) first, implementation after it, tests at the end; meetings and reports by the week in their name.
4. Round estimates to SprintMan's complexity list (`0.25 … 144`) and write the same value into the PBS, so the PBS and SprintMan stay 1:1. S1 used 13 h for a weekly meeting and the retro (10 people × 1 h) and 34 h for a consultation.
5. Build the ticket list from the PBS with a script (never by hand): name = Task, backlog request = column A, complexity = Estimation, week tag + type tag, solver. Pre-fill only role-bound solvers (minutes, weekly report, demo, sprint evaluation, retro minutes → PM of that week from the team portal; do not copy the rota into the repo).
6. Show the human the full list and wait for an explicit yes.
7. Create the tickets through the API (idempotent, re-read after every write), then set the pre-filled solvers in the UI (⋮ › Set solver).
8. Add a one-sentence Czech description to every ticket (what is the output). A BUC ticket names its user story and links the Business Requests › User story page and the Business Model › Business use cases page.
9. Export the sprint (name, backlog request, complexity, tags, solver set) and give it, the plan and the PBS to a fresh **read-only** reviewer agent; fix what it confirms.
10. Send the team the sprint link and a per-week overview of the free tickets; everyone sets themselves as solver (⋮ › Set solver) by an agreed day before the deadline.
11. Copy the solvers from SprintMan into the PBS Solver column.
12. Capacity plan: per member and week, sum the estimates of their tickets plus their share of meetings; capacity may exceed it by at most 20 %.
13. Upload the PBS and the capacity plan to the team portal as new versions (the human confirms; never delete the old files).
14. On the sprint's first day set it to Current.

## Checks before you call it done

- Every sprint row in the PBS has exactly one ticket with the same name, backlog request, complexity, week and type; no ticket without a PBS row.
- Every ticket has exactly one week tag and one type tag.
- Every non-meeting ticket has a solver; the PBS Solver column matches SprintMan.
- PBS cells respect the sheet's allowed values; the SUM row is correct.
