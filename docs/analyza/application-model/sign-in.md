> Draft – zdroj pravdy je uuApp.

# Sign In (přihlášení přes poskytovatele identity)

> Podklad pro stránky **Application**, **Application Profiles**, **Persistence Layer** a **Command List** v Application Model.
> Fakta jsou převzatá z kódu na větvi `sign-in-via-identity-provider` (`services/auth`, `packages/server`, `services/reference-data`); endpointy Better Auth jsme sami nespouštěli, jejich chování vychází ze zdrojů knihovny `better-auth@1.7.14` ověřených při návrhu.

## Application

### Application Description

Přihlášení zajišťuje služba `services/auth` knihovnou Better Auth (`better-auth@1.7.14`), která je namontovaná na cestě `/auth`. Uživatel se přihlašuje účtem Google (e-mail a heslo nejsou zapnuté). Po přihlášení má prohlížeč session cookie `better-auth.session_token`; ostatním službám se identita dokazuje krátkodobým JWT, který vydává `services/auth`.

Každý nový uživatel dostane roli `customer`. Roli `worker` nastavuje někdo přímo v databázi (viz Application Profiles); aplikace nemá správu rolí.

### Application Topology

Uzly a vztahy (textový popis, diagram se doplní v uuApp):

- **`services/auth`** (`:3100`, Better Auth, základní cesta `/auth`) → **Google** (OAuth 2.0; redirect URI `http://localhost:3100/auth/callback/google`).
- **`services/auth`** vydává JWT (`GET /auth/token`) a zveřejňuje veřejné klíče (`GET /auth/jwks`); ukládá do vlastní databáze `auth`.
- **ostatní služby** (nyní `services/reference-data`, `:3002`) ověřují JWT lokálně veřejnými klíči z `GET /auth/jwks`; `services/auth` při ověření nevolají.

V development prostředí používat `localhost`, ne `127.0.0.1` (cookie, redirect URI a `trustedOrigins` jsou vázané na `localhost`).

### Konfigurace `services/auth`

Z `services/auth/src/env.ts` a `src/auth/better-auth.factory.ts`:

| Proměnná | Výchozí | Popis |
|---|---|---|
| `PORT` | `3100` | Port služby. |
| `DATABASE_URL` | – (povinná) | Databáze `auth`. |
| `BETTER_AUTH_URL` | `http://localhost:3100` | Veřejná adresa služby; je zároveň `iss` a `aud` v JWT. |
| `BETTER_AUTH_SECRET` | – (povinná, min. 32 znaků) | Podepisuje cookie a šifruje privátní klíč v tabulce `jwks`; po změně se nelze přihlásit k dříve šifrovaným klíčům. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | – (povinné) | Přihlašovací údaje OAuth klienta Google. |
| `WEB_ORIGIN` | `http://localhost:5173` | Jediný důvěryhodný origin (`trustedOrigins`) a cíl přesměrování při chybě (`onAPIError.errorURL`). |

Další nastavení Better Auth: `prompt: 'select_account'` u Googlu, pole `user.role` s `input: false` (klient ji nemůže nastavit), plugin `jwt` s algoritmem EdDSA / Ed25519, platností tokenu `15m`, `issuer` i `audience` = `BETTER_AUTH_URL`. `emailAndPassword` ani cache session cookie zapnuté nejsou.

## Application Profiles

### Role Profiles

| Name | Code | Description |
|---|---|---|
| Návštěvník | – | Nepřihlášený uživatel. Nemá kód role ani token; smí volat jen veřejné endpointy (`GET /categories`, `GET /health`, `/auth/*`). |
| Zákazník | `customer` | Přihlášený uživatel. Roli dostane každý nový uživatel (výchozí hodnota sloupce `user.role` i pole Better Auth). |
| Pracovník | `worker` | Pracovník půjčovny. Roli nastaví někdo přímo v databázi `auth`; v aplikaci není správa rolí ani seed. |

### Role Group Profiles

Žádné.

### Přidělení role `worker`

