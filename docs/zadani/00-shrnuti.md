# Shrnutí zadání – Půjčovna nářadí (Tým 1, BPMI 2026 zima)

> Výtah ze tří stránek v uuApp + Konzultace 1 + našeho návrhu, stav k **10. 10. 2026**.
> Detail a doslovné znění: [`01`](01-bpmi-project-assignment.md) (obecné zadání) · [`02`](02-projekt-pm-informace.md) (pravidla PM, harmonogram, hodnocení) · [`03`](03-tym-1-portal.md) (týmový portál, šablony dokumentů, odkazy) · [Konzultace 1 – shrnutí](../prepisy/2026-10-10_PM_Konzultace-1/shrnuti.md) · [zpětná vazba vyučující](../tym/zpetna-vazba.md) · [náš návrh](../navrh/navrh-aplikace-pujcovna-naradi.md).
> U každého tvrzení je zdroj: **[Z]** = BPMI Project Assignment, **[P]** = stránka Projekt, **[T]** = týmový portál, **[K1]** = přepis Konzultace 1, **[N]** = náš návrh (docx).

---

## 1. Co máme dodat (jednou větou)

Cloudovou webovou aplikaci (MVP) pro **půjčovnu nářadí** – React FE + Node.js/Express BE v **mikroslužbách**, s veřejným **REST nebo GraphQL API**, SQL/NoSQL DB, přihlášením přes **externí identity providera**, **audit logem**, nasazenou na internetu, se zdrojáky v Gitu – plus dokumentaci ve formátu uuApp (Business Requests → Business Model → Application Model) a projekt řízený ve 3 sprintech v uuSprintMan. **[Z]**

## 2. Povinné požadavky na aplikaci (checklist) **[Z]**

- [ ] Schválený základní nápad (vize) vyučujícím
- [ ] **≥ 4 doménové entity** uložené v DB – user/role/user management se **nepočítá** (doporučení: držet se 4, max. 5 – víc = zbytečně velký rozsah **[K1]**)
- [ ] Mikroslužbová architektura
- [ ] Veřejné API – REST nebo GraphQL
- [ ] BE: `Node.js`, `Express`, `SQL` nebo `NoSQL` DB · FE: `React`
- [ ] Autentizace a autorizace
- [ ] Registrace přes 3rd‑party identity providera (Google, Microsoft, Apple…)
- [ ] Audit log
- [ ] Nasazeno v cloudu, dostupné z internetu (cloud od školy jen pokud stavíme na uuApp Frameworku)
- [ ] Dokumentace dle uuApp Frameworku: Business Requests, Business Model, Application Model
- [ ] Řízení ve sprintech v **uuSprintMan**
- [ ] Veškerý kód v dedikovaném Git repozitáři (odkaz doplnit na týmový portál → „doplní tým“ **[T]**)
- [ ] **Implementovat celou aplikaci dle vize**, ne jen funkce popsané v dokumentaci

### Povinnosti „na hlavu“ (10 členů) **[Z]**

| Co | Kolik | Kde |
|---|---|---|
| User story | **1 na člena** → 10 | Business Requests |
| Business use case (vč. wireframe a popisu) | **1 na člena** → 10 | Business Model |
| Backend endpoint (command) | **1 na člena** → 10 | Application Model |
| Routes (FE) | **≥ 2 za tým** + všechny komponenty použité na routách | Application Model |
| Kompletní datový model | schéma diagram + schéma každého objektu, indexy, DAO metody | Application Model |

Funkční požadavky v BR = počet členů (10), vybírat nejdůležitější pro cílového uživatele, **bez** user managementu (registrace/přihlášení se nepočítá). **[K1]**
V Application Model musí být zřejmé, jak jsou **uve → routes → components** propojené a zanořené. **[Z]**

## 3. Body a hodnocení

| Hodnocená aktivita | Max | Minimum | Jak **[K1]** |
|---|---|---|---|
| Test | 10 b | 60 % | 30 min, 20 otázek, výběr 1+ správných odpovědí; před testem projít „žlutý kurz“ PM ve studijních materiálech |
| **Projektové řízení** | **70 b** | 60 % | průběžně každý týden, malé body za aktivity z harmonogramu; **nelze získat zpětně** **[P]**; body uvidíme na týmovém portálu |
| Projekt (workshop) | 20 b | 40 % | 2denní workshop ve zkouškovém (MS Teams), prezentace 30–40 min, neúčast = 0 b **[P]** |

