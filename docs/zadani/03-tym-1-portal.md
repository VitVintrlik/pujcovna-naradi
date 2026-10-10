# Odkaz 3 – Týmový portál „Tým 1“

| | |
|---|---|
| **Týmový portál** | https://uuapp.plus4u.net/uu-openbusinessbrickkit-maing01/e16d7ca1433c4a5d8b40d7be5723da39/uuOpenBusinessBrick?oid=6abb8d8149b0da91fb17b586&pageOid=6abb8d8249b0da91fb17b59b |
| **Business Requests – Tým 1** (průběžné výsledky týmu) | https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6abb8e54128fd3cc6abb50ff |
| **Business Model, Application Model, SprintMan, kanál v Teams** | odkazy v tabulce „Výstupy projektu“ na portálu |
| **Staženo** | 10. 10. 2026 |

> Výtah popisuje **strukturu** portálu a šablon dokumentů. Aktuální obsah (role, rozpis PM, vize, user stories…) se průběžně mění, proto ho
> nepřepisujeme a **platí to, co je v uuApp**.

## Stránky portálu

**Tým 1** (hlavní) · **Zápisy z týmových schůzek** · **Týdenní reporty** · **Retrospektiva** – přepínač pod šipkou vedle nadpisu.

## Hlavní stránka

| Sekce | K čemu je | Termín vyplnění (harmonogram) |
|---|---|---|
| **Informace k projektu** | rozcestník; tlačítko „Zobrazit“ vede na stránku Projekt ([`02`](02-projekt-pm-informace.md)) | – |
| **Rozdělení rolí** | tabulka Student / Přiřazená role (Analytik/Tester, BE, FE, kombinace) | 18. 10. 2026 20:00 |
| **Pravidelná týmová schůzka** | tabulka Den v týdnu / Čas – má obsahovat **pevný den v týdnu** (víc schůzek = víc řádků) | 18. 10. 2026 20:00 |
| **Projektový manažer** | rozpis PM na týdny výuky 4–13; týdny **6, 9, 12 jsou konzultační** (PM musí být na konzultaci) | 18. 10. 2026 20:00 |
| **Výstupy projektu** | odkazy na všechny výstupy – viz níže | – |
| **Diskuze** | sem píše vyučující **zpětnou vazbu** (notifikace nechodí, oznámí to v obecném kanálu Teams) | – |
| **Členové týmu** | 10 členů | – |
| **Seznam souborů** | šablony od vyučující: `Kapacitní plán.xlsx`, `PBS.xlsx`, `Bug Report.xlsx` – **nemazat ani nenahrazovat, jen aktualizovat** (historie verzí) | – |
| **Hodnocení týmu** | body z workshopu: DOC‑BE 4 · DOC‑FE 4 · IMP‑BE 4 · IMP‑FE 4 (na webu 2× „IMP – BE“) · Prezentace a funkčnost 4; tabulka hodnocení členů | – |

### Výstupy projektu (tabulka na portálu)

| Výstup | Popis |
|---|---|
| MS Teams | Týmový komunikační kanál v MS Teams |
| BPMI 26W CZ DL Tým 1 – SprintMan | Aplikace na řízení projektu (uuSprintMan) |
| BPMI DL Business Requests – Tým 1 | Vize projektu a požadavky na aplikaci |
| BPMI DL Business Model – Tým 1 | Business analýza aplikace |
| BPMI DL Application Model – Tým 1 | Technická dokumentace aplikace |
| PBS.xlsx | PBS – rozpad prací na projektu včetně odhadů pracnosti |
| Kapacitní plán.xlsx | Kapacitní plán |
| Zápisy z týmových schůzek | Zápisy z pravidelné týdenní týmové schůzky |
| Týdenní reporty | Týdenní reporty |
| Bug Report.xlsx | Bug Report – seznam nalezených chyb a stav jejich řešení |
| Retrospektiva | Zápisy z retrospektivy |
| _doplní tým_ | **Repozitář s kódem aplikace (GitHub)** ← sem patří odkaz na tohle repo |

---

## Šablona „Zápisy z týmových schůzek“

Záložky **Týden výuky 4 … 13**, každá stejná šablona:

```
Zápis ze schůzky
  Základní informace
    | Datum a čas schůzky                          |  |
    | Zápis ze schůzky zpracoval                   |  |
    | Nezúčastnění členové týmu a důvod neúčasti   |  |
  Příprava
    Jednotliví členové týmu průběžně zapisují, co je potřeba na schůzce řešit
  Zápis ze schůzky
    Během schůzky PM zapisuje, na čem se tým dohodl
```