Po prvním přihlášení uživatele jeho roli změnit v databázi `auth`, buď v Prisma Studiu (`pnpm --filter @pujcovna/auth-service exec prisma studio`, tabulka `user`, sloupec `role`), nebo SQL:

```sql
UPDATE "user" SET role = 'worker' WHERE email = '…';
```

Role se do JWT dostane s dalším tokenem. Už vydaný token platí až 15 minut i po odhlášení nebo změně role.

## Persistence Layer

Databáze `auth` (PostgreSQL), schéma `services/auth/prisma/schema.prisma`, migrace `20261031092102_init` a `20261105170128_add_jwks`. Modely a pole jsou v kódu camelCase, tabulky a sloupce snake_case (`@map`).

### Schema Diagram

Textem: `user` 1 – N `session`; `user` 1 – N `account`; ostatní tabulky na sobě nezávisí. Vazby `session.user_id` a `account.user_id` mají `ON DELETE CASCADE`. `auditLogEntry.actorId` odkazuje na `user.id` jen logicky, bez cizího klíče.

### Schema Name

Tabulky `user`, `session`, `account`, `verification` a `jwks` odpovídají základnímu schématu Better Auth (id jsou řetězce, ne UUID); tabulku `jwks` vyžaduje plugin `jwt`. `auditLogEntry` je naše.

**`user`** (tabulka `user`)

```
const userSchema = {
  id: "…",             // String, PK
  name: "…",           // String
  email: "…",          // String, unique
  emailVerified: false,// Boolean, default false (email_verified)
  image: "…",          // String?, nepovinné
  role: "customer",    // enum userRole: customer | worker, default customer
  createdAt: "…",      // Timestamptz(3), default now (created_at)
  updatedAt: "…",      // Timestamptz(3), default now (updated_at)
};
```

Indexy: PK `id`, unique `user_email_key` (`email`). Typ `userRole` je PostgreSQL enum.

**`session`**

```
const sessionSchema = {
  id: "…",             // String, PK
  userId: "…",         // String, FK -> user.id, ON DELETE CASCADE (user_id)
  token: "…",          // String, unique
  expiresAt: "…",      // Timestamptz(3) (expires_at)
  ipAddress: "…",      // String?, nepovinné (ip_address)
  userAgent: "…",      // String?, nepovinné (user_agent)
  createdAt: "…",      // Timestamptz(3), default now
  updatedAt: "…",      // Timestamptz(3), default now
};
```

Indexy: PK `id`, unique `session_token_key` (`token`), `session_user_id_idx` (`user_id`).

**`account`**

```
const accountSchema = {
  id: "…",                    // String, PK
  userId: "…",                // String, FK -> user.id, ON DELETE CASCADE (user_id)
  accountId: "…",             // String (account_id) – id uživatele u poskytovatele
  providerId: "…",            // String (provider_id), zde "google"
  accessToken: "…",           // String?
  refreshToken: "…",          // String?
  accessTokenExpiresAt: "…",  // Timestamptz(3)?
  refreshTokenExpiresAt: "…", // Timestamptz(3)?
  scope: "…",                 // String?
  idToken: "…",               // String?
  password: "…",              // String?, nepoužité (e-mail a heslo jsou vypnuté)
  createdAt: "…",             // Timestamptz(3), default now
  updatedAt: "…",             // Timestamptz(3), default now
};
```

Indexy: PK `id`, `account_user_id_idx` (`user_id`).

**`verification`** (stav OAuth toku a podobné krátkodobé záznamy)

```
const verificationSchema = {
  id: "…",          // String, PK
  identifier: "…",  // String
  value: "…",       // String
  expiresAt: "…",   // Timestamptz(3)
  createdAt: "…",   // Timestamptz(3), default now
  updatedAt: "…",   // Timestamptz(3), default now
};
```

Indexy: PK `id`, `verification_identifier_idx` (`identifier`).

**`jwks`** (podpisové klíče pro JWT)

```
const jwksSchema = {
  id: "…",          // String, PK (hodnota `kid`)
  publicKey: "…",   // String (public_key)
  privateKey: "…",  // String (private_key), šifrovaný BETTER_AUTH_SECRET
  createdAt: "…",   // Timestamptz(3), default now
  expiresAt: "…",   // Timestamptz(3)?
  alg: "…",         // String?
  crv: "…",         // String?
};
```

