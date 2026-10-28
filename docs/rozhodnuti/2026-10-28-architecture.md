# Architektura: backend, frontend a jak spolu mluví

| | |
|---|---|
| **Datum** | 28. 10. 2026 |
| **Stav** | **návrh** – tým ho může změnit PR do tohoto dokumentu |
| **Kontext** | [`docs/zadani/00-shrnuti.md`](../zadani/00-shrnuti.md), [návrh stacku](2026-10-10-stack-and-ai-workflow.md) (tento dokument odpovídá na většinu jeho §7), user stories a slovník v [Business Requests](https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=6abb8e54128fd3cc6abb50ff) |

V týmu jsou úplní začátečníci, pár zkušených vývojářů a AI agenti a všichni pracují ve stejném kódu. Zadání předepisuje Express, takže nemáme framework jako NestJS, který by každému řekl, kam co patří – to dělá tento dokument. Všemi rozhodnutími se táhnou dvě zásady:

- **Jednoduše, ne chytře.** Co začátečník nepřečte, nepoužíváme.
- **Typovou bezpečnost neobětujeme.** Chyby chytá TypeScript a Zod, ne pozornost lidí.

## 1. Celkový obrázek

```
apps/web  (React)
   │  REST + JSON, token přihlášeného uživatele v hlavičce Authorization
   ├──► services/reference-data   pobočky, kategorie              → vlastní databáze PostgreSQL
   ├──► services/rental           nářadí, objednávky               → vlastní databáze PostgreSQL
   │        └──► services/reference-data   (jen při vytvoření nářadí)
   └──► services/auth             přihlášení přes Google, uživatelé, role → vlastní databáze PostgreSQL

packages/shared   kontrakty endpointů a schémata      – používá apps/web i každá služba
packages/server   pomocníci pro backend (chyby, auth)  – používá každá služba
packages/ui       design systém                         – používá apps/web
```

### Co stavíme

| | |
|---|---|
| **Entity** | pobočka (= místo vyzvednutí), kategorie, nářadí (jeden fyzický kus s vlastním kódem, např. K003), objednávka. Uživatel není doménová entita. |
| **Role** | nepřihlášený návštěvník – prohlíží nabídku a detail nářadí · zákazník (přihlášený) – vytváří, prohlíží a ruší své objednávky · pracovník – všechno ostatní. Role admin ani management není; „Administrátor“ v user story o pobočkách je pracovník. |
| **Stavy objednávky** | `PENDING` → `CONFIRMED` nebo `REJECTED`; `PENDING` / `CONFIRMED` → `CANCELLED`. České popisky se berou z analýzy. |
| **Stavy nářadí, které uživatel vidí** | Dostupné, Rezervované, Vyřazené (jak se ukládají: §2.5) |

**Atributy a pravidla** každé entity se berou z její user story (Business Requests) a business use case (Business Model) v uuApp, a to ve chvíli, kdy se daná funkce plánuje. Tento dokument je nekopíruje (`AGENTS.md` › Repo content). Funkce se staví, až když má svůj business use case. Kde analýza mlčí: žádná cena; termíny jsou celé dny, začátek je dnes nebo později, konec je stejný den nebo po začátku, oba dny včetně; kód nářadí se generuje jako `K` + pořadové číslo a je jedinečný napříč všemi kusy.

**Předpoklady tam, kde analýza zatím není jednotná** (rozhodnou analytici; tento dokument analýzu nemění): na objednávce je právě jedno nářadí, jak říká user story „Create Order“ (slovník říká, že objednávka sdružuje víc kusů) – tabulka položek objednávky nebude; názvy stavů objednávky se sjednotí na čtyři výše; země u pobočky a kontrola duplicitní adresy jsou zatím otevřené a schéma musí umožnit je doplnit.

## 2. Backend

### 2.1 Technologie

