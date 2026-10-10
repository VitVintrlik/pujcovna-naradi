# Půjčovna nářadí

> Věrný přepis `Navrh_aplikace_Pujcovna_naradi.docx` (stejná složka) do Markdownu.
> **Status: původní návrh tématu (3. 10. 2026).** Téma bylo schváleno; popisuje *co* chceme dělat, ne *jak*. Entity a tabulky nejsou závazné –
> aktuální verze vize, user stories a entit je v Business Requests v uuApp (odkaz v `docs/zadani/03-tym-1-portal.md`). Při rozporu platí uuApp.

**Rezervace a evidence výpůjček pro jednu provozovnu**
Projektový management 2026/2027 | Hlavní varianta | 3. října 2026

Navrhuji vytvořit webovou aplikaci pro malou půjčovnu nářadí. Zákazník si vybere model a požádá o rezervaci na určité období. Obsluha přidělí konkrétní dostupný kus, zaznamená jeho vydání a následné vrácení. Hlavní přínos spočívá v přehledu o tom, které stroje jsou použitelné, rezervované nebo právě půjčené.

## Vize produktu

Chceme zákazníkovi umožnit domluvit zapůjčení před cestou do provozovny a půjčovně usnadnit správu fyzického vybavení. Aplikace propojí nabídku modelů s evidencí jednotlivých kusů, rezervacemi a skutečnými výpůjčkami. První verze pokryje celý postup od žádosti o rezervaci až po vrácení nářadí v jedné provozovně.

## Pro koho aplikace vzniká

Zákazník prohlíží nabídku, žádá o termín, sleduje potvrzení a vidí své výpůjčky. Obsluha potvrzuje rezervace, vydává a přebírá stroje. Správce půjčovny udržuje nabídku modelů a evidenci kusů. Jde o role uživatelů aplikace, které může v malé provozovně kombinovat jedna osoba.

## Ukázka použití

1. **Výběr.** Zákazník potřebuje na víkend bourací kladivo. Vybere model ABC a zadá období od pátku do pondělí.
2. **Potvrzení.** Obsluha ověří dostupnost, přiřadí provozuschopný kus K003 a potvrdí rezervaci. Zákazník vidí výsledek ve svém přehledu.
3. **Vydání.** Při osobním vyzvednutí obsluha založí výpůjčku a zaznamená skutečný čas předání i očekávané vrácení.
4. **Vrácení.** Obsluha převezme K003, zaznamená čas a stav při vrácení. Poškozený kus označí jako nedostupný pro další výdej.
5. **Historie.** Zůstane dohledatelné, kdo měl konkrétní stroj půjčený a jak výpůjčka skončila.

## Proč má návrh smysl

Půjčovna potřebuje rozlišovat i několik stejných strojů: jeden může být půjčený, druhý rezervovaný a třetí v opravě. Aplikace řeší dostupnost a oběh konkrétního majetku. Úspěšné dokončení procesu představuje vrácení stroje a záznam jeho stavu.

## Rozsah první verze

První verzi navrhuji jako MVP, tedy nejmenší užitečný celek, který lze dokončit a předvést. Zahrne jednu provozovnu a jeden kus nářadí na jednu rezervaci a výpůjčku. Více kusů zákazník řeší samostatnými rezervacemi.

| Funkce | Rozsah a očekávané chování |
|---|---|
| Nabídka modelů | Seznam a detail modelu s názvem, popisem a základními parametry. Správce může nabídku upravovat. |
| Evidence kusů | Inventární číslo, vazba na model a provozní stav každého stroje. Kus lze označit jako provozuschopný, v opravě nebo vyřazený. |
| Žádost o rezervaci | Zákazník zvolí model a období. Nová žádost čeká na potvrzení; do vydání ji lze zrušit. |
| Potvrzení rezervace | Obsluha vybere konkrétní kus. Systém ověří časové kolize a umožní potvrzení nebo odmítnutí žádosti. |
| Výdej a vrácení | Z potvrzené rezervace vznikne výpůjčka. Obsluha zaznamená skutečné předání, očekávané vrácení a následně převzetí stroje. |
| Provozní přehled | Obsluha vidí žádosti, potvrzené rezervace, otevřené výpůjčky a překročené termíny vrácení. Zákazník vidí vlastní záznamy. |

### Navržené obrazovky

- **Nabídka nářadí:** seznam modelů, detail a formulář rezervace.
- **Moje rezervace a výpůjčky:** termíny, stav a možnost zrušení rezervace.
- **Přehled pro obsluhu:** žádosti k vyřízení, plánované výdeje a vrácení.
- **Detail rezervace a výpůjčky:** přiřazený kus, předání, vrácení a historie změn.
- **Správa modelů a kusů:** nabídka, inventární čísla a provozní stav.

### Co zůstává mimo první verzi

Platby, kauce, fakturace a výpočet ceny se řeší mimo aplikaci. První verze nebude obsahovat více poboček, dopravu, nákupní košík pro více kusů, automatické prodlužování, e-mailová upozornění, sklad náhradních dílů ani podrobnou evidenci oprav. Rezervace se potvrzují obsluhou.

Systémové součásti jsou zahrnuté: přihlášení přes externí identitu, oprávnění, auditní log, API a nasazení na internet. Podrobnosti uvádí poslední strana.

## Datový model a pravidla

