# 5 - Authenticatie

In de vorige hoofdstukken hebben we een eenvoudige webapplicatie gemaakt die gegevens uit een database haalt en deze met verschillende soorten visualisaties weergeeft. In dit hoofdstuk zorgen we ervoor dat alleen geautoriseerde gebruikers toegang hebben tot onze applicatie.

Hoewel we niet zullen bespreken hoe we deze webapplicatie live kunnen zetten, zullen we wel een basis authenticatiesysteem implementeren met GitHub OAuth, om te zien hoe we onze applicatie zouden kunnen beveiligen mochten we besluiten deze in de toekomst te deployen.

## Hoofdstukoverzicht

### Leerdoelen

Aan het einde van dit hoofdstuk kun je:

  - De basisprincipes van authenticatie en autorisatie begrijpen.
  - Een eenvoudig authenticatiesysteem implementeren met GitHub OAuth.
  - Een loginpagina maken in Svelte.
  - Toegang tot bepaalde routes beperken op basis van de authenticatiestatus in SvelteKit.
  - Gebruikers op een witte lijst zetten om toegang te krijgen tot de applicatie.

### Leermiddelen

## Auth.js

We gebruiken [Auth.js](https://authjs.dev/) om authenticatie in onze SvelteKit-applicatie te implementeren. Auth.js is een flexibele authenticatiebibliotheek die verschillende OAuth-providers ondersteunt, waaronder GitHub. Hiermee kunnen we eenvoudig authenticatie in onze applicatie integreren zonder alles helemaal opnieuw te hoeven bouwen.

### Waarom een bibliotheek boven handmatige implementatie?

Beveiliging is een cruciaal aspect van webapplicaties, maar het opzetten van een goede, waterdichte authenticatie kan behoorlijk complex worden. Het valt daarom buiten de reikwijdte van deze cursus om alle fijne kneepjes van authenticatie te behandelen, en daarom zullen we meer kijken naar hoe we authenticatie in onze SvelteKit-applicatie kunnen implementeren, in plaats van de details van hoe authenticatie in het algemeen werkt. We zullen enkele basisconcepten van authenticatie en autorisatie behandelen, maar we zullen niet diep ingaan op de beveiligingsaspecten van OAuth of hoe je het zelf veilig kunt implementeren. Als je meer wilt weten over authenticatie, dan is [Lucia](https://lucia-auth.com/) een geweldige bron om te leren hoe je handmatig authenticatie kunt uitrollen, wat een meer diepgaand begrip van het onderwerp biedt.

### Wat is OAuth en waarom zou je het gebruiken?

Als je ooit een "Log in met Google" of "Log in met GitHub" knop op een website hebt gezien, ben je OAuth tegengekomen. Het stelt gebruikers in staat om toegang te verlenen tot hun middelen op een externe service, zoals Google, aan jouw applicatie zonder hun inloggegevens te delen (uit: [The Copenhagen Book](https://thecopenhagenbook.com/oauth)). Door het authenticatieproces uit te besteden aan een vertrouwde provider, hoeven we ons geen zorgen te maken over het veilig opslaan van wachtwoorden in onze database.

Auth.js raadt aan om OAuth te gebruiken als de primaire methode van authenticatie, omdat het ons veel complexiteit bespaart die gepaard gaat met het beheren van gebruikersgegevens en beveiliging:

> OAuth-services besteden aanzienlijke bedragen, tijd en technische inspanning aan het bouwen van misbruikdetectie (bot-beveiliging, rate-limiting), wachtwoordbeheer (wachtwoordreset, credential stuffing, rotatie), gegevensbeveiliging (versleuteling/salting, sterktevalidatie) en nog veel meer. Het is waarschijnlijk dat jouw applicatie baat zou hebben bij het gebruik van deze beproefde oplossingen in plaats van deze helemaal opnieuw te proberen te bouwen. Of als je niet wilt betalen voor een OAuth-service, ondersteunen we veel zelf gehoste OAuth-providers zoals Keycloak.

### Hoe onze applicatie gebruikers zal authentiseren

In ons `.env`-bestand slaan we een witte lijst op van GitHub-gebruikers die mogen inloggen op onze applicatie. We gebruiken GitHub OAuth om gebruikers te authentiseren. Wanneer een gebruiker inlogt, controleren we of hun GitHub userID in deze witte lijst staat. Als ze op de witte lijst staan, krijgen ze toegang tot de applicatie door hun 'sessie' in een cookie op te slaan (hierover later meer). We kunnen deze sessiecookie vervolgens gebruiken in onze `+page.server.ts`-bestanden om te controleren of een gebruiker toegang mag krijgen tot bepaalde routes of niet. Als ze niet op de witte lijst staan, kunnen ze niet authentiseren en krijgen ze deze 'sessiecookie' niet. In onze server kunnen we die gebruikers dan doorverwijzen naar een "niet geautoriseerd"-pagina, in plaats van de beschermde inhoud te tonen.

Een 'leg uit alsof ik vijf ben'-versie van het authenticatieproces gaat als volgt.

Stel dat onze applicatie een supergeheim clubhuis is met geweldig speelgoed, en alleen bepaalde kinderen mogen naar binnen.

| Clubhuis Analogie | Technische Implementatie |
|-------------------|-------------------------|
| Johnny wil in het clubhuis spelen en klopt op de deur | Gebruiker bezoekt een beschermde route/URL in jouw applicatie |
| "Sorry, je mag niet naar binnen zonder een polsbandje, ga er een halen aan de overkant bij Mr. GitHub's huis" | Auth.js middleware detecteert niet-geauthenticeerde gebruiker en stuurt door naar GitHub OAuth autorisatie-eindpunt |
| Johnny gaat naar het GitHub-huis en klikt op "Log in met GitHub" | Gebruiker wordt doorgestuurd naar `https://github.com/login/oauth/authorize` met de client ID van jouw app |
| Mr. GitHub vraagt Johnny te bewijzen dat ze echt Johnny zijn, Johnny toont ID (wachtwoord) | GitHub vraagt de gebruiker om hun GitHub-gebruikersnaam/wachtwoord in te voeren of een bestaande sessie te gebruiken |
| Mr. GitHub geeft Johnny een verzegelde envelop met een speciaal nummer erin | GitHub stuurt terug naar jouw app met een autorisatiecode in de callback URL |
| Johnny neemt de envelop terug naar de clubhuisdeur | De browser van de gebruiker volgt de redirect terug naar de callback-route van jouw app |
| We openen de envelop en zien "Ja, dit is Johnny\! Zijn nummer is 12345" | Jouw app wisselt de autorisatiecode in voor een access token, en gebruikt deze vervolgens om het GitHub-profiel van de gebruiker op te halen (inclusief gebruikers-ID) |
| We controleren onze lijst met kinderen die in het clubhuis mogen | Jouw app controleert of de GitHub-gebruikers-ID bestaat in jouw `.env` whitelist |
| We geven Johnny een rode polsband met hun naam erop | Auth.js maakt een sessiecookie aan met gebruikersinformatie |
| Johnny toont polsbandje om speelgoed te gebruiken | Latere verzoeken van de gebruiker bevatten de sessiecookie voor authenticatie |
| We nemen het polsbandje terug wanneer Johnny weggaat | Gebruiker logt uit, sessiecookie wordt gewist/ongeldig gemaakt |
| Polsbandje verloopt na enige tijd (morgen werken alleen blauwe polsbandjes) | Sessiecookie heeft een vervaltijd, gebruiker moet opnieuw authenticeren |
| We kunnen Johnny's nummer van onze lijst verwijderen als ze zich misdragen | Beheerder kan de GitHub ID van de gebruiker verwijderen uit de whitelist in `.env` |

In deze analogie kunnen we het clubhuis ook zien als een plek waar ze toegang hebben tot een deel van ons speelgoed (openbare routes), maar alleen de kinderen met een polsbandje kunnen met de rest van ons speelgoed spelen (beschermde routes).

Met wat basisbegrip van hoe onze authenticatie zal werken, laten we beginnen met de implementatie ervan in onze SvelteKit-applicatie\!

### Auth.js instellen

We zullen de [Auth.js documentatie](https://authjs.dev/getting-started/installation?framework=SvelteKit) volgen om authenticatie in onze SvelteKit-applicatie op te zetten. Probeer de nieuwste instructies van Auth.js zelf te volgen, aangezien deze in de loop van de tijd kunnen veranderen, maar we zullen de stappen beschrijven die we in dit hoofdstuk hebben genomen om het op te zetten.

Eerst installeren we de `auth.js` afhankelijkheid:

```bash
npm i @auth/sveltekit
```

Vervolgens maken we een `AUTH_SECRET` variabele aan in ons `.env` bestand. Dit is een willekeurig gegenereerde string die alleen wij kennen, en die we daarom kunnen gebruiken voor het versleutelen van onze sessiecookies. Auth.js kan dit geheim voor ons genereren:

```env
npx auth secret
```

(Vergeet niet je `.env.example` bestand bij te werken met een nieuwe lege `AUTH_SECRET` variabele (SLA HET WERKELIJKE GEHEIM NIET OP in je `.env.example` bestand, want dit wordt naar onze repository gepusht\!))

Vervolgens maken we een configuratiebestand voor Auth.js aan.

```typescript
// /src/lib/server/auth/auth.ts

import { SvelteKitAuth } from "@auth/sveltekit"
 
export const { handle } = SvelteKitAuth({
  providers: [],
})
```

We willen deze `handle` functie re-exporteren in `src/hooks.server.ts`, wat ervoor zorgt dat deze `handle` die we zojuist hebben gemaakt, wordt gebruikt voor alle verzoeken in onze SvelteKit-applicatie (zie [Server Hooks](https://svelte.dev/docs/kit/hooks#Server-hooks)).

```typescript
// /src/hooks.server.ts

export { handle } from "./auth"
```

Deze `handle` functie voegt een methode `auth()` toe aan [het `event.locals` object](https://www.google.com/search?q=%5Bhttps://svelte.dev/docs/kit/hooks%23Server-hooks-locals%5D\(https://svelte.dev/docs/kit/hooks%23Server-hooks-locals\)), die we kunnen benaderen in elk `+page.server.ts` of `+layout.server.ts` bestand, door de `locals` parameter toe te voegen aan de `load` functie.

Bijvoorbeeld, in `src/routes/+layout.server.ts`, kunnen we de `auth` methode als volgt benaderen:

```ts
// /src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();

	return {
		session
	};
};
```

Nu moeten we de GitHub OAuth-provider toevoegen.

Laten we eerst [een GitHub OAuth-applicatie aanmaken](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

  - Ga naar je GitHub-accountinstellingen
  - Navigeer naar "Developer settings" (linkerzijbalk, helemaal onderaan)
  - Klik op "OAuth Apps" (linkerzijbalk)
  - Klik op "New OAuth App"
  - Geef je applicatie een naam, bijv. "oauth-demobots"
  - Stel de "Homepage URL" in op `http://localhost:5173` (dit is waar de app lokaal draait)
  - Stel de "Authorization callback URL" in op `[origin]/auth/callback/github` (dus voor ons wordt het `http://localhost:5173/auth/callback/github`)
  - Klik op "Register application"

Neem vervolgens de "Client ID" over en genereer een nieuwe "Client secret", en voeg deze toe aan je `.env` bestand. Nu we toch bezig zijn, voegen we ook een variabele toe voor de `ALLOWED_GITHUB_IDS`, dit wordt een door komma's gescheiden lijst van GitHub user ID's die mogen inloggen op onze applicatie.

Je `.env.example`-bestand zou er zo uit moeten zien, en je `.env`-bestand zou vergelijkbaar moeten zijn, maar dan met je daadwerkelijke inloggegevens ingevuld:

```
.env.example

# Vervang met je DB-inloggegevens!
DATABASE_URL="mysql://username:password@host:port/dbname"
# Auth.js configuratie
AUTH_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
# Door komma's gescheiden lijst van toegestane GitHub user ID's (niet gebruikersnamen)
# Haal die van jou op via, bijv., https://api.github.com/user/codevogel
ALLOWED_GITHUB_IDS=""
```

Nu voegen we de GitHub-provider toe aan onze Auth.js-configuratie:

```typescript
// /src/lib/server/auth/auth.ts

import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
 
export const { handle, signIn } = SvelteKitAuth({
  providers: [GitHub],
}) 
```

We zijn vrijwel klaar met de setup van Auth.js, maar we moeten nog wat inlog/uitlog-logica implementeren, en logica die onze routes beschermt tegen gebruikers die niet zijn ingelogd.

### Een aanmeldingsroute toevoegen

Nu voegen we een server-side loginroute toe die de `POST`-verzoeken afhandelt om gebruikers in te loggen:

We zullen de `signIn` functie toevoegen aan onze exports in ons Auth.js configuratiebestand:

```ts
// /src/lib/server/auth/auth.ts
...

export const { handle, signIn } = ...
})
```

Vervolgens maken we het `+server.ts` bestand aan in de `src/routes/auth/sign-in` directory, die de aanmeldingsverzoeken zal afhandelen. Dit bestand zal een `actions` object exporteren met een `default` actie die de `signIn` functie aanroept die we zojuist hebben geëxporteerd.

```typescript
// /src/routes/auth/sign-in/+server.ts

import { signIn } from "$lib/server/auth/auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }
```

En vervolgens voegen we een aanmeldknop toe aan onze applicatie. Voor nu voegen we deze gewoon toe aan een nieuwe pagina op `/src/routes/login/+page.svelte`. Maak je geen zorgen over de styling voor nu, we verplaatsen de aanmeldknop later naar een meer geschikte plaats.

```svelte
<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
	import { page } from '$app/state';
</script>

<div>
	<SignIn
		provider="github"
		signInPage="auth/sign-in"
	/>
</div>
```

Je kunt nu proberen in te loggen op je applicatie door in je browser naar [`http://localhost:5173/login`](https://www.google.com/search?q=http://localhost:5173/login) te navigeren. Dit zou je moeten omleiden naar GitHub, waar je wordt gevraagd om in te loggen en/of onze OAuth-applicatie te autoriseren, en je vervolgens terugleiden naar onze web-app. Dit slaat je sessie op in een cookie, die vervolgens wordt gebruikt om je te authentiseren bij volgende verzoeken.

![github-oauth.png](/tutorial/5-authentication/img/github-oauth.png)

Natuurlijk doet dit op zichzelf nog niet veel, aangezien we nog geen logica hebben geïmplementeerd om te controleren of de gebruiker toegang mag krijgen tot onze applicatie. Dus, laten we dat nu doen.

### Controleren of een gebruiker toegang heeft tot de applicatie

We willen al onze routes onder `/dashboard` beveiligen. Laten we beginnen met de `/dashboard` route zelf, en daarna beveiligen we de andere routes ook.

In `src/routes/dashboard/+page.server.ts` moeten we controleren of de gebruiker is geauthenticeerd. Zoals eerder gezegd, kunnen we de `auth()` methode van `event.locals` gebruiken om de sessie-informatie van de gebruiker te krijgen.

We voegen de `locals` parameter toe aan de `load` functie en controleren vervolgens of het `session`-object een `user`-eigenschap heeft. Als dat zo is, laden we de dashboardgegevens zoals normaal. Als dat niet zo is, geven we [een 401-fout](https://svelte.dev/docs/kit/errors) terug (401 betekent "Unauthorized") met een bericht dat de gebruiker niet is ingelogd.

```ts
// /src/routes/dashboard/+page.server.ts

...
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user) {
		return error(401, 'Je bent niet ingelogd. Log in om deze pagina te bezoeken.');
	}

	...	
};
```

Als je nu probeert toegang te krijgen tot [`http://localhost:5173/dashboard`](https://www.google.com/search?q=http://localhost:5173/dashboard), zou je de dashboardgegevens nog steeds moeten kunnen zien, aangezien je bent ingelogd (mits je de aanmeldingsstappen hierboven hebt gevolgd). Als je nog niet bent ingelogd, of dezelfde pagina in een incognitovenster bezoekt, zou je in plaats daarvan de foutmelding "Je bent niet ingelogd" moeten zien.

Cool: Onze dashboardroute is nu beveiligd tegen gebruikers die niet zijn ingelogd\!

Later zullen we dit ook implementeren in onze andere dashboardroutes, maar laten we voor nu een uitlogknop toevoegen aan onze applicatie, zodat gebruikers zich kunnen afmelden bij hun sessie.

### Een afmeldroute toevoegen

Net als bij de aanmeldingsroute, voegen we een afmeldingsroute toe aan onze applicatie.

Eerst breiden we het `src/lib/server/auth/auth.ts` bestand uit om de `signOut` functie te exporteren:

```ts
// /src/lib/server/auth/auth.ts
...

export const { handle, signIn, signOut } = ...
```

Voeg vervolgens het `+server.ts` bestand toe dat de uitlogverzoeken afhandelt:

```ts
// /src/routes/auth/sign-out/+server.ts
import { signOut } from "$lib/server/auth/auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signOut }
```

En dan een `+page.svelte` bestand dat de afmeldknop weergeeft. Nogmaals, we voegen deze voor nu gewoon toe aan een nieuwe pagina op `/src/routes/logout/+page.svelte`, maar we verplaatsen hem later naar een meer geschikte plaats, dus maak je geen zorgen over de styling voor nu.

```svelte
<script lang="ts">
   import { SignOut } from "@auth/sveltekit/components"
</script>
 
<div>
	<SignOut
		provider="github"
		signOutPage="auth/sign-out"
	/>
</div>
```

Probeer in je browser naar [`http://localhost:5173/logout`](https://www.google.com/search?q=http://localhost:5173/logout) te navigeren, en je zou een afmeldknop moeten zien. Klik erop, en je zou geen toegang meer moeten hebben tot de `/dashboard` route, aangezien je nu bent uitgelogd, en je cookie sessie is gewist (dit kun je controleren in de ontwikkelaarstools van je browser, onder het tabblad "Application", in de sectie "Cookies").

Oké, cool. We kunnen in- en uitloggen bij onze applicatie, maar elke GitHub-gebruiker kan inloggen. Laten we die `ALLOWED_GITHUB_IDS` variabele in ons `.env` bestand gaan gebruiken en de toegang tot onze applicatie beperken tot alleen die gebruikers.

### Toegang beperken tot gebruikers op de witte lijst

Om de toegang tot onze applicatie te beperken, controleren we of de GitHub-ID van de geauthenticeerde gebruiker in de `ALLOWED_GITHUB_IDS`-lijst uit ons `.env`-bestand staat.

In ons Auth.js configuratiebestand, `src/lib/server/auth/auth.ts`, kunnen we een [callback functie](https://authjs.dev/reference/sveltekit/types#callbacks) `signIn` toevoegen aan de `SvelteKitAuth` configuratiemethode. Deze functie wordt aangeroepen nadat een gebruiker is teruggestuurd naar onze applicatie na het inloggen met GitHub, en we kunnen deze gebruiken om te bepalen of die GitHub-gebruiker toegang mag krijgen tot onze webapp.

In deze functie controleren we of de GitHub ID van de gebruiker in de `ALLOWED_GITHUB_IDS` lijst staat, en retourneren `true` als dat zo is, of `false` als dat niet zo is. Als de gebruiker niet mag inloggen, sturen we hem door naar een "niet op de witte lijst"-pagina, met behulp van [de `pages` optie](https://www.google.com/search?q=%5Bhttps://authjs.dev/reference/sveltekit/types%23pages%5D\(https://authjs.dev/reference/sveltekit/types%23pages\)) in de `SvelteKitAuth` configuratie.

```typescript
// /src/lib/server/auth/auth.ts

import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { ALLOWED_GITHUB_IDS } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [GitHub],
	callbacks: {
		async signIn({ account, profile }) {
			if (!account || !account.provider || !profile || !profile.id) {
				return false;
			}
			if (account.provider === 'github') {
				// Controleer of de GitHub ID van de gebruiker in je witte lijst staat
				const allowedIds = ALLOWED_GITHUB_IDS.split(',').map((id) => id.trim());
				return allowedIds.includes(profile.id.toString());
			}
			return false;
		}
	},
	pages: {
		error: '/auth/not-whitelisted'
	}
});
```

Nu hoeven we alleen nog maar de `/auth/not-whitelisted`-pagina te maken waar gebruikers naartoe worden omgeleid als ze niet mogen inloggen:

```svelte
<script lang="ts">
	import Card from '$lib/ui/views/Card.svelte';
	import { ADMIN_EMAIL } from '$lib/constants/strings';
</script>

<div class="flex h-full items-center justify-center">
	<Card>
		{#snippet header()}
			<h1 class="text-2xl font-bold">Authenticatie Fout</h1>
		{/snippet}
		{#snippet article()}
			<p>Je bent niet geautoriseerd om deze pagina te bezoeken.</p>
			<p>
				Hoogstwaarschijnlijk heb je geprobeerd in te loggen op deze website, maar is je account niet op de witte lijst gezet.
			</p>
			<p>Neem contact op met de sitebeheerder om toegang te vragen, op {ADMIN_EMAIL} .</p>
		{/snippet}
	</Card>
</div>
```

Als je uitlogt en je GitHub gebruikers-ID verwijdert uit de `ALLOWED_GITHUB_IDS` lijst in je `.env` bestand, zou je nu naar deze pagina moeten worden doorgestuurd wanneer je probeert in te loggen:

![auth-error.png](/tutorial/5-authentication/img/auth-error.png)

Geweldig, we hebben nu controle over wie toegang heeft tot onze applicatie: We kunnen inloggen als gebruiker, en weer uitloggen, en we kunnen de toegang beperken tot alleen die gebruikers die op de witte lijst staan in ons `.env` bestand.

### De andere routes beveiligen

We willen dezelfde authenticatiecontrole toevoegen aan al onze dashboardroutes, zodat geen enkele route onbeschermd blijft.

Laten we dezelfde authenticatiecheck toevoegen aan de volgende `+page.server.ts` bestanden:

  - `src/routes/dashboard/session/+page.server.ts`
  - `src/routes/dashboard/session/[id]/+page.server.ts`
  - `src/routes/dashboard/user/+page.server.ts`
  - `src/routes/dashboard/user/[id]/+page.server.ts`

We zullen de code voor elk van deze bestanden niet behandelen, aangezien deze erg vergelijkbaar is met de code die we hebben toegevoegd aan `src/routes/dashboard/+page.server.ts`. Voeg gewoon de `locals` parameter toe aan de `load` functie, roep `await locals.auth()` aan en controleer of de `session.user` eigenschap bestaat. Als dat niet zo is, retourneer dan een 401-fout met een bericht dat de gebruiker niet is ingelogd.

Aangezien we de foutmelding in de `error()`-functie zullen dupliceren, extraheren we deze naar een constante in `src/lib/constants/strings.ts`:

```ts
// src/lib/constants/strings.ts

export const NOT_LOGGED_IN_ERROR = 'Je bent niet ingelogd. Log in om deze pagina te bezoeken.';
```

bijv. voor `src/routes/dashboard/session/[id]/+page.server.ts`:

```ts
...
import { error } from '@sveltejs/kit';
import { NOT_LOGGED_IN_ERROR } from '$lib/constants/strings';

export const load: PageServerLoad = async ({ params, locals }) => {
    const authSession = await locals.auth();

    if (!authSession?.user) {
        return error(401, NOT_LOGGED_IN_ERROR);
    }

    ...
}
```

Geweldig, onze dashboardroutes zijn nu allemaal beveiligd en gebruikers worden doorgestuurd naar de "niet ingelogd" foutpagina als ze proberen deze te openen zonder geauthenticeerd te zijn.

### Een betere authenticatiestroom

Hoewel onze authenticatiestroom werkt, kunnen we niet echt verwachten dat onze gebruikers handmatig naar de `/login` en `/logout` pagina's navigeren om in en uit te loggen bij onze applicatie.

In plaats daarvan maken we een `LogInButton` en `LogOutButton` component die de aanmeld- en afmeldacties voor ons afhandelen. We plaatsen ze netjes in de `NavBar` component, zodat gebruikers eenvoudig kunnen in- en uitloggen bij onze applicatie.

Bovendien zorgen we ervoor dat gebruikers na het afmelden worden omgeleid naar `/`.

#### De LogInButton-component maken

We wrappen de `SignIn`-component van Auth.js in een nieuwe `LogInButton`-component, die de aanmeldactie voor ons afhandelt. We kunnen de knop stylen zodat deze overeenkomt met het ontwerp van onze applicatie, en we voegen er ook een pictogram aan toe.

Voor de aanmeldknop voegen we ook een optionele `primary` prop toe, die bepaalt of de knop als een primaire knop of als een pictogramknop moet worden gestyled, op deze manier kunnen we deze opnieuw gebruiken op de foutpagina's die gebruikers vertellen in te loggen.

Op grotere schermen tonen we de tekst "Log In", maar op kleinere schermen verbergen we deze, zodat de knop op kleinere schermen in de `NavBar` past.

```svelte
<script lang="ts">
	import { LogIn } from 'lucide-svelte';
	import { SignIn } from '@auth/sveltekit/components';

	let { primary = false } = $props();
</script>

<SignIn
	provider="github"
	class={primary ? 'btn preset-filled-primary-500' : 'btn-icon hover:preset-tonal'}
	signInPage="auth/sign-in"
>
	<span slot="submitButton" class="flex gap-x-1">
		<span class="{primary ? '' : 'hidden'} text-sm lg:block">Log In</span>
		<LogIn />
	</span>
</SignIn>
```

#### De LogOutButton-component maken

Dit is erg vergelijkbaar met de `LogInButton`-component, maar we gebruiken in plaats daarvan de `SignOut`-component van Auth.js. We hebben de `primary`-prop hier niet nodig, aangezien het plaatsen ervan in de `NavBar` voldoende is.

Opmerkelijk is dat we de `options`-prop toevoegen aan de `SignOut`-component, met een `redirectTo`-optie ingesteld op `/`. Dit zorgt ervoor dat de gebruiker na het uitloggen wordt doorgestuurd naar de startpagina van onze applicatie.

```svelte
<script lang="ts">
	import { LogOut } from 'lucide-svelte';
	import { SignOut } from '@auth/sveltekit/components';
</script>

<SignOut
	provider="github"
	class="btn-icon hover:preset-tonal"
	signOutPage="auth/sign-out"
	options={{ redirectTo: '/' }}
>
	<span slot="submitButton" class="flex gap-x-1">
		<span class="hidden text-sm lg:block">Log Out</span>
		<LogOut />
	</span>
</SignOut>
```

#### De knoppen toevoegen aan de NavBar

Eerst laden we de `loggedIn`-status in het bestand `/src/routes/+layout.server.ts`:

```ts
// /src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();

	const loggedIn = session?.user ? true : false;

	return {
		session,
		loggedIn
	};
};
```

Vervolgens geven we deze prop door aan de `NavBar`-component:

```svelte
<script lang="ts">
    ...

	let { children, data } = $props();

	const loggedIn = $derived(data.loggedIn);
</script>

<div class="...">
	<header>
		<NavBar {loggedIn} />
	</header>
    ...	
</div>
```

Vervolgens breiden we de `NavBar`-component uit om de `loggedIn`-prop te accepteren en de `LogInButton` of `LogOutButton` voorwaardelijk weer te geven op basis van de authenticatiestatus van de gebruiker.

```svelte
<script lang="ts">
    ...
	import LogInButton from '$lib/ui/control/LogInButton.svelte';
	import LogOutButton from '$lib/ui/control/LogOutButton.svelte';

	let { loggedIn }: { loggedIn: boolean } = $props();

    ...
</script>

<div class="...">
    <div>...</div>
    <div>...</div>
    <div class="col-span-1 flex items-center md:gap-x-6">
		{#if loggedIn}
			<LogOutButton />
		{:else}
			<LogInButton />
		{/if}
		<ThemeSwitch />
	</div>
</div>
```

Om consistent te blijven met deze nieuwe knoppen, zullen we ook de `ThemeSwitch`-component bijwerken om op grotere schermen tekst naast het pictogram toe te voegen:

```svelte
<Popover ...>
	{#snippet trigger()}
		<span class="flex gap-x-1">
			<span class="hidden text-sm lg:block">Thema</span>
			<Palette />
		</span>
	{/snippet}
    ...
</Popover>
```

Nu zou je de aanmeldknop in de navigatiebalk moeten zien wanneer je niet bent ingelogd, en de afmeldknop wanneer je bent ingelogd. Door op de aanmeldknop te klikken, word je doorgestuurd naar de GitHub OAuth-flow, en door op de afmeldknop te klikken, word je uitgelogd en doorgestuurd naar de startpagina.

![navbar-buttons-small.png](/tutorial/5-authentication/img/navbar-buttons-small.png)

![navbar-buttons-large.png](/tutorial/5-authentication/img/navbar-buttons-large.png)

We kunnen nu de routes/pagina's `/login` en `/logout` verwijderen, aangezien we ze niet langer nodig hebben (bewaar de `auth/sign-in` en `auth/sign-out` routes\!). De aanmeld- en afmeldknoppen in de navigatiebalk zullen de aanmeld- en afmeldacties voor ons afhandelen.

#### Inloggen vanaf de foutpagina's

Laten we onze `Error.svelte`-component bijwerken om een inlogknop weer te geven wanneer de gebruiker een 401-fout tegenkomt, wat aangeeft dat hij niet is ingelogd:

```svelte
<script lang="ts">
	import LogInButton from '$lib/ui/control/LogInButton.svelte';
	let { status, message }: { status: number; message: string } = $props();
</script>

<div class="flex flex-grow flex-col items-center justify-center gap-y-4 p-8">
	<h1 class="text-3xl font-bold">Fout {status}</h1>
	<p class="text-center">{message}</p>
	{#if status === 401}
		<LogInButton primary={true} />
	{/if}
</div>
```

![login-from-error.png](/tutorial/5-authentication/img/login-from-error.png)

#### Een inlogknop weergeven op de startpagina wanneer niet ingelogd

Tot slot voegen we een inlogknop toe aan de startpagina, zodat gebruikers daar ook gemakkelijk kunnen inloggen op onze applicatie. We hebben de `loggedIn`-prop al toegevoegd aan ons `+layout.server.ts`-bestand, dus we kunnen deze ook op de startpagina gebruiken:

```svelte
<script lang="ts">
    ...
	import LogInButton from '$lib/ui/control/LogInButton.svelte';

	let { data } = $props();
	const loggedIn = $derived(data.loggedIn);
</script>

<div
	class="..."
>
	<Card footerBase="...">
	    ...
		{#snippet article()}
			...
            {#if !loggedIn}
				<p>Log in om toegang te krijgen tot de database.</p>
				<LogInButton primary={true} />
			{/if}
		{/snippet}
	</Card>
</div>
```

De knop zou moeten verschijnen wanneer je niet bent ingelogd:

![login-from-home.png](/tutorial/5-authentication/img/login-from-home.png)

## Afronding

Gefeliciteerd\! Je hebt met succes een basisauthenticatiesysteem geïmplementeerd met GitHub OAuth en Auth.js in je SvelteKit-applicatie. Je kunt nu de toegang tot je applicatie beperken tot alleen gebruikers die op de witte lijst staan, en een naadloze login- en logout-ervaring bieden.

Je hebt geleerd:

  - De basisprincipes van authenticatie en autorisatie te begrijpen.
  - Hoe je een eenvoudig authenticatiesysteem implementeert met GitHub OAuth.
  - Hoe je een inlogpagina maakt in Svelte.
  - Hoe je de toegang tot bepaalde routes beperkt op basis van de authenticatiestatus in SvelteKit.
  - Hoe je gebruikers op een witte lijst zet om toegang te krijgen tot de applicatie.

Dit sluit de cursus over het bouwen van een webapplicatie met SvelteKit af. We hopen dat je ervan hebt genoten en veel hebt geleerd over SvelteKit, Svelte en het bouwen van webapplicaties in het algemeen.