## Šablona „Týdenní reporty“

Záložky **Týden výuky 5 … 13**, každá stejná šablona.

**Pravidla pro určení stavu projektu (semafor):**

- 🟢 **projekt probíhá podle plánu** (pokud platí vše z následujícího): dokončeno ≥ 80 % plánovaných tasků na daný týden · žádný kritický bug nebo blokující problém · rozdíl mezi plánovanými a skutečnými hodinami ≤ 20 % · žádné riziko, které by ohrožovalo dokončení sprintu
- 🟠 **projekt má problémy, ale je zvládnutelný** (pokud platí alespoň jedna z možností): dokončeno 50–80 % plánovaných tasků · objevily se nové bugy nebo technické problémy · některý člen týmu nestíhá nebo chyběl · rozdíl mezi plánovanými a skutečnými hodinami 20–40 % · existuje riziko, které může ovlivnit další týden
- 🔴 **projekt je v ohrožení** (pokud platí alespoň jedna z možností): dokončeno < 50 % plánovaných tasků · existuje blokující problém, který zastavil práci · tým nemá kapacitu dokončit sprint · rozdíl mezi plánovanými a skutečnými hodinami > 40 % · riziko přímo ohrožuje dokončení sprintu

| Sekce | Sloupce / instrukce |
|---|---|
| Základní informace | Sprint · Týden sprintu · Datum a čas · Zpracoval · Stav projektu |
| Úkoly ve sprintu | _Do jednotlivých kolonek uveďte počet úkolů dle Sprintmana:_ Plánované úkoly · Waiting · Waiting – Problem · In progress · In progress – Problem · To assessment · To Assessment – Problem · Solved · Cancelled · Transferred |
| Bugy | _Počet chyb dle Bug Reportu:_ Závažnost (A, B, C) · Celkem bugů · Nové · Opravují se · V retestech · Vyřešené |
| Kapacity týmu (souhrn) | _Hodiny za celý tým dle Kapacitního plánu a Sprintmana:_ Plánované hodiny týmu · Skutečně odpracované hodiny týmu · Rozdíl |
| Využití kapacit jednotlivých členů týmu | Člen týmu · Plánované hodiny · Skutečně odpracované hodiny · Rozdíl · Komentář |
| Rizika a problémy | _Pokud je stav 🟠 nebo 🔴, uveďte problémy a návrh řešení:_ Riziko / Problém · Dopad · Navržené řešení |
| Akce na příští týden | _Pokud je stav 🟠 nebo 🔴, vyplňte minimálně 2 konkrétní akce:_ Problém / Oblast · Akce · Odpovědná osoba |
| Poznámka projektového manažera | Krátké zhodnocení týdne: co fungovalo, hlavní problém, co bude prioritou příští týden. **Max. 3 věty.** |

## Šablona „Retrospektiva“

Záložky **Sprint 1 · Sprint 2 · Sprint 3**, každá stejná:

- 4 diskuzní boxy (každý člen přidá příspěvek): **Co mi přišlo fajn / co mě potěšilo** · **Co mě brzdilo / blokovalo** · **Co mi chybělo** · **Nápady na vylepšení**
- Tabulka **Akční body**: Akční bod · Zodpovědný člen týmu · Stav

---

## Šablony týmových dokumentů (uuApp „books“)

### Business Requests – stránky Vision · Dictionary · Context · User story

_„This document is used to describe the vision of the application and the most important functional requirements.“_

- **Vision** – vize + seznam user stories (1 na člena) + entity.
- **Dictionary** – tabulka Term / Term description.
- **Context** – „Describes context of the application.“ (ilustrativní příklad použitý v user stories).
- **User story** – jedna sekce na user story; přepínač stránek je vlevo nahoře u nadpisu (odpověď vyučující, viz [`../tym/zpetna-vazba.md`](../tym/zpetna-vazba.md)). Šablona každé US:
  - **Why we need this User Story** – Describe the purpose why this User Story is needed and which problem it is going to solve. _(E.g.: Without this functionality payments cannot be collected and business – digitalized.)_
  - **User Story goal** – Describe what is the goal of the User Story, which goal is going to be reached by involved actors. _(E.g.: The goal is to have created payment plan to be able to see how much money we will need to pay payments planned for next month.)_
  - **User Story context** – Provide description of the situation from real world – what is needed, who and from which role can do it and why it is needed. You can also create a page Context in this book to describe whole model situation. _(E.g.: The accountant Mary received new invoice with the paydate next month. She need to create a payment to be able to see planned payments for next month.)_
  - **User Story initial situation** – Describe initial situation in the details and examples from the real world. _(E.g.: Mary have all payment information about payer and receiver of the payment.)_
  - **User Story scenario** – strukturovaný scénář (komponenta uuApp)
  - **User Story diagram** – uuBml diagram