Návrh má čtyři doménové typy entit. Typ entity určuje, jaký druh věci evidujeme; konkrétní věci jsou jeho záznamy. Padesát fyzických strojů tedy znamená padesát záznamů typu Kus nářadí.

| Entita | Co eviduje | Příklad |
|---|---|---|
| Model nářadí | Společný název, popis a technické parametry nabízeného modelu. | Bourací kladivo ABC |
| Kus nářadí | Konkrétní stroj: inventární číslo, model a provozní stav. | K003, model ABC, provozuschopný |
| Rezervace | Zákazníka, požadovaný model, období, stav žádosti a po potvrzení přiřazený kus. | Model ABC od pátku do pondělí; přidělen K003 |
| Výpůjčka | Rezervaci a skutečné předání kusu, očekávané i skutečné vrácení a stav při vrácení. | K003 vydán v pátek v 15:10 a vrácen v pondělí v 8:40 |

### Vazby mezi záznamy

- **Model → kusy:** jeden model může mít více fyzických kusů; každý kus patří právě jednomu modelu. Popis modelu se proto neopakuje u každého stroje.
- **Rezervace → výpůjčka:** rezervace požaduje jeden model a při potvrzení získá jeden konkrétní kus. Může vést nejvýše k jedné výpůjčce. Zrušená nebo nevyzvednutá rezervace výpůjčku nemá. Jeden kus má v průběhu času mnoho výpůjček.

### Pravidla důležitá pro správné fungování

- Čekající žádost není potvrzená rezervace. Kus je závazně přidělen až při potvrzení. Zrušení uvolní jeho rezervované období.
- Jeden kus nelze potvrdit na překrývající se termíny. Kontrola musí fungovat i při současném potvrzování dvěma pracovníky.
- Provozní stav a obsazenost jsou různé věci. Provozuschopný stroj může být právě půjčený. Výdej musí ověřit obojí.
- Nevrácený nebo poškozený kus nelze znovu vydat. Ohroženou navazující rezervaci řeší obsluha; aplikace sama neslibuje náhradní stroj.

### Příklad uživatelského příběhu

> Jako zákazník chci požádat o zapůjčení vybraného modelu na určité období, abych mohl před cestou do půjčovny získat potvrzení rezervace.

**Ověření:** platná žádost se uloží jako čekající, po potvrzení obsahuje konkrétní kus a zákazník vidí výsledek. Neplatné období nebo kolidující potvrzení systém odmítne. Důležité změny se zaznamenají do auditu.

## Proveditelnost a rozhodnutí týmu

### Návaznost na zadání předmětu

- **Povinný technický základ:** React pro uživatelské rozhraní, Node.js a Express pro serverovou část, SQL nebo NoSQL databáze, mikroslužbová architektura a veřejné API typu REST nebo GraphQL. Aplikace musí být nasazena v cloudu a dostupná z internetu.
- **Přístup a dohledatelnost:** registrace a přihlášení přes externího poskytovatele identity, například Google nebo Microsoft; kontrola oprávnění; auditní záznamy o důležitých změnách. Zákazník pracuje pouze se svými údaji. Uživatelské účty a role se nepočítají mezi čtyři doménové entity.
- **Dokumentace a řízení:** Business Requests, Business Model a Application Model podle struktury uuApp Frameworku, kompletní datový model, Git a sprinty v uuSprintMan. Na člena připadá jeden uživatelský příběh, jeden business use-case (scénář použití) a návrh jednoho backendového endpointu (operace API). Za tým alespoň dvě frontendové routes a všechny jejich komponenty. Implementuje se celý schválený rozsah vize.

### Předběžné technické řešení

K projednání navrhuji dvě doménové služby: katalog a inventář spravující modely a kusy a rezervace a výpůjčky spravující jejich časové přidělení. Každá je samostatně nasaditelná a spravuje vlastní data; propojení probíhá přes API. Jde o předběžný návrh, nikoli školou předepsaný počet služeb.

Konkrétní databázi, poskytovatele identity a hosting vybereme podle zkušeností týmu a možností předmětu. Rozdělení služeb a případné využití uuApp Frameworku projednáme s vyučujícím. Při návrhu API doporučuji začít s REST.

### Nejdůležitější riziko

Největší pozornost vyžaduje dostupnost kusu v čase. Nestačí zkontrolovat formulář v prohlížeči; server musí zabránit dvojímu potvrzení a při výdeji znovu ověřit skutečný stav. Pravidla pro pozdní vrácení a vyřazení kusu je potřeba popsat před implementací.

### Co předvedeme při ověření aplikace

- Od žádosti o model ABC přes potvrzení kusu K003 až po výdej a vrácení proběhne celý postup na nasazené aplikaci.
- Druhá kolidující rezervace stejného kusu a výdej kusu v opravě budou odmítnuty.
- Cizí zákazník neuvidí ani nezmění rezervaci; obsluha dohledá změny a autora v auditním logu.

### Co rozhodnout na týmové schůzce

Potvrdit jednu provozovnu a jeden kus na rezervaci; dohodnout pravidla termínů a zrušení; ověřit, že tým zvládne povinné technické části. Po výběru tématu doplnit Business Requests a nechat vizi schválit vyučujícím. Rozdělení práce si tým domluví samostatně.

_Podklad pro požadavky předmětu: BPMI Project Assignment, strany 1 a 3–8 dodaného PDF ze dne 3. 10. 2026._
