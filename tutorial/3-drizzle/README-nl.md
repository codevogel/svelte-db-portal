# 3 - Drizzle ORM

Nu we een basiswebsite hebben draaien, kunnen we beginnen met het toevoegen van data. In dit hoofdstuk gaan we [Drizzle](https://orm.drizzle.team/) instellen als onze Object Relational Mapper (ORM) om te communiceren met onze MySQL-database.

## Hoofdstukoverzicht

### Leerdoelen

Aan het einde van dit hoofdstuk zul je:

  - Begrijpen wat ORM's zijn en waarom ze voordelig zijn voor database-interacties
  - Drizzle ORM configureren in je SvelteKit-project en MySQL-databaseverbindingen instellen
  - Databaseschema's definiëren met Drizzle's TypeScript-syntaxis
  - Drizzle Kit gebruiken om schema's naar je database te pushen en bestaande schema's te pullen
  - Complexe relationele databasestructuren bouwen door een-op-een en een-op-veel relaties te implementeren
  - Realistische testdata genereren met Drizzle-seed's ingebouwde generators en verfijningsopties
  - Gezaaide data verbeteren met Faker.js voor geavanceerdere data generatie scenario's
  - Basisquery's schrijven om data op te halen en te manipuleren met Drizzle ORM

### Vereisten

  - Basisbegrip van SQL en relationele databases.

### Leermiddelen

  - [Drizzle ORM Official Documentation](https://orm.drizzle.team/) - Uitgebreide gids die alle functies behandelt
  - [Drizzle MySQL Column Types](https://orm.drizzle.team/docs/column-types/mysql) - Referentie voor alle beschikbare kolomtypen
  - [Migrations with Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) - CLI-tools voor schemabeheer
  - [Drizzle Seed Documentation](https://orm.drizzle.team/docs/seed-overview) - Gids voor het genereren van testdata
  - [Drizzle Seed Functions Reference](https://orm.drizzle.team/docs/seed-functions) - Ingebouwde data generators
  - [Faker.js Documentation](https://fakerjs.dev/) - Bibliotheek voor het genereren van realistische nepdata
  - [Database Relationships Explained](https://www.lucidchart.com/pages/database-diagram/database-design) - Visuele gids voor databaseontwerp
  - [Foreign Keys vs Soft Relations](https://orm.drizzle.team/docs/relations#foreign-keys) - Verschillende benaderingen voor relaties begrijpen
  - [Environment Variables in SvelteKit](https://kit.svelte.dev/docs/modules#$env-dynamic-private) - Veilig configuratiebeheer

## Introductie tot ORM's

Een ORM (Object Relational Mapper) is een programmeertechniek waarmee we met een database kunnen communiceren met behulp van een objectgeoriënteerde aanpak. In plaats van ruwe SQL-query's te schrijven, kunnen we een ORM gebruiken om onze databasetabellen en relaties als klassen en objecten in onze code te definiëren. Hierdoor kunnen we op een intuïtievere manier met onze data werken, en kan het ons helpen enkele veelvoorkomende valkuilen van ruwe SQL-query's te vermijden, zoals SQL injection-aanvallen.

[Drizzle](https://orm.drizzle.team/) is een TypeScript ORM die is ontworpen om eenvoudig en gemakkelijk te gebruiken te zijn. Het stelt ons in staat om onze databasetabellen en relaties te definiëren met behulp van TypeScript-klassen, en biedt een eenvoudige API voor het bevragen en manipuleren van onze data. Drizzle biedt ook Drizzle-seed, een tool voor het vullen van onze database met initiële data. Dit kan nuttig zijn voor test- en ontwikkelingsdoeleinden, omdat het ons in staat stelt onze database snel te vullen met voorbeelddata zonder handmatig veel SQL-query's te hoeven schrijven.

Het is een code-first ORM, wat betekent dat we ons databaseschema in code definiëren en vervolgens de Drizzle CLI gebruiken om dat schema naar onze database te pushen.

## Drizzle ORM instellen

Tijdens de setup van ons SvelteKit-project hebben we `drizzle` al geïnstalleerd, en de `sv` CLI heeft de benodigde configuratiebestanden al voor ons gegenereerd. Als je `drizzle` niet hebt geïnstalleerd tijdens de setup, kun je dit nu doen met de `sv` cli:

```bash
npx sv add drizzle
```

Of, als je wilt, kun je in plaats daarvan de [installatie-instructies](https://orm.drizzle.team/docs/get-started/mysql-new) op de Drizzle-website volgen. We zullen enkele van de bestanden bespreken die de `sv` CLI voor ons heeft gegenereerd, dus als je mee wilt doen, zorg er dan voor dat je dezelfde configuratie gebruikt.

### Drizzle-configuratie

Aangezien de `sv` CLI Drizzle al in ons project heeft geïnstalleerd tijdens de setup, laten we het eens hebben over enkele van de bestanden die het voor ons heeft gemaakt.

  - `.env` en `.env.example`

      - Deze bestanden worden gebruikt om omgevingsvariabelen op te slaan. Het `.env`-bestand wordt gebruikt om gevoelige informatie op te slaan, zoals databaseverbindingstekenreeksen, terwijl het `.env.example`-bestand wordt gebruikt om een sjabloon te bieden voor het `.env`-bestand en de waarden leeg laat.

    > ⚠️ **Belangrijk**: Het `.env`-bestand mag **nooit** worden gecommit naar versiebeheer, omdat het gevoelige informatie bevat, zoals databasegegevens. Het `.env.example`-bestand is veilig om te committen, omdat het geen gevoelige informatie mag bevatten.

  - `drizzle.config.ts`

      - Dit bestand wordt gebruikt om Drizzle te configureren. Het bevat de databaseverbindingstekenreeks en andere configuratie-opties. Meer informatie over de configuratie-opties vind je in de [Drizzle-documentatie](https://orm.drizzle.team/docs/get-started/mysql-new).

  - `src/lib/server/db/index.ts`

      - Dit bestand wordt gebruikt om een verbinding met de database te maken en de Drizzle-instantie te exporteren. Meer informatie over de configuratie-opties vind je in de [Drizzle-documentatie](https://orm.drizzle.team/docs/get-started/mysql-new).

  - `src/lib/server/db/schema.ts`

      - Dit bestand wordt gebruikt om het databaseschema te definiëren. Het bevat de databasetabellen en relaties. Meer informatie over de schema-opties vind je in de [Drizzle-documentatie](https://orm.drizzle.team/docs/sql-schema-declaration).

In `.env` willen we de `DATABASE_URL` bijwerken om de juiste configuratie weer te geven. Ik gebruik hier `root` (de standaard bevoegde MySQL-gebruiker in XAMPP) als de `username` (en optioneel, een `password`), de `host` is `localhost`, op poort `3306` (standaardpoort voor de SQL-database die in XAMPP wordt geleverd), en we verwijzen naar een database `db-demobots` (die we nog moeten maken\!). Als je met de gebruikersnamen, poorten en/of wachtwoorden hebt geknoeid, vul die dan in.

> ℹ️ We gaan niet live met deze database, maar het kan wel handig zijn om deze toch te beveiligen met een wachtwoord. Je kunt dit doen door een query uit te voeren in de MySQL-server (start deze door /opt/lampp/bin/mysql uit te voeren): `SET PASSWORD FOR 'root'@'localhost' = PASSWORD('my_very_secretive_password'); FLUSH PRIVILEGES;`. Zorg ervoor dat je je `mysql` en `phpMyAdmin` referenties bijwerkt door respectievelijk `/opt/lampp/etc/my.cnf` (vereist sudo-toegang) en `/opt/lampp/phpmyadmin/config.inc.php` te bewerken. Vergeet niet de XAMPP-server daarna opnieuw te starten (`sudo /opt/lampp/lampp restart`). Mocht je ooit problemen tegenkomen, dan kun je altijd proberen om het [wachtwoord te resetten](https://dev.mysql.com/doc/refman/8.4/en/resetting-permissions.html).

Volgens de bovenstaande instructies zou je `.env`-bestand er ongeveer zo uit moeten zien:

```shellscript
# Vervang door je DB-gegevens!
DATABASE_URL="mysql://root:a_very_secretive_password@localhost:3306/db-demobots"
```

Je `/opt/lampp/etc/my.cnf`-bestand zou zoiets moeten bevatten (merk op dat dit bestand wordt overschreven door de alternatieve locaties die in het my.cnf-bestand worden genoemd, `/opt/lampp/var/mysql/my.cnf` en `~/.my.cnf`):

```
# De volgende opties worden doorgegeven aan alle MySQL-clients
[client]
password       =my_very_secretive_password
port            =3306
```

En je `/opt/lampp/phpmyadmin/config.inc.php`-bestand zou zoiets moeten bevatten:

```php
/* Authenticatietype */
$cfg['Servers'][$i]['auth_type'] = 'config';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = 'my_very_secretive_password';
```

(Her)start de XAMPP-server nu om ervoor te zorgen dat de wijzigingen van kracht worden:

```bash
sudo /opt/lampp/lampp restart
```

Laten we vervolgens eens kijken naar het `src/lib/server/db/index.ts`-bestand dat voor ons is gegenereerd:

```typescript
// /src/lib/server/db/index.ts

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(client, { schema, mode: 'default' });
```

Het is verantwoordelijk voor het maken van een verbinding met de MySQL-database met behulp van het `mysql2`-pakket en het exporteren van een Drizzle-instantie (`db`) die we kunnen gebruiken om met onze database te communiceren. De `env`-import wordt gebruikt om toegang te krijgen tot de omgevingsvariabelen die in ons `.env`-bestand zijn gedefinieerd.

We hoeven niets te wijzigen in dit bestand, maar het is goed om te weten wat het doet.

### De database aanmaken

> ℹ️ Als je al een bestaande database hebt die je wilt gebruiken, *kun* je deze stap overslaan, maar het wordt ten zeerste aanbevolen om een volledig nieuwe database aan te maken om gegevensverlies te voorkomen terwijl we Drizzle uitzoeken.

Nu we onze Drizzle-configuratie hebben ingesteld, moeten we, voordat we ons databaseschema gaan definiëren, de database zelf aanmaken.

Dit is net zo eenvoudig als het bezoeken van `[http://localhost/phpmyadmin](http://localhost/phpmyadmin)` in je browser, wat je automatisch zou moeten inloggen met de referenties die we hebben opgegeven in het bestand `/opt/lampp/phpmyadmin/config.inc.php`.
Eenmaal op de startpagina, klik je bovenaan op het tabblad "Databases", en vervolgens in het veld "Create database" vul je `db-demobots` in (of welke naam je eerder in je `.env`-bestand hebt ingesteld), en klik je op de knop "Create".

We zullen voorlopig niets anders doen in phpMyAdmin, aangezien we Drizzle (`drizzle-seed` om precies te zijn) zullen gebruiken om ons databaseschema in te stellen en onze database te vullen met testdata.

## Het databaseschema definiëren

> ℹ️ Als je al een bestaande database met een schema hebt die je wilt gebruiken, kun je deze stap overslaan en in plaats daarvan direct naar de subsectie "Een schema uit een bestaande database halen" gaan. Het wordt echter nogmaals sterk aanbevolen om de stappen die we hier volgen, gewoon mee te doen om gegevensverlies te voorkomen terwijl we Drizzle uitzoeken.

### Het schema verkennen

Laten we eens kijken naar het `src/lib/server/db/schema.ts`-bestand dat voor ons is gegenereerd:

```typescript
// /src/lib/db/schema.ts

import { mysqlTable, serial, int } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: serial('id').primaryKey(),
	age: int('age')
});
```

Dit bestand definieert momenteel één tabel genaamd `user`, met twee kolommen: `id` en `age`. De `id`-kolom is een seriële (auto-incrementing) primary key, en de `age`-kolom is een integer.
Het importeert de nodige functies van het `drizzle-orm/mysql-core`-pakket om het type tabel en kolomtypen te definiëren.

> ℹ️ Hoewel aanwezig in het standaardschema, ondersteunt de SQL-database die we samen met XAMPP (MariaDB) hebben geïnstalleerd de `serial`-type niet direct. We zullen dit in de volgende stap wijzigen, maar houd hier rekening mee, aangezien je vergelijkbare kolomtypefouten kunt tegenkomen bij het pushen van je schema naar de database.

### Het schema aanpassen

#### Gebruikerstabel

Laten we onze database uitbreiden met een eenvoudige gebruikerstabel die meer informatie over de gebruikers bevat. Kijkend naar de [kolomtypen](https://orm.drizzle.team/docs/column-types/mysql) die Drizzle ondersteunt, laten we een `user`-tabel maken die de volgende kolommen bevat:

| Kolomnaam | Gegevenstype | Beperkingen |
| `username` | `varchar(20)` | UNIEK, NOT NULL |
|-------------|-----------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO\_INCREMENT |
| `created_at` | `datetime` | NOT NULL |
| `date_of_birth` | `date` | NOT NULL |

##### Implementatie

We voegen de volgende kolommen toe aan de `user` tabel.

```typescript
// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int } from 'drizzle-orm/mysql-core';

// Bevat gebruikersinformatie.
export const userTable = mysqlTable('user', {
	id: int('id').primaryKey().autoincrement(),
	createdAt: datetime('created_at').notNull(),
	username: varchar('username', { length: 20 }).notNull(),
	dateOfBirth: date('date_of_birth').notNull()
});
```

Nu willen we dat Drizzle deze tabel in onze database aanmaakt.
Laten we dus proberen dit schema naar onze database te pushen.

### Een schema pushen

Om dit te doen, kunnen we de `drizzle-kit` CLI-tool gebruiken die is geïnstalleerd als onderdeel van de Drizzle-installatie. We kunnen deze uitvoeren met `npx`:

[Een schema pushen](https://orm.drizzle.team/docs/drizzle-kit-push) naar de database is het aanpassen van de database om overeen te komen met het schema dat in onze code is gedefinieerd.

```bash
npx drizzle-kit push
```

We krijgen een bericht te zien met de SQL-statement die is gegenereerd om deze wijzigingen aan onze database toe te voegen. Als we bevestigen dat dit is wat we willen doen, wordt de statement uitgevoerd en wordt de tabel in onze database aangemaakt:

![drizzle-kit-push.png](/tutorial/3-drizzle/img/drizzle-kit-push.png)

> ⚠️ Als je naar een database pusht die al tabellen heeft, zal Drizzle proberen de bestaande tabellen *aan te passen* aan het schema dat in je code is gedefinieerd. Dit kan echter problemen met gegevensverlies veroorzaken. Voor de eenvoud van deze cursus kun je alle tabellen in je dummy-database *verwijderen* voordat je het schema pusht, zodat Drizzle de tabellen helemaal opnieuw kan aanmaken en vervolgens de database kan vullen (zie volgende sectie) om de tabellen opnieuw te vullen met gegevens.

Laten we naar [`http://localhost/phpmyadmin/`](https://www.google.com/search?q=http://localhost/phpmyadmin/) gaan, de `db-demobots`-database openen en vervolgens op de `user`-tabel klikken om de structuur van de zojuist aangemaakte tabel te bekijken:


![created-user-table.png](/tutorial/3-drizzle/img/created-user-table.png)


Ziet er goed uit\! We zullen later nog wat interessantere tabellen maken die relaties delen, maar laten we voor nu proberen het omgekeerde te doen: een schema uit een bestaande database halen.

#### Een schema pullen

[Een schema pullen](https://orm.drizzle.team/docs/drizzle-kit-pull) is het tegenovergestelde van een schema pushen. Het bekijkt een bestaande database en genereert een Drizzle-schema-bestand dat overeenkomt met de structuur van de database.
Als je al een bestaande database met een schema hebt die je wilt gebruiken, kun je `drizzle-kit` gebruiken om het schema uit de database te pullen en het bijbehorende Drizzle-schema-bestand te genereren.

Laten we dit doen door de volgende opdracht uit te voeren:

```bash
npx drizzle-kit pull
```

Zoals hieronder te zien is, haalt de CLI het schema uit de database en genereert het een `drizzle/schema.ts`-bestand en een `drizzle/relations.ts`-bestand (we komen later op relaties terug) dat, indien gepusht, de databasestructuur opnieuw zou aanmaken.


![drizzle-kit-pull.png](/tutorial/3-drizzle/img/drizzle-kit-pull.png)

We zullen deze functie niet vaak gebruiken, dus je kunt de gemaakte `drizzle`-map verwijderen, maar het is handig om hiervan op de hoogte te zijn.

> ℹ️ Als je een bestaande database met een schema had die je wilde gebruiken, is het nog steeds een goede aanbeveling om een nieuwe dummy-database aan te maken en de stappen van het helemaal opnieuw definiëren van het schema te doorlopen, omdat dit je zal helpen begrijpen hoe Drizzle werkt en hoe je in de toekomst je eigen schema kunt definiëren, en aangezien we tabellen zullen verwijderen in plaats van te migreren tussen wijzigingen, verlies je gegevens in je echte database.

Nu we weten hoe we ons schema moeten pushen en pullen, gaan we verder met het vullen van onze database met initiële data.

### De database vullen

Om onze applicatie te kunnen testen, hebben we wat initiële data in onze database nodig. Nu *zouden* we nauwgezet SQL-query's kunnen schrijven om handmatig data in onze database in te voegen, of phpMyAdmin gebruiken om dit te doen, maar Drizzle biedt een veel eenvoudigere manier om onze database te vullen met realistische data met behulp van `drizzle-seed`.

[`drizzle-seed` (link)](https://www.google.com/search?q=%5Bhttps://orm.drizzle.team/docs/seed-overview%5D\(https://orm.drizzle.team/docs/seed-overview\)) is een TypeScript-bibliotheek die je helpt deterministische, maar realistische, nepdata te genereren om je database te vullen.

Om `drizzle-seed` te gebruiken, moeten we een paar afhankelijkheden installeren;

  - `drizzle-seed` zelf, dat de seeding-functionaliteit biedt.
  - `dotenv`, waarmee we omgevingsvariabelen uit een `.env`-bestand kunnen laden.
  - `tsx`, wat een TypeScript-uitvoeringsomgeving is waarmee we TypeScript-bestanden direct kunnen uitvoeren.

We kunnen deze afhankelijkheden installeren door de volgende opdracht in onze terminal uit te voeren:

```bash
npm install --save-dev drizzle-seed dotenv tsx
```

Nu we de benodigde afhankelijkheden hebben geïnstalleerd, kunnen we een seeding-script maken om onze database te vullen met initiële data. Laten we een nieuw bestand genaamd `reseed.ts` maken in een nieuwe map `scripts` die we in de rootmap van ons svelte-project plaatsen (`/scripts/reseed.ts`):

```typescript
// /scripts/reseed.ts

import mysql from 'mysql2/promise';
// Deze import is nodig zodat we onze omgevingsvariabelen kunnen laden 
import 'dotenv/config';
// Dit moet verwijzen naar je schema-bestand
import * as schema from '../src/lib/server/db/schema';
import { drizzle } from 'drizzle-orm/mysql2';
import { reset, seed } from 'drizzle-seed';

// Functie om de database opnieuw te vullen
async function reseed_db() {
	// Zorg ervoor dat de DATABASE_URL omgevingsvariabele is ingesteld
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	// Maak een MySQL-client aan en initialiseer Drizzle ORM 
	const client = mysql.createPool(process.env.DATABASE_URL);
	const db = drizzle(client, { schema, mode: 'default' });

	// Reset de database (verwijder alle data uit de tabellen)
	console.log('Resetting database...');
	await reset(db, schema);
	// Vul de database met testdata
	console.log('Reseeding database...');
	await seed(db, schema);

	// Log succesbericht
	console.log('Database reseeded successfully');
	await client.end();
}

// Entry point voor het script
async function main() {
	await reseed_db();
}

// Voer de main functie uit
main();
```

Als we dit script uitvoeren, wordt onze database gereset (alle data gaat verloren(\!)) en vervolgens (opnieuw) gevuld met wat initiële data.
Deze data wordt gegenereerd met behulp van een pseudo-random nummer generator, wat betekent dat de data willekeurig zal zijn, maar met een deterministische seed, zodat we elke keer dat we het script uitvoeren dezelfde data kunnen genereren. (Je zult zien dat dit erg nuttig wordt bij het testen van dingen later.)

Om het script uit te voeren, kunnen we de `tsx`-opdracht gebruiken, waarmee we TypeScript-bestanden direct kunnen uitvoeren:

```bash
npx tsx scripts/reseed.ts
```

Als alles goed gaat, zouden we onze logberichten moeten zien die aangeven dat de database succesvol is gereset en opnieuw is gevuld:

![reseed.png](/tutorial/3-drizzle/img/reseed.png)

Laten we opnieuw een kijkje nemen in onze tabel in `phpMyAdmin`, zodat we de nieuw gegenereerde data kunnen zien:

![reseed-data.png](/tutorial/3-drizzle/img/reseed-data.png)

Cool. Dit bespaart ons veel tijd met handmatige gegevensinvoer en zorgt ervoor dat we geen fouten maken in de gegevens die we invoeren.

> ℹ️ Even een waarschuwing: we kunnen (en zullen) deze gegevens later verfijnen om te voldoen aan specifieke testbehoeften (zoals dat de geboortedata allemaal binnen een bepaald bereik liggen, of het toevoegen van speciale tekens aan gebruikersnamen).

### Tabellen die relaties delen

Onthoud dat een ORM staat voor Object *Relational* Mapper, maar op dit moment hebben we eigenlijk maar één tabel met enkele objecten erin. We kunnen beter dan dat: we kunnen tabellen maken die relaties met elkaar delen, waardoor we complexere datastructuren kunnen modelleren.

#### Soft Relations versus Foreign Keys

Voordat we ons verdiepen in het implementeren van relaties in Drizzle, laten we het verschil verduidelijken tussen **relaties** en **foreign keys**.

  - **Foreign keys** zijn een beperking op databaseniveau waarmee we twee tabellen aan elkaar kunnen koppelen. Een foreign key is een kolom in de ene tabel die verwijst naar de primary key van een andere tabel. Dit creëert een relatie tussen de twee tabellen, waardoor we ze in query's kunnen samenvoegen. Foreign key-beperkingen zorgen ervoor dat bij het invoegen/bijwerken/verwijderen van data de data consistent en geldig blijft in de tabellen. Als we bijvoorbeeld een `user_profiles`-tabel hebben die verwijst naar de `users`-tabel, kunnen we ervoor zorgen dat elk profiel bij een geldige gebruiker hoort.
  - **Soft Relations** daarentegen zijn een abstractie op applicatieniveau die Drizzle biedt om het gemakkelijker te maken om met gerelateerde data te werken. Het is cruciaal om te weten dat ze de databaseschema niet direct beïnvloeden, maar ze kunnen erg nuttig zijn om query's leesbaarder en gemakkelijker te maken.
  - We kunnen soft relations definiëren zonder foreign keys en vice versa, maar in de meeste gevallen is het een goed idee om beide te gebruiken.

Het is oké om hier in het begin wat verward door te zijn, we wilden alleen het verschil tussen de twee verduidelijken voordat we ze als uitwisselbaar gaan beschouwen.
Laten we voor nu eens kijken naar een eenvoudige relatie tussen twee tabellen: de een-op-een relatie.

#### Eén-op-één

[Een-op-een relaties](https://orm.drizzle.team/docs/relations#one-to-one) zijn het eenvoudigste type relatie, waarbij één record in een tabel gerelateerd is aan één record in een andere tabel. We zouden bijvoorbeeld een `profile`-tabel kunnen hebben die aanvullende informatie over een gebruiker bevat, in plaats van minder cruciale gegevens in de `user`-tabel zelf op te slaan.

Laten we een `user_profiles`-tabel opzetten die aanvullende informatie over de gebruiker bevat, met het volgende formaat:

##### User Profiles Tabel

| Kolomnaam | Gegevenstype | Beperkingen |
|-------------|-----------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO\_INCREMENT |
| `user_id` | `int` | FOREIGN KEY → users(id), NOT NULL |
| `first_name` | `varchar(35)` | NOT NULL |
| `last_name` | `varchar(35)` | NOT NULL |
| `title` | `varchar(35)` | NOT NULL |

###### Implementatie

We implementeren het als volgt:

```typescript
// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Bevat gebruikersinformatie.
export const users = mysqlTable('users', {
	id: int('id').primaryKey().autoincrement(),
	createdAt: datetime('created_at').notNull(),
	username: varchar('username', { length: 20 }).unique().notNull(),
	dateOfBirth: date('date_of_birth').notNull()
});

// Bevat gebruikersprofielinformatie.
export const userProfiles = mysqlTable('user_profiles', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').references(() => users.id).notNull(),
	firstName: varchar('first_name', { length: 35 }).notNull(),
	lastName: varchar('last_name', { length: 35 }).notNull(),
	title: varchar('title', { length: 35 }).notNull()
});

// Eén gebruiker heeft één profiel.
export const usersRelations = relations(users, ({ one }) => ({
	profile: one(userProfiles)
}));

// Eén profiel behoort tot één gebruiker.
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id]
	})
}));

```

Nu hebben we twee tabellen: `users` en `user_profiles`. Eén gebruiker kan één profiel hebben, en één profiel behoort tot één gebruiker.

  - De `users`-tabel bevat nu niet de kolommen `firstName` en `lastName`.
  - De `user_profiles`-tabel is nieuw en bevat:
      - `id`: een auto-incrementing primary key van het type `int`.
      - `userId`: een foreign key die verwijst naar de `id`-kolom in de `users`-tabel. Meer over foreign keys later.
      - `firstName`: een `varchar`-kolom die de voornaam van de gebruiker opslaat, met een maximale lengte van 35 tekens.
      - `lastName`: een `varchar`-kolom die de achternaam van de gebruiker opslaat, met een maximale lengte van 35 tekens.
      - `title`: een `varchar`-kolom die de titel van de gebruiker opslaat (bijv. hun functie), met een maximale lengte van 35 tekens.

We definiëren ook de **relaties** tussen de twee tabellen met behulp van de `relations`-functie van Drizzle. Hierdoor kunnen we later eenvoudig de gerelateerde data opvragen.

Laten we de bestaande `user`-tabellen in onze database verwijderen met behulp van phpMyAdmin (klik op het ⛔-pictogram in het tabeloverzicht), en vervolgens ons schema opnieuw pushen met `npx drizzle-kit push`. We kunnen zien hoe de SQL-statement die door Drizzle is gegenereerd automatisch de beperkingen toevoegt die we in ons schema hebben gedefinieerd:

![two-tables.png](/tutorial/3-drizzle/img/two-tables.png)

#### Eén-op-veel

[Eén-op-veel relaties](https://orm.drizzle.team/docs/relations#one-to-many) zijn een type relatie waarbij één record in een tabel gerelateerd is aan meerdere records in een andere tabel. We zouden bijvoorbeeld een `sessions`-tabel kunnen hebben die gegevens bevat over de trainingssessies van de gebruiker in onze game, waarbij één gebruiker meerdere sessies kan hebben, maar elke sessie behoort tot één gebruiker.

##### Sessietabel

Laten we een `sessions`-tabel opzetten die informatie bevat over de trainingssessie van de gebruiker, met het volgende formaat:

| Kolomnaam | Gegevenstype | Beperkingen |
|-------------|-----------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO\_INCREMENT |
| `user_id` | `int` | FOREIGN KEY → users(id), NOT NULL |
| `created_at` | `datetime` | NOT NULL |
| `duration` | `int` | NOT NULL |

###### Implementatie

We implementeren het als volgt:

```typescript
// Bevat informatie over gebruikerssessies
export const sessions = mysqlTable('sessions', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').references(() => users.id).notNull(),
	createdAt: datetime('created_at').notNull(),
	duration: int('duration').notNull() // in seconden
});

// Definieer relaties van de sessietabel
export const sessionsRelations = relations(sessions, ({ one }) => ({
	// Eén sessie behoort tot één gebruiker.
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));
```

## Het schema afronden

Nu we begrijpen hoe we nieuwe tabellen kunnen maken en relaties daartussen kunnen definiëren, laten we ons schema afronden door nog een paar tabellen toe te voegen die ons zullen helpen de gegevens voor onze serious game-database te modelleren.

### Scoretabel

Deze tabel houdt de scores bij die een gebruiker behaalt. Elke score is gekoppeld aan een specifieke trainingssessie en wordt behaald op een specifiek niveau van het spel.

Deze tabel zal de volgende kolommen bevatten:
| Kolomnaam | Gegevenstype | Beperkingen |
|-------------|-----------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO\_INCREMENT |
| `session_id` | `int` | FOREIGN KEY → sessions(id), NOT NULL |
| `level_id` | `int` | FOREIGN KEY → levels(id), NOT NULL |

#### Implementatie

We zullen de `scores`-tabel als volgt implementeren:

```typescript
// Bevat scores voor elke sessie en elk niveau
export const scores = mysqlTable('scores', {
	id: int('id').primaryKey().autoincrement(),
	sessionId: int('session_id').references(() => sessions.id).notNull(),
	levelId: int('level_id').references(() => levels.id).notNull(),
	createdAt: datetime('created_at').notNull(),
	score: int('score').notNull(),
	timeTaken: int('time_taken').notNull(), 
	accuracy: float('accuracy').notNull()
});
```

En we updaten de `sessionsRelations` en voegen de `scoresRelations` toe:

```typescript
// Definieer relaties van de sessietabel
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
    ...,
    scores: many(scores) // Eén sessie kan veel scores hebben.
}));

// Definieer relaties van de scoretabel
export const scoresRelations = relations(scores, ({ one }) => ({
	// Eén score behoort tot één sessie.
	session: one(sessions, {
		fields: [scores.sessionId],
		references: [sessions.id]
	})
}));
```

### Niveautabel

Deze tabel bevat informatie over de verschillende niveaus in het spel. Elk niveau heeft een unieke ID en een naam.

Deze tabel zal de volgende kolommen bevatten:

| Kolomnaam | Gegevenstype | Beperkingen |
|-------------|-----------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO\_INCREMENT |
| `name` | `varchar(50)` | NOT NULL |
| `difficulty` | `int` | NOT NULL |

#### Implementatie

We zullen de `levels`-tabel als volgt implementeren:

```typescript
// Bevat informatie over de niveaus in het spel
export const levels = mysqlTable('levels', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	difficulty: int('difficulty').notNull()
});
```

En we zullen de `scoresRelations` bijwerken en de `levelsRelations` toevoegen:

```typescript
// Definieer relaties van de scoretabel
export const scoresRelations = relations(scores, ({ one }) => ({
    ...	
	// Eén score behoort tot één niveau.
	level: one(levels, {
		fields: [scores.levelId],
		references: [levels.id]
	})
}));

// Bevat informatie over de niveaus in het spel
export const levelsRelations = relations(levels, ({ many }) => ({
	// Eén niveau kan veel scores hebben.
	scores: many(scores)
}));
```

### Eindschema

Het uiteindelijke (voor nu) schema waar we op uitkwamen tijdens deze wijzigingen zou er als volgt uit moeten zien:

```typescript
// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int, float } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Bevat gebruikersinformatie.
export const users = mysqlTable('users', {
	id: int('id').primaryKey().autoincrement(),
	createdAt: datetime('created_at').notNull(),
	username: varchar('username', { length: 20 }).unique().notNull(),
	dateOfBirth: date('date_of_birth').notNull()
});

// Bevat gebruikersprofielinformatie.
export const userProfiles = mysqlTable('user_profiles', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').references(() => users.id).notNull(),
	firstName: varchar('first_name', { length: 35 }).notNull(),
	lastName: varchar('last_name', { length: 35 }).notNull(),
	title: varchar('title', { length: 35 }).notNull()
});

// Bevat informatie over gebruikerssessies
export const sessions = mysqlTable('sessions', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').references(() => users.id).notNull(),
	createdAt: datetime('created_at').notNull(),
	duration: int('duration').notNull() // in seconden
});

// Bevat scores voor elke sessie en elk niveau
export const scores = mysqlTable('scores', {
	id: int('id').primaryKey().autoincrement(),
	sessionId: int('session_id').references(() => sessions.id).notNull(),
	levelId: int('level_id').references(() => levels.id).notNull(),
	createdAt: datetime('created_at').notNull(),
	score: int('score').notNull(),
	timeTaken: int('time_taken').notNull(), 
	accuracy: float('accuracy').notNull()
});

export const levels = mysqlTable('levels', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	difficulty: int('difficulty').notNull()
});

// Definieer relaties van de gebruikerstabel
export const usersRelations = relations(users, ({ one, many }) => ({
	// Eén gebruiker heeft één profiel.
	profile: one(userProfiles),
	// Eén gebruiker kan veel sessies hebben.
	sessions: many(sessions)
}));

// Definieer relaties van de userProfiles-tabel
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	// Eén gebruikersprofiel behoort tot één gebruiker.
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id]
	})
}));

// Definieer relaties van de sessietabel
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	// Eén sessie behoort tot één gebruiker.
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
	scores: many(scores) // Eén sessie kan veel scores hebben.
}));

// Definieer relaties van de scoretabel
export const scoresRelations = relations(scores, ({ one }) => ({
	// Eén score behoort tot één sessie.
	session: one(sessions, {
		fields: [scores.sessionId],
		references: [sessions.id]
	}),
	// Eén score behoort tot één niveau.
	level: one(levels, {
		fields: [scores.levelId],
		references: [levels.id]
	})
}));

// Bevat informatie over de niveaus in het spel
export const levelsRelations = relations(levels, ({ many }) => ({
	// Eén niveau kan veel scores hebben.
	scores: many(scores)
}));
```

## Verfijningen in seeding

Nu we een complexer schema hebben, waarbij tabellen daadwerkelijk relaties delen, moeten we ons seeding-script bijwerken om realistischere data te genereren die voldoet aan het schema dat we hebben gedefinieerd.

> ℹ️ Volg alsjeblieft de onderstaande codefragmenten, want ze zullen je helpen begrijpen hoe je de gegenereerde data kunt verfijnen om beter aan je behoeften te voldoen. Houd er echter rekening mee dat je het seeding-script voor je eigen database niet te ingewikkeld moet maken. Concentreer je alleen op de belangrijkste aspecten van de data die 'realistisch' moeten zijn voor je applicatie. In ons geval willen we realistische data in grafieken tonen, dus moeten we ervoor zorgen dat de datums, duur en scores allemaal binnen een redelijk bereik liggen.

### Relatie-bewuste seeding

Drizzle's `drizzle-seed`-bibliotheek verwerkt relaties redelijk goed. We hoeven alleen maar wat hints te geven over hoe de gegevens moeten worden gegenereerd.
Dit kunnen we doen met de `refine`-methode.

Laten we ons `scripts/reseed.ts`-bestand bijwerken om de `refine`-methode te gebruiken:

```typescript
// /scripts/reseed.ts
...

await seed(db, schema).refine((f) => ({
    users: {
        count: 12,
        with: {
            userProfiles: 1,
            sessions: 5
        }
    },
    sessions: {
        with: {
            scores: 5
        }
    },
    levels: {
        count: 5
    }
}));

...
```

Dit genereert 12 gebruikers, elk met 1 profiel en 5 sessies.
Elke sessie heeft vijf scores en de `levels`-tabel wordt gevuld met vijf niveaus.

Omdat we het `schema` aan de `seed`-functie doorgeven, is Drizzle op de hoogte van de relaties tussen onze tabellen en zal het de data dienovereenkomstig genereren.

Hierdoor krijgen we een database met:

  - 12 gebruikers
      - Elke gebruiker heeft 1 profiel
      - Elke gebruiker heeft 5 sessies
  - 12 gebruikersprofielen
  - 60 sessies
      - Elke sessie heeft 5 scores
  - 300 scores
  - 5 niveaus

Laten we het bekijken in `phpMyAdmin`:

![refinement-overview.png](/tutorial/3-drizzle/img/refinement-overview.png)

Die rijtellingen kloppen\!
Kijkend naar de `sessions`-tabel, zien we ook dat elke `user_id` vijf keer voorkomt, en elke `user_id` geldig is:


![sessions-overview.png](/tutorial/3-drizzle/img/sessions-overview.png)

En kijkend naar de `scores`-tabel, kunnen we zien dat elke `session_id` vijf keer voorkomt, en elke `level_id` geldig is:

![scores-overview.png](/tutorial/3-drizzle/img/scores-overview.png)

Dit is geweldig\!
Misschien zijn je wat vreemde waarden opgevallen voor onze testdata. De `duration`-kolom in de `sessions`-tabel is soms negatief, en de getallen zijn enorm. Dat ziet er niet erg zinnig uit als we bedenken dat de `duration` in seconden is, en een realistische sessie hooguit een paar uur zou moeten duren.

Gelukkig hebben we meer opties om de gegenereerde gegevens te verfijnen. Laten we enkele van die andere opties bekijken.

### Generatorfuncties

Je hebt je misschien afgevraagd wat de `f`-parameter is in de `refine`-methode. We kunnen deze gebruiken om realistischere data te genereren met behulp van de verschillende [generatorfuncties](https://orm.drizzle.team/docs/seed-functions) die Drizzle biedt.

Laten we enkele van deze functies toepassen op ons seeding-script. We zullen ze hieronder bespreken.

```typescript
// /scripts/reseed.ts

...
await seed(db, schema).refine((f) => ({
	users: {
		count: 12,
		columns: {
			createdAt: f.date({ minDate: '2025-01-01', maxDate: '2025-02-01' }),
			dateOfBirth: f.date({ minDate: '1995-01-01', maxDate: '2005-12-31' })
		},
		with: {
			userProfiles: 1,
			sessions: 5
		}
	},
	userProfiles: {
		columns: {
			firstName: f.firstName(),
			lastName: f.lastName({ isUnique: true }),
			title: f.valuesFromArray({
				values: ['Intern', 'Junior', 'Senior']
			})
		}
	},
	sessions: {
		columns: {
			// Tussen 30 minuten en 4 uur
			duration: f.number({ minValue: 60 * 30, maxValue: 60 * 60 * 4 })
		},
		with: {
			scores: 5
		}
	},
	levels: {
		count: 5
	},
	scores: {
		columns: {
			score: f.number({ minValue: 0, maxValue: 5000 }),
			// Tussen 1 minuut en 12 uur
			timeTaken: f.number({ minValue: 60, maxValue: 60 * 12 }),
			// Tussen 0 en 1 met 2 decimalen
			accuracy: f.number({ minValue: 0, maxValue: 1, precision: 100 })
		}
	}
}));
...
```

In dit bijgewerkte seeding-script gebruiken we de volgende generatorfuncties:

  - `f.date({ minDate, maxDate })`: Genereert een willekeurige datum tussen de opgegeven minimum- en maximumdatums. We gebruiken dit om een realistische geboortedatum voor de gebruikers te genereren.
  - `f.firstName()`: Genereert een willekeurige voornaam voor het gebruikersprofiel.
  - `f.lastName({ isUnique: true })`: Genereert een willekeurige achternaam voor het gebruikersprofiel, waarbij ervoor wordt gezorgd dat de achternamen uniek zijn.
  - `f.valuesFromArray({ values })`: Genereert een willekeurige waarde uit de opgegeven array. We gebruiken dit om een willekeurige titel voor het gebruikersprofiel te genereren.
  - `f.number({ minValue, maxValue })`: Genereert een willekeurig getal tussen de opgegeven minimum- en maximumwaarden. We gebruiken dit om een realistische duur voor de sessies, een score voor de scores en een tijdsduur voor de scores te genereren.
  - `f.number({ minValue, maxValue, precision })`: Genereert een willekeurig getal tussen de opgegeven minimum- en maximumwaarden, met de opgegeven precisie. We gebruiken dit om een realistische nauwkeurigheid voor de scores te genereren.

Meer generatorfuncties vind je in de [Drizzle-documentatie](https://orm.drizzle.team/docs/seed-functions), mocht je die nodig hebben.

Hoewel de data nu realistischer is, hebben we nog een paar manieren om onze data verder te verbeteren. We moeten er bijvoorbeeld voor zorgen dat de `created_at` kolom in de `score` tabel wordt ingesteld na de `created_at` kolom in de `sessions` tabel. Anders zouden we scores creëren die niet in een sessie zijn gebeurd, wat geen zin heeft.

Om deze wijzigingen aan te brengen, moeten we data genereren die afhankelijk is van andere data. `drizzle-seed` is daar niet zo goed in. Dus zullen we in plaats daarvan handmatig een deel van de data moeten seeden, wat we in de volgende sectie zullen behandelen.

### Handmatig vullen

Zoals hierboven vermeld, moet een deel van onze data op een rigide manier worden gegenereerd, en is een deel van onze data afhankelijk van andere data. We willen er bijvoorbeeld voor zorgen dat de moeilijkheidsgraad van de `levels` geleidelijk toeneemt, en dat de `created_at`-kolom in de `scores`-tabel wordt behaald binnen de tijdsduur van de sessie waartoe deze behoort.

Aangezien `drizzle-seed` dit niet standaard ondersteunt, moeten we een deel van de data handmatig invoegen. In sommige gevallen moeten we eerst de afhankelijke data opvragen en die data vervolgens gebruiken om de afhankelijke data te genereren.

We zullen [Faker.js](https://fakerjs.dev/) gebruiken om de gaten op te vullen waar `drizzle-seed` de benodigde gegevens niet kan genereren.

#### Faker.js

Faker.js is een populaire bibliotheek voor het genereren van nepdata, en we kunnen deze gebruiken in combinatie met `drizzle-seed`.

Om Faker.js te gebruiken, moeten we het eerst [installeren](https://fakerjs.dev/guide/) als een dev-afhankelijkheid:

```bash
npm install @faker-js/faker --save-dev
```

Nu kunnen we het importeren in ons seeding-script en het gebruiken om de benodigde gegevens te genereren.
Om ervoor te zorgen dat `faker` reproduceerbare gegevens genereert, kunnen we handmatig een seed instellen:

```typescript
// /scripts/reseed.ts

import { faker } from '@faker-js/faker';

// Functie om de database opnieuw te vullen
async function reseed_db() {
	...
	// Maak een MySQL-client aan en initialiseer Drizzle ORM
	const client = mysql.createPool(process.env.DATABASE_URL);
	const db = drizzle(client, { schema, mode: 'default' });
	faker.seed(1234);
	...
}
```

Bekijk de [gebruikershandleiding](https://fakerjs.dev/guide/usage.html) en [API-referentie](https://fakerjs.dev/api/) om te zien wat Faker.js voor ons kan doen.

#### Handmatig bijwerken

Laten we eenvoudig beginnen. We willen alleen handmatig de `name` en `difficulty` van de gemaakte `levels` tabel [bijwerken](https://orm.drizzle.team/docs/update), aangezien ze nu nogal onzinnig zijn:

![pre-level-patch.png](/tutorial/3-drizzle/img/pre-level-patch.png)

Dit geeft ons een goede gelegenheid om onze eerste query te schrijven die data in de database bijwerkt met behulp van Drizzle.
Onder de `seed`-functie voegen we toe:

```typescript
// /scripts/reseed.ts

async function reseed_db() {
	...
	await seed(db, schema).refine(...);

	// We roepen deze functie aan na het seeding-proces
	await updateLevels(db);
	...
}
```

En dan implementeren we de `updateLevels`-functie:

```typescript
// Werkt de niveautabel bij met sequentiële namen en moeilijkheidsgraden 
async function updateLevels(db: MySql2Database<typeof schema>) {
	// We definiëren een array van niveaus met hun namen en moeilijkheidsgraden
	const levels = [
		{ name: 'Beginner', difficulty: 1 },
		{ name: 'Intermediate', difficulty: 2 },
		{ name: 'Advanced', difficulty: 3 },
		{ name: 'Expert', difficulty: 4 },
		{ name: 'Master', difficulty: 5 }
	];

	// Werk voor elk niveau de naam en moeilijkheidsgraad bij
	for (let i = 0; i < levels.length; i++) {
		// We roepen de update-methode aan op het db-object, waarbij we de schema.levels-tabel doorgeven
		await db.update(schema.levels)
			// We stellen de naam- en moeilijkheidsgraadkolommen in op de waarden uit de levels-array
			.set({
				name: levels[i].name,
				difficulty: i + 1
			})
			// We gebruiken de eq-functie om aan te geven welke rij moet worden bijgewerkt, op basis van de id-kolom
			.where(eq(schema.levels.id, i + 1));
	}
}
```

Na uitvoering van het seed-script hebben we de niveau-tabel gecorrigeerd:

![post-level-patch.png](/tutorial/3-drizzle/img/post-level-patch.png)

Dat ziet er veel beter uit\!
Laten we nu verder gaan met iets complexers.

#### Selecteren en bijwerken met een Faker-functie

Net als hoe we de levels-tabel hebben bijgewerkt, kunnen we een Faker.js-functie gebruiken om willekeurige, internetachtige gebruikersnamen te genereren voor elke gebruiker in de `users`-tabel.

We [selecteren](https://orm.drizzle.team/docs/select#basic-select) eerst de gebruikers uit de `users`-tabel, en vervolgens genereren we voor elke gebruiker een willekeurige gebruikersnaam met Faker.js en werken we de `username`-kolom in de `users`-tabel bij waar de `id` overeenkomt met de id van de gebruiker.

```typescript
// Stelt willekeurige internetgebruikersnamen in voor elke gebruiker
async function updateUsernames(db: MySql2Database<typeof schema>) {
	const users = await db.select().from(schema.users);
	for (const user of users) {
		await db
			.update(schema.users)
			.set({
				username: faker.internet.username().slice(0, 20)
			})
			.where(eq(schema.users.id, user.id));
	}
}
```

#### Data genereren die afhankelijk is van andere data

Een van de problemen met ons huidige seeding-script is dat de `sessions`-tabel sessies kan bevatten die zijn aangemaakt vóórdat het gebruikersaccount is aangemaakt, vanwege het willekeurige karakter van het seeding-proces.

Laten we dit corrigeren door de kolom `created_at` in de `sessions`-tabel handmatig bij te werken om ervoor te zorgen dat ze altijd sequentieel worden aangemaakt na het aanmaken van het gebruikersaccount.

Hiervoor moeten we eerst de gebruikers uit de `users`-tabel [selecteren](https://orm.drizzle.team/docs/select#basic-select), en vervolgens voor elke gebruiker hun sessies selecteren en de kolom `created_at` bijwerken op basis van een willekeurige, sequentiële offset van de `created_at`-datum van de gebruiker:

```typescript

// Past de created_at-kolom in de sessiestabel aan om ervoor te zorgen dat sessies worden aangemaakt nadat het gebruikersaccount is aangemaakt
async function adjustSessionCreatedAt(db: MySql2Database<typeof schema>) {
	// Query de aangemaakte gebruikers
	const createdUsers = await db.select().from(schema.users);

	// Voor elke gebruiker...
	for (const user of createdUsers) {
		// Vind hun sessies
		const userSessions = await db.query.sessions.findMany({
			where: (sessions, { eq }) => eq(sessions.userId, user.id)
		});

		// Verschuif de sessies voor die gebruiker
		let currentCreatedAt = user.createdAt;
		for (const session of userSessions) {
			// Verschuif de createdAt met een willekeurige hoeveelheid tijd (tot 48 uur)
			const offset = faker.number.int({ min: 0, max: 60 * 60 * 48 * 1000 });
			const newCreatedAt = new Date(currentCreatedAt.getTime() + offset);
			// Werk de createdAt van de sessie bij
			await db
				.update(schema.sessions)
				.set({ createdAt: newCreatedAt })
				.where(eq(schema.sessions.id, session.id));
			currentCreatedAt = newCreatedAt;
		}
	}
}
```

Cool. Laten we nog een faker-functie gebruiken om ervoor te zorgen dat elke score wordt aangemaakt binnen de tijdsduur van de sessie waartoe deze behoort.

```typescript
// Past de created_at-kolom in de scores-tabel aan om ervoor te zorgen dat scores worden aangemaakt binnen de tijdsduur van de sessie
async function adjustScoresCreatedAt(db: MySql2Database<typeof schema>) {
	// Query alle sessies
	const sessions = await db.select().from(schema.sessions);

	// Voor elke sessie...
	for (const session of sessions) {
		// Bereken de start- en eindtijden van de sessie
		const sessionCreatedAt = session.createdAt;
		const sessionEndedAt = new Date(sessionCreatedAt.getTime() + session.duration * 1000);

		// Zoek alle scores voor die sessie
		const scores = await db.query.scores.findMany({
			where: eq(schema.scores.sessionId, session.id)
		});

		// Stel voor elke score een willekeurige createdAt-tijd in binnen de tijdsduur van de sessie
		for (const score of scores) {
			const randomTime = faker.date.between({ from: sessionCreatedAt, to: sessionEndedAt });
			await db
				.update(schema.scores)
				.set({ createdAt: randomTime })
				.where(eq(schema.scores.id, score.id));
		}
	}
}
```

Dat zijn alle verfijningen die we voorlopig moeten doen.

Nogmaals, onthoud dat je niet te veel moet overdrijven met deze verfijningen, en concentreer je op het normaliseren van de gegevens die het belangrijkst zijn voor je applicatie.
We wilden je vooral laten zien hoe je de gesimuleerde data kunt verfijnen, en kunnen altijd later terugkomen om de data verder te verfijnen.

## De database bevragen

Nu we bruikbare, realistische data hebben om in onze applicatie te tonen, willen we weten hoe we de database kunnen bevragen om deze data op te halen.
We hebben al enkele basisquery's geschreven in ons seeding-script, maar dit is een goed moment om de [Drizzle-documentatie](https://orm.drizzle.team/docs/select) door te lezen. (In onze webportal wijzigen we meestal geen data, we lezen het alleen, dus we zullen voornamelijk `select`-query's gebruiken.)

Het belangrijkste om te weten is dat er twee manieren zijn om de database te bevragen met Drizzle:

  - **Query Builder**: Dit is de meest voorkomende manier om de database te bevragen, waarbij we de `db.select()`-methode gebruiken om stap voor stap een query op te bouwen. Het bootst SQL-syntaxis nauwkeurig na.
  - **Drizzle Queries**: Dit is waar de `relations` die we in ons schema hebben gedefinieerd voor worden gebruikt. Het stelt ons in staat om gerelateerde data op een intuïtievere manier te bevragen, met behulp van de `db.query`-methode. Dit is vooral handig wanneer we data willen bevragen die relaties heeft, zoals gebruikers met hun profielen of sessies.

We kunnen beide methoden gebruiken om hetzelfde resultaat te bereiken. Afhankelijk van de situatie kan de ene methode handiger zijn dan de andere.

In het volgende hoofdstuk gaan we kijken naar het implementeren van deze query's in onze SvelteKit-applicatie, dus het is een goed idee om je vertrouwd te maken met de verschillende query-methoden die Drizzle biedt.

## Samenvatting

In dit hoofdstuk hebben we ORM's conceptueel leren begrijpen en zijn we verder gegaan met het bouwen van een volledig functionele, relationeel gestructureerde database voor onze SvelteKit-applicatie.

We begonnen met het begrijpen waarom ORM's zoals Drizzle waardevolle alternatieven zijn voor pure SQL, en gingen vervolgens verder met de praktische opzet van het verbinden van Drizzle met onze MySQL-database. Van daaruit hebben we ons databaseschema stapsgewijs opgebouwd - beginnend met een eenvoudige gebruikerstabel, en vervolgens uitgebreid om zinvolle relaties te creëren tussen gebruikers, profielen, sessies, scores en niveaus. We leerden efficiënt realistische testdata te genereren, deze te verfijnen om aan onze specifieke behoeften te voldoen, en ten slotte onderzochten we hoe we deze data kunnen bevragen met behulp van Drizzle's flexibele query-benaderingen.

**Wat we hebben bereikt:**

  - Een solide begrip van de voordelen van ORM en Drizzle's TypeScript-first benadering opgebouwd
  - Een productieklare databaseconfiguratie opgezet met correct omgevingsvariabelebeheer
  - Een relationele database ontworpen die de gegevensvereisten van een serious game nauwkeurig modelleert
  - Een geautomatiseerd seeding-systeem gebouwd dat consistente, realistische gegevens genereert voor ontwikkeling en testen
  - Geleerd hoe we onze database kunnen bevragen, zodat we klaar zijn voor gegevensopvraging in onze SvelteKit-applicatie

Met onze databasefundering op zijn plaats, zijn we nu klaar om deze gegevens tot leven te brengen in onze SvelteKit-applicatie. In het volgende hoofdstuk leren we hoe we deze databasequery's veilig kunnen integreren in onze server-side routes, dynamische pagina's kunnen maken die gebruikersgegevens weergeven, en interactieve componenten kunnen bouwen die ruwe informatie visualiseren.
Ga naar [Hoofdstuk 4](https://www.google.com/search?q=/tutorials/4-load-and-display-data/README.md) om verder te gaan.