Workshop (20 b): DOC‑BE 4 · DOC‑FE 4 · IMP‑BE 4 · IMP‑FE 4 (na webu omylem 2× IMP‑BE) · Prezentace a funkčnost 4. **[P]**
Den 1: od 9:00 krátký průchod stavem všech týmů, pak dodělávky a příprava prezentace (lektoři k dispozici do 18:00). Den 2: od 9:00 prezentace (cca do 14:00) – vize → analýza → technická dokumentace → demo s testovacími daty → ukázka kódu BE/FE. Prezentace z PowerPointu i přímo z dokumentů – obojí OK. Prezentace rovnoměrně mezi všechny členy. **[K1][P]** Datum: zatím `DD.MM.2027`, oznámí se v Teams. **[P][K1]**

### Srážky **[P]**

| Za co | Srážka |
|---|---|
| Pozdní přihlášení do týmu (dodatečná 5denní lhůta) | 10 b / student (nepřihlášení vůbec: 70 b) |
| Pozdní odevzdání **PBS** (18. 10. 20:00) | **5 b celý tým** |
| Po skončení S3 (27. 12.) projekt není dokončený (drobnosti jako FE úpravy nebo nasazení do cloudu OK) | **10 b celý tým** |

## 4. Termíny

| Kdy | Co | Zdroj |
|---|---|---|
| ✅ 10. 10. 2026 09:00 | Zvolené zadání, vize a klíčové funkčnosti v BR; prezentace na Konzultaci 1 | [P] |
| ⏰ **14. 10. 2026 23:59** | **Celý Business Requests**: dictionary, **context**, **user stories** (vyučující čte hned ve čtvrtek 15. 10.) | [P][K1] |
| ⏰ **18. 10. 2026 20:00** | Zapracovat připomínky k BR (z Diskuze na portálu) · **PBS celého projektu** (srážka!) · role v týmu · rozpis PM po týdnech · **den** pravidelné týdenní schůzky · ve SprintManu: **všechny sprinty** (bez úkolů), **všechny backlog requesty**, **tagy** (týdny sprintů + typy ANA/IMP/TST/MNG/BUG) | [P] |
| 23. 10. 2026 20:00 | Zapracovat další připomínky lektora | [P] |
| 25. 10. 2026 20:00 | Zápis z týdenní schůzky · zpřesnit PBS pro S1 · kapacitní plán S1 · úkoly S1 ve SprintManu | [P] |
| 26. 10. – 15. 11. | **Sprint 1** | [P] |
| 7. 11. 2026 09:00–12:00 | **Konzultace 2** (vše připravené do 09:00) | [P] |
| 15. 11. 16:00 / 20:00 | Konec S1: bug report, demo, PBS vyhodnocení, uzavřít S1 (16:00) · retrospektiva, plán S2 (20:00) | [P] |
| 16. 11. – 6. 12. | **Sprint 2** | [P] |
| 28. 11. 2026 09:00–12:00 | **Konzultace 3** | [P] |
| 6. 12. 16:00 / 20:00 | Konec S2 (analogicky S1) | [P] |
| 7. 12. – 27. 12. | **Sprint 3** (zasahuje do Vánoc – počítat s tím v kapacitách **[K1]**) | [P] |
| 19. 12. 2026 09:00–12:00 | **Konzultace 4** | [P] |
| **27. 12. 2026 20:00** | Konec S3 – **projekt hotový** (jinak −10 b) | [P] |
| 2027 (TBD) | Workshop (2 dny) | [P] |

Běžný týdenní rytmus: termíny **neděle 20:00**; v týdnu s konzultací **sobota 09:00** (ukazuje se na konzultaci). **[K1][P]**

## 5. Jak to funguje (procesní pravidla)

**Role** **[P][T]** – Analytik/Tester, BE vývojář, FE vývojář (1 člověk může mít víc rolí); rozumné rozložení kvůli zastupitelnosti.
**Projektový manažer** – rotuje po týdnu, každý alespoň 1× (týdny výuky 4–13). PM vede schůzky, píše zápis a týdenní report, vede demo a retrospektivu, uzavírá sprint, je **vždy na konzultaci** (+ min. 1 další člen). Při volbě PM týdne hlídat konzultační týdny. PM je „tahoun“, ne ten, kdo dělá práci za ostatní – PBS, kapacitní plán i reporting dělá celý tým. **[P][K1]**