| Technologie | K čemu | Proč |
|---|---|---|
| Node.js + **Express 5** | HTTP server každé služby | předepisuje zadání |
| **TypeScript** (strict) | veškerý kód | typové chyby v editoru, ne až za běhu |
| **Zod** | validace každého požadavku a konfigurace | jedno schéma dá kontrolu za běhu i typ pro TypeScript |
| **PostgreSQL 17** (Docker) | data | už je v kostře; ORM ho mají v dokumentaci na prvním místě; spousta hostingů zdarma pro nasazení do cloudu |
| **Prisma** | přístup k databázi, migrace | celá databáze v jednom čitelném `schema.prisma`; plně typované dotazy; migrace jedním příkazem; Prisma Studio na prohlížení dat |
| **Better Auth** | přihlášení přes Google, uživatelé, sessions, role | zadání chce externího identity providera; je typovaný, má adaptér pro Prismu a vydává JWT |
| **jose** | ověření JWT v každé službě | malá knihovna bez závislostí; ověří podpis proti veřejnému klíči, takže se služba `auth` nevolá u každého požadavku |

### 2.2 Služby

| Služba | Vlastní | User stories |
|---|---|---|
| `services/reference-data` | pobočky, kategorie | Create Pickup Locations, Create Categories, seznam poboček v Browse Equipment |
| `services/rental` | nářadí, objednávky | Browse Equipment, View Equipment Details, Create Order, View Orders, Cancel Order, Create Equipment, Delete Equipment, Reject/Confirm Orders |
| `services/auth` | uživatelé, sessions, role | přihlášení (nepočítá se jako user story) |

**Proč právě takhle:** nářadí a objednávky se mění spolu – vytvoření, zrušení, potvrzení nebo zamítnutí objednávky mění, co nářadí ukazuje. V jedné službě je to jedna databázová transakce. Kdyby nářadí bylo u kategorií, musela by každá změna objednávky zapisovat do databáze jiné služby, a to je v mikroslužbách to nejtěžší, co se dá udělat špatně.

**Jediné volání mezi službami:** při vytvoření nářadí se `rental` zeptá `reference-data`, jestli kategorie a pobočka existují. Odpovědi `rental` obsahují jen `categoryId` a `pickupLocationId`; názvy si web doplní ze seznamů, které stejně načítá. Objednávka si při vytvoření uloží jméno a e-mail zákazníka z tokenu, takže přehled pracovníka nemusí volat `auth`.

`services/example` zůstává jako šablona, ze které se nová služba kopíruje (`AGENTS.md` › Backend).

### 2.3 Struktura služby

```
services/rental/
├── prisma/schema.prisma        tabulky této služby
├── src/
│   ├── app.ts                  sestaví Express aplikaci
│   ├── index.ts                spustí ji
│   ├── env.ts                  ověřená konfigurace – jediné místo, které čte process.env
│   └── tools/                  jedna složka na entitu
│       ├── tool.routes.ts      zparsuje vstup → zavolá service → pošle odpověď
│       ├── tool.service.ts     logika a dotazy přes Prismu
│       └── tool.mapper.ts      řádek z databáze → odpověď (výslovně vypsaná pole)
└── .env.example
```

Je to uspořádané tak, jak by to uspořádal NestJS, takže tvar je povědomý:

| NestJS | U nás |
|---|---|
| module | `src/<entita>/` |
| controller | `<entita>.routes.ts` – jen zparsovat, zavolat, odpovědět |
| service | `<entita>.service.ts` |
| DTO + validation pipe | Zod schémata z kontraktu endpointu (§4) |
| exception filter | `throw new AppError(code, message)` + centrální `errorHandler` → `{ error: { code, message, details } }` |
| guard | middleware `requireAuth()` / `requireRole('worker')`; veřejná routa se označí výslovně |
| repository | žádné – service volá Prismu přímo; klient Prismy už repository je |
| response DTO | `to<Entita>Response()` v mapperu – nikdy rozbalený řádek z databáze |

### 2.4 Databáze

- Každá služba má vlastní databázi na stejné lokální instanci PostgreSQL a vlastní Prisma schéma, klienta a migrace.
- Skripty `db:migrate`, `db:seed`, `db:reset`. Seed naplní data na demo pro workshop: pracovníka, kategorie, pobočky, nářadí.

### 2.5 Stav nářadí a rezervace