Index: PK `jwks_pkey` (`id`).

**`auditLogEntry`** (tabulka `audit_log_entry`)

```
const auditLogEntrySchema = {
  id: "…",          // UUID, PK, default gen_random_uuid()
  createdAt: "…",   // Timestamptz(3), default now
  actorId: "…",     // String (actor_id)
  actorRole: "…",   // VarChar(20) (actor_role): "customer" | "worker"
  action: "…",      // VarChar(100): "user.register" | "user.signIn"
  entityType: "…",  // VarChar(100): "user" | "session"
  entityId: "…",    // String (entity_id)
  details: null,    // Json?, tato funkce ho nevyplňuje
};
```

Index: PK `id`, `audit_log_entry_entity_type_entity_id_idx` (`entity_type`, `entity_id`). Sloupec `actor_role` je v databázi řetězec, ne enum; hodnotu hlídá typ `UserRole` v kódu.

### Limit List

Žádný limit není v kódu definovaný. Související pevné hodnoty: platnost JWT 15 minut, minimální délka `BETTER_AUTH_SECRET` 32 znaků.

### DAO Method List

Metody Better Auth přes jeho Prisma adaptér (`better-auth/adapters/prisma`; pracuje s tabulkami `user`, `session`, `account`, `verification`, `jwks`). Jsou to metody knihovny, ne naše; jejich seznam knihovna neurčuje naší dokumentací a v kódu služby se nevolají.

Naše metody (jediné, které služba volá přímo):

| Schema | Metoda | Soubor | Popis |
|---|---|---|---|
| `user` | `get (id) -> user \| null` | `services/auth/src/user/user.repository.ts` (`findUnique({ where: { id } })`) | Načte uživatele; používá `AuditLogService.recordSignIn` kvůli roli. |
| `auditLogEntry` | `create (entry) -> auditLogEntry` | `services/auth/src/audit-log/audit-log.repository.ts` | Vloží záznam auditu (`actorId`, `actorRole`, `action`, `entityType`, `entityId`; `details` zůstane NULL). |

Žádná jiná z metod `create / get / list / update / delete` pro tyto schémata v našem kódu neexistuje.

## Command List

Příkazy jsou endpointy Better Auth namontované na `/auth/*` (`AuthController` v `services/auth/src/auth/auth.controller.ts`) před `express.json()`. Nemají kontrakt v `@pujcovna/shared` (definuje je knihovna) a chyby vrací v tvaru Better Auth `{ code, message }`, ne v našem `{ error: { code, message, details } }`. Všechna POST volání vyžadují hlavičku `Origin` rovnou `WEB_ORIGIN`.

| Command | Description | Application profiles |
|---|---|---|
| `POST /auth/sign-in/social` | Zahájí přihlášení přes Google. | Návštěvník |
| `GET /auth/callback/google` | Dokončí přihlášení po návratu z Googlu. | Návštěvník |
| `GET /auth/get-session` | Vrátí aktuálního uživatele podle cookie. | Návštěvník, Zákazník, Pracovník |
| `POST /auth/sign-out` | Ukončí session. | Zákazník, Pracovník |
| `GET /auth/token` | Vydá JWT pro volání ostatních služeb. | Zákazník, Pracovník |
| `GET /auth/jwks` | Vrátí veřejné klíče pro ověření JWT. | Veřejný (služby) |

### POST /auth/sign-in/social

**Basic Info** – Name: `signInSocial` · Description: zahájí OAuth tok s Googlem; uloží stav do cookie `better-auth.state` a do tabulky `verification` · HTTP Method: `POST` · Url: `/auth/sign-in/social` · Application profiles: Návštěvník.

```
const dtoIn = {
  provider: "google",                  // povinné
  callbackURL: "http://localhost:5173/", // kam po úspěchu; musí být v trustedOrigins
  errorCallbackURL: "http://localhost:5173/", // kam po chybě
};
const dtoOut = {
  url: "https://accounts.google.com/…", // redirect_uri=http://localhost:3100/auth/callback/google
  redirect: true,
};
```

