# 4 - Gegevens laden en weergeven

In de vorige hoofdstukken hebben we geleerd hoe we een SvelteKit-applicatie kunnen opzetten en verbinden met een database. We hebben ook gezien hoe we Drizzle ORM-modellen kunnen maken en hoe we basisquery's kunnen uitvoeren met Drizzle ORM.
In dit hoofdstuk leren we hoe we deze query's kunnen gebruiken om gegevens uit de database naar de SvelteKit-app te laden en deze weer te geven met verschillende visualisatietechnieken.

-----

## Hoofdstukoverzicht

### Leerdoelen

Aan het einde van dit hoofdstuk kun je:

  - De **load function** in SvelteKit begrijpen en gebruiken om gegevens voor je pagina's voor te laden.
  - Onderscheid maken tussen **universal** en **server-only** load functions.
  - Gegevens uit een database opvragen met Drizzle ORM en veilig doorgeven aan je frontend.
  - **Data Access Objects (DAO's)** maken en gebruiken om query-logica te **encapsuleren** en te **modulariseren**.
  - Routeparameters en URL-query's gebruiken om dynamische en responsieve gegevenslading te implementeren.
  - Fouten elegant afhandelen met behulp van SvelteKit's foutafhandelingsmechanismen.
  - Gegevens in verschillende formaten weergeven:
      - Basis component-gebaseerde rendering.
      - Herbruikbare tabelcomponenten met optionele paginering.
      - Dynamische grafieken met Chart.js voor visuele inzichten.
  - Hulpprogrammafuncties extraheren om hergebruik en duidelijkheid in je codebase te bevorderen.

### Leermiddelen

  - [SvelteKit Documentation](https://kit.svelte.dev/docs/load)

  - [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

  - [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

  - [Skeleton.dev UI Components](https://www.skeleton.dev/docs/components)

  - [Understanding DAOs (Data Access Objects)](https://en.wikipedia.org/wiki/Data_access_object)

-----

## Gegevens laden met SvelteKit

### Pagina gegevens laden

Stel dat we een lijst met gebruikers uit onze database willen weergeven in een SvelteKit-applicatie.
Hiervoor hebben we een UI-element nodig dat de lijst met gebruikers weergeeft, en moeten we de gegevens uit de database in dat UI-element laden voordat het wordt gerenderd.

De [load](https://svelte.dev/docs/kit/load) functie stelt ons in staat om precies dat te doen. Het is een speciale functie die zich in een naastgelegen `+page.ts` of `+page.server.ts` bestand bevindt, naast een `+page.svelte` bestand.

De `load` functie wordt aangeroepen voordat de pagina wordt gerenderd, en de retourwaarde ervan wordt als `data` **prop** aan de pagina doorgegeven.
We kunnen deze functie gebruiken om gegevens te laden uit een database, API of een andere bron, en deze vervolgens door te geven aan de pagina voor rendering.
In ons geval zullen we dus de `load` functie gebruiken om onze database op te vragen voor de lijst met gebruikers, en die gegevens vervolgens door te geven aan de pagina, die de gegevens vervolgens zal gebruiken om de lijst met gebruikers te renderen.

#### Universal loading vs server-side loading

Het is belangrijk op te merken dat er twee typen **load functions** zijn in SvelteKit: **universal** en **server-side**.
Universal load functions worden gedefinieerd in `+page.ts` bestanden, terwijl server-side load functions worden gedefinieerd in `+page.server.ts` bestanden. Het belangrijkste verschil tussen de twee is dat server-side load functions alleen op de server draaien, terwijl universal load functions zowel op de server als op de client kunnen draaien.

Zonder te diep op de details in te gaan, volgt hier een korte beschrijving van wanneer je welk type moet gebruiken uit de [SvelteKit documentatie](https://svelte.dev/docs/kit/load#Universal-vs-server-When-to-use-which):

> Server load functions zijn handig wanneer je direct toegang moet hebben tot gegevens uit een database of bestandssysteem, of privé omgevingsvariabelen moet gebruiken.
> Universal load functions zijn nuttig wanneer je gegevens van een externe API moet ophalen en geen privé referenties nodig hebt, omdat SvelteKit de gegevens rechtstreeks van de API kan ophalen in plaats van via je server te gaan. Ze zijn ook nuttig wanneer je iets moet retourneren dat niet kan worden geserialiseerd, zoals een Svelte component constructor.
> In zeldzame gevallen moet je mogelijk beide samen gebruiken — bijvoorbeeld, je moet mogelijk een instantie van een aangepaste klasse retourneren die is geïnitialiseerd met gegevens van je server. Bij het gebruik van beide wordt de retourwaarde van de server load niet rechtstreeks aan de pagina doorgegeven, maar aan de universal load function (als de data property).

Omdat we gegevens uit een database zullen laden, gebruiken we in dit hoofdstuk de **server-side load function**.

#### Statische gegevens laden

Voordat we onze database gaan bevragen, laden we eerst wat statische gegevens om te zien hoe de `load` functie werkt.

We maken een nieuw `+page.server.ts` bestand aan in de `src/routes` map en voegen de volgende code toe:

```ts
// /src/routes/+page.server.ts

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const myData = {
        name: "John Doe",
        age: 30,
        display: true
    };
    return { myData };
}
```

We importeren het `PageServerLoad` type uit de `$types` module, een [gegenereerde module](https://svelte.dev/docs/kit/types#Generated-types).
Dit zorgt ervoor dat onze `load` functie het juiste type doorgeeft aan de `data` **prop** die de pagina zal ontvangen.

Vervolgens definiëren we de `load` functie zelf, die een object met de naam `myData` retourneert, met daarin enkele statische gegevens.

Nu kunnen we deze gegevens gebruiken in ons `+page.svelte` bestand op hetzelfde niveau als het `+page.server.ts` bestand (`src/routes/+page.svelte`).
Laten we snel wat code toevoegen om deze gegevens van `myData` weer te geven:

```svelte
<script lang="ts">
    ...
    let { data } = $props();
</script>

<div
    class="..."
>
    <Card footerBase="...">
        {#snippet header()}
            ...
        {/snippet}
        {#snippet article()}
            ...
            <p class="opacity-60">
                ...
                {data.myData.name} is {data.myData.age} years old.
                Are they visible? {data.myData.display ? 'Yes' : 'No'}
            </p>
        {/snippet}
    </Card>
</div>
```

Et voilà\! Als we de pagina bezoeken, zouden we nu de statische gegevens op de pagina moeten zien:

![display-static-data.png](/tutorial/4-load-and-display-data/img/display-static-data.png)

Laten we de code die we zojuist hebben toegevoegd in het `+page.svelte` bestand verwijderen en de `load` functie in het `+page.server.ts` bestand vervangen door code die onze database bevraagt voor een lijst met gebruikers.

#### Gegevens uit de database laden

Om gegevens uit de database te laden, gebruiken we de Drizzle ORM die we in het vorige hoofdstuk hebben opgezet.

Om **type safety** te behouden tussen ons database schema en de gegevens die we in de SvelteKit-app tonen, kunnen we de types voor de gegevens rechtstreeks afleiden uit de tabellen die we in ons Drizzle ORM-schema hebben gedefinieerd.
Om de types voor ons Schema te exporteren, voegen we de volgende code toe aan (helemaal onderaan) ons `src/lib/db/schema.ts` bestand:

```ts
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Score = typeof scores.$inferSelect;
export type Level = typeof levels.$inferSelect;
```

Vervolgens gaan we het `+page.server.ts` bestand herwerken om de database te bevragen voor een lijst met gebruikers.

```ts
// /src/routes/+page.server.ts

import type { PageServerLoad } from "./$types";

// We importeren de db-instantie en het schema dat we in het vorige hoofdstuk hebben gedefinieerd
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
// We importeren het nieuw afgeleide User-type
import type { User } from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
    // Hier voeren we een basis select query uit om alle gebruikers uit de database te halen
    const users: User[] = await db.select().from(schema.users);
    // En tot slot geven we de lijst met gebruikers door aan de data prop van de pagina
    return {
        users
    }
}
```

En werk vervolgens het `+page.svelte` bestand bij om die lijst met gebruikers weer te geven.
We zullen de `$derived` **rune** gebruiken om ervoor te zorgen dat de lijst met gebruikers **reactief** is, wat betekent dat als de gegevens veranderen, de UI automatisch wordt bijgewerkt.
(Hoewel in ons voorbeeld de gegevens niet **reactief** zullen veranderen. Maar dit is over het algemeen een goede gewoonte om te volgen.)

```svelte
<script lang="ts">
    ...
    // We importeren het User-type om type safety te garanderen
    import type { User } from '$lib/server/db/schema';
    
    let { data } = $props();

    // We gebruiken de $derived rune om een reactieve lijst met gebruikers te maken
    let users: User[] = $derived(data.users);
</script>

<div
    class="..."
>
    <Card footerBase="...">
        ...
        {#snippet article()}
            ...    
            {#each users as user (user.id)}
                <p class="text-sm">
                    {user.username} 
                </p>
            {/each}
        {/snippet}
    </Card>
</div>
```

Laten we nu eens kijken naar de `/`-route en bevestigen dat we de gegevens van de gebruikers in onze database weergeven:


![show-users.png](/tutorial/4-load-and-display-data/img/show-users.png)

Fantastisch\! We weten nu hoe we gegevens uit de database kunnen laden en weergeven in onze SvelteKit-applicatie.

### Een DAO toevoegen

In de vorige sectie hebben we de gegevens direct in het `+page.server.ts` bestand geladen.
Hoewel dit werkt, kan het snel moeilijk worden om de logica voor het laden van gegevens te beheren naarmate onze applicatie groeit.

Om onze code **modulairder** en beter **onderhoudbaar** te maken, kunnen we een [Data Access Object (DAO)](https://en.wikipedia.org/wiki/Data_access_object) maken dat de logica voor het laden van gegevens uit de database **encapsuleert**. Het is een laag die tussen onze database en onze applicatie zit, waardoor we de details van hoe we toegang krijgen tot de gegevens kunnen **abstraheren**.
Dit vereenvoudigt de code in ons `+page.server.ts` bestand tot het simpelweg aanroepen van de DAO-methoden om de gegevens te krijgen die we nodig hebben.

Laten we een nieuw bestand genaamd `DAO.ts` maken in de `src/lib/server/dao` map en de volgende code toevoegen:

```ts
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { MySql2Database } from 'drizzle-orm/mysql2';

export abstract class DAO {
    protected static readonly db: MySql2Database<typeof schema> = db;
}
```

Dit zal een abstracte basisklasse vormen voor onze `DAO` klassen.
Vervolgens maken we een `UserDAO` klasse die deze `DAO` klasse uitbreidt en methoden biedt voor het laden van gebruikers uit de database.

```ts
// /src/lib/server/dao/UserDAO.ts

import { DAO } from "$lib/server/dao/DAO";
import type { User } from "$lib/server/db/schema";
import { users } from "$lib/server/db/schema";

export class UserDAO extends DAO { 
    static async getAllUsers(): Promise<User[]> {
        return DAO.db.select().from(users);
    }
}
```

Laten we nu deze `UserDAO` klasse gebruiken in ons `+page.server.ts` bestand om de gebruikers uit de database te laden:

```ts
// /src/routes/+page.server.ts

import type { PageServerLoad } from "./$types";

import type { User } from "$lib/server/db/schema";
import { UserDAO } from "$lib/server/dao/UserDAO";

export const load: PageServerLoad = async () => {
    const users: User[] = await UserDAO.getAllUsers(); 
    return {
        users
    }
}
```

Kijk, dat ziet er veel schoner uit\! Vooral als we meer, geavanceerdere queries aan onze DAO toevoegen, zal dit ons helpen onze code georganiseerd en onderhoudbaar te houden.

Dit is allemaal mooi en aardig, maar we hoeven niet per se een lijst met gebruikers op onze startpagina te tonen. We weten nu hoe we dat moeten doen, maar voor nu maken we de wijzigingen die we hebben aangebracht in het `+page.svelte` bestand ongedaan en verwijderen we ook het `+page.server.ts` bestand.

Vervolgens zullen we kijken naar het implementeren van een complexere query en de resultaten weergeven in een **component**.

### Query's met de `where` clause: een specifieke gebruiker selecteren

Stel dat we gebruikersgegevens willen weergeven, maar alleen voor een specifieke gebruiker, geïdentificeerd door hun ID.
We *zouden* de `UserDAO`-klasse die we eerder hebben gemaakt kunnen gebruiken om alle gebruikers op te halen en vervolgens de lijst te filteren om de gewenste gebruiker te vinden. Maar dat zou de database onnodig belasten.
We zouden in plaats daarvan gewoon de database kunnen bevragen voor die specifieke gebruiker.

Laten we eens kijken hoe we dat kunnen doen. Laten we een methode toevoegen aan onze `UserDAO`-klasse `findUserById` die een gebruikers-ID als argument neemt en de gebruiker met die ID uit de database retourneert:

```ts
// /src/lib/server/dao/UserDAO.ts

...
import { eq } from 'drizzle-orm';

export class UserDAO extends DAO {
    ...

    static async findUserById(id: number): Promise<User | undefined> {
        return DAO.db.query.users.findFirst({
            where: eq(users.id, id)
        });
    }
}
```

> ℹ️ Merk op dat we deze query ook kunnen schrijven met de `select` methode: `DAO.db.select().from(users).where(eq(users.id, id)).then(rows => rows[0]);`. De `findFirst` methode is slechts een gemakkelijke methode.

Nu maken we een nieuwe route op `/src/routes/dashboard/user/[id]/` (let op de vierkante haken rond `id`, die leggen we zo uit) en maken we een `+page.server.ts` bestand in die map.

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts 

import type { PageServerLoad } from "./$types";

import type { User } from "$lib/server/db/schema";
import { UserDAO } from "$lib/server/dao/UserDAO";

export const load: PageServerLoad = async () => {
    const id = 3;
    const user: User | undefined = await UserDAO.findUserById(id);

    return {
        user
    }
}
```

En het bijbehorende `+page.svelte` bestand:

```svelte
<script lang="ts">
    import type { User } from '$lib/server/db/schema';

    let { data } = $props();
    
    let user: User = $derived(data.user);

</script>

<p>
    User: {user.username}
</p>
```

Als we nu de route [`/dashboard/user/3`](https://www.google.com/search?q=http://localhost:5173/dashboard/user/3) bezoeken, zouden we de gebruikersnaam van de gebruiker met ID 3 op de pagina moeten zien.

Maar als we [`/dashboard/user/4`](https://www.google.com/search?q=http://localhost:5173/dashboard/user/4) bezoeken, zien we nog steeds dezelfde gebruiker, omdat we de ID hebben **hardcoded** in het `+page.server.ts` bestand.
Dit is waar het `[id]` deel van de route om de hoek komt kijken. Het is een [routing](https://svelte.dev/docs/kit/routing) functie van SvelteKit, en het stelt ons in staat om dynamische routes te creëren die parameters kunnen accepteren.

We kunnen de `id` parameter in de `load` functie benaderen door [de `params` parameter](https://www.google.com/search?q=%5Bhttps://svelte.dev/docs/kit/load%23Using-URL-data-params%5D\(https://svelte.dev/docs/kit/load%23Using-URL-data-params\)) door te geven aan de `load` functie.

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts 

...

export const load: PageServerLoad = async ({ params }) => {
    const id: number = parseInt(params.id);
    const user: User | undefined = await UserDAO.findUserById(id);

    return {
        user
    }
}
```

Als we nu [`/dashboard/user/4`](https://www.google.com/search?q=http://localhost:5173/dashboard/user/4) bezoeken, zouden we de gebruikersnaam van de gebruiker met ID 4 op de pagina moeten zien.

Laten we hetzelfde doen voor de `/dashboard/session/[id]` route, die de details van een specifieke sessie zal weergeven. We zullen hier minder diep op ingaan, aangezien de code grotendeels herhalend is van wat we hebben gedaan voor de gebruikersroute.

Eerst maken we de `SessionDAO`:

```ts
// /src/lib/server/dao/SessionDao.ts

import { DAO } from '$lib/server/dao/DAO';
import { type Session, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class SessionDAO extends DAO {
    static async getSessionById (id: number): Promise<Session | undefined> {
        return await DAO.db.query.sessions.findFirst({
            where: eq(sessions.id, id),
        });

    }
}
```

Vervolgens maken we het `+page.server.ts` bestand aan in de `src/routes/dashboard/session/[id]` map:

```ts
// /src/routes/dashboard/session/[id]/+page.server.ts

import type { PageServerLoad } from './$types';

import type { Session } from '$lib/server/db/schema';
import { SessionDAO } from '$lib/server/dao/SessionDAO';

export const load: PageServerLoad = async ({ params }) => {
    const id: number = parseInt(params.id);

    const session: Session | undefined = await SessionDAO.getSessionById(id);

    return {
        session
    };
};
```

En tot slot maken we het bijbehorende `+page.svelte` bestand:

```svelte
<script lang="ts">
    import type { Session } from '$lib/server/db/schema';

    let { data } = $props();

    let session: Session = $derived(data.session);
</script>

<p>
    Session: {session.id}
</p>
```

Nu kunnen we zowel gebruikers- als sessiepagina's in het dashboard bezoeken. We zullen ze later verder uitbouwen om meer informatie weer te geven, maar voor nu kunnen we bevestigen dat we een specifieke gebruiker of sessie kunnen opvragen op basis van ID.

### Query's met joined tables: de top 10 gebruikers selecteren

Nu we weten hoe we een enkele gebruiker op basis van ID kunnen opvragen, gaan we kijken hoe we de top 10 gebruikers kunnen opvragen.

We definiëren de top 10 gebruikers als de gebruikers die de hoogste scores hebben behaald, over alle sessies en niveaus.
Dus, hoewel een van onze gebruikers bijvoorbeeld een score van 100 en 95 heeft in twee verschillende sessies en niveaus, tellen we voor die gebruiker alleen de hoogste score van 100.
Onze volgende beste gebruiker heeft mogelijk een maximale score van 95, enzovoort, totdat we de top 10 gebruikers hebben.
Als twee gebruikers dezelfde maximale score hebben, sorteren we ze niet (hoewel we dat wel zouden kunnen doen, bijvoorbeeld op datum).

Laten we een nieuwe `ScoreDAO` maken die de logica afhandelt voor het opvragen van scores uit de database.

```ts
// /src/lib/server/dao/ScoreDAO.ts

import { DAO } from '$lib/server/dao/DAO';
import {
    users,
    scores,
    sessions,
    type User,
    type Score,
    type Session
} from '$lib/server/db/schema';
import { eq, and, desc, max } from 'drizzle-orm';

export class ScoreDAO extends DAO {
    static async getTopScorers(limit: number): Promise<TopScorer[]> {
        // Vind eerst de maximale score voor elke gebruiker
        const maxScoreSubquery = DAO.db
            // We willen de maximale score voor elke gebruiker vinden,
            // over al hun sessies.
            .select({
                // We willen de userId selecteren die de maximale score behaalde ...
                userId: sessions.userId,
                // ... en het maximum van alle scores voor die gebruiker.
                maxScore: max(scores.score).as('max_score')
            })
            // We beginnen met de sessies (de brug tussen gebruikers en scores) ...
            .from(sessions)
            // ... en joinen met de scores-tabel om de scores voor elke sessie te krijgen ...
            .innerJoin(scores, eq(scores.sessionId, sessions.id))
            // ... dan groeperen op userId om alle scores per gebruiker terug te geven ...
            .groupBy(sessions.userId)
            // ... en tenslotte deze subquery van een alias voorzien zodat ernaar kan worden verwezen.
            .as('max_scores');

        // Zoek vervolgens de score-records die overeenkomen met deze maximums
        return await DAO.db
            // Selecteer zowel gebruikers- als score-informatie ...
            .select({ user: users, score: scores, session: sessions })
            // ... uit de gebruikers-tabel ...
            .from(users)
            // ... gejoined met de subquery van de maximale scores ...
            .innerJoin(maxScoreSubquery, eq(maxScoreSubquery.userId, users.id))
            // ... gejoined met de sessies die overeenkomen met de gebruikers-id ...
            .innerJoin(sessions, eq(sessions.userId, users.id))
            // ... en de score die overeenkomt met zowel de relevante sessionId als de maximale score ...
            .innerJoin(
                scores,
                and(eq(scores.sessionId, sessions.id), eq(scores.score, maxScoreSubquery.maxScore))
            )
            // ... sorteer vervolgens de resultaten op score in aflopende volgorde ...
            .orderBy(desc(scores.score))
            // ... en beperk de resultaten tot de top 10 scorers.
            .limit(limit);
    }
}

// Slaat de relevante gebruikers-, score- en sessiegegevens op voor een topscorer
export interface TopScorer {
    user: User;
    score: Score;
    session: Session;
}
```

Belangrijke punten om hier op te merken zijn:

  - We voeren eerst een **subquery** uit om de maximale score voor elke gebruiker te vinden, over al hun sessies.
  - We **joinen** deze **subquery** vervolgens met de **users**, **sessions** en **scores** tabellen om de relevante gegevens voor elke topscorer te verkrijgen.
  - We gebruiken de `max` functie van Drizzle ORM om de maximale score voor elke gebruiker te vinden (die de SQL `MAX` functie uitvoert).
      - Als we dat niet zouden doen, zouden we slechts één van de scores per gebruiker krijgen, wat niet de maximale score hoeft te zijn.
      - **Inner joins** zoals deze kunnen een beetje onintuïtief zijn:
          - Een query retourneert slechts één waarde per rij per kolom.
          - In de **subquery** hebben we meerdere scores per sessie
          - Wanneer we de scores **inner joinen** met de sessies tabel en vervolgens groeperen op `userId`, krijgen we slechts één scorewaarde per rij, willekeurig gekozen op positie in de database.
			  ![query-explanation-1.png](/tutorial/4-load-and-display-data/img/query-explanation-1.png)
          - Maar de `MAX` functie zorgt ervoor dat de waarde het maximum is van alle mogelijke waarden die in die rij zouden kunnen passen:
			  ![query-explanation-2.png](/tutorial/4-load-and-display-data/img/query-explanation-2.png)
      - We kunnen zien dat de andere kolommen (bijv. sessie-ID) niet veranderen, maar dat is oké, want we zijn in deze **subquery** alleen op zoek naar de gebruikers-ID en de MAX-score.
      - We zullen de corresponderende score, gebruiker en sessie vinden in de volgende query.
  - We gebruiken de `as` methode om de maximale score kolom een alias te geven, zodat we ernaar kunnen verwijzen later in de query.
      - We hebben deze alias eigenlijk niet nodig voor de Drizzle-syntaxis, maar als we deze niet toevoegen, kan Drizzle de relevante SQL niet maken, aangezien we **subqueries** een alias moeten geven.
  - We gebruiken de `and` functie van Drizzle ORM om meerdere voorwaarden te combineren in de `innerJoin` methode.
  - We gebruiken de `desc` functie van Drizzle ORM om de resultaten te sorteren op score in aflopende volgorde.
  - We beperken de resultaten tot de top 10 **scorers** met behulp van de `limit` methode.
  - We maken een interface `TopScorer` om de relevante gegevens voor elke top scorer op te slaan, inclusief de gebruiker die de score heeft behaald, het score record zelf en de sessie waarin de score is behaald.
      - We mappen de `users`, `scores` en `sessions` tabellen naar dit type in de `select` methode. (bijv. als we `users` (geïmporteerd uit ons schema) selecteren, selecteren we alle kolommen uit de `users` tabel, en de geretourneerde gegevens worden opgeslagen in een object met de `users` sleutel. Hier hernoemen we die sleutel naar `user` voor de duidelijkheid, aangezien de geretourneerde gegevens betrekking hebben op een enkele gebruiker, niet op een lijst met gebruikers.)

Laten we nu deze `ScoreDAO` gebruiken in ons `+page.server.ts` bestand om de topscorers uit de database te laden.
We zullen de topscorers weergeven in het dashboardoverzicht, dus op `/dashboard`.

Inmiddels zouden we moeten weten dat we een nieuw `+page.server.ts` bestand moeten maken in de `src/routes/dashboard` map en de volgende code moeten toevoegen:

```ts
// /src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';

import { ScoreDAO, type TopScorer } from '$lib/server/dao/ScoreDAO';

export const load: PageServerLoad = async () => {
    const limit: number = 10;

    return {
        topScorers
    };
};
```

```
const topScorers: TopScorer[] = await ScoreDAO.getTopScorers(limit);
```

Tot slot maken we een rudimentaire UI om de topscorers weer te geven in het `/routes/dashboard/+page.svelte` bestand.

```svelte
<script lang="ts">
    import type { TopScorer } from '$lib/server/dao/ScoreDAO';
    
    let { data } = $props();

    let topScorers: TopScorer[] = $derived(data.topScorers);
</script>

<h2 class="text-xl font-bold">Dashboard home.</h2>

{#each topScorers as scorer (scorer.user.id)}
    <div class="flex items-center">
        <span class="text-lg">Username: {scorer.user.username}</span>
        <span class="text-lg">Score: {scorer.score.score}</span>
        <span class="text-lg">In session: {scorer.session.id}</span>
    </div>
{/each}
```

![top-scorers.png](/tutorial/4-load-and-display-data/img/top-scorers.png)

Fantastisch\! Dat was een vrij geavanceerde query, maar we kunnen zien dat Drizzle het vrij eenvoudig maakt om aan complexe query's zoals deze te werken.

> ℹ️ Als je wilt, kun je rondneuzen in phpMyAdmin om te bevestigen dat deze topscorers inderdaad de topscorers in je database zijn.

### Responsieve gegevenslading

Voor onze `/dashboard/user` pagina en de `/dashboard/session` pagina willen we dat gebruikers kunnen zoeken naar een specifieke gebruiker (op gebruikersnaam) of sessie (op gebruikersnaam of sessie-ID).

We *zouden* een formulier kunnen maken waarin gebruikers hun query kunnen invoeren, en dat formulier vervolgens naar de server kunnen sturen om de gegevens te laden.
Hoewel dit werkt, is het niet zo responsief als het kan zijn: Laten we proberen de resultaten te tonen *terwijl de gebruiker zijn query typt*, zonder het formulier te hoeven verzenden en te wachten tot een nieuwe pagina geladen is.

Om dit te doen, combineren we [data](https://svelte.dev/docs/kit/load#Using-URL-data) en het [data-sveltekit-keepfocus attribuut](https://svelte.dev/docs/kit/link-options#data-sveltekit-keepfocus).
Hoe het werkt, is dat we een formulier maken met een invoerveld. Terwijl de gebruiker typt in het invoerveld, werken we de URL bij met de query die ze hebben ingevoerd.
De `load` functie wordt dan automatisch uitgevoerd en retourneert de gegevens uit de database op basis van de query in de URL.
Het `data-sveltekit-keepfocus` attribuut zorgt ervoor dat het invoerveld gefocust blijft, zodat de gebruiker kan blijven typen terwijl de database wordt bevraagd.
Dit zal het doen aanvoelen als een **responsive search**, aangezien de gebruiker de resultaten in real-time zal zien bijwerken terwijl hij typt.

Eerst breiden we de `UserDAO`-klasse uit met een methode die gebruikers op hun gebruikersnaam vindt, waarbij we de `like`-operator gebruiken om **partial matches** toe te staan:

```ts
// /src/lib/server/dao/UserDAO.ts
...
import { like } from 'drizzle-orm';

export class UserDAO extends DAO {
    ...

    static async findUsersLikeUsername(username: string): Promise<User[]> {
        return DAO.db.query.users.findMany({
            where: like(users.username, `%${username}%`)
        });
    }
}
```

Nu maken we een nieuw bestand aan op `/src/routes/dashboard/user/+page.server.ts` om het laden te regelen op basis van de gebruikersnaam query:

```ts
// /src/routes/dashboard/user/+page.server.ts

import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/dao/UserDAO';

export const load: PageServerLoad = async ({ url }) => {
    // Hier halen we de username query parameter uit de URL 
    const username = url.searchParams.get('username');
    let users: User[] = [];
    if (username) {
        users = await UserDAO.findUsersLikeUsername(username);
    }
    return { users };
};
```

Vervolgens werken we het `/src/routes/dashboard/user/+page.svelte` bestand bij om een formulier met een invoerveld voor de gebruikersnaamquery op te nemen.

```svelte
<script lang="ts">
    import Card from '$lib/ui/views/Card.svelte';
    import type { User } from '$lib/server/db/schema';

    let { data } = $props();
    let userResults: User[] | undefined = $derived(data.users);

    function searchForUsersByName(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        event.currentTarget.form?.requestSubmit();
    }
</script>

<div
    class="mx-auto my-24 grid grid-cols-1 items-center gap-4 sm:my-48 lg:my-auto lg:grid-cols-[auto_1fr] lg:gap-8"
>
    <Card baseExtension="lg:min-w-md">
        {#snippet header()}
            <h1>Find a user</h1>
        {/snippet}
        {#snippet article()}
            <form data-sveltekit-keepfocus>
                <label for="username">Name: </label>
                <input class="input" type="text" name="username" oninput={searchForUsersByName} />
            </form>
        {/snippet}
    </Card>
    {#if userResults && userResults.length > 0}
        <Card baseExtension="lg:min-w-md">
            {#snippet header()}
                <h1>Found users</h1>
            {/snippet}
            {#snippet article()}
                <div class="flex max-h-64 flex-col overflow-y-scroll">
                    {#each userResults as user (user.id)}
                        <a href="/dashboard/user/{user.id}">{user.username}</a>
                    {/each}
                </div>
            {/snippet}
        </Card>
    {:else}
        <div class="flex flex-col items-center justify-center lg:min-w-md">
            <p>Try searching for a user by name.</p>
        </div>
    {/if}
</div>

```

Belangrijke punten om hier op te merken:

  - We maken een formulier met een invoerveld voor de gebruikersnaamquery.
  - We gebruiken het `data-sveltekit-keepfocus` attribuut op het formulier om ervoor te zorgen dat het invoerveld gefocust blijft wanneer het formulier wordt verzonden.
  - We gebruiken de `oninput` gebeurtenis op het invoerveld om de `searchForUsersByName` functie aan te roepen, die het formulier verzendt wanneer de gebruiker in het invoerveld typt.
  - We tonen de lijst met gebruikers die zijn afgeleid van de `data` **prop**, die wordt gevuld door de `load` functie in het `+page.server.ts` bestand.
  - Als er geen gebruikers zijn gevonden, tonen we een bericht dat de gebruiker vraagt om naar een gebruiker op naam te zoeken in plaats van de (lege) lijst met gebruikers.
  - We maken de gebruikersnamen in de lijst klikbaar, zodat de gebruiker naar de detailpagina van de gebruiker kan navigeren (`/dashboard/user/[id]`).

Nu zouden we de relevante gebruikers moeten zien verschijnen terwijl we typen:

![responsive-user-search.gif](/tutorial/4-load-and-display-data/img/responsive-user-search.gif)

Laten we hetzelfde doen voor de sessies, zodat we kunnen zoeken naar sessies op basis van het sessie-ID of de gebruikersnaam van de gebruiker die de sessie heeft gemaakt.

> ℹ️ Merk op dat dit meer belasting op de database legt, aangezien de database elke keer wordt bevraagd als de gebruiker het invoerveld wijzigt. Deze gebruiksvriendelijkheid heeft dus een prijs. In een echte, schaalbare applicatie zou je waarschijnlijk een vorm van **debouncing** willen implementeren (zodat de database niet bij elke toetsaanslag wordt bevraagd, maar na een korte vertraging (bijv. 300ms) nadat de gebruiker stopt met typen), **caching** (zodat de database niet meerdere keren voor dezelfde invoer wordt bevraagd), of **pre-fetching** van alle gebruikers (zodat de database slechts één keer wordt bevraagd en de resultaten worden **gecached** voor volgende query's).
> We zullen de `SessionDAO`-klasse uitbreiden en een methode toevoegen om sessies te vinden op basis van het sessie-ID of de gebruikersnaam van de gebruiker die de sessie heeft gemaakt, net zoals we deden voor de gebruikers.

```ts
// /src/lib/server/dao/SessionDao.ts

...
import { type Session, type User, sessions, users } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export class SessionDAO extends DAO {
    ... 

    static async getSessionsLikeId(id: number): Promise<SessionWithUser[]> {
        const result = await DAO.db
            .select({ session: sessions, user: users })
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(like(sessions.id, `${id}%`));
        return result.map((row) => ({
            ...row.session,
            user: row.user
        }));
    }

    static async getSessionsLikeUserName(name: string): Promise<SessionWithUser[]> {
        const result = await DAO.db
            .select({
                session: sessions,
                user: users
            })
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(like(users.username, `%${name}%`));
        return result.map((row) => ({
            ...row.session,
            user: row.user
        }));
    }
}

export type SessionWithUser = Session & {
    user: User;
};
```
En opnieuw, net zoals we deden voor de gebruikers, maken we een nieuw `+page.server.ts` bestand aan in de map `src/routes/dashboard/session`, en maken we een `+page.svelte` bestand met een zoekformulier waarmee gebruikers sessies kunnen zoeken op ID of gebruikersnaam.
We tonen de resultaten in een rudimentaire lijst met klikbare links en gebruiken het `data-sveltekit-keepfocus` attribuut om het invoerveld gefocust te houden terwijl de gebruiker typt.
We gaan hier niet te veel in detail treden, aangezien de code erg vergelijkbaar is met wat we deden voor de gebruikers: Het enige echt 'nieuwe' hier is dat we nu het andere invoerveld wissen wanneer de gebruiker in een van de invoervelden typt, zodat we onderscheid kunnen maken tussen zoeken op ID of gebruikersnaam.

```ts
// /src/routes/dashboard/session/+page.server.ts

import type { PageServerLoad } from './$types';
import { SessionDAO, type SessionWithUser } from '$lib/server/dao/SessionDAO';

export const load: PageServerLoad = async ({ url }) => {
    let sessions: SessionWithUser[] = [];

    // Zoeken op gebruikersnaam of op ID
    const userNameParam = url.searchParams.get('username');
    if (userNameParam) {
        sessions = await SessionDAO.getSessionsLikeUserName(userNameParam);
        return { sessions };
    }

    const idParam = url.searchParams.get('id');
    const id = idParam ? parseInt(idParam) : null;
    if (id) {
        sessions = await SessionDAO.getSessionsLikeId(id);
    }
    return { sessions };
};
```

```svelte
<script lang="ts">
    import Card from '$lib/ui/views/Card.svelte';
    import { type SessionWithUser } from '$lib/server/dao/SessionDAO';

    let { data } = $props();
    let sessionResults: SessionWithUser[] | undefined = $derived(data.sessions);

    let idInput: HTMLInputElement, usernameInput: HTMLInputElement;

    function searchForSessionsById(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        usernameInput.value = '';
        event.currentTarget.form?.requestSubmit();
    }

    function searchForSessionsByUsername(
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ) {
        idInput.value = '';
        event.currentTarget.form?.requestSubmit();
    }
</script>

<div class="lg: m-auto grid grid-cols-1 items-center gap-4 lg:grid-cols-[auto_1fr] lg:gap-8">
    <Card baseExtension="lg:min-w-md">
        {#snippet header()}
            <h1>Find a session</h1>
        {/snippet}
        {#snippet article()}
            <form data-sveltekit-keepfocus>
                <label for="id">Session ID: </label>
                <input
                    class="input"
                    type="text"
                    name="id"
                    oninput={searchForSessionsById}
                    bind:this={idInput}
                />
                <label for="id">Username: </label>
                <input
                    class="input"
                    type="text"
                    name="username"
                    oninput={searchForSessionsByUsername}
                    bind:this={usernameInput}
                />
            </form>
        {/snippet}
    </Card>
    {#if sessionResults && sessionResults.length > 0}
        <Card baseExtension="lg:min-w-md">
            {#snippet header()}
                <h1>Found Sessions</h1>
            {/snippet}
            {#snippet article()}
                <div class="max-h-64 overflow-y-scroll">
                    {#each sessionResults as result (result.id)}
                        <div class="flex flex-col gap-2">
                            <a href='/dashboard/session/{result.id}'>
                                <span>Session {result.id} by {result.user.username}</span>
                            </a>    
                        </div>
                    {/each}
                </div>
            {/snippet}
        </Card>
    {:else}
        <div class="flex flex-col items-center justify-center lg:min-w-md">
            <p>Try searching for a session by id or username.</p>
        </div>
    {/if}
</div>
```

Nu kunnen we sessies zoeken op ID of gebruikersnaam, en de resultaten worden weergegeven in een lijst met klikbare links die leiden naar de detailpagina van de sessie:

![responsive-session-search.gif](/tutorial/4-load-and-display-data/img/responsive-session-search.gif)

## Foutafhandeling

De oplettende lezer heeft misschien al opgemerkt dat we nog geen foutgevallen afhandelen, zoals wanneer de gebruiker met de opgegeven ID niet in de database bestaat.
Laten we wat **error handling** toevoegen aan onze `load` functie om dit geval af te handelen.

We kunnen hiervoor Svelte's [error function](https://svelte.dev/docs/kit/errors) gebruiken, en een aangepast [`+error.svelte` bestand](https://www.google.com/search?q=%5Bhttps://svelte.dev/docs/kit/routing%23error%5D\(https://svelte.dev/docs/kit/routing%23error\)) definiëren (nog een SvelteKit **routing feature**) om het foutbericht weer te geven.

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts 

...
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const id: number = parseInt(params.id);

    const user: User | undefined = await UserDAO.findUserById(id);

    if (!user) {
        // Dit logt de fout naar onze console, zodat we ervan op de hoogte zijn. 
        console.error(`User with ID ${id} not found. Showing 404.`);
        // Dit zal een 404 error veroorzaken, die wordt opgevangen door het +error.svelte bestand.
        throw error(404, `User with ID ${id} not found`);
    }

    return {
        user
    }
}
```

```svelte
<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="text-center p-8">
<h1 class="text-3xl font-bold">Error {page.status}</h1>
    <p>{page.error.message}</p>
</div>
```

Opmerkelijk is dat het `+error.svelte` bestand **layouts** overneemt, afhankelijk van waar het is geplaatst.
Als we bijvoorbeeld een `+error.svelte` bestand plaatsen in `src/routes`, wordt het gebruikt om alle fouten weer te geven, met behulp van de **layout** uit het `src/routes/+layout.svelte` bestand.
Als we vervolgens nog een `+error.svelte` bestand toevoegen in `src/routes/dashboard`, wordt dat bestand gebruikt om alle fouten in de `/dashboard` route (en de **subroutes**) weer te geven.
Om de zijbalknavigatie in de `dashboard` routes niet te verliezen, extraheren we een `Error` **component** en gebruiken we deze in zowel `src/routes/+error.svelte` als `src/routes/dashboard/+error.svelte`.

```svelte
<script lang="ts">
    let { status, message }: { status: number, message: string } = $props();
</script>

<div class="text-center p-8">
    <h1 class="text-3xl font-bold">Error {status}</h1>
    <p>{message}</p>
</div>
```

```svelte
<script>
    import { page } from '$app/state';
    import Error from '$lib/ui/views/Error.svelte';
</script>

{#if page.error}
    <Error status={page.status} message={page.error.message}/>
{/if}
```

Laten we vergelijkbare **error handling** toevoegen aan de `/dashboard/session/[id]` route, zodat als een sessie met de gegeven ID niet bestaat, we een 404-foutpagina tonen.

```ts
// /src/routes/dashboard/session/[id]/+page.server.ts 

import type { PageServerLoad } from "./$types";

import type { Session} from "$lib/server/db/schema";
import { SessionDAO } from "$lib/server/dao/SessionDAO";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const id: number = parseInt(params.id);

    const session: Session | undefined = await SessionDAO.getSessionById(id);

    if (!session) {
        console.error(`Session with ID ${id} not found. Showing 404.`);
        throw error(404, `Session with ID ${id} not found`);
    }

    return {
        session
    }
}
```

Oké, we zijn nu klaar om fouten af te handelen. Laten we eens kijken hoe we er tot nu toe voor staan.

Het opvragen van een bestaande gebruiker toont de gebruikersnaam:

![showing-user.png](/tutorial/4-load-and-display-data/img/showing-user.png)

En het opvragen van een niet-bestaande gebruiker leidt ons naar een foutpagina:

![error-dashboard.png](/tutorial/4-load-and-display-data/img/error-dashboard.png)

En – hoewel misschien iets minder relevant voor wat we doen – het bezoeken van elke andere niet-bestaande route leidt ons ook naar een foutpagina, maar deze keer zonder de **layout** van het dashboard te delen:

![error-root.png](/tutorial/4-load-and-display-data/img/error-root.png)

## Gegevens visualiseren

Oké, we hebben gegevens in onze pagina's geladen en we handelen fouten af wanneer we ze tegenkomen.
De manier waarop we gegevens weergeven is echter nogal **rudimentair** op dit moment. We willen enkele **componenten** maken die onze gegevens op een zinvollere manier visualiseren.

### Tabellen

De meeste van onze gegevens zouden we in mooie tabellen moeten kunnen weergeven. Laten we daarmee beginnen.

[Skeleton.dev bevat al een aantal nette Table componenten](https://www.skeleton.dev/docs/tailwind/tables). We zullen onze aangepaste componenten hierop baseren en er extra functionaliteit aan toevoegen.

Laten we beginnen met een eenvoudig `Table` voorbeeld uit de documentatie van Skeleton.Dev:

```svelte
<script>
    const tableData = [
      { position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
      { position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
      { position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
      { position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
      { position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' }
    ];
</script>

<div class="table-wrap">
  <table class="table caption-bottom">
    <tbody class="[&>tr]:hover:preset-tonal-primary">
      {
        tableData.map((row) => (
          <tr>
            <td>{row.position}</td>
            <td>{row.symbol}</td>
            <td>{row.name}</td>
            <td class="text-right">{row.atomic_no}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
</div>
```

Zoals bij elke Table, hebben we een `table` element dat een `tbody` element bevat met een lijst van `tr` (table row) elementen, elk met een lijst van `td` (table data) elementen. We kunnen optioneel een `thead` of `tfoot` toevoegen voor respectievelijk een tabelheader of -footer.

Het bovenstaande voorbeeld gebruikt de `map` functie om over de gegevens in de `tableData` **array** te itereren, en de relevante gegevens te renderen.

Dit ziet er redelijk uit - maar we kunnen het beter doen, om de Table iets flexibeler te maken. In het bovenstaande voorbeeld bevatten de `td` velden allemaal **hard-coded** verwijzingen naar de relevante gegevensvelden. We gaan het zo maken dat we elk type gegevens aan onze Table **component** kunnen doorgeven, zodat we niet hoeven te rommelen met het aanpassen van de Table code zelf.

Om dit te doen, exporteren we twee nieuwe **interfaces** in onze `Table` **component**:

```ts
export interface TableData {
    caption?: string;
    columns: string[];
    rows: TableRow[];
}

export interface TableRow {
    values: (string | number | null)[];
    url?: string;
}
```

De **interface** `TableData` vertegenwoordigt de gegevens die we in de **Table** willen weergeven, en bevat een optionele `caption` voor de **Table**, een lijst met `columns` (de kolomheaders), en een lijst met `rows` (de daadwerkelijke gegevensrijen).
De **interface** `TableRow` vertegenwoordigt één enkele rij in de **Table**, en bevat een lijst met `values` (de daadwerkelijke gegevenswaarden voor die rij), en een optionele `url` om naar een specifieke pagina te linken wanneer op de rij wordt geklikt.

Laten we vervolgens een nieuwe `Table.svelte` **component** maken die deze **interfaces** gebruikt om de **Table** te renderen:

```svelte
<script lang="ts">
    import { goto } from '$app/navigation';

    export interface TableData {
        caption?: string;
        columns: string[];
        rows: TableRow[];
    }

    export interface TableRow {
        values: (string | number | null)[];
        url?: string;
    }

    let { table }: { table: TableData } = $props();
</script>

<section class="space-y-4">
    <div class="table-wrap">
        <table class="table caption-bottom">
            {#if table.caption}
                <caption style="white-space: pre-line">{table.caption}</caption>
            {/if}
            <thead>
                <tr>
                    {#each table.columns as header, index (index)}
                        <th>{header}</th>
                    {/each}
                </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
                {#each table.rows as row, index (index)}
                    <tr
                        onclick={() => (row.url ? goto(row.url) : null)}
                        class={row.url ? 'cursor-pointer' : ''}
                    >
                        {#each row.values as value, i (i)}
                            <td>{value}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</section>
```

Belangrijke punten om hier op te letten:

  * We gebruiken de **interfaces** `TableData` en `TableRow` om de gegevensstructuur voor de **Table** te definiëren.
  * We **exposen** de `table` **prop**, die van het type `TableData` is, zodat we de **Table**-gegevens aan de **component** kunnen doorgeven.
  * We gebruiken een **each block** om zowel de `columns` als de `rows` **arrays** te doorlopen om de **Table headers** en gegevensrijen te renderen.
  * We gebruiken de `goto` functie van `$app/navigation` om naar een specifieke pagina te navigeren wanneer op een rij wordt geklikt, indien de `url` eigenschap op de rij is ingesteld.
  * We voegen een `cursor-pointer` **class** toe aan de rij als deze een `url` heeft, zodat de gebruiker weet dat hij op de rij kan klikken om naar een andere pagina te navigeren.

Vervolgens zullen we zien hoe we deze `Table` **component** kunnen gebruiken in onze **dashboard**-pagina's.

-----

### Gebruikers- en sessiezoekresultaten in tabellen weergeven

Laten we eerst kijken hoe we het kunnen gebruiken om de gevonden gebruikers weer te geven in het bestand `/dashboard/user/+page.svelte`.

```svelte
<script lang="ts">
    ...
    import Table from '$lib/ui/views/Table.svelte';

    ...    

    let table = $derived({
        columns: ['Username', 'Created At'],
        rows: userResults?.map((user) => ({
            values: [user.username, user.createdAt.toLocaleDateString()],
            url: `/dashboard/user/${user.id}`
        }))
    });
</script>

<div class="...">
    ...
    {#if userResults && userResults.length > 0}
        <Card baseExtension="...">
            ...    
            {#snippet article()}
                <div class="flex max-h-64 flex-col overflow-y-scroll">
                    <Table {table} />
                </div>
            {/snippet}
        </Card>
    {:else}
        ...
    {/if}
</div>
```

Belangrijke punten om hier op te letten:

  * We importeren de `Table` **component** en gebruiken deze om de **Table** met de gevonden gebruikers te renderen.
  * We maken een `table` **object** dat:
      * De `columns` voor de **Table** bevat, wat een **array** van **strings** is die de kolomheaders bevat.
      * De `rows` voor de tabel bevat, wat een **array** van `TableRow` **objecten** is.
          * Elk `TableRow` **object** bevat een `values` **array** met waarden voor elke kolom in de rij, en een optionele `url` om naar te navigeren wanneer op de rij wordt geklikt.
      * We kunnen hier elke aanvullende gegevensopmaak/-transformatie uitvoeren, zoals **string interpolation**, datumopmaak, enzovoort.

Dit zal de gevonden gebruikers op een veel representatievere manier weergeven:

![found-users-table.gif](/tutorial/4-load-and-display-data/img/found-users-table.gif)

Op vergelijkbare wijze kunnen we de **Table** implementeren in ons `/dashboard/session/+page.svelte` bestand om de gevonden sessies weer te geven:
(We tonen hier niet de volledige paginacode, aangezien je dit nu zelf zou moeten kunnen implementeren - de code is zeer vergelijkbaar met de gebruikerspagina.)

```ts
let table = $derived({
    columns: ['ID', 'Username'],
    rows: sessionResults?.map((session) => {
    return {
        values: [session.id, session.user.username],
        url: `/dashboard/session/${session.id}`
    };
    })
});
```

-----

#### Gebruikerssessies weergeven met een gemiddelde scoretabel

Op onze `/src/routes/dashboard/user/[id]` **route** willen we niet alleen gegevens over de gebruiker zelf (`userProfile`) tonen, maar ook alle sessies die die gebruiker heeft gespeeld, met een veld dat hun gemiddelde score per sessie toont.

Eerst moeten we de relevante **query** schrijven in onze `SessionDAO` en de gegevens laden in het `+page.server.ts` bestand:

```ts
// /src/lib/server/dao/SessionDao.ts
...
import { type Session, type User, scores, sessions, users } from '$lib/server/db/schema';
import { avg, eq, like } from 'drizzle-orm';

export class SessionDAO extends DAO {
    ...    

    static async findSessionsByUserId(userId: number): Promise<SessionWithAverageScore[]> {
        const result = await DAO.db
            .select({
                session: sessions,
                averageScore: avg(scores.score).mapWith(Number)
            })
            .from(sessions)
            .innerJoin(scores, eq(sessions.id, scores.sessionId))
            .where(eq(sessions.userId, userId))
            .groupBy(sessions.id);

        return result.map((row) => ({
            ...row.session,
            averageScore: row.averageScore
        }));
    }
}

...

export type SessionWithAverageScore = Session & {
    averageScore: number;
};
```

Belangrijke punten om hier op te letten:

  * We gebruiken de `avg` functie van **Drizzle ORM** om de gemiddelde score voor elke sessie te berekenen.
  * We gebruiken de `mapWith(Number)` methode om ervoor te zorgen dat de gemiddelde score als een getal wordt geretourneerd, aangezien deze standaard als een **string** wordt geretourneerd.
  * We gebruiken de `groupBy` methode om de resultaten per sessie-ID te groeperen, zodat we één rij per sessie krijgen met de gemiddelde score.
  * We exporteren een nieuw type `SessionWithAverageScore` dat het `Session` type uitbreidt en een `averageScore` veld toevoegt.

Nu we toch bezig zijn, laten we ook een methode toevoegen aan de `UserDAO` om de profielinformatie van een gebruiker op basis van hun ID te vinden, zodat we de profielinformatie van de gebruiker op de detailpagina van de gebruiker kunnen laden:

```ts
...
import type { User, UserProfile } from '$lib/server/db/schema';
import { userProfiles, users } from '$lib/server/db/schema';

export class UserDAO extends DAO {
    ...

    static async findUserWithProfileById(id: number): Promise<UserWithProfile | undefined> {
        const result = await DAO.db
            .select({
                users,
                userProfiles
            })
            .from(users)
            .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
            .where(eq(users.id, id));

        if (result.length !== 1) {
            return undefined;
        }

        return {
            ...result[0].users,
            profile: result[0].userProfiles
        };
    }
}

export type UserWithProfile = User & {
    profile: UserProfile;
};
```

Belangrijke punten om hier op te letten:

  * We gebruiken de `innerJoin` methode om de `users` en `userProfiles` tabellen te **joinen**, zodat we de profielinformatie van de gebruiker kunnen ophalen.
  * We voeren een **sanity check** uit om ervoor te zorgen dat we slechts één gebruiker met hun profielinformatie retourneren (onze databasebeperkingen zouden dit moeten afdwingen, maar het is goede praktijk om te controleren).
  * We exporteren een nieuw type `UserWithProfile` dat het `User` type uitbreidt en een `profile` veld toevoegt dat de profielinformatie van de gebruiker bevat.

Vervolgens kunnen we deze gegevens laden in ons `+page.server.ts` bestand voor de detailpagina van de gebruiker:

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts

import type { PageServerLoad } from './$types';

import { UserDAO, type UserWithProfile } from '$lib/server/dao/UserDAO';
import { error } from '@sveltejs/kit';
import { SessionDAO, type SessionWithAverageScore } from '$lib/server/dao/SessionDAO';

export const load: PageServerLoad = async ({ params }) => {
    const id: number = parseInt(params.id);

    const user: UserWithProfile | undefined = await UserDAO.findUserWithProfileById(id);
    const sessionsByUser: SessionWithAverageScore[] = await SessionDAO.findSessionsByUserId(id);
    

    if (!user) {
        console.error(`User with ID ${id} not found. Showing 404.`);
        throw error(404, `User with ID ${id} not found`);
    }

    return {
        user,
        sessionsByUser
    };
};
```

En tot slot kunnen we deze gegevens weergeven in ons `+page.svelte` bestand voor de detailpagina van de gebruiker.

```svelte
<script lang="ts">
    import type { UserWithProfile } from '$lib/server/dao/UserDAO';
    import type { SessionWithAverageScore } from '$lib/server/dao/SessionDAO';
    import type { TableData } from '$lib/ui/views/Table.svelte';
    import Card from '$lib/ui/views/Card.svelte';
    import Table from '$lib/ui/views/Table.svelte';

    let { data } = $props();

    let user: UserWithProfile = $derived(data.user);

    const table: TableData = $derived({
        caption: 'Scores in this session.',
        columns: ['ID', 'Duration', 'Created At', 'Ended At', 'Average Score'],
        rows: data.sessionsByUser.map((session: SessionWithAverageScore) => ({
            values: [
                session.id,
                session.duration,
                session.createdAt.toLocaleString(),
                getSessionEnd(session.createdAt, session.duration).toLocaleString(),
                session.averageScore
            ],
            url: `/dashboard/session/${session.id}`
        }))
    });

    function getSessionEnd(createdAt: Date, duration: number): Date {
        return new Date(createdAt.getTime() + duration * 1000);
    }

    function getCurrentAge(dateOfBirth: Date): number {
        const now = new Date();
        let age = now.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = now.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }

    const userAge = $derived(getCurrentAge(user.dateOfBirth));

</script>

<div class="m-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
    <Card>
        {#snippet header()}
            <h1>User Profile</h1>
        {/snippet}
        {#snippet article()}
            <div class="grid grid-cols-2 justify-between">
                <span>Username:</span>
                <span>{user.username}</span>
                <span>First Name:</span>
                <span>{user.profile.firstName}</span>
                <span>Last Name:</span>
                <span>{user.profile.lastName}</span>
                <span>Age:</span>
                <span>{userAge}</span>
                <span>User Since:</span>
                <span>{user.createdAt.toLocaleDateString()}</span>
            </div>
        {/snippet}
    </Card>

    <Card>
        {#snippet header()}
            <h1>Sessions</h1>
        {/snippet}
        {#snippet article()}
            <Table {table} />
        {/snippet}
    </Card>
</div>
```

Belangrijke punten om hier op te letten:

  * We importeren de `UserWithProfile` en `SessionWithAverageScore` **types** om de gegevens die we ontvangen van de `load` functie te **typen**.
  * We maken een `TableData` **object** dat de gegevens voor de **Table** bevat, inclusief de **caption**, **columns** en **rows**.
      * We gebruiken de `getSessionEnd` functie om de eindtijd van de sessie te berekenen op basis van de starttijd en duur.
      * We maken de rijen klikbaar door een `url` voor elke rij op te geven, die navigeert naar de sessiedetailpagina wanneer erop wordt geklikt.
  * We voegen een **User Profile card** toe die de profielinformatie van de gebruiker weergeeft.
      * We gebruiken de `getCurrentAge` functie om de leeftijd van de gebruiker te berekenen op basis van hun geboortedatum.
  * We geven de sessies van de gebruiker weer in een **Table**, met behulp van de eerder gemaakte `Table` **component**.

We zouden nu een nette **User Profile** sectie en een **table** moeten zien die een overzicht geeft van hun sessies, samen met de gemiddelde score per sessie:

![user-details.png](/tutorial/4-load-and-display-data/img/user-details.png)

#### Scores per sessie weergeven in een tabel

Laten we wat informatie over een sessie en de behaalde scores in die sessie weergeven.
Onze workflow zal vergelijkbaar zijn met de vorige sectie, maar in plaats van informatie over de sessies van een gebruiker weer te geven, tonen we informatie over een enkele sessie en de behaalde scores in die sessie.

Eerst breiden we onze `SessionDAO` uit met een methode die een sessie ophaalt, samen met wat informatie over de gebruiker die deze heeft gemaakt (eerder haalden we alleen de sessie zelf op).

```ts
// /src/lib/server/dao/SessionDao.ts
export class SessionDAO extends DAO {
    ...

    static async getSessionByIdWithUser(id: number): Promise<SessionWithUser | undefined> {
        const result = await DAO.db.select({
            session: sessions,
            user: users
        })
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.id, id))
            .limit(1)
            .then((rows) => rows[0]);
        return result ? { ...result.session, user: result.user } : undefined;
    }
}
```

Vervolgens breiden we de `ScoreDAO` uit met een methode die alle scores voor een gegeven sessie ophaalt:

```ts
// /src/lib/server/dao/ScoreDAO.ts
export class ScoreDAO extends DAO {
    ...

    static async findScoresForSession(sessionId: number): Promise<Score[]> {
        return await DAO.db.query.scores.findMany({
            where: eq(scores.sessionId, sessionId)
        });
    }
}
```

Deze gegevens laden we vervolgens in ons `+page.server.ts` bestand voor de detailpagina van de sessie:

```ts
// /src/routes/dashboard/session/[id]/+page.server.ts 

...

import type { Score } from "$lib/server/db/schema";
import { SessionDAO, type SessionWithUser } from "$lib/server/dao/SessionDAO";
import { ScoreDAO } from "$lib/server/dao/ScoreDAO";

export const load: PageServerLoad = async ({ params }) => {
    ...

    const session: SessionWithUser | undefined = await SessionDAO.getSessionByIdWithUser(id);
    const scores: Score[] = await ScoreDAO.findScoresForSession(id);

    ...    

    return {
        session,
        scoresInSession: scores,
    }
}
```

En tot slot tonen we deze gegevens in ons `+page.svelte` bestand voor de detailpagina van de sessie:

```svelte
<script lang="ts">
    import type { TableData } from '$lib/ui/views/Table.svelte';
    import Card from '$lib/ui/views/Card.svelte';
    import Table from '$lib/ui/views/Table.svelte';
    import type { Score } from '$lib/server/db/schema';
    import type { SessionWithUser } from '$lib/server/dao/SessionDAO.js';
    
    let { data } = $props();

    const session: SessionWithUser = $derived(data.session);
    const user = $derived(session.user);

    const table: TableData = $derived({
        caption: 'A list of scores in this session.',
        columns: ['Level ID', 'Score', 'Accuracy', 'Time Taken', 'Created At'],
        rows: data.scoresInSession.map((score: Score) => ({
            values: [
                score.levelId,
                score.score,
                score.accuracy,
                score.timeTaken,
                score.createdAt.toLocaleString()
            ]
        }))
    });

    function getSessionEnd(createdAt: Date, duration: number): Date {
        return new Date(createdAt.getTime() + duration * 1000);
    }

    const sessionEnd = $derived(getSessionEnd(session.createdAt, session.duration));    
</script>

<div class="m-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
    <Card>
        {#snippet header()}
            <h1>Session Information</h1>
        {/snippet}
        {#snippet article()}
            <div class="grid grid-cols-2 justify-between">
                <span>ID</span>
                <span>{session.id}</span>
                <span>Created At</span>
                <span>{session.createdAt.toLocaleString()}</span>
                <span>Ended At</span>
                <span>{sessionEnd.toLocaleString()}</span>
                <span>By</span>
                <a href="/dashboard/user/{user.id}" class="underline">{user.username}</a>
            </div>
        {/snippet}
    </Card>

    <Card>
        {#snippet header()}
            <h1>Scores</h1>
        {/snippet}
        {#snippet article()}
            <Table {table} />
        {/snippet}
    </Card>
</div>
```

Belangrijke verschillen met de vorige sectie:

  * We geven de sessie-informatie weer in een **Card**, in plaats van een **User Profile**.
  * We geven de scores weer in een **Table**, in plaats van de sessies van de gebruiker.
  * We hebben geen klikbare rijen meer in de **Table**.
  * We voegen een klikbare link toe naar de gebruiker die de sessie heeft gemaakt, die navigeert naar de detailpagina van de gebruiker.

-----

### Data Utility-functies

We hebben in de vorige secties wat **dubbele code** geïntroduceerd om onze gegevens te visualiseren, zoals de `getSessionEnd` en `getCurrentAge` functies.
We kunnen deze extraheren naar een apart **utility-bestand** om **duplicatie** te voorkomen en onze code schoner te maken.

We maken een nieuw bestand `/src/lib/utils/date.ts` en verplaatsen de `getSessionEnd` en `getCurrentAge` functies daarheen, waarbij we ze een meer generieke naam geven om hun **utility**-karakter te weerspiegelen:

```ts
// /src/lib/utils/date.ts

export function dateAddSeconds(createdAt: Date, duration: number): Date {
    return new Date(createdAt.getTime() + duration * 1000);
}

export function ageFromDateOfBirth(dateOfBirth: Date): number {
    const now = new Date();
    let age = now.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = now.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())) {
        age--;
    }
    return age;
}
```
En dan gebruiken we ze in de `+page.svelte` bestanden voor de detailpagina's van de gebruiker en de sessie:

```svelte
<script lang="ts">
    ...

    import { ageFromDateOfBirth, dateAddSeconds } from '$lib/utils/date';

    ...
    const table: TableData = $derived({
        caption: ...,
        columns: ...,
        rows: data.sessionsByUser.map((session: SessionWithAverageScore) => ({
            values: [
                ...,
                dateAddSeconds(session.createdAt, session.duration).toLocaleString(),
                ...
            ],
            ...
        }))
    });

    const userAge = $derived(ageFromDateOfBirth(user.dateOfBirth));
</script>

```

```svelte
<script lang="ts">
    ...

    import { dateAddSeconds } from '$lib/utils/date'; 
    
    ...

    const sessionEnd = $derived(dateAddSeconds(session.createdAt, session.duration));
</script>

...
```

Nu hoeft onze paginacode zich geen zorgen te maken over de **implementatiedetails** van hoe de eindtijd van de sessie of de leeftijd van de gebruiker wordt berekend, en we kunnen deze **utility-functies** ook op andere plaatsen in onze applicatie hergebruiken.

-----

### Tabelpaginering

Naarmate het aantal sessies en gebruikers in de loop van de tijd toeneemt, willen we misschien **paginering** implementeren voor onze tabellen, zodat een gebruiker niet wordt overweldigd door te veel gegevens tegelijk.
Dit kunnen we implementeren door de **Skeleton** [`pagination` component](https://www.google.com/search?q=%5Bhttps://www.skeleton.dev/docs/components/pagination/svelte%5D\(https://www.skeleton.dev/docs/components/pagination/svelte\)) toe te voegen.

Eerst implementeren we wat **TypeScript** voor de **pagineringsfunctionaliteit**:

  * importeert de **component** en enkele **pictogrammen** van `lucide-svelte`
  * definieert een `PaginationOptions` **interface** om het **pagineringsgedrag** te configureren
  * voegt de `paginationOptions` **eigenschap** toe aan de `TableData` **interface**
  * definieert enkele **standaardwaarden** voor de **pagineringsopties**
  * definieert enkele **reactieve statusvariabelen** om de huidige pagina, paginagrootte en of **paginering** is ingeschakeld te bevatten
  * creëerde een afgeleide **gesneden array** van de **brongegevens**, die de inhoud bevat die op de huidige pagina moet worden weergegeven

<!-- end list -->

```svelte
<script lang="ts">
    ...

    import { Pagination } from '@skeletonlabs/skeleton-svelte';
    import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast, Ellipsis } from 'lucide-svelte';

    export interface TableData {
        ...,
        paginationOptions?: PaginationOptions;
    }

    ...

    export interface PaginationOptions {
        enabled?: boolean;
        page?: number;
        size?: number;
        sizePerPage?: number[];
    }

    const paginationDefaults: PaginationOptions = {
        enabled: true,
        page: 1,
        size: 10,
        sizePerPage: [5, 10]
    };

    let { table }: { table: TableData } = $props();


    // State
    // We pick the pagination options from the table, or use the defaults if not provided
    let page = $state(table.paginationOptions?.page ?? paginationDefaults.page!);
    let size = $state(table.paginationOptions?.size ?? paginationDefaults.size!);
    let enabled = $state(table.paginationOptions?.enabled ?? paginationDefaults.enabled!);
    let sizePerPage = $state(table.paginationOptions?.sizePerPage ?? paginationDefaults.sizePerPage!);

    const slicedSource = $derived((source: TableRow[]) =>
        enabled ? source.slice((page - 1) * size, page * size) : source
    );
</script>
```

Vervolgens passen we de **Table markup** aan om:

  * de `slicedSource` te doorlopen in plaats van de volledige `table.rows` om alleen de rijen voor de huidige pagina weer te geven
  * de **Table markup** uit te breiden met de **pagineringscontroles**, die in de **footer** van de **table** worden weergegeven
      * in de `onchange` **events** werken we de **statusvariabelen** bij, wat een **herrendering** van de **component** met de nieuwe pagina of paginagrootte zal activeren

<!-- end list -->

```svelte
<section class="...">
    <div class="...">
        <table class="...">
            ...    
            <tbody class="...">
                {#each slicedSource(table.rows) as row, index (index)}
                    <tr
                        onclick={() => (row.url ? goto(row.url) : null)}
                        class={row.url ? 'cursor-pointer' : ''}
                    >
                        {#each row.values as value, i (i)}
                            <td>{value}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    {#if enabled}
        <footer class="flex justify-between">
            <select
                name="size"
                id="size"
                class="select w-fit max-w-[150px] px-2"
                value={size}
                onchange={(e) => (size = Number(e.currentTarget.value))}
            >
                {#each sizePerPage as v, i (i)}
                    <option value={v}>{v} Per Page</option>
                {/each}
                <option value={table.rows.length}>Show All</option>
            </select>
            <Pagination
                data={table.rows}
                {page}
                onPageChange={(e) => (page = e.page)}
                pageSize={size}
                onPageSizeChange={(e) => (size = e.pageSize)}
                siblingCount={4}
            >
                {#snippet labelEllipsis()}<Ellipsis class="size-4" />{/snippet}
                {#snippet labelNext()}<ArrowRight class="size-4" />{/snippet}
                {#snippet labelPrevious()}<ArrowLeft class="size-4" />{/snippet}
                {#snippet labelFirst()}<ChevronFirst class="size-4" />{/snippet}
                {#snippet labelLast()}<ChevronLast class="size-4" />{/snippet}
            </Pagination>
        </footer>
    {/if}
</section>
```

Om de **pagineringsfunctionaliteit** te gebruiken, kunnen we nu eenvoudig de `paginationOptions` **eigenschap** doorgeven aan het `TableData` **object**.

Om bijvoorbeeld onze **Sessietabel** in `/src/routes/dashboard/user/[id]/+page.svelte` in te stellen om slechts 3 sessies per pagina te tonen, kunnen we het volgende doen:

```svelte
<script lang="ts">
    ...

    const table: TableData = $derived({
        ...,    
        paginationOptions: {
            // Show 3 sessions per page by default
            size: 3, 
            // Pass 3 as an option for the dropdown that allows the user to change the page size
            sizePerPage: [3, 5, 10], 
        }
    });
</script>
```

![pagination.gif](/tutorial/4-load-and-display-data/img/pagination.gif)

We kunnen er ook voor kiezen om de zojuist toegevoegde functie voor specifieke tabellen uit te schakelen door de `enabled` **eigenschap** op `false` in te stellen in de `paginationOptions`.
Bijvoorbeeld om **paginering** uit te schakelen voor de gebruikers- en sessiezoekresultaten:

```svelte
<script lang="ts">
    ...

    let table = $derived({
        ...    
        paginationOptions: {
            enabled: false
        }
    });
</script>
```

-----

### Grafieken

Laten we vervolgens kijken naar het **visualiseren** van onze gegevens op een meer grafische manier, met behulp van **grafieken**.

Om dit te doen, gebruiken we de [Chart.js](https://www.chartjs.org/) **bibliotheek**, een populaire **JavaScript-bibliotheek** voor het maken van **grafieken** en **diagrammen**.
We gaan niet te diep in op het gebruik van **Chart.js**, aangezien de **website** goed gedocumenteerd is, maar we zullen het vooral hebben over hoe we het kunnen integreren in onze **SvelteKit**-applicatie.

We willen een **grafiek** maken waarin **Tijd** op de X-as staat, om de behaalde scores in een sessie over tijd te **visualiseren**. Hiervoor [hebben we](https://www.chartjs.org/docs/latest/axes/cartesian/time.html) een **datumadapter** nodig.
We gebruiken een [date-fns adapter](https://github.com/chartjs/chartjs-adapter-date-fns) om datumopmaak in de **grafieken** te verwerken.

Eerst installeren we `chart.js`, `date-fns` en het `chartjs-adapter-date-fns` **pakket**:

```bash
npm i chart.js date-fns chartjs-adapter-date-fns
```

Laten we vervolgens een nieuwe `Chart.svelte` **component** maken in `/src/lib/ui/views/charts/Chart.svelte`, die we als basiscomponent voor onze **grafieken** zullen gebruiken:

```svelte
<script lang="ts">
    //@ts-nocheck
    import { Chart } from 'chart.js/auto';
    import 'chartjs-adapter-date-fns';
    import { onMount } from 'svelte';

    let { type, data, options } = $props();

    let chartElement;
    let chartInstance: Chart | null = null;

    onMount(() => {
        renderChart();
        window.addEventListener('resize', renderChart);
    });

    function renderChart() {
        // When resizing, it's possible the chart gets stuck in it's smallest state.
        // To avoid this, we destroy the chart instance and create a new one, disabling the pop-in animation.
        let animate = true;
        if (chartInstance) {
            chartInstance.destroy();
            animate = false;
        }
        chartInstance = new Chart(chartElement, {
            type: type,
            data: data,
            options: {
                ...options,
                animation: animate
            }
        });
    }
</script>

<canvas id="chart" bind:this={chartElement}></canvas>
```

De belangrijkste punten om hier op te letten zijn:

  * We importeren de `Chart` **class** van `chart.js/auto`.
  * We **exposen** de **props** `type`, `data` en `options`, die zullen worden gebruikt om [de grafiek te configureren](https://www.chartjs.org/docs/latest/configuration/).
  * We gebruiken [de `onMount` **lifecycle-functie**](https://www.google.com/search?q=%5Bhttps://svelte.dev/docs/svelte/lifecycle-hooks%23onMount%5D\(https://svelte.dev/docs/svelte/lifecycle-hooks%23onMount\)) om de **grafiek** te renderen wanneer de **component** wordt gemonteerd.
  * We **binden** het `<canvas>`-element aan `chartElement`, waar de **grafiek** zal worden gerenderd.
  * We importeren `chartjs-adapter-date-fns` om datumopmaak in de **grafiek** mogelijk te maken.
  * We voegen extra **logica** toe om het **formaat** van de **grafiek** aan te passen om ervoor te zorgen dat deze correct wordt geschaald wanneer het **venster** wordt geschaald.

Vervolgens maken we een nieuwe `ScoreOverTimeInSessionChart.svelte` **component** in `/src/lib/ui/views/charts/ScoreOverTimeInSessionChart.svelte`, die de `Chart` **component** zal gebruiken om de behaalde scores in een sessie over tijd weer te geven.
Dit zal geen **herbruikbare component** zijn, maar we kunnen alle **logica** met betrekking tot deze specifieke **grafiek** abstraheren, zodat we deze gemakkelijk kunnen gebruiken op onze sessiedetailpagina.

Het belangrijkste dat we moeten begrijpen, is welk type **grafiek** we willen maken en hoe `chart.js` de gegevens verwacht te worden **geformatteerd**.
In dit geval willen we een **lijngrafiek** maken, waarbij de x-as een **tijdas** is en de y-as de score die op dat moment is behaald.
We kunnen voorbeelden van **lijngrafieken** vinden op de [Chart.js documentatiewebsite](https://www.chartjs.org/docs/latest/charts/line.html) en daarvan leren.

**Chart.js** verwacht dat de gegevens in een specifiek **formaat** zijn, van x- en y-waarden.
We **mappen** de **scoregegevens** naar een nieuwe **array** van **objecten**, waarbij elk **object** een `x`-waarde (de tijd dat de score is behaald) en een `y`-waarde (de score zelf) bevat.

```svelte
<script lang="ts">
    import type { Score } from '$lib/server/db/schema';
    import { nl } from 'date-fns/locale';
    import Chart from '$lib/ui/views/charts/Chart.svelte';

    let { scores }: { scores: Score[] } = $props();

    // We sort the scores by createdAt,
    // then map the x values (time) to the createdAt,
    // and the y values (score) to the score.
    const inData = scores
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((score) => {
            return {
                x: score.createdAt,
                y: score.score
            };
        });

    const chartData = {
        // Display a line chart 
        type: 'line',

        data: {
            // Labels for the x-axis
            labels: inData.map((score) => score.x),
            // Datasets for the y-axis
            datasets: [
                // Just one dataset: the score over time
                {
                    label: 'Score',
                    data: inData.map((score) => score.y)
                }
            ]
        },
        options: {
            // Define how the charts scales should behave
            scales: {
                // The x-axis is of type 'time' and has a date adapter for the 'nl' locale
                x: {
                    type: 'time',
                    adapters: {
                        date: {
                            locale: nl
                        }
                    },
                    bounds: 'data'
                },
                // The y-axis starts at zero (rather than the lowest value)
                y: {
                    beginAtZero: true
                }
            }
        }
    };
</script>

<Chart type={chartData.type} data={chartData.data} options={chartData.options} />
```

Belangrijke punten om hier op te letten:

  * We importeren de eerder gemaakte `Chart` **component** en gebruiken deze om de **grafiek** te renderen.
  * We **exposen** de `scores` **prop**, een **array** van `Score` **objecten**.
  * We sorteren de scores op `createdAt` en **mappen** de `x`-waarden naar de `createdAt` datum en de `y`-waarden naar de `score`.
  * We maken een `chartData` **object** dat de gegevens voor de **grafiek** bevat, inclusief de **labels** voor de x-as en de **datasets** voor de y-as.
  * We definiëren de **grafiekopties**, inclusief het type x-as als `time` en de **datumadapter** voor de `nl` **locale** (Nederlands).

Vervolgens kunnen we deze `ScoreOverTimeInSessionChart` **component** gebruiken in `/src/routes/dashboard/session/[id]/+page.svelte` om de behaalde scores in een sessie over tijd weer te geven:

```svelte
<script lang="ts">
    ...    
    import ScoreOverTimeInSessionChart from '$lib/ui/views/charts/ScoreOverTimeInSessionChart.svelte';
    
    ...
</script>

<div class="m-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
    <Card>
        ...    
    </Card>

    <Card>
        ...    
    </Card>
    <Card baseExtension="lg:col-span-2 !max-w-full">
        {#snippet header()}
            <h1>Score over time</h1>
        {/snippet}
        {#snippet article()}
            <div class="justify-center">
                <ScoreOverTimeInSessionChart scores={data.scoresInSession} />
            </div>
        {/snippet}
    </Card>
</div>
```

En zo hebben we een nette **grafiek** die de score over tijd in een sessie weergeeft\!

![charthover.gif](/tutorial/4-load-and-display-data/img/charthover.gif)

Om er zeker van te zijn dat dit geen toevalstreffer was, implementeren we ook een **grafiek** voor de detailpagina van de gebruiker, die de gemiddelde score per sessie over tijd weergeeft.

We maken een nieuwe `AverageScoreOverTimeForUserChart.svelte` **component** in `/src/lib/ui/views/charts/AverageScoreOverTimeForUserChart.svelte`.
Dit is grotendeels een **duplicaat** van de vorige **grafiek**, maar we zullen het `SessionWithAverageScore` **type** gebruiken in plaats van het `Score` **type**, en we zullen de `averageScore` **mappen** naar de `y`-waarde in plaats van de `score` (en het **label** ervan aanpassen).

```svelte
<script lang="ts">
    ...
    import type { SessionWithAverageScore } from '$lib/server/dao/SessionDAO';

    let { scores: sessions }: { scores: SessionWithAverageScore[] } = $props();

    // We sort the scores by createdAt,
    // then map the x values to the createdAt,
    // and the y values to the score.
    const inData = sessions
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((score) => {
            return {
                x: score.createdAt,
                y: score.averageScore
            };
        });

    const chartData = {
        ...,
        data: {
            ...,
            datasets: [
                {
                    label: 'Average Score',
                    data: inData.map((score) => score.y)
                }
            ]
        },
        ...    
    };
</script>

<Chart type={chartData.type} data={chartData.data} options={chartData.options} />
```

Het toevoegen aan de detailpagina van de gebruiker is vergelijkbaar met de vorige **grafiek**, dus we gaan hier ook niet te diep op in:

```svelte
<script lang="ts">
    ...
    import AverageScoreOverTimeForUserChart from '$lib/ui/views/charts/AverageScoreOverTimeForUserChart.svelte';
    ...
</script>

<div class="...">
    <Card>
        ...    
    </Card>

    <Card>
        ...    
    </Card>
    <Card baseExtension="lg:col-span-2 !max-w-full">
        {#snippet header()}
            <h1>Average score over time</h1>
        {/snippet}
        {#snippet article()}
            <div class="justify-center">
                <AverageScoreOverTimeForUserChart scores={data.sessionsByUser} />
            </div>
        {/snippet}
    </Card>
</div>
```

-----

### Dashboard Overzichtspagina opfrissen

De meeste van onze pagina's zien er nu redelijk goed uit, maar we hebben onze **dashboard-overzichtspagina** nog niet onder handen genomen.

Laten we dat nu doen om dit hoofdstuk af te ronden.
Naast onze `TopScorers`-lijst voegen we een lijst toe van alle gebruikers in de **database**.
Bovendien zullen we onze nieuwe **Table component** gebruiken om deze lijsten op een meer presentabele manier weer te geven.

Eerst breiden we het bestand `/src/routes/dashboard/page.server.ts` uit om de **database** te **queryen** voor alle gebruikers (we hebben de relevante **query** al geïmplementeerd in de `UserDAO`):

```ts
// /src/routes/dashboard/+page.server.ts

...
import { UserDAO } from '$lib/server/dao/UserDAO';
import type { User } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
    const limit: number = 10;
    const users: User[] = await UserDAO.getAllUsers();
    const topScorers: TopScorer[] = await ScoreDAO.getTopScorers(limit);

    return {
        users,
        topScorers
    };
};
```

En vervolgens werken we het bestand `/src/routes/dashboard/+page.svelte` bij om de gebruikers in een **Table** weer te geven, samen met de **topscorers**:

```svelte
<script lang="ts">
    import type { TopScorer } from '$lib/server/dao/ScoreDAO';
    import type { User } from '$lib/server/db/schema';
    import Card from '$lib/ui/views/Card.svelte';
    import type { TableData } from '$lib/ui/views/Table.svelte';
    import Table from '$lib/ui/views/Table.svelte';
    import { ageFromDateOfBirth } from '$lib/utils/date.js';

    const { data } = $props();

    const topScoreTable: TableData = $derived({
        caption:
            'A list of the top 10 users who have the highest scores.\nClick to view the session in which they achieved it.',
        columns: [
            'Ranking',
            'Username',
            'Level ID',
            'Score',
            'Accuracy',
            'Time Taken',
            'Created At',
            'Session ID'
        ],
        rows: data.topScorers.map((score: TopScorer, index: number) => ({
            values: [
                index + 1,
                score.user.username,
                score.score.levelId,
                score.score.score,
                score.score.accuracy,
                score.score.timeTaken,
                score.score.createdAt.toLocaleString(),
                score.session.id
            ],
            url: `/dashboard/session/${score.session.id}`
        })),
        paginationOptions: { enabled: false }
    });

    const userTable: TableData = $derived({
        caption: 'A list of users.\nClick to view their profile.',
        columns: ['Username', 'Age', 'Created At'],
        rows: data.users.map((user: User) => ({
            values: [
                user.username,
                ageFromDateOfBirth(user.dateOfBirth),
                user.createdAt.toLocaleDateString()
            ],
            url: `/dashboard/user/${user.id}`
        }))
    });
</script>

<div class="mx-auto grid grid-cols-1 gap-y-4">
    <Card baseExtension="!max-w-full w-6xl">
        {#snippet header()}
            <h1>Top 10 Users</h1>
        {/snippet}
        {#snippet article()}
            <Table table={topScoreTable} />
        {/snippet}
    </Card>
    <Card baseExtension="!max-w-full w-6xl">
        {#snippet header()}
            <h1>Users</h1>
        {/snippet}
        {#snippet article()}
            <Table table={userTable} />
        {/snippet}
    </Card>
</div>

```

Belangrijke punten om hier op te letten:

  * We maken twee `TableData` **objecten**, één voor de **topscorers** en één voor de gebruikers.
  * We schakelen **paginering** uit voor de **topscorers-tabel**, omdat we alleen de **top 10 gebruikers** willen tonen.
  * We voegen een **index** toe aan de **topscorers-tabel** om de **rangschikking** van elke gebruiker weer te geven.
  * We stellen de `url` **eigenschap** in voor elke rij, zodat klikken op een rij navigeert naar de relevante gebruiker (**gebruikerstabel**) of sessiedetailpagina waarin de **topscore** is behaald (**topscorers-tabel**).
  * We gebruiken de `ageFromDateOfBirth` **utility-functie** om de leeftijd van de gebruiker te berekenen op basis van hun geboortedatum.

Mooi. We hebben nu een mooie overzichtspagina die ons naar de detailpagina van de gebruiker brengt wanneer we op een gebruiker klikken, en naar de detailpagina van de sessie wanneer we op een **topscorer** klikken.

![dashboard-overview.gif](/tutorial/4-load-and-display-data/img/dashboard-overview.gif)

### Sectie "Over ons" bijwerken

Deze sectie gaat niet echt over **gegevensvisualisatie**, maar meer over het verder **verfijnen** van onze applicatie.
Onze site is, visueel gezien, bijna compleet. Laten we snel een mooier uitziende "Over ons"-pagina in elkaar zetten, aangezien dat de enige pagina is die we nog niet hebben aangepast.

Aan deze sectie voegen we een tekstgedeelte toe met wat informatie over de applicatie, en wat informatie over het **authenticatiesysteem** dat we in het volgende hoofdstuk zullen creëren.

```svelte
<script lang="ts">
    import Card from '$lib/ui/views/Card.svelte';
    import { GAME_NAME, ADMIN_EMAIL } from '$lib/constants/strings';
</script>

<div class="flex h-full items-center justify-center p-4">
    <Card>
        {#snippet header()}
            <h1 class="text-center text-2xl font-bold">About</h1>
        {/snippet}
        {#snippet article()}
            <p>
                This website functions as a web portal to a database for the game '{GAME_NAME}'.
            </p>
            <p>
                To gain access to the database, please log in using your GitHub account. Note that your
                GitHub account has to be whitelisted by the site administrator in order to access this
                website.
            </p>
            <p>
                You can contact the administrator via email at {ADMIN_EMAIL}.
            </p>

            <p>
                Once logged in, you can view the <a href="/dashboard" class="text-primary-500">dashboard</a
                >, which provides an overview of the database. There, you can also view data about specific
                <a href="/dashboard/user" class="text-primary-500">users</a>
                or <a href="/dashboard/session" class="text-primary-500">sessions</a>.
            </p>
        {/snippet}
    </Card>
</div>
```

We moeten het `ADMIN_EMAIL` toevoegen aan het bestand `/src/lib/constants/strings.ts`, zodat we het kunnen gebruiken op de **About**-pagina:

```ts
// /src/lib/constants/strings.ts

...

export const ADMIN_EMAIL = 'demo@admin.com';
```

En nu hebben we deze mooie **card** op onze **About**-pagina:

![about.png](/tutorial/4-load-and-display-data/img/about.png)

-----

## Afronding

In dit hoofdstuk hebben we onze applicatie bijna voltooid, waarbij we onze gegevens uit de **database** laden en op een **gebruiksvriendelijke manier** weergeven.

We hebben geleerd hoe we:

  * Gegevens in pagina's kunnen laden met behulp van de `load`-functie.
  * Schone, georganiseerde **queries** kunnen schrijven met behulp van **DAO's** (**Data Access Objects**).
  * **Routeparameters** en **URL-queries** kunnen verwerken om specifieke gegevens te laden.
  * Informatie kunnen weergeven met behulp van **tabellen** en **grafieken** die zowel functioneel als visueel duidelijk zijn.
  * De **app** sneller en **interactiever** kunnen maken met **responsief zoeken**.
  * Fouten elegant kunnen afhandelen, zodat gebruikers nuttige feedback krijgen wanneer er iets misgaat.

Inmiddels hebben we de punten tussen onze **database** en onze **UI** verbonden – en ervoor gezorgd dat jouw gebruikers de opgeslagen gegevens daadwerkelijk kunnen zien en ermee kunnen **interacteren**.

Vervolgens gaan we verder dan het lezen van gegevens – en onderzoeken we hoe we een **veilig authenticatiesysteem** kunnen bouwen om te beheren wie toegang heeft tot onze applicatie.
Raadpleeg [Hoofdstuk 5: Authenticatie](https://www.google.com/search?q=/tutorial/5-authentication/README.md) om te leren hoe je **authenticatie** in jouw **SvelteKit**-applicatie kunt implementeren.