- Nářadí si ukládá jen `AVAILABLE` nebo `RETIRED`. **„Rezervované“ se počítá**: vyřazené → Vyřazené; jinak, pokud má aktivní objednávku → Rezervované; jinak Dostupné.
- Objednávka je **aktivní**, dokud je `PENDING` nebo `CONFIRMED` a ještě neskončil její termín. Výdej a vrácení nářadí nejsou v rozsahu, takže nářadí uvolní konec termínu.
- Odpovídá to zpětné vazbě vyučující ze 16. 10. ([`docs/tym/zpetna-vazba.md`](../tym/zpetna-vazba.md)): nářadí je Rezervované od chvíle, kdy vznikne objednávka, a vrátí se zpět, když je objednávka zamítnutá nebo zrušená – tady samo, protože se stav počítá.
- **Rezervuje se podle termínů.** Rezervované nářadí jde objednat na termín, který se nepřekrývá s žádnou jeho aktivní objednávkou. Překryv je chyba A3 z user story „Create Order“. Dva současné požadavky na překrývající se termín nesmí projít oba (serializovatelná transakce nebo exclusion constraint v PostgreSQL – vybere ten, kdo to staví). Formulář objednávky obsazené dny neukazuje: žádná user story to nepopisuje.

### 2.6 Přihlášení, role, audit log

- **Better Auth** ve `services/auth`: přihlášení přes Google, adaptér pro Prismu, pole `role` – `customer` pro každého nového uživatele, `worker` nastaví seed nebo se změní přímo v databázi (správu rolí žádná user story nepopisuje).
- Vydává **JWT** s id uživatele, rolí, jménem a e-mailem a zveřejňuje své veřejné klíče. Každá další služba token ověří přes `jose` v `requireAuth()` / `requireRole()`.
- **Veřejné routy:** seznam poboček, seznam kategorií, seznam nářadí na pobočce, detail nářadí. Všechno ostatní vyžaduje přihlášení.
- OAuth klienta v Googlu založí člen týmu; jeho id a secret i secret pro Better Auth patří jen do `.env` (názvy v `.env.example`).
- **Audit log:** každá služba má tabulku `AuditLogEntry` (čas, kdo a s jakou rolí, akce jako `order.cancel`, typ a id záznamu, nepovinné detaily). Service funkce volá `recordAudit(...)` ve stejné transakci jako samotnou změnu, takže žádná změna neproběhne bez záznamu. `auth` zapisuje přihlášení. Obrazovka nebude – na demo se log ukáže v Prisma Studiu.

## 3. Frontend

### 3.1 Technologie

| Technologie | K čemu | Proč |
|---|---|---|
| **React 19** + **Vite** | webová aplikace | React předepisuje zadání; Vite už je v kostře |
| **React Router** | routy | router, který používá každý tutoriál; TanStack Router je plně typovaný, ale na deset obrazovek má moc konvencí |
| **TanStack Query** | všechna data z backendu | stav načítání a chyby, cache a nové načtení po změně – žádné načítání dat v `useEffect`, žádné ruční ošetřování souběhu požadavků |
| **shadcn/ui** + **Tailwind CSS** | design systém | hotové přístupné komponenty zkopírované do našeho repa, takže je můžeme měnit; styly třídami jako `flex gap-4`, žádné CSS soubory |
| **react-hook-form** + Zod | formuláře | formulář validuje stejným schématem jako backend (§4) |
| klient Better Auth | přihlášený uživatel (`useSession`) | protějšek `services/auth` |

### 3.2 Struktura

```
packages/ui/                 design systém: Button, Input, Table, Dialog, Toast, Calendar…
                             neví nic o nářadí ani o API
apps/web/src/
├── pages/                   jedna stránka = jedna routa (ToolListPage, ToolDetailPage…)
├── components/              komponenty, které znají doménu (ToolCard, OrderTable) – jen vykreslují props
├── hooks/                   veškerá business logika a data – jeden hook na soubor (use-tools.ts, use-create-order.ts)
├── utils/                   čisté funkce bez Reactu (kontrola termínu, popisky)
├── api/client.ts            volá backend přes kontrakty, přidává token
├── routes.tsx               všechny routy na jednom místě
└── paths.ts                 skládání odkazů: paths.toolDetail(toolId)
```

**Kam s novým kódem?**