Klient po úspěchu přesměruje prohlížeč na `url`.

**Errors**

| Status | code | Kdy |
|---|---|---|
| 403 | `INVALID_CALLBACK_URL` | `callbackURL` není ve `trustedOrigins`. |
| 403 | `MISSING_OR_NULL_ORIGIN` / `INVALID_ORIGIN` | chybí nebo nesedí hlavička `Origin` (kontrola Origin knihovnou). |

### GET /auth/callback/google

**Basic Info** – Name: `callbackGoogle` · Description: Google sem přesměruje prohlížeč; služba ověří `state`, vymění kód za údaje o uživateli, vytvoří (nebo najde) uživatele a session a nastaví cookie `better-auth.session_token` · HTTP Method: `GET` · Url: `/auth/callback/google` · Application profiles: Návštěvník.

```
const dtoIn = { code: "…", state: "…" };   // query, vkládá Google
const dtoOut = "302 Location: <callbackURL>";  // + Set-Cookie: better-auth.session_token
```

Chyby se nevracejí jako JSON, ale jako přesměrování na `errorCallbackURL` (nebo `WEB_ORIGIN`) s parametrem `?error=<kód>` a případně `error_description`. Příklad: falšovaný `state` → `302 Location: http://localhost:5173/?error=state_mismatch`.

Při vytvoření uživatele se zapíše audit `user.register`, při vytvoření session `user.signIn` (viz Ověření přihlášení v ostatních službách).

### GET /auth/get-session

**Basic Info** – Name: `getSession` · Description: vrátí uživatele a session podle cookie · HTTP Method: `GET` · Url: `/auth/get-session` · Application profiles: Návštěvník, Zákazník, Pracovník.

```
const dtoIn = {};   // cookie better-auth.session_token
const dtoOut = {
  user: { id, name, email, emailVerified, image, createdAt, updatedAt, role },
  session: { id, userId, token, expiresAt, … },
};  // nebo null bez platné session (HTTP 200)
```

Plugin `jwt` navíc přidává hlavičku `set-auth-jwt`. **Errors:** žádné specifické; bez platné session vrací `null`.

### POST /auth/sign-out

**Basic Info** – Name: `signOut` · Description: smaže session a cookie · HTTP Method: `POST` · Url: `/auth/sign-out` · Application profiles: Zákazník, Pracovník.

```
const dtoIn = {};
const dtoOut = { success: true };
```

**Errors:** chybná hlavička `Origin` → 403 (kontrola Origin). Už vydaný JWT platí do vypršení (max. 15 minut).

### GET /auth/token

**Basic Info** – Name: `getToken` · Description: vydá JWT pro přihlášeného uživatele · HTTP Method: `GET` · Url: `/auth/token` · Application profiles: Zákazník, Pracovník.

```
const dtoIn = {};   // cookie better-auth.session_token
const dtoOut = { token: "<JWT>" };
```

JWT: hlavička `alg: EdDSA`, `kid` z `/auth/jwks`; payload přesně `iat`, `name`, `email`, `role`, `sub` (id uživatele), `exp` (`iat` + 900 s), `iss` a `aud` (obojí `BETTER_AUTH_URL`). Role se čte z databáze při každém vydání (cache session cookie je vypnutá), změna role se tedy projeví v dalším tokenu.

**Errors:** bez platné session → 401. Klient si token vyžádá před voláním chráněného endpointu (viz níže).

### GET /auth/jwks

**Basic Info** – Name: `getJwks` · Description: veřejné klíče pro ověření podpisu JWT · HTTP Method: `GET` · Url: `/auth/jwks` · Application profiles: veřejný (volají ho služby, které ověřují token).

```
const dtoIn = {};
const dtoOut = { keys: [{ kid, kty: "OKP", crv: "Ed25519", alg: "EdDSA", x }] };   // bez privátní části `d`
```

**Errors:** žádné specifické. Při prvním použití plugin klíč vygeneruje a uloží do `jwks`.

