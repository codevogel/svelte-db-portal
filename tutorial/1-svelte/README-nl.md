# Svelte

In dit hoofdstuk zetten we de basisstructuur op voor onze Svelte-applicatie en maken we de basis-UI, routing en paginacontent.

## Hoofdstukoverzicht
### Leerdoelen

Aan het einde van dit hoofdstuk ben je in staat om:
- Te begrijpen waarom we Svelte zullen gebruiken om onze applicatie te bouwen.
- De structuur van een Svelte-applicatie begrijpen en uitleggen.
- Content, TypeScript en stijlen (met behulp van Tailwind CSS) toevoegen aan een Svelte-applicatie.
- Begrijpen hoe basis-routing werkt in een Svelte-applicatie met behulp van SvelteKit.
- Begrijpen wat `+page.svelte`-bestanden zijn, wat hun doel is en hoe je ze kunt gebruiken om pagina's voor je applicatie te maken.
- Begrijpen wat `+layout.svelte`-bestanden zijn, wat hun doel is en hoe je ze kunt gebruiken om lay-outs voor je applicatie te maken.
- Begrijpen hoe je Components in Svelte maakt om je UI te modulariseren voor herbruikbaarheid.
- Begrijpen hoe je TypeScript gebruikt in Svelte-componenten.
- Begrijpen hoe de `$state`- en `$derived`-runes werken in Svelte om reactieve variabelen en afgeleide state te creëren.
- Begrijpen hoe je de `$props()`-rune gebruikt om gegevens tussen componenten door te geven.
- Begrijpen hoe je strings hergebruikt over componenten heen.

Aan het einde van dit hoofdstuk heb je gemaakt:
- Een Svelte-applicatie met basis-layout en routing.
- Een site met de volgende structuur:
    - `/`: Een startpagina met een welkomstbericht en een reactieve teller.
    - `/about`: Een over-ons-pagina met een bericht over de applicatie.
    - `/dashboard`: Een dashboard-pagina met links naar gebruikers- en sessiepagina's.
        - `/dashboard/user`: Een gebruikerspagina met voorbeeldinhoud.
        - `/dashboard/sessions`: Een sessiepagina met voorbeeldinhoud.
- Een herbruikbare, gestylde en modulaire `NavBar.svelte`-component.

### Vereisten

- Basisbegrip van HTML, CSS en JavaScript/TypeScript.
- Basiskennis van web development-terminologie en -concepten.

### Leermiddelen