| Když to… | Patří to do |
|---|---|
| je obrazovka s vlastní adresou | `pages/` |
| zobrazuje něco o nářadí, objednávkách, kategoriích… | `apps/web/src/components/` |
| je obecné (tlačítko, tabulka, dialog) | `packages/ui/` |
| načítá nebo mění data, nebo drží logiku, která potřebuje React | `hooks/` |
| je logika bez Reactu | `utils/` |

`packages/ui` nezávisí na TanStack Query ani na API klientovi, takže komponenta v něm nemůže načítat data ani omylem.

### 3.3 Pravidla

- **Stránka** volá hooky, definuje handlery a skládá komponenty. **Komponenta** jen vykresluje své props. Logiku drží **hooky**.
- Klíč pro TanStack Query je v hooku, který data čte; mutace si ho odtamtud importuje a po změně ho invaliduje.
- Všechny routy jsou v `routes.tsx` – to je zároveň seznam rout pro Application Model; UVE → routy → komponenty odpovídá `routes.tsx` → `pages/` → `components/`.
- Odkazy jen přes `paths.ts`; parametry rout se ověří Zod schématem.
- Každá stránka s daty má stav načítání, chyby a prázdného seznamu – přes `LoadingState`, `ErrorState` a `EmptyState` z `packages/ui`.
- Stránky pracovníka obaluje v `routes.tsx` komponenta `RequireRole` – je to pohodlí pro uživatele, skutečná ochrana je na backendu.
- Jazyk UI: čeština. Hlášky, které jsou v user stories slovensky, se přeloží.

**Předběžné routy** (kdo staví, je může upravit; Application Model pak odpovídá výsledku): `/` (pobočka a její nářadí), `/tools/:toolId`, `/tools/:toolId/order`, `/orders`, `/orders/:orderId`, `/manage/tools`, `/manage/tools/new`, `/manage/categories`, `/manage/categories/new`, `/manage/pickup-locations`, `/manage/pickup-locations/new`, `/sign-in`.

## 4. Jak spolu mluví frontend a backend

### 4.1 REST

Obyčejné REST zdroje přes JSON: `GET /tools/:toolId`, `POST /orders`, `PATCH /orders/:orderId/cancel`… (přesné cesty určí ten, kdo staví). Chyba má vždy stejný tvar, `{ error: { code, message, details } }`. Požadavek přihlášeného uživatele nese token v `Authorization: Bearer <token>`.

### 4.2 Co je `packages/shared`

`@pujcovna/shared` je jediný balík, který importuje **zároveň** web i služby. Obsahuje **kontrakt** každého endpointu: s čím se volá a co vrací, zapsané jako Zod schémata. Protože obě strany importují stejný kontrakt, nemůžou se rozejít: změníš pole a TypeScript ukáže každé místo na obou stranách, které se musí přizpůsobit.

Jeden endpoint od začátku do konce:

```ts
// packages/shared – kontrakt
export const getToolEndpoint = defineEndpoint({
  method: 'GET',
  path: '/tools/:toolId',
  params: z.object({ toolId: z.uuid() }),
  response: toolResponseSchema,
});
```
```ts
// services/rental – backend jím ověří vstup a otypuje odpověď
toolRouter.get(getToolEndpoint.path, async (request, response) => {
  const { toolId } = getToolEndpoint.params.parse(request.params);
  const body: ToolResponse = toToolResponse(await getTool(toolId));
  response.json(body);
});
```
```ts
// apps/web – frontend jím sestaví adresu a zkontroluje odpověď
const tool = await callEndpoint(getToolEndpoint, { params: { toolId } });
```

- Kontrakt má `method`, `path` a schémata `params`, `query`, `body` a `response` (všechna nepovinná kromě `response`). `defineEndpoint()` jen přidá typy – žádná chytrá odvozování. Šablona ukazuje tvar ke zkopírování.
- `callEndpoint()` je tady taky, protože ho používá web i služba, která volá jinou službu. Hlídá časový limit, kontroluje odpověď proti schématu a z těla `{ error }` udělá typovanou chybu.
- Formuláře používají schéma `body` z kontraktu, takže formulář i backend odmítnou přesně stejný vstup.
- Každý typ vzniká ze schématu přes `z.infer`; nic se nepíše dvakrát.
- **Kontrakt je kódová podoba commandu z Application Model**: dtoIn = `params` / `query` / `body`, dtoOut = `response`, seznam chyb = kódy `AppError`, které vrací. Každý člen píše jeden command a v dokumentu i v kódu je to totéž.

