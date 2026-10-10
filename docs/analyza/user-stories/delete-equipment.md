> Draft – zdroj pravdy je uuApp.

# Delete Equipment

> Podklad pro stránku **User story** v Business Requests (sekce „Delete Equipment“). Vychází z Vision, Dictionary a Context v uuApp
> (stav 10. 10. 2026) a ze stylu už vyplněné US „Cancel Order“.
> Návrh pro tým: doplnit do Dictionary pojem **Stav nářadí** – Dostupné / Rezervované / Vyřazené.

### Why we need this User Story

Funkcionalita umožňuje pracovníkovi půjčovny odstranit z nabídky nářadí, které půjčovna už nemůže nebo nechce pronajímat – například kus je nevratně poškozený, ztracený, vyřazený ze stáří nebo byl do systému zadán omylem.

Bez této možnosti by zákazníci v nabídce viděli a mohli si objednat nářadí, které fyzicky neexistuje, a evidence vybavení půjčovny by neodpovídala skutečnosti.

### User Story goal

Cílem je umožnit pracovníkovi půjčovny smazat konkrétní kus nářadí z nabídky. Smazání nářadí fyzicky neodstraní: změní jeho stav na „Vyřazené“. Vyřazené nářadí se nezobrazuje zákazníkům a nelze na něj vytvořit novou objednávku, ale objednávky, ve kterých bylo dříve použito, zůstávají dohledatelné včetně toho, kdo měl nářadí půjčené.

### User Story context

Půjčovna eviduje každý fyzický kus nářadí jako samostatný záznam s vlastním označením a vazbou na kategorii. Během provozu se nářadí opotřebovává, může se nevratně poškodit nebo ztratit a půjčovna také vyřazuje staré kusy.

Takové nářadí musí pracovník půjčovny smazat z nabídky, aby si ho zákazníci nemohli objednat. Smazat lze jen nářadí ve stavu „Dostupné“. Pokud je nářadí rezervované nebo vydané zákazníkovi, systém smazání odmítne – pracovník musí nejdřív zrušit příslušnou objednávku (User Story „Cancel Order“).

### User Story initial situation

- Pracovník půjčovny je přihlášený.
- V systému existuje nářadí ve stavu „Dostupné“ – např. bourací kladivo s označením K003 z kategorie bourací kladiva.
- Nářadí není přiřazené k žádné objednávce ve stavu „Čeká na potvrzení“ ani „Potvrzená“.

### User Story scenario

**Happy day scénář**

1. Pracovník půjčovny otevře přehled nářadí.
2. Vybere konkrétní kus nářadí a otevře jeho detail.
3. Zvolí možnost „Smazat nářadí“.
4. Systém zobrazí výzvu k potvrzení smazání.
5. Pracovník smazání potvrdí.
6. Systém ověří, že nářadí je ve stavu „Dostupné“.
7. Systém změní stav nářadí na „Vyřazené“ a zaznamená smazání do auditního logu.
8. Systém zobrazí informaci o úspěšném smazání a vrátí pracovníka na přehled nářadí, kde už smazané nářadí není.

### User Story diagram

Popis pro uuBml diagram (ve stylu diagramu u „Cancel Order“):

- `user` → `tool overview` → `tool` → akce **„Smazat nářadí“** → `tool` → `tool overview`
- popisek na šipce za akcí: **mění stav nářadí na „Vyřazené“**
- `order` → `tool` (za akcí), popisek: **ověří, že nářadí není v aktivní objednávce**