**Každý sprint (3 týdny)** **[P]**
1. *Plánování:* zpřesnit PBS (Week, Solver, Estimation), kapacitní plán po týdnech (kapacita ≥ odhad, rezerva max 20 %), úkoly ve SprintManu (název, priorita, tagy týden+typ, odhad, řešitel; schůzky bez řešitele).
2. *Průběh:* 1. den sprint → Current; každý řešitel průběžně hlásí **stav** úkolu a **Time to complete** ve SprintManu + **odpracované hodiny v PBS**; týdenní schůzka + zápis; týdenní report (semafor 🟢🟠🔴); bugy do Bug Reportu (kompletní historie).
3. *Vyhodnocení:* komentované **demo** všech úkolů sprintu (do Seznamu souborů na portálu), vyhodnocení PBS (Status, Worked Hours, Comment), uzavření sprintu (vše Solved nebo přesunuto), **retrospektiva** s akčními body na konkrétní lidi.

**Stavy úkolů:** Waiting · In progress · To Assessment · Solved · Waiting/In progress/To Assessment – Problem · Transferred · Cancelled. **Solved** = zrevidováno, otestováno, bez připomínek. **[P]**

**Zásady, které vyučující zdůrazňuje**
- **Neimplementovat nic, co neprošlo analýzou** (Business Model); změny proti zadání konzultovat s analytikem. **[P][K1]**
- Každý úkol má **jednoho** konkrétního řešitele (jinak „to neudělá nikdo“). **[K1]**
- Soubory na portálu (PBS, kapacitní plán, bug report) **nemazat, jen aktualizovat** – kvůli historii. **[K1]**
- Nic se „neodevzdává“ tlačítkem – výstupy se plní přímo do dokumentů/tabulek, vyučující je kontroluje a zpětnou vazbu píše do **Diskuze** na portálu (oznámí v Teams). **[K1]**
- Konzultace probíhají v týmových kanálech v Teams, lze je nahrávat (→ přepisy sem do `docs/prepisy/`). **[K1]**
- Dotazy: obecné → obecný kanál, týmové → týmový kanál, osobní → soukromá zpráva. **[K1]**
- Vzorová aplikace s kompletní dokumentací: **uuJokes** (Portál běhu kurzu → studijní materiály → případová studie) – inspirace, ne šablona 1:1. **[K1]**

## 6. ⚠️ Nesoulady a otevřené otázky

1. **Vize a entity:** téma je schválené (týmová část Konzultace 1, viz [`../tym/zpetna-vazba.md`](../tym/zpetna-vazba.md)). Aktuální verze vize, user stories a entit je **v Business Requests v uuApp** (odkaz v [`03`](03-tym-1-portal.md)). Původní návrh v [`docs/navrh/`](../navrh/navrh-aplikace-pujcovna-naradi.md) pracoval s jinými entitami (Model nářadí, Kus, Rezervace, Výpůjčka) – při rozporu platí uuApp.
2. **Tagy typů úkolů:** harmonogram říká ANA, IMP, TST, MNG, **BUG**; záložka Hodnocení › Vytvoření tagů i sloupec v PBS jen ANA/IMP/TST/MNG → bezpečnější založit i BUG. **[P]**
3. **Application Model:** zadání chce „standard pages (Application Structure, SubApp, Profiles)“ **[Z]**, šablona týmového dokumentu má *Application, Application Profiles, Persistence Layer, Command List, User view entry points, Routes, Components* **[T]** – stránka „SubApp“ chybí. ❓ zeptat se vyučující.
4. **Architektura a technologie:** návrh a otevřené otázky viz [`../rozhodnuti/`](../rozhodnuti/). Cloud od školy je jen při použití uuApp Frameworku. **[Z]**
5. **Drobnosti na webu školy** **[P]**: workshop 2× „IMP – BE“; u „Vyhodnocení úkolů v PBS“ odkaz pojmenovaný „Kapacitní plán.xlsx“ (správně asi `PBS - vyhodnocení sprintu.xlsx`); v harmonogramu chybí retrospektiva S3 (portál ji má).

## 7. Co výtah nepokrývá

- **Přílohy** (xlsx šablony a příklady, 12 videonávodů k uuSprintMan) – jsou jen na stránkách školy; seznam v [`02`](02-projekt-pm-informace.md).
- **Portál běhu kurzu** (studijní materiály, „žlutý kurz“ k testu, vzorová aplikace uuJokes) a **Termíny k přihlášení**.
- **Aktuální stav týmu** (role, rozpis PM, obsah BR, SprintMan) – průběžně se mění, platí uuApp.