### 4.3 Tři balíky

| Balík | Obsahuje | Používá |
|---|---|---|
| `packages/shared` | kontrakty, schémata, `callEndpoint` | `apps/web` a každá služba |
| `packages/server` | `AppError`, obsluha chyb, `requireAuth` / `requireRole` | každá služba |
| `packages/ui` | design systém | `apps/web` |

Schéma patří do `packages/shared`, jen když ho používají obě strany (`AGENTS.md` › Structure); všechno ostatní zůstává tam, kde se používá.

## 5. Git

- Do `main` jen přes PR: zelené CI (lint, typecheck, build), jedno schválení, squash merge, větev se po merge smaže, žádný force push. Na GitHubu už je to nastavené.
- Větev se jmenuje podle ticketu v uuSprintMan, malými písmeny s pomlčkami (`create-order-be`), a vždy vzniká z čerstvě stažené `main`.
- Titulek PR je název ticketu, popis obsahuje odkaz na ticket.
- „Require branches to be up to date before merging“ zůstává vypnuté; konflikt merge zablokuje i tak.
- Repozitář je veřejný: všechno, co se pushne, vidí kdokoli.

## 6. Zamítnuté varianty

| Oblast | Varianta | Proč ne |
|---|---|---|
| Backend | NestJS | vyučující chce Express |
| Backend | MySQL | proti PostgreSQL nic nepřinese a ten už je v kostře |
| Backend | Drizzle | chce znalost SQL; jeho typové chyby jsou pro začátečníky nečitelné |
| Backend | TypeORM | slabší typy u relací a dotazů |
| Backend | nářadí ve službě reference-data | každá změna objednávky by zapisovala do databáze jiné služby |
| Backend | ukládat „Rezervované“ na nářadí | přestane sedět, jakmile má jedno nářadí dvě objednávky |
| Backend | gateway | kvůli přihlášení není potřeba; vrátíme se k ní u nasazení |
| Backend | fronty zpráv, eventy | daleko nad rámec toho, co projekt potřebuje |
| Frontend | TanStack Router | na deset obrazovek moc konvencí |
| Frontend | načítání v `useEffect`, SWR, Redux / RTK Query, loadery routeru | ruční načítání a souběh požadavků, slabší mutace, příliš těžké, nebo bez typů |
| Frontend | složky podle features | pages / components / hooks je známější a na tuhle velikost stačí |
| Frontend | centrální soubor s query klíči | na tuhle velikost zbytečný |
| Frontend | design systém od nuly | shadcn/ui dá přístupné komponenty, které jsou pořád naše |
| Komunikace | GraphQL | tým chce REST |
| Komunikace | sdílená schémata bez kontraktu | překlepy v cestě a metodě se nechytí; command do Application Model by se psal zvlášť |
| Komunikace | ts-rest, generování z OpenAPI | knihovna nebo generátor navíc kvůli tomu, co zvládne pár řádků |

## 7. Odložené a ponechané na tom, kdo staví

**Odložené:** nasazení, a s ním i to, jestli budou služby za jednou veřejnou adresou (CORS, doména cookies); rozhodnutí analytiků o předpokladech z §1.

**Ponechané na tom, kdo staví:** dokument určuje architekturu, ne pořadí práce – pořadí, tickety a řešitelé patří do plánu. Nejdřív se postaví společný základ (`packages/server`, `packages/ui`, kontrakty a `callEndpoint`, `services/auth` s ověřováním tokenu, databáze pro každou službu), aby se pak funkce daly stavět souběžně. Dále: přesné verze knihoven (napevno, ověřené v `node_modules`), porty služeb, názvy souborů uvnitř složek výše, nastavení shadcn/ui v monorepu, přesné cesty endpointů, obsah seedu a jak zajistit, aby kontrola překryvu termínů nešla obejít souběžnými požadavky.