### Business Model – stránky Business discipline · Processes · Business actors · Products · Business use cases

_„This document is used to describe the detailed business analysis of the application.“_

| Stránka | Struktura šablony |
|---|---|
| Business discipline | **Overview (A4)** – „Brief description of the Business Discipline matter. Here we try to express this Business Discipline within one page of A4 format. For detailed specifications, the related Concepts are used.“ · „Describe the solved business discipline, ideally supplemented by one or more uuBml diagrams.“ |
| Processes | **Process Diagram** (první dekompozice hlavního procesu) · **Process Name** („Give a brief description of the process.“) · **Process – Products Diagram** · **Business Use Case List Diagram** |
| Business actors | diagram + tabulka **Business Actor / Description** |
| Products | **Product Overview** (class diagram vztahů produktů) · **Product Name** („Insert brief description of the product.“) · tabulka **Attributes: Attribute Name / Description** |
| Business use cases | **Business Use Case Name** · **Trigger List** (Triggered by / Trigger Description) · **Pre-conditions** · **Post-conditions** · **Business Use Case Specification – Happy day scénář** (kroky) · **Mockups & Wireframes** („Describe the screen.“) + tabulka **Name / Data binding / Component / Description** (vzor: `Field/column name` · `product.atributeName` · `Used component` · `Description of the field/column.`) |

### Application Model – stránky Application · Application Profiles · Persistence Layer · Command List · User view entry points · Routes · Components

_„This document is used to describe the detailed technical design of the application – database, backend and frontend endpoints.“_

| Stránka | Struktura šablony |
|---|---|
| Application | **Application Description** + diagram · **Application Topology** (diagram) |
| Application Profiles | **Role Profiles** (Name / Code / Description) · **Role Group Profiles** (Name / Code / Description) |
| Persistence Layer | **Schema Diagram** · **Schema Name** – `const schemaNameSchema = { id: "012...", //generated unique code ... };` · **Limit List** (vzor `maxNoi` · `1,000` · Maximum number of items.) · **DAO Method List**: `create (uuObject) -> uuObject` · `get (filter) -> uuObject` · `list (pageInfo) -> {itemList:[object], pageInfo:{}}` · `update (object) -> object` · `delete (id) -> void` |
| Command List | tabulka **Commands** (Command / Description / Application profiles) · **Basic Info** (Name · Description · HTTP Method · Url · Application profiles) · „This algorithm describes [fill in what end-point does] and all possible errors and warnings that can happen during this process.“ · **Vstup** `const dtoIn = {...}` · **Input validation** `const dtoInValidationSchema = {...}` · **Výstup** `const dtoOut = {...}` · **Output validation** `const dtoOutValidationSchema = {...}` · **Error prefix** `{host}/{command}` · **Algoritmus**: 1. Validation of dtoIn (1.1 validate dtoIn by dtoInType → validationResult; 1.2 no keys beyond dtoInType; 1.3 validationResult must not contain wrong keys; 1.4 missing keys get default values) · 2. [other steps] · 3. Return dtoOut · **Seznam chyb**: `Warning / unsupportedKeys / DtoIn contains unsupported keys. / { "unsupportedKeyList":{} }` · `Error / invalidDtoIn / DtoIn is not valid. / { "invalidTypeKeyMap":{}, "invalidValueKeyMap":{}, "missingKeyMap":{} }` |
| User view entry points | **User View Entry Point Name** · **Routes** (diagram) · tabulka Name / Uri / Profiles / Description |
| Routes | **Basic Info** (Name · Description · User view entrypoint) · **Properties (props)** (Name / Type / Default value / Description) · **Component Diagram** · **Component Render** (Název / Pravidla – „Do not display if ...“, „Disabled if...“) |
| Components | **Basic Info** (Name · Description) · **Properties (props)** · **Component Diagram** · **Component Render** |

> Zadání chce „Standard Application Model pages (Application Structure, SubApp, Profiles)“ – stránka „SubApp“ v šabloně není (viz [`00-shrnuti.md`](00-shrnuti.md) → Nesoulady).