## Ověření přihlášení v ostatních službách

Balík `@pujcovna/server` (`packages/server`) má třídu `JwtVerifier` (`new JwtVerifier(createRemoteKeySet(jwksUrl), { issuer, audience })`) a strážce `AuthGuard` (`new AuthGuard(jwtVerifier)`); `services/reference-data` je konfiguruje proměnnými `AUTH_JWKS_URL` (`http://localhost:3100/auth/jwks`), `AUTH_ISSUER` a `AUTH_AUDIENCE` (obě `http://localhost:3100`, musí se rovnat `BETTER_AUTH_URL` služby auth). Každá routa musí mít `authGuard.requireAuth()`, nebo `AuthGuard.allowPublic()`.

### Algoritmus `requireAuth()`

1. Přečte hlavičku `Authorization`; schéma musí být `Bearer` (bez ohledu na velikost písmen) a token neprázdný, jinak `UNAUTHORIZED`.
2. `JwtVerifier.verify` ověří token knihovnou `jose` (`jwtVerify`) proti klíčům z `jwksUrl`: kontroluje podpis, `iss` = `issuer`, `aud` = `audience`, algoritmus pouze EdDSA a přítomnost a platnost `exp`.
3. Z payloadu sestaví uživatele `{ id: sub, name, email, role }` a zparsuje ho `authenticatedUserSchema`; neplatný tvar → `UNAUTHORIZED` bez `details`.
4. Uloží uživatele k požadavku (čte ho `authGuard.getUser(request)`) a zavolá `next()`.

Klíče (`createRemoteJWKSet`, timeout 5 s) se načtou při prvním požadavku, ne při startu služby, a jose je cachuje (10 minut). Služba tedy nastartuje i při nedostupné službě auth, ověřování vydaných tokenů po dobu cache funguje i při jejím výpadku.

### Algoritmus `requireRole(...roles)`

Vezme uživatele uloženého `requireAuth()`; pokud jeho `role` není v `roles`, vyhodí `FORBIDDEN`. Používá se až za `requireAuth()`. Příklad: `POST /categories` má `requireAuth()` a `requireRole(UserRole.Worker)` (pracovník), `GET /categories` je `AuthGuard.allowPublic()`. Kontrola přihlášení běží před validací těla.

### Seznam chyb

| Typ | Code | HTTP | Message | Kdy |
|---|---|---|---|---|
| Error | `UNAUTHORIZED` | 401 | Pro tuto akci se musíte přihlásit. | Chybí hlavička nebo schéma není Bearer; token je nevalidní, chybně podepsaný, expirovaný, má špatné `iss`/`aud`/algoritmus nebo nemá `exp`; klíč `kid` v JWKS neexistuje; payload neprojde `authenticatedUserSchema`. |
| Error | `FORBIDDEN` | 403 | K této akci nemáte oprávnění. | Přihlášený uživatel nemá požadovanou roli (např. zákazník volá `POST /categories`). |
| Error | `INTERNAL` | 500 | Unexpected server error | Služba auth je nedostupná a klíče nejsou v cache (síťová chyba, timeout, nečitelný JWKS); chyba se zaloguje, nikdy se nemapuje na 401. |

Chyby mají tvar `{ error: { code, message, details } }` (`errorHandler` z `@pujcovna/server`).

### Audit

`AuditLogService` zapisuje do `auditLogEntry` hned po zápisu Better Auth (databázové hooky `user.create.after` a `session.create.after`); není to stejná transakce a selhání zápisu se nezachytává – Better Auth ho propaguje dál.

| Action | actorId | actorRole | entityType | entityId | Kdy |
|---|---|---|---|---|---|
| `user.register` | id uživatele | role nového uživatele | `user` | id uživatele | po vytvoření uživatele (první přihlášení) |
| `user.signIn` | id uživatele | role z DB (`user.get`) | `session` | id session | po vytvoření každé session |

Tokeny se do auditu neukládají.

### Jak klient získá token

Před každým voláním chráněného endpointu klient zavolá `GET /auth/token` a pošle `Authorization: Bearer <token>`. Token se nikam trvale neukládá.