- [HTML (W3 schools)](https://www.w3schools.com/html/)
- [CSS (W3 schools)](https://www.w3schools.com/css/)
- [JavaScript (W3 schools)](https://www.w3schools.com/js/)
- Typescript:
    - [Typescript (Mozilla)](https://developer.mozilla.org/en-US/docs/Glossary/TypeScript)
    - [Typescript (W3 schools)](https://www.w3schools.com/typescript/)
    - [Typescript (Officiële Documentatie)](https://www.typescriptlang.org/docs/)
- Svelte:
    - [Svelte (Officiële Documentatie)](https://svelte.dev/docs)
    - [Svelte (Interactieve Tutorial)](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
    - [SvelteKit (Officiële Documentatie)](https://svelte.dev/docs/kit/introduction)
- Tailwind CSS:
    - [Tailwind CSS (Officiële Documentatie)](https://tailwindcss.com/docs/styling-with-utility-classes)

## Waarom Svelte?

Svelte en SvelteKit zijn geweldige frameworks voor het bouwen van webapplicaties. Er zijn veel andere frameworks beschikbaar, zoals [React](https://reactjs.org/), [Vue](https://vuejs.org/) en [Angular](https://angular.io/), maar Svelte onderscheidt zich door zijn gebruiksgemak en eenvoudige maar grondige documentatie. Svelte heeft ook een geweldige [interactieve tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte) die een goede manier is om de basis van het framework te leren.

### Populariteit en community
Hoewel [niet zo populair](https://survey.stackoverflow.co/2024/technology#1-web-frameworks-and-technologies) als andere frameworks vanaf 2024, wint Svelte [terrein](https://2024.stateofjs.com/en-US/libraries/front-end-frameworks/) en wordt het, volgens de homepage, consistent gerangschikt als het meest geliefde framework. De Stack Overflow-enquête toonde aan dat [73% van de ontwikkelaars](https://survey.stackoverflow.co/2024/technology#2-web-frameworks-and-technologies) die Svelte gebruiken, met Svelte willen blijven werken.
Het is leuk, gemakkelijk te leren en heeft een behulpzame community (bijv. hun [Discord-server](https://discord.com/invite/svelte) heeft veel actieve discussies en leden die vragen stellen - en beantwoorden).

### Maar is het een goede carrièrekeuze?
Ja! Maar misschien om andere redenen dan je zou hopen of denken.
- **Svelte wordt *niet* zo veel gebruikt in de industrie als sommige andere frameworks** (hoewel we je al hebben laten zien dat het terrein wint), dus je zult misschien niet zoveel stages of vacatures vinden die specifiek om ervaring met Svelte vragen.
- **Svelte is gemakkelijk te leren en toegankelijk voor beginners**, wat betekent dat het een geweldige manier is om na te denken over web development en het bouwen van applicaties, zonder alle complexiteit die andere frameworks kunnen introduceren.
- **Je kunt veel van de vaardigheden die je in Svelte leert overzetten naar andere frameworks**, en veel bedrijven zijn op zoek naar ontwikkelaars die snel nieuwe technologieën kunnen leren. Dus, hoewel je misschien geen baan vindt die specifiek om Svelte-ervaring vraagt, zul je merken dat de vaardigheden die je in deze cursus leert, je zullen helpen een baan in web development te vinden.
- **Je kunt altijd later uitbreiden naar andere frameworks als je dat wilt.** Veel ervan delen veel concepten met Svelte (Components, state management, routing, enz.), en je zult merken dat je kennis van Svelte je zal helpen om andere frameworks gemakkelijker te leren. (Je zult waarschijnlijk ook merken dat je wenst dat ze dingen deden zoals Svelte doet).

### De belangrijkste reden om Svelte te gebruiken
**Svelte is gewoon prettig om mee te werken. Wat betekent dat je waarschijnlijker deze cursus zult afronden**. Het heeft een eenvoudige en intuïtieve syntax, en gebruikt een compiler om veel van de complexe logica te abstraheren die je in andere frameworks zou kunnen vinden. Dit betekent dat je je kunt richten op het bouwen van je applicatie zonder te veel te verzanden in de details van het framework zelf.
Dit is vooral belangrijk voor een cursus als deze, waar we willen dat je je kunt richten op het bouwen van je applicatie en het leren van de concepten, in plaats van vast te lopen op het framework zelf.

## Svelte en SvelteKit

Deze twee termen lijken misschien op elkaar, maar ze verwijzen naar verschillende dingen:

- **Svelte** is een Component-gebaseerd framework waarmee je herbruikbare UI-componenten kunt bouwen.
    - Het is een manier om componenten te schrijven die compileren naar sterk geoptimaliseerde JavaScript-code die in de browser draait, wat resulteert in snelle en efficiënte applicaties.
    - Svelte is ontworpen om gemakkelijk te leren en te gebruiken, met een eenvoudige en intuïtieve syntax waarmee je je kunt richten op het bouwen van je applicatie in plaats van het framework zelf.
- **SvelteKit** is een framework voor het bouwen van webapplicaties met Svelte dat routing, server-side rendering en andere functies biedt.
    - Het is gebouwd voor applicaties die Svelte gebruiken en biedt een set tools en conventies voor het bouwen van webapplicaties.
    - SvelteKit is de aanbevolen manier om Svelte-applicaties te bouwen, omdat het veel functies out of the box biedt die je anders zelf zou moeten implementeren.

Hier is een eenvoudige analogie: We kunnen Svelte gebruiken om een webpagina te maken. SvelteKit stelt ons in staat om een complete webapplicatie te maken.

Raadpleeg de [SvelteKit-documentatie](https://svelte.dev/docs/kit/introduction#SvelteKit-vs-Svelte) voor meer informatie over de verschillen tussen Svelte en SvelteKit.

## Basis Svelte

In de vorige sectie hebben we onze Svelte-applicatie gemaakt met behulp van de 'Skeleton'-template. Nu zullen we onze basisapplicatiestructuur opzetten.

> ⚠️ Voordat we verder gaan, zorg ervoor dat je ten minste een deel van de [interactieve Svelte-tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte) hebt voltooid om vertrouwd te raken met Svelte. Het legt de basisprincipes van Svelte perfect uit.
We zullen hier nog steeds enkele basisprincipes van Svelte behandelen, maar het wordt sterk aanbevolen om eerst de interactieve tutorial te volgen en daarna terug te komen naar deze sectie om je nieuw verworven kennis te versterken.

Probeer ten minste deze onderwerpen te behandelen voordat je verdergaat (of, op zijn minst, voltooi ze wanneer je ze in dit hoofdstuk tegenkomt):

- [ ] Basis Svelte
    - [ ] Introductie
    - [ ] Reactiviteit
    - [ ] Props
        - [ ] Props Declaring
        - [ ] Default Values
    - [ ] Logica
    - [ ] Events
        - [ ] Dom Events
        - [ ] Inline Handlers
    - [ ] Bindings
        - [ ] Text inputs
        - [ ] Numeric inputs
    - [ ] Classes en Styles
- [ ] Basis SvelteKit
    - [ ] Introductie
    - [ ] Routing

Het is begrijpelijk als je nog niet alles in de interactieve tutorial begrijpt, maar dit zou je een goed startpunt moeten geven om de rest van dit hoofdstuk te volgen.

### De applicatiestructuur begrijpen

De projectstructuur van een Svelte-applicatie wordt redelijk goed beschreven in de [SvelteKit-documentatie](https://svelte.dev/docs/kit/project-structure), maar laten we eens kijken naar de structuur van onze gegenereerde Svelte-applicatie (met behulp van de `sv` CLI) om te begrijpen hoe het werkt en welke bestanden belangrijk zijn om te kennen.

![tree.png](/tutorial/1-svelte/img/tree.png)

Laten we de relevante delen van deze structuur voor nu uitsplitsen:
- `src/`: Dit is de hoofdbronmap voor je Svelte-applicatie. Al je Svelte-componenten, routes en stijlen worden hier geplaatst.
    - `src/lib/`: Deze map wordt gebruikt voor herbruikbare componenten en utilities. Je kunt hier submappen aanmaken om je code beter te organiseren.
    - `src/routes`: Deze map bevat de routingstructuur van je applicatie. Elk bestand in deze map komt overeen met een route in je applicatie.
        - `+layout.svelte`: Dit bestand definieert de layout voor je applicatie. Het wordt gebruikt om alle pagina's in je applicatie te omwikkelen met een gemeenschappelijke layout (bijv. een navigatiebalk, footer, enz.).
        - `+page.svelte`: Dit bestand definieert de content voor de root-route (`/`) van je applicatie. Je kunt extra `+page.svelte`-bestanden in submappen aanmaken om content voor andere routes te definiëren.
    - `app.css`: Dit bestand bevat de globale stijlen voor je applicatie. Je kunt hier Tailwind CSS importeren om je applicatie te stylen.
    - `app.d.ts`: Dit bestand wordt gebruikt om TypeScript-types voor je applicatie te definiëren. Het kan worden gebruikt om globale types of interfaces te declareren die door je hele applicatie worden gebruikt.
    - `app.html`: Dit is het hoofd-HTML-bestand voor je applicatie. Het wordt gebruikt om de structuur van je applicatie te definiëren en kan worden gewijzigd om extra meta-tags, links of scripts op te nemen.
- `static/`: Deze map wordt gebruikt om statische assets voor je applicatie op te slaan, zoals afbeeldingen, lettertypen of andere bestanden die niet veranderen.
    - `favicon.png`: Dit is de favicon voor je applicatie. Het definieert het kleine icoontje dat in een browsertabblad verschijnt.
- `README.md`: Dit bestand bevat informatie over je applicatie, zoals hoe je deze uitvoert, hoe je kunt bijdragen en andere relevante details.
- `drizzle.config.ts`: Dit bestand wordt gebruikt om Drizzle ORM te configureren, wat een TypeScript ORM is voor het werken met databases.
- `package.json`: Dit bestand bevat de metadata voor je applicatie, zoals de naam, versie, dependencies en scripts.

**Bestanden die we niet zullen aanraken, maar die wel belangrijk zijn om te weten:**
- `package-lock.json`: Dit bestand wordt automatisch gegenereerd door npm en bevat de exacte versies van de dependencies die in je applicatie zijn geïnstalleerd.
- `eslint.config.js`: Dit bestand wordt gebruikt om ESLint te configureren, een tool voor het identificeren en oplossen van problemen in je JavaScript/TypeScript-code.
- `svelte.config.js`: Dit bestand wordt gebruikt om Svelte en zijn plugins te configureren. Het kan worden gebruikt om het gedrag van Svelte aan te passen en extra functies toe te voegen.
- `tsconfig.json`: Dit bestand wordt gebruikt om TypeScript voor je applicatie te configureren. Het definieert de compileropties en de bestanden die in de compilatie moeten worden opgenomen.
- `vite.config.ts`: Dit bestand wordt gebruikt om Vite te configureren, een build-tool voor moderne webapplicaties. Het definieert hoe je applicatie moet worden gebouwd en geserveerd.

## Onze eerste pagina bewerken

Laten we eens kijken naar `src/routes/+page.svelte`:

```svelte
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="[https://svelte.dev/docs/kit](https://svelte.dev/docs/kit)">svelte.dev/docs/kit</a> to read the documentation</p>
````

Zoals hierboven vermeld, definieert de `src/routes`-map de routingstructuur van onze applicatie. We kunnen het zien als de root-directory van onze applicatie. Het `+page.svelte`-bestand definieert de content voor de root-route (`/`).

We kunnen zien hoe het `+page.svelte`-bestand eruitziet in de browser door de applicatie uit te voeren.
Als je dat nog niet hebt gedaan, voer dan `npm run dev` uit in de terminal om de development-server te starten. (Zorg ervoor dat je dit uitvoert in de root-directory van de Svelte-applicatie, bijv. `~/work/svelte-db-portal/app`, niet in de root van de Git-repository, bijv. `~/work/svelte-db-portal`). Het is een goed idee om deze terminal op de achtergrond open te houden terwijl je aan je applicatie werkt, aangezien deze je wijzigingen automatisch hot-reloaded.

Terwijl de development-server draait, open je browser en navigeer je naar [`http://localhost:5173/`](https://www.google.com/search?q=http://localhost:5173/) zoals gevraagd. Je zou de content van het `+page.svelte`-bestand in de browser moeten zien:

![standard-page.png](/tutorial/1-svelte/img/standard-page.png)

Laten we dit bestand bewerken om onze eigen welkomstboodschap toe te voegen.

```svelte
<h1>Welcome to the Web Portal</h1>
<p>We hope you enjoy your stay!</p>
```

En zie het direct na het opslaan updaten, zonder de browser opnieuw te hoeven laden.

![custom-welcome.png](/tutorial/1-svelte/img/custom-welcome.png)

Nu *zouden* we wat styling kunnen toevoegen met de `style`-tag en wat CSS, en dat ook zien updaten:

```svelte
<h1>Welcome to the Web Portal</h1>
<p>We hope you enjoy your stay!</p>

<style>
  h1 {
    font-size: 2em;
    font-weight: bold;
  }
</style>
```
![styled-welcome.png](/tutorial/1-svelte/img/styled-welcome.png)

Maar aangezien we [Tailwind CSS](https://www.google.com/search?q=) hebben geïnstalleerd, zullen we die niet gebruiken. In plaats daarvan gebruiken we de class-based styling van Tailwind:

```
<h1 class="text-3xl font-bold">Welcome to the Web Portal</h1>
<p>We hope you enjoy your stay!</p>
```

Oké, dus we weten dat we nu een aantal vrij basis dingen kunnen doen. Laten we eens kijken naar iets geavanceerder.

## Ons eerste reactieve element toevoegen ($state en $derived)

Om een gevoel te krijgen van hoe Svelte werkt, voegen we een kleine knop en wat tekst toe die het aantal keren weergeeft dat we op die knop hebben geklikt.

```svelte
<div class="flex flex-col gap-2">
	<h1 class="text-3xl font-bold">Welcome to the Web Portal</h1>
	<p>We hope you enjoy your stay!</p>

	<p>We're building this website. But for now, here's a button. How many times can you click it?</p>

	<button class="max-w-36 rounded-lg border px-4">Click me!</button>
	<p>You have clicked the button <span class="text-red-500">X</span> times.</p>
</div>
```

![button-welcome.png](/tutorial/1-svelte/img/button-welcome.png)

Dit doet uiteraard nog niet veel, maar laten we die functionaliteit toevoegen. Hiervoor moeten we twee van de runes begrijpen die Svelte biedt: [`$state`](https://svelte.dev/docs/svelte/$state) en [`$derived`](https://svelte.dev/docs/svelte/$derived) (klik op de links om de officiële documentatie te zien).

  - `$state`: Hiermee kun je reactieve state creëren, wat betekent dat je UI reageert wanneer deze verandert.
  - `$derived`: Hiermee kun je afgeleide state creëren, wat betekent dat je een variabele kunt maken die *afhangt* van een andere variabele. Deze wordt automatisch bijgewerkt wanneer de variabele waarvan deze afhangt verandert.

<!-- end list -->

1.  We voegen een `script`-tag direct in de `.svelte`-pagina toe, waardoor de logica dicht bij de UI blijft die het beïnvloedt.
2.  We definiëren een variabele `buttonClicks` om het aantal keren dat de knop is geklikt te bewaren.
3.  We gebruiken de `$state`-rune om deze variabele reactief te maken, zodat wanneer deze verandert, de UI waarin deze wordt gebruikt automatisch wordt bijgewerkt.
4.  We voegen een `onclick` event handler toe aan de knop die de `buttonClicks`-variabele verhoogt wanneer de knop wordt geklikt.
    (We kunnen een inline handler gebruiken of verwijzen naar een functie die we in de script-tag definiëren.)
5.  We gebruiken de `$derived`-rune om een afgeleide `timesOrTimes`-variabele te creëren die de meervoudsvorm afhandelt op basis van het aantal klikken, zodat "time" wordt weergegeven voor 1 klik en "times" voor 0 of meer dan 1 klik.
6.  We vervangen de `X` en `times`-tekst in de paragraaf door verwijzingen naar onze reactieve variabelen met behulp van de `{}`-syntax.

<!-- end list -->

```svelte
<script lang="ts">
	// The $state rune is used to create a reactive state variable.
	let buttonClicks: number = $state(0);
	// The $derived rune is used to create a derived variable that updates when its dependencies change.
	let timeOrTimes: string = $derived(buttonClicks === 1 ? 'time' : 'times');
</script>

<div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold">Welcome to the Web Portal</h1>
    <p>We hope you enjoy your stay!</p>

    <p>We're building this website. But for now, here's a button. How many times can you click it?</p>

    <button class="max-w-36 rounded-lg border px-4" onclick={() => buttonClicks++}>Click me!</button>
    <p>You have clicked the button <span class="text-red-500">{buttonClicks}</span> {timeOrTimes}.</p>
</div>
```

Laten we het in actie zien:

![reactive-button.gif](/tutorial/1-svelte/img/reactive-button.gif)

Cool\! Het is een eenvoudig voorbeeld, maar geeft een goed idee van hoe de reactiviteit van Svelte werkt.
Laten we nu enkele routing-functies van SvelteKit in actie zien.

## Pagina's en routing toevoegen

Om een nieuwe pagina aan onze applicatie toe te voegen, moeten we eerst een nieuwe directory maken in de `src/routes`-directory.
De naam van die directory zal de naam van de route zijn, dus om een "About"-pagina te maken, zouden we een nieuwe directory genaamd `about` maken in de `src/routes`-directory, en vervolgens een `+page.svelte`-bestand toevoegen in die directory:

```
mkdir src/routes/about
touch src/routes/about/+page.svelte
```

Laten we er nu wat inhoud aan toevoegen:

```svelte
<h1 class="text-3xl font-bold">About us.</h1>
<p>This is some very important information about us.</p>
```

Als we dan naar [`http://localhost:5173/about`](https://www.google.com/search?q=http://localhost:5173/about) in onze browser navigeren, zouden we de inhoud van de `about`-pagina moeten zien:

![about-us.png](/tutorial/1-svelte/img/about-us.png)

Dus wat als we wat subpagina's wilden toevoegen, zoals een dashboard-pagina op `/dashboard`, een dashboard-subpagina voor gebruikers op `/dashboard/user` en nog een dashboard-subpagina voor sessies op `/dashboard/session`?
Welnu, we zouden gewoon de `src/routes/dashboard`-directory maken zoals we hierboven deden, submappen toevoegen in de `dashboard`-directory, en ook `+page.svelte`-bestanden toevoegen in die mappen:

```svelte
<h1 class="text-3xl font-bold">Dashboard.</h1>
<p>This is where the dashboard will live.</p>

<h2 class="text-xl font-bold">User Page</h1>
<p>This is the user page.</p>

<h2 class="text-xl font-bold">Session Page</h1>
<p>This is the session page.</p>
```

En nogmaals,

  - gegeven de route `/dashboard`, kunnen we navigeren naar [`http://localhost:5173/dashboard`](https://www.google.com/search?q=http://localhost:5173/dashboard) om de dashboardpagina te zien.
  - gegeven de route `/dashboard/user`, kunnen we navigeren naar [`http://localhost:5173/dashboard/user`](https://www.google.com/search?q=http://localhost:5173/dashboard/user) om de gebruikers-subpagina te zien.
  - gegeven de route `/dashboard/session`, kunnen we navigeren naar [`http://localhost:5173/dashboard/session`](https://www.google.com/search?q=http://localhost:5173/dashboard/session) om de sessies-subpagina te zien.

Momenteel zijn de dashboardpagina's allemaal afzonderlijke pagina's, dus de Dashboard-header is niet zichtbaar op de gebruikers- en sessiepagina's. We kunnen de dashboardpagina's echter consolideren om een gemeenschappelijke layout te delen, wat we in de volgende sectie zullen doen.

## `+layout.svelte` en $props gebruiken

Het `+layout.svelte`-bestand wordt gebruikt om een lay-out voor je applicatie te definiëren. Het stelt je in staat om alle pagina's in je applicatie te omwikkelen met een gemeenschappelijke lay-out, zoals een navigatiebalk, footer of andere componenten die op elke pagina aanwezig moeten zijn.

Elk `+layout.svelte`-bestand is van toepassing op alle pagina's in de directory en eventuele subdirectories. Een `+layout.svelte`-bestand in de `src/routes`-directory is bijvoorbeeld van toepassing op alle pagina's in de applicatie, terwijl een `+layout.svelte`-bestand in de `src/routes/dashboard`-directory alleen van toepassing is op de pagina's in de `dashboard`-directory en de subdirectories.

Laten we eens kijken naar het `src/routes/+layout.svelte`-bestand dat voor ons is gegenereerd:

```svelte
<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
```

We zien dat het een `children` prop blootstelt met behulp van de [`$props()` rune](https://svelte.dev/docs/svelte/$props), die wordt gebruikt voor het doorgeven van data tussen pagina's (en componenten). Dit is een speciale property die automatisch de inhoud van de sub layouts en subpagina's zal bevatten die binnen deze layout worden gerenderd.

De `{@render children()}`-syntax wordt gebruikt om de inhoud van de `children` prop te renderen. We kunnen hieromheen markup schrijven om de lay-out van onze applicatie te definiëren.

Laten we bijvoorbeeld een eenvoudige navigatiebalk aan onze lay-out toevoegen.

```svelte
<script lang="ts">
	import '../app.css';
	import type { Page } from '$lib/types/page';

	let { children } = $props();
</script>

<div class="flex gap-x-4">
    <a href="/" class="underline">
        Home
    </a>
    <a href="/about" class="underline">
        About Us
    </a>
    <a href="/dashboard" class="underline">
        Dashboard
    </a>
</div>

{@render children()}
```

We zouden de navigatielinks op elke pagina moeten zien verschijnen, voor de inhoud:

![simple-nav.gif](/tutorial/1-svelte/img/simple-nav.gif)

Oké, cool\! Maar we moeten onze dashboardpagina's nog consolideren om een gemeenschappelijke lay-out te delen. Laten we nu eens kijken hoe we dat kunnen doen.

Zoals gezegd, zijn de `+layout.svelte`-bestanden van toepassing op alle pagina's in de directory *en eventuele subdirectories*. Dus, om een lay-out voor de dashboardpagina's te maken, kunnen we een nieuw `+layout.svelte`-bestand maken in de `src/routes/dashboard`-directory:

```svelte
<script lang="ts">
	let { children } = $props();
</script>

<h1 class="text-3xl font-bold">Dashboard.</h1>

<div class="flex gap-x-4">
    <a href="/dashboard/user" class="underline">
        User
    </a>
    <a href="/dashboard/session" class="underline">
        Sessions
    </a>
</div>

{@render children()}
```

We kunnen nu de inhoud van het `src/routes/dashboard/+page.svelte`-bestand aanpassen om de header een sub-header te maken, aangezien we al een header in de lay-out hebben:

```svelte
<h2 class="text-xl font-bold">Dashboard home.</h2>
<p>This is where the dashboard will live.</p>
```

Nu kunnen we zien dat de dashboardpagina's een gemeenschappelijke lay-out delen:

![shared-layout.gif](/tutorial/1-svelte/img/shared-layout.gif)

Cool\!
We hebben echter nu dubbele markup voor onze navigatie in zowel ons `src/routes/+layout.svelte`-bestand als ons `src/routes/dashboard/+layout.svelte`-bestand, die niet echt *direct verband houdt* met het definiëren van een lay-out. Bovendien zijn de URL's hardcoded. Dat kunnen we veel beter doen. Door het [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) toe te passen, zouden we deze navigatielogica moeten extraheren naar een aparte component, en die component vervolgens in onze lay-out gebruiken.
Gelukkig maakt Svelte dit gemakkelijk.

## Je eerste Svelte-component maken

Een Svelte-component is een zelfstandig stuk UI, en kan zijn eigen logica, stijlen en markup bevatten. Een component kan ook props accepteren, die worden gebruikt om data van de parent-component naar de child-component door te geven.

Het maken van een nieuwe component is net zo eenvoudig als het maken van een nieuw `.svelte`-bestand. De aanbevolen locatie voor herbruikbare componenten is de `src/lib`-directory. We kunnen subdirectories maken om onze componenten beter te organiseren.

Laten we een deel van onze navigatie-markup van `src/routes/+layout.svelte` verplaatsen naar een nieuwe `NavBar.svelte`-component in de `src/lib/ui/nav`-directory:

```svelte
<div class="flex gap-x-4">
    <a href="/" class="underline">
        Home
    </a>
    <a href="/about" class="underline">
        About Us
    </a>
    <a href="/dashboard" class="underline">
        Dashboard
    </a>
</div>
```

En nu, laten we deze component importeren in ons `/src/routes/+layout.svelte`-bestand. (`$lib` is een speciale alias die verwijst naar de `src/lib`-directory, dus we kunnen onze component zo importeren):

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/ui/nav/NavBar.svelte';

	let { children } = $props();
</script>

<NavBar />
{@render children()}
```

Dat ziet er al veel beter uit, maar deze component is nog niet erg herbruikbaar.
We moeten deze component ook in ons `src/routes/dashboard/+layout.svelte`-bestand hergebruiken, maar om dat te doen moeten we eerst begrijpen hoe we props aan componenten kunnen doorgeven, en hoe we het `#each`-blok kunnen gebruiken om arrays in Svelte te itereren.

## Het \#each blok gebruiken

Om onze navigatiebalk gemakkelijker te onderhouden, kunnen we gebruik maken van het `[#each](https://svelte.dev/docs/svelte/each)`-blok om te itereren over een array van pagina's en de links dynamisch te renderen. Op deze manier hoeven we, als we pagina's willen toevoegen of verwijderen, alleen de array bij te werken, in plaats van de markup.

Laten we onze `NavBar.svelte`-component aanpassen om het `#each`-blok te gebruiken:

```svelte
<script lang="ts">
	let pages = [
		{ name: 'Home', url: '/', description: 'The home page.' },
		{ name: 'About Us', url: '/about', description: 'Learn more about us.' },
		{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' }
	]
</script>

<div class="flex gap-x-4">
	{#each pages as page (page.url)}
		<a
			href={page.url}
			class="underline"
			title={page.description}
		>
			{page.name}
		</a>
	{/each}
</div>
```

Hopelijk zie je al waar dit naartoe gaat. We hebben een array van `pages`, en we hebben al geleerd dat we `$props()` kunnen gebruiken om data door te geven aan componenten. Dus uiteindelijk zullen we alle informatie over de pagina's uit onze `NavBar.svelte`-component verwijderen en deze in plaats daarvan doorgeven vanuit de parent-component.
Voordat we daarop ingaan, moeten we een korte omweg maken om te begrijpen hoe we typeveiligheid aan onze componenten kunnen toevoegen met behulp van TypeScript, zodat we weten dat we de juiste data doorgeven.

## TypeScript gebruiken in Svelte-componenten

Svelte ondersteunt TypeScript out of the box, waardoor we types kunnen definiëren voor onze variabelen en props. Dit kan ons helpen fouten vroegtijdig op te sporen en de onderhoudbaarheid van onze code te verbeteren.

Voor typeveiligheid, laten we het `PageInfo`-type extrapoleren naar een `interface` in een apart bestand, zodat we het gemakkelijk kunnen hergebruiken in andere componenten of bestanden, mochten we dat nodig hebben.

Maak een nieuw bestand aan in `src/lib/types/page.ts` en definieer de `PageInfo`-interface:

```typescript
// src/lib/types/pageInfo.ts

export interface PageInfo {
	name: string;
	description: string;
	url: string;
}
```

Nu kunnen we deze `PageInfo`-interface importeren en gebruiken in onze `NavBar.svelte`-component:

```svelte
<script lang="ts">
	import type { PageInfo } from '$lib/types/pageInfo';

	let pages: PageInfo[] = [
		{ name: 'Home', url: '/', description: 'The home page.' },
		{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' },
		{ name: 'About Us', url: '/about', description: 'Learn more about us.' }
	];
</script>

<div class="flex gap-x-4">
	{#each pages as page (page.url)}
		<a href={page.url} class="underline" title={page.description}>
			{page.name}
		</a>
	{/each}
</div>
```

Het lijkt misschien alsof we niet veel hebben veranderd, maar we hebben nu typeveiligheid toegevoegd aan onze `pages`-array, wat ons zal helpen fouten vroegtijdig op te sporen als we een property met een incompatibel type proberen toe te voegen, of vergeten een vereiste property toe te voegen:

![type-error.png](/tutorial/1-svelte/img/type-error.png)

Geweldig\! Dit zal ons zeker helpen fouten te voorkomen naarmate we de complexiteit van onze applicatie verhogen.

Nu, zoals beloofd, kunnen we de `NavBar.svelte`-component herbruikbaarder maken door de `pages`-array als een prop beschikbaar te maken, en de data door te geven vanuit de parent-component in plaats van deze hard te coderen in de component zelf.

## Svelte-componenten hergebruiken met $props()

Momenteel heeft onze `NavBar.svelte`-component de `pages`-array hardcoded in de component. We willen deze herbruikbaarder maken door de `pages`-array als een prop door te geven vanuit de parent-component. Op deze manier kunnen we de `NavBar`-component hergebruiken om de links naar Home, About Us en Dashboard weer te geven, maar ook om de links naar de Dashboard-subpagina's weer te geven.

Om dit te doen, laten we de `pages`-array als een prop in `NavBar.svelte` beschikbaar maken:

```svelte
<script lang="ts">
	import type { PageInfo } from '$lib/types/pageInfo';

	let { pages }: { pages: PageInfo[] } = $props();
</script>

<div class="flex gap-x-4">
	{#each pages as page (page.url)}
		<a href={page.url} class="underline" title={page.description}>
			{page.name}
		</a>
	{/each}
</div>
```

En geef de `pages`-array door in `+/src/routes/+layout.svelte` in plaats daarvan:

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/ui/nav/NavBar.svelte';
	
    let pages: PageInfo[] = [
		{ name: 'Home', url: '/', description: 'The home page.' },
		{ name: 'About Us', url: '/about', description: 'Learn more about us.' },
		{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' }
	];

	let { children } = $props();
</script>

<NavBar pages={pages} />
{@render children()}
```

Laten we hetzelfde doen voor ons `src/routes/dashboard/+layout.svelte`-bestand, zodat we de `NavBar`-component daar ook kunnen hergebruiken:

```svelte
<script lang="ts">
	import NavBar from '$lib/ui/nav/NavBar.svelte';

	let pages: PageInfo[] = [
        { name: 'User', url: '/dashboard/user', description: 'Query user information' },
        { name: 'Session', url: '/dashboard/session', description: 'View session details.' }
	];

	let { children } = $props();
</script>

<h1 class="text-3xl font-bold">Dashboard.</h1>

<NavBar pages={pages} />

{@render children()}
```

Oké, dat ziet er veel beter uit. Maar de scherpe onder jullie hebben misschien gemerkt dat we nu een eerder probleem opnieuw hebben geïntroduceerd. De `pages`-array is nu opgeslagen op twee verschillende plaatsen, en geen van beide zou echt verantwoordelijk moeten zijn voor het opslaan van de navigatiegegevens.
Laten we dat oplossen met behulp van constanten.

## Onveranderlijke waarden hergebruiken over componenten heen

We hebben een aantal onveranderlijke waarden in onze applicatie, zoals de `pages`-array en de `dashboardPages`-array. We kunnen deze in een apart bestand opslaan en importeren in onze componenten, zodat we ze in onze applicatie kunnen hergebruiken zonder de data te dupliceren.

Laten we een nieuw bestand maken in `src/lib/constants/navigation.ts` en daar onze `PAGES` en `DASHBOARD_PAGES` constanten definiëren:

```typescript
// /src/lib/constants/navigation.ts

import { PanelsTopLeft, User, Dumbbell } from 'lucide-svelte';
import type { PageInfo } from '$lib/types/pageInfo';

export const PAGES: PageInfo[] = [
	{ name: 'Home', url: '/', description: 'The home page.' },
	{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' },
	{ name: 'About Us', url: '/about', description: 'Learn more about us.' }
];

export const DASHBOARD_PAGES: PageInfo[] = [
	{
		name: 'Overview',
		url: '/dashboard/',
		description: 'Dashboard overview.',
		icon: PanelsTopLeft
	},
	{
		name: 'User',
		url: '/dashboard/user',
		description: 'Query user information',
		icon: User
	},
	{
		name: 'Session',
		url: '/dashboard/session',
		description: 'View session details.',
		icon: Dumbbell
	}
];
```

En gebruik de stores in onze `+layout.svelte`-bestanden in plaats daarvan (let op het `$`-voorvoegsel om toegang te krijgen tot de waarde van de store):

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/ui/nav/NavBar.svelte';
	import { PAGES } from '$lib/constants/navigation';

	let { children } = $props();
</script>

<NavBar pages={PAGES} />
{@render children()}


<script lang="ts">
	import NavBar from '$lib/ui/nav/NavBar.svelte';
	import { DASHBOARD_PAGES } from '$lib/constants/navigation';

	let { children } = $props();
</script>

<h1 class="text-3xl font-bold">Dashboard.</h1>

<NavBar pages={DASHBOARD_PAGES} />

{@render children()}
```

Nu hebben we een enkele bron voor onze navigatiegegevens. We kunnen eenvoudig pagina's toevoegen of verwijderen uit het `navigation.ts`-bestand, en de `NavBar`-component hergebruiken in onze root- en dashboard `+layout.svelte`-bestanden zonder de navigatiegegevens te dupliceren.

## Samenvatting

Ter afsluiting weten we nu hoe we:

  - Een Svelte-applicatie maken met SvelteKit.
  - De structuur van een Svelte-applicatie navigeren.
  - Content, TypeScript en stijlen toevoegen aan een Svelte-applicatie.
  - Pagina's en lay-outs maken met behulp van `+page.svelte`- en `+layout.svelte`-bestanden.
  - Herbruikbare componenten maken in Svelte.
  - TypeScript gebruiken in Svelte-componenten om typeveiligheid toe te voegen.
  - De `$state`- en `$derived`-runes gebruiken om reactieve variabelen en afgeleide state te creëren.
  - De `$props()`-rune gebruiken om data tussen componenten door te geven.
  - Onveranderlijke data hergebruiken over componenten heen met behulp van constanten.

We hebben ook een eenvoudig webportaal gebouwd met een startpagina, een over-ons-pagina en een dashboard met gebruikers- en sessiepagina's, allemaal met SvelteKit en Tailwind CSS.

Nu we enige ervaring hebben met Svelte als een web development framework, laten we proberen iets mooiers te creëren. In het volgende hoofdstuk leren we hoe we wat mooie UI aan onze applicatie kunnen toevoegen.
Zie [2.0 - UI](https://www.google.com/search?q=/tutorial/2-ui/README.md) voor meer informatie.

