# UI

Tot nu toe hebben we ons gericht op de functionaliteit van onze applicatie, waarbij we een kleine website hebben gemaakt met een paar pagina's en een interactieve knop.
In dit hoofdstuk gaan we de gebruikersinterface (UI) voor onze applicatie bouwen.
We zullen de website visueel aantrekkelijker en gebruiksvriendelijker maken, en ervoor zorgen dat deze goed werkt op verschillende apparaten en schermformaten.
We gebruiken [Skeleton](https://www.skeleton.dev/), een adaptief design system aangedreven door Tailwind CSS, om ons te helpen een responsive en moderne UI te creëren.

## Hoofdstukoverzicht

### Leerdoelen

Aan het einde van dit hoofdstuk kun je:

  - lucide-svelte installeren en gebruiken om icons te renderen in Svelte componenten.
  - Het Skeleton UI framework opzetten met Tailwind CSS in een SvelteKit project.
  - Skeleton utility classes toepassen om componenten te stylen.
  - Skeleton componenten gebruiken om een responsive, mobile-first, thematiseerbare layout te bouwen.
  - Een herbruikbare theme switcher component bouwen die gebruikersvoorkeuren opslaat met `localStorage` en Svelte state.
  - Een dynamische NavBar implementeren die schakelt tussen modale en inline navigatie.
  - Skeleton's Navigation.Rail en Navigation.Bar componenten gebruiken voor sectie-gebaseerde navigatie.
  - Een flexibele Card component creëren met behulp van Svelte snippets en Tailwind styling.

### Vereisten

  - Basiskennis van Svelte en SvelteKit (zoals behandeld in de vorige hoofdstukken).
  - Enige bekendheid met [Tailwind CSS](https://tailwindcss.com/).
  - Basiskennis van [responsive design principes](https://www.interaction-design.org/literature/article/responsive-design-let-the-device-do-the-work).

### Leermiddelen

  - [Lucide Svelte installation](https://lucide.dev/guide/installation#svelte)
  - [Lucide icons database](https://lucide.dev/icons)
  - [Skeleton installation](https://www.skeleton.dev/docs/get-started/installation/sveltekit)
  - [Skeleton themes](https://www.skeleton.dev/docs/design/themes)
  - [Responsive design with Tailwind](https://tailwindcss.com/docs/responsive-design)
  - [Dark mode with Tailwind](https://tailwindcss.com/docs/dark-mode)
  - [Theme variables with Tailwind](https://tailwindcss.com/docs/theme)

## Lucide

Laten we het eerst hebben over [Lucide](https://lucide.dev/). Het is een community-gebaseerde verzameling van mooie icons die gebruikt kunnen worden in webapplicaties.
We zullen `lucide-svelte` in onze UI gebruiken, maar eerst moeten we het installeren. (Skeleton gebruikt Lucide ook voor sommige icons.)

### Lucide installeren

Raadpleeg altijd de [nieuwste instructies](https://lucide.dev/guide/installation#svelte) op de Lucide website voor installatie, aangezien het proces in de loop van de tijd kan veranderen. Het enige wat we hoefden te doen was `npm install lucide-svelte` uitvoeren.

### Lucide gebruiken

Ter referentie, om Lucide te gebruiken importeren we eenvoudig de icons die we willen gebruiken in onze Svelte componenten. Om bijvoorbeeld de `sun` en `moon` icons te gebruiken, kunnen we het volgende doen:

```svelte
<script>
    import { Sun, Moon } from 'lucide-svelte';
</script>

<Sun />
<Moon />
```

Mooi. Als we later icons nodig hebben, hebben we daar nu een goede bron voor.

## Skeleton

Skeleton is een design system aangedreven door Tailwind CSS dat een set voorgeprogrammeerde componenten en utilities biedt om je te helpen snel responsive en moderne gebruikersinterfaces te bouwen.
Het gebruik van een design system zoals Skeleton stelt ons in staat minder tijd te besteden aan het creëren van componenten en meer tijd aan de functionaliteit van onze applicatie, terwijl we toch zorgen voor een consistent en visueel aantrekkelijk design.
Skeleton werkt goed samen met Svelte, waardoor we herbruikbare componenten kunnen creëren die gemakkelijk gestyled en aangepast kunnen worden.

### Skeleton installeren

Om met Skeleton te beginnen, moeten we het eerst in ons Svelte project installeren. Volg de [nieuwste instructies](https://www.skeleton.dev/docs/installation) op de Skeleton website voor installatie, aangezien het proces in de loop van de tijd kan veranderen. We zullen nog steeds de stappen die we hier hebben genomen doorlopen, maar ze kunnen verouderd zijn.

1.  We installeren Skeleton door de volgende opdracht uit te voeren in de root directory van de Svelte app:

    ```bash
    npm i -D @skeletonlabs/skeleton @skeletonlabs/skeleton-svelte
    ```

2.  Vervolgens moeten we Skeleton's stijlen importeren in onze Svelte app.
    Open `src/app.css` en voeg Skeleton's imports toe (let op, het importeert standaard het `cerberus` thema):

    ```css
    /* /src/app.css */

    @import 'tailwindcss';

    @import '@skeletonlabs/skeleton';
    @import '@skeletonlabs/skeleton/optional/presets';
    @import '@skeletonlabs/skeleton/themes/cerberus';

    @source '../node_modules/@skeletonlabs/skeleton-svelte/dist';
    ```

3.  Nu voegen we het `data-theme` attribuut toe aan de `<html>` tag in `src/app.html` om het `cerberus` thema toe te passen:

    ```html
    <!doctype html>
    <html lang="en" data-theme="cerberus">
        <head>
            <meta charset="utf-8" />
            <link rel="icon" href="%sveltekit.assets%/favicon.png" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            %sveltekit.head%
        </head>
        <body data-sveltekit-preload-data="hover">
            <div style="display: contents">%sveltekit.body%</div>
        </body>
    </html>
    ```

4.  (Her)start de development server en zie dat onze [theming](https://www.skeleton.dev/docs/design/themes) is veranderd:

![install-theme.png](/tutorial/2-ui/img/install-theme.png)

### Basis Skeleton componenten

Nu we Skeleton geïnstalleerd hebben, laten we proberen onze eerdere knop te veranderen naar een thematische knop met behulp van Skeleton's componenten (aangedreven door Tailwind CSS).

Na een snelle blik op de [Skeleton documentatie](https://www.skeleton.dev/docs/tailwind/buttons), kunnen we eenvoudig de voorbeeldcode voor een knop kopiëren naar ons `src/routes/+page.svelte` bestand:

```svelte
...
<button class="btn preset-filled-primary-500 max-w-36" onclick={() => buttonClicks++}>
    Click me!
</button>
...
```

En we zullen zien dat onze knop is veranderd in een thematische knop met een kleur volgens het Skeleton [Color System](https://www.skeleton.dev/docs/design/colors):

![themed-button.png](/tutorial/2-ui/img/themed-button.png)

Dit is een mooie knop, maar Skeleton kan meer dan alleen knoppen. Laten we eerst eens kijken hoe we het thema van onze website kunnen veranderen, en daarna zullen we enkele meer geavanceerde Skeleton componenten verkennen om tussen die thema's te schakelen.

### Skeleton Thema's en Dark Mode

Voordat we complexere UI aan onze applicatie toevoegen, is het een goed idee om wat thema's en dark mode ondersteuning in te stellen, zodat we onze UI daarmee in gedachten kunnen ontwerpen. Dit is zeker geen vereiste, maar het zal onze applicatie er gepolijster uit laten zien, en de beste tijd om dit te implementeren is nu.

Laten we eerst wat [thema's naar keuze](https://www.skeleton.dev/docs/design/themes) en [een dark mode toggle](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually) toevoegen aan ons `app.css` bestand.

```css
/* /src/app.css */

@import 'tailwindcss';

/* Skeleton imports */
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton/optional/presets';
@source '../node_modules/@skeletonlabs/skeleton-svelte/dist';

/* Skeleton themes */
@import '@skeletonlabs/skeleton/themes/catppuccin';
@import '@skeletonlabs/skeleton/themes/cerberus';
@import '@skeletonlabs/skeleton/themes/vintage';
@import '@skeletonlabs/skeleton/themes/modern';

/* Tailwind dark mode toggle */
@custom-variant dark (&:where([data-mode=dark], [data-mode=dark] *));
```

Je kunt proberen over te schakelen naar een van de nieuwe thema's door het `data-theme` attribuut in de `<html>` tag in `src/app.html` te wijzigen.

Je kunt ook proberen de dark mode in te schakelen door een `data-mode="dark"` attribuut toe te voegen aan de `<html>` tag in `src/app.html`.

```html
<html lang="en" data-theme="catppuccin" data-mode="dark">
```

Zoals je kunt zien, is het vrij eenvoudig om het thema van onze website te wijzigen.
Het zou echter mooi zijn als we de gebruiker de mogelijkheid zouden kunnen geven om zelf tussen thema's en dark mode te schakelen.
Laten we een theme switcher maken met behulp van enkele meer geavanceerde Skeleton componenten.

### Thema's wisselen en gebruikersvoorkeuren opslaan

We weten nu hoe we het thema van onze website kunnen veranderen met `data` attributen, maar we willen de gebruiker de mogelijkheid geven om ertussen te schakelen en hun voorkeur tussen sessies op te slaan.

Als we naar de [Skeleton documentatie](https://www.skeleton.dev/docs/integrations/popover/svelte) kijken, zien we dat er een component `Popover` is die nuttig kan zijn voor het maken van een Theme Switch.

Laten we eens kijken naar de voorbeeldcode voor de `Popover` component:

```svelte
<script lang="ts">
  import { Popover } from '@skeletonlabs/skeleton-svelte';
  import IconX from '@lucide/svelte/icons/x';

  let openState = $state(false);

  function popoverClose() {
    openState = false;
  }
</script>

<Popover
  open={openState}
  onOpenChange={(e) => (openState = e.open)}
  positioning={{ placement: 'top' }}
  triggerBase="btn preset-tonal"
  contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
  arrow
  arrowBackground="!bg-surface-200 dark:!bg-surface-800"
>
  {#snippet trigger()}Click Me{/snippet}
  {#snippet content()}
    <header class="flex justify-between">
      <p class="font-bold text-xl">Popover Example</p>
      <button class="btn-icon hover:preset-tonal" onclick={popoverClose}><IconX /></button>
    </header>
    <article>
      <p class="opacity-60">
        This will display a basic popover with a header and body. This also includes a title, description, and close button.
      </p>
    </article>
  {/snippet}
</Popover>
```

Laten we deze code doorlopen:

  - Het importeert de `Popover` component van Skeleton en een icon van Lucide.

  - Het creëert een state variabele `openState` die regelt of de popover open of gesloten is.

      - De `onOpenChange` event handler werkt de `openState` variabele bij wanneer de popover wordt geopend.

  - De `Popover` component wordt gebruikt met verschillende props:

      - `open`: regelt of de popover open of gesloten is.
      - `onOpenChange`: werkt de `openState` bij wanneer de open status van de popover verandert.
      - `positioning`: stelt de plaatsing van de popover in (in dit geval bovenaan).
      - `triggerBase`: definieert de basisklasse voor de trigger knop.
      - `contentBase`: definieert de basisklasse voor de inhoud van de popover.
      - `arrow`: voegt een pijl/speechbubble indicator toe aan de popover.
      - `arrowBackground`: stelt de achtergrondkleur van de pijl in.

  - We zien hier het eerste gebruik van [een Svelte `snippet`](https://www.google.com/search?q=%5Bhttps://svelte.dev/docs/svelte/snippet%5D\(https://svelte.dev/docs/svelte/snippet\)), waarmee we een stuk markup kunnen doorgeven aan de `Popover` component. In de broncode van de `Popover` (die [hier](https://github.com/skeletonlabs/skeleton/blob/e4c76d60c0738a266c305e44c5dc5944413bf8db/packages/skeleton-svelte/src/components/Popover/Popover.svelte) te vinden is) zien we dat de `trigger` en `content` snippets worden gerenderd met de `{@render snippet}` syntax. Op deze manier kunnen we componenten hergebruiken en secties van de component aanpassen zonder de hele component opnieuw te hoeven schrijven.

  - De knop roept `popoverClose` aan wanneer erop wordt geklikt, wat `openState` op `false` zet, waardoor de popover sluit.

  - Er is een `header` sectie met een titel en een sluitknop, en een `article` sectie voor de inhoud van de popover.

Laten we nu deze `Popover` code opslaan in een nieuw bestand `src/lib/ui/control/ThemeSwitch.svelte`, zodat we het later naar onze behoeften kunnen aanpassen.

> ℹ️ Het kan zijn dat de import voor de `IconX` een fout geeft.
> In ons geval moesten we deze vervangen door `import { X } from 'lucide-svelte';` en de `<IconX />` component door `<X />`.

We importeren de `ThemeSwitch` ook in ons `src/routes/+layout.svelte` bestand:

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/ui/nav/NavBar.svelte';
	import { PAGES } from '$lib/constants/navigation';
	import ThemeSwitch from '$lib/ui/control/ThemeSwitch.svelte';

	let { children } = $props();
</script>

<ThemeSwitch />
<NavBar pages={PAGES} />
{@render children()}
```

#### Themaconstanten

Allereerst voegen we voor type safety een nieuw Type `Theme` toe in `src/lib/types/theme.ts`:

```typescript
// /src/lib/types/theme.ts
export interface Theme {
	label: string;
	value: string;
}
```

Vervolgens maken we een bestand aan dat de beschikbare thema's bevat. Dit stelt ons in staat om gemakkelijk toegang te krijgen tot de thema's in onze applicatie en zorgt ervoor dat we de lijst met thema's op één plek kunnen bijwerken indien nodig.

```typescript
// /src/lib/constants/themes.ts

import type { Theme } from '$lib/types/theme';

// De label is de weergavenaam van het thema,
// terwijl de value de daadwerkelijke themanaam is die wordt gebruikt
// in het `data-theme` attribuut.
export const THEMES: Theme[] = [
	{ label: '🐱 Catppuccin', value: 'catppuccin' },
	{ label: '🐺 Cerberus', value: 'cerberus' },
	{ label: '📺 Vintage', value: 'vintage' },
	{ label: '💮 Modern', value: 'modern' }
];
```

#### Theme Switcher Markup

Laten we deze store gebruiken in onze `ThemeSwitch` component.

```svelte
<script lang="ts">
	import { THEMES } from '$lib/constants/themes';
	...
</script>

...

<article>
	<form>
		<label class="label">
			<span class="label-text">Select</span>
			<select class="select" bind:value={selectedTheme} onchange={handleThemeSelect}>
				{#each THEMES as theme (theme.value)}
					<option value={theme.value}>{theme.label}</option>
				{/each}
			</select>
		</label>
	</form>
</article>
```

Nu we toch bezig zijn, laten we de header van de popover content vervangen door een meer beschrijvende titel, en wat styling toevoegen aan de sluitknop:

```svelte
<header class="flex justify-between">
	<p class="text-xl font-bold">Kies Thema</p>
	<button class="btn-icon hover:preset-tonal" onclick={popoverClose}><X /></button>
</header>
```

En verander de `trigger` snippet om een Lucide icon te gebruiken voor de trigger knop:

```svelte
<script lang="ts">
	import { X, Palette } from 'lucide-svelte';
</script>

...

{#snippet trigger()}<Palette />{/snippet}
```

Tot slot voegen we [een `Switch` component](https://www.google.com/search?q=%5Bhttps://www.skeleton.dev/docs/components/switch/svelte%5D\(https://www.skeleton.dev/docs/components/switch/svelte\)) toe om dark mode te togglen. (Ja, we kunnen Skeleton componenten gebruiken binnen andere Skeleton componenten\!)

```svelte
<script lang="ts">
	import { Popover, Switch } from '@skeletonlabs/skeleton-svelte';
</script>

...
<article> ... </article>
<span class="flex">
			<span class="label">Donkere Modus</span>
			<Switch name="darkMode" checked={darkMode} onCheckedChange={handleDarkModeSelect} />
</span>
```

Dat is de markup voor onze basis `ThemeSwitch` component, maar we moeten nog steeds de logica implementeren zodat het daadwerkelijk werkt.

#### Theme Switcher Logica

Laten we eerst enkele state variabelen toevoegen aan onze `ThemeSwitch` component om de geselecteerde thema- en dark mode-status bij te houden. We verwijzen hier al naar in de markup.

```typescript
// We laten ze voorlopig ongedefinieerd
let selectedTheme: string | undefined = $state();
let darkMode: boolean | undefined = $state();
```

Vervolgens zullen we de `onMount` lifecycle hook gebruiken om de opgeslagen thema- en dark mode-status uit `localStorage` op te halen wanneer de component wordt gemount. Deze functie wordt uitgevoerd zodra de component aan de DOM is toegevoegd, waardoor we de variabelen kunnen initialiseren met de opgeslagen waarden.
Als er geen thema of modus is opgeslagen, halen we de standaardwaarden op uit het HTML-document.

```typescript
import { onMount } from 'svelte';

onMount(() => {
	// Haal het opgeslagen thema en de modus (indien aanwezig) op, of gebruik het standaardthema uit het HTML-document.
	const storedTheme =
		localStorage.getItem('theme.name') || document.documentElement.dataset.themeDefault;
	const storedMode =
		(localStorage.getItem('theme.mode') || document.documentElement.dataset.modeDefault) ===
		'dark';
	// Stel de initiële waarden voor selectedTheme en darkMode in op basis van de opgeslagen waarden.
	selectedTheme = storedTheme;
	darkMode = storedMode;
});
```

We moeten deze standaardwaarden toevoegen aan de `<html>` tag in `src/app.html`:

```
<html lang="en" data-theme-default="catppuccin" data-mode-default="dark">
```

Terug in onze `ThemeSwitch` component, laten we de `handleThemeSelect` functie en `handleDarkModeSelect` functies implementeren om het geselecteerde thema en de dark mode status bij te werken wanneer de gebruiker interactie heeft met de dropdown en switch, respectievelijk.
Je kunt de `svelte` LSP gebruiken om de functie signaturen te genereren (alt+enter in VSCode terwijl je cursor op de niet-geïmplementeerde functie staat) en dan de logica invullen.

```typescript
// Deze functie wordt aangeroepen wanneer de gebruiker een thema selecteert uit de dropdown.
function handleThemeSelect(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
	// Wanneer de gebruiker een thema selecteert, werk de selectedTheme variabele bij en sla deze op in localStorage.
	selectedTheme = event.currentTarget.value;
	localStorage.setItem('theme.name', selectedTheme);
	document.documentElement.dataset.theme = selectedTheme;
}

// Deze functie wordt aangeroepen wanneer de gebruiker de dark mode schakelaar togglet.
function handleDarkModeSelect(details: { checked: boolean }): void {
	// Wanneer de gebruiker dark mode togglet, werk de darkMode variabele bij en sla deze op in localStorage.
	darkMode = details.checked;
	const mode = darkMode ? 'dark' : 'light';
	localStorage.setItem('theme.mode', mode);
	document.documentElement.dataset.mode = mode;
}
```

Tot slot, aangezien we onze keuzes nu opslaan in `localStorage`, moeten we onze `app.html` nog één keer bijwerken om het thema en de modus vanuit `localStorage` te laden. Dit kunnen we doen door een klein script direct in de `<head>` van ons `src/app.html` bestand toe te voegen:

```html
<script>
	(() => {
		const html = document.querySelector('html');
		if (!html) return;
		// Stel thema en modus in vanuit localStorage of data-default attributen
		html.dataset.mode = localStorage.getItem('theme.mode') || html.dataset.modeDefault;
		html.dataset.theme = localStorage.getItem('theme.name') || html.dataset.themeDefault;
	})();
</script>
```

Geweldig. Nu is onze `ThemeSwitch` component volledig functioneel. Als je onderweg de weg kwijt bent geraakt, is hier de complete code:

```svelte
<!doctype html>
<html lang="en" data-theme-default="catppuccin" data-mode-default="dark">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script>
			(() => {
				const html = document.querySelector('html');
				if (!html) return;
				// Stel thema en modus in vanuit localStorage of data-default attributen
				html.dataset.mode = localStorage.getItem('theme.mode') || html.dataset.modeDefault;
				html.dataset.theme = localStorage.getItem('theme.name') || html.dataset.themeDefault;
			})();
		</script>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

```svelte
<script lang="ts">
	import { THEMES } from '$lib/constants/themes';
	import { Popover, Switch } from '@skeletonlabs/skeleton-svelte';
	import { X, Palette } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// Slaat het momenteel geselecteerde thema en de dark mode status op.
	let selectedTheme: string | undefined = $state();
	let darkMode: boolean | undefined = $state();

	// openState bepaalt of de popover open of gesloten is.
	let openState = $state(false);

	// De onMount functie is een Svelte lifecycle hook die wordt uitgevoerd zodra de component in de DOM is gemonteerd.
	onMount(() => {
		// Haal het opgeslagen thema en de modus (indien aanwezig) op, of gebruik het standaardthema uit het HTML-document.
		const storedTheme =
			localStorage.getItem('theme.name') || document.documentElement.dataset.themeDefault;
		const storedMode =
			(localStorage.getItem('theme.mode') || document.documentElement.dataset.modeDefault) ===
			'dark';
		// Stel de initiële waarden voor selectedTheme en darkMode in op basis van de opgeslagen waarden.
		selectedTheme = storedTheme;
		darkMode = storedMode;
	});

	function popoverClose() {
		openState = false;
	}

	// Deze functie wordt aangeroepen wanneer de gebruiker een thema selecteert uit de dropdown.
	function handleThemeSelect(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		// Wanneer de gebruiker een thema selecteert, werk de selectedTheme variabele bij en sla deze op in localStorage.
		selectedTheme = event.currentTarget.value;
		localStorage.setItem('theme.name', selectedTheme);
		document.documentElement.dataset.theme = selectedTheme;
	}

	// Deze functie wordt aangeroepen wanneer de gebruiker de dark mode schakelaar togglet.
	function handleDarkModeSelect(details: { checked: boolean }): void {
		// Wanneer de gebruiker dark mode togglet, werk de darkMode variabele bij en sla deze op in localStorage.
		darkMode = details.checked;
		const mode = darkMode ? 'dark' : 'light';
		localStorage.setItem('theme.mode', mode);
		document.documentElement.dataset.mode = mode;
	}
</script>

<Popover
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: 'top' }}
	triggerBase="btn hover:preset-tonal"
	contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
	arrow
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
>
	{#snippet trigger()}<Palette />{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<p class="text-xl font-bold">Kies Thema</p>
			<button class="btn-icon hover:preset-tonal" onclick={popoverClose}><X /></button>
		</header>
		<article>
			<form>
				<label class="label">
					<span class="label-text">Selecteer</span>
					<select class="select" bind:value={selectedTheme} onchange={handleThemeSelect}>
						{#each THEMES as theme (theme.value)}
							<option value={theme.value}>{theme.label}</option>
						{/each}
					</select>
				</label>
			</form>
		</article>
		<span class="flex">
			<span class="label">Donkere Modus</span>
			<Switch name="darkMode" checked={darkMode} onCheckedChange={handleDarkModeSelect} />
		</span>
	{/snippet}
</Popover>
```

Laten we het eens proberen (merk op dat de dropdown niet wordt weergegeven in de screen recording software die wordt gebruikt voor de .gif hieronder, maar het zou op je scherm moeten verschijnen\!):

![theme-switcher.gif](/tutorial/2-ui/img/theme-switcher.gif)

### Een betere lay-out

Oké, die theme switcher was even werk, maar nu we onze theming hebben ingesteld, kunnen we onze applicatie er beter uit laten zien.

Laten we eerst het hoofd `+layout.svelte` bestand aanpakken.
We baseren onze website op het [One Column layout](https://www.skeleton.dev/docs/guides/layouts#one-column) voorbeeld van Skeleton.

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/ui/nav/NavBar.svelte';
	import { PAGES } from '$lib/constants/navigation';

	let { children } = $props();
</script>

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<header>
		<NavBar pages={PAGES} />
	</header>
	<main class="space-y-4">
		{@render children()}
	</main>
	<footer></footer>
</div>
```

Deze lay-out gebruikt een `grid` met drie rijen: één voor de header, één voor de hoofdinhoud en één voor de footer.

De `grid-rows-[auto_1fr_auto]` stelt de header en footer in om alleen zoveel ruimte in te nemen als ze nodig hebben, terwijl het hoofdinhoudsgebied de resterende ruimte inneemt (`1fr`).

De `min-h-screen` class zorgt ervoor dat het grid ten minste de volledige hoogte van het scherm inneemt, zodat de footer altijd onderaan de pagina staat, zelfs als er niet genoeg inhoud is om het scherm te vullen.

(Je hebt misschien gemerkt dat we de `ThemeSwitch` component uit het `+layout.svelte` bestand hebben verwijderd, omdat we deze later aan de `NavBar` component zullen toevoegen.)

We zullen in deze applicatie geen footer gebruiken, maar laten de footer voor nu in de lay-out staan, zodat we er later altijd een kunnen toevoegen als we willen.

We zullen nog niet veel verandering zien, maar dit bereidt ons mooi voor op een responsive lay-out.

### Een betere NavBar

De volgende stap is de `NavBar` component.

We hadden eerder een eenvoudige `NavBar` component, maar laten we die uitbreiden met een logo en onze `ThemeSwitch` component, terwijl we hem mooier en responsiever maken.

Laten we eens kijken naar een voorbeeld van de `NavBar` die we gaan maken.

![navbar.png](/tutorial/2-ui/img/navbar.png)

Dat ziet er mooi uit, maar op kleinere schermen kunnen deze knoppen een beetje te krap worden. We zullen responsief overschakelen naar een zijbalknavigatie:

![modal-navbar.gif](/tutorial/2-ui/img/modal-navbar.gif)

Oké, hoe maken we dit?

Laten we eerst nadenken over de structuur van de `NavBar` component.

Het is één grote, sitebrede navigatiebalk die het volgende bevat:

  - Een links uitgelijnde Logo sectie (of een hamburgermenu op kleinere schermen)
  - Een midden navigatie sectie
  - Een rechts uitgelijnde theme switcher sectie

Laten we die NavBar ontwerpen.

#### Responsive Design (Mobile-first)

Over het algemeen is het een goed idee om een website [mobile-first](https://tailwindcss.com/docs/responsive-design#working-mobile-first) te ontwerpen. Oftewel, ontwerp eerst voor kleine schermen, en voeg dan stijl-overrides toe voor grotere schermen. Dit is makkelijker dan andersom, omdat het makkelijker is om een ontwerp uit te breiden om meer informatie te bevatten dan het te verkleinen om dezelfde hoeveelheid informatie op een klein scherm te passen.

Met Tailwind kunnen we schermgrootte-prefixes gebruiken om stijlen voorwaardelijk toe te passen op basis van de schermgrootte.

Als we bijvoorbeeld de `grid` class toevoegen aan een element, kunnen we het op kleine schermen weergeven als een 1-koloms grid, maar naarmate het scherm groter wordt, kunnen we het veranderen naar een 2-koloms (of meer) grid:

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

Of een ander voorbeeld, we kunnen de `hidden` class gebruiken om een element op kleine schermen te verbergen, maar het op grotere schermen te tonen:

```
hidden md:block
```

Dus over het algemeen schrijven we eerst de CSS-directieven voor kleine schermen, en voegen dan de schermgrootte-prefixes toe om deze te overschrijven voor grotere schermen.

#### NavBar Markup

Laten we beginnen met de markup voor onze kleine scherm NavBar. We gebruiken de [Modal](https://www.skeleton.dev/docs/integrations/popover/svelte#modal) component van Skeleton om een hamburgermenu te creëren dat een zijbalknavigatie opent wanneer erop wordt geklikt.

```svelte
<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, DatabaseZap, Menu } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { PAGES } from '$lib/constants/navigation';
	import ThemeSwitch from '$lib/ui/control/ThemeSwitch.svelte';

	let drawerState = $state(false);

	function drawerClose() {
		drawerState = false;
	}

	function onNavItemClick(url: string) {
		drawerClose();
		goto(url);
	}
</script>

<div class="align-items-center bg-primary-200-800 grid h-[var(--h-navbar)] w-full grid-cols-5 p-4">
	<div class="col-span-1 flex items-center justify-start">
		<Modal
			classes="block"
			open={drawerState}
			onOpenChange={(e) => (drawerState = e.open)}
			triggerBase="btn hover:preset-tonal"
			contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
			positionerJustify="justify-start"
			positionerAlign=""
			positionerPadding=""
			transitionsPositionerIn={{ x: -480, duration: 200 }}
			transitionsPositionerOut={{ x: -480, duration: 200 }}
		>
			{#snippet trigger()}
				<Menu></Menu>
			{/snippet}
			{#snippet content()}
				<header class="flex items-center gap-x-4">
					<button onclick={drawerClose} class="btn hover:preset-tonal">
						<ArrowLeft />
					</button>
					<h3 class="h3">Pagina's</h3>
				</header>
				<hr class="hr my-2" />
				<article class="flex flex-col">
					{#each PAGES as page, index (page.name)}
						<button
							class="btn hover:preset-tonal h5 justify-start"
							onclick={() => onNavItemClick(page.url)}
						>
							<h5 class="h5">
								{page.name}
							</h5>
						</button>
						{#if index < PAGES.length - 1}{/if}
					{/each}
				</article>
			{/snippet}
		</Modal>
	</div>

	<div class="col-span-3 flex items-center justify-center">
		<button class="btn hover:preset-tonal" onclick={() => goto('/')}>
			<span class="flex items-center justify-center gap-x-2">
				<DatabaseZap />
				<h3 class="h3">Webportaal</h3></span
			>
		</button>
	</div>
	<div class="col-span-1 flex items-center justify-end">
		<ThemeSwitch />
	</div>
</div>
```

Belangrijke punten om hier op te merken:

  - We hebben de `pages` prop uit de `NavBar` component verwijderd, aangezien we deze component niet op andere plaatsen zullen hergebruiken, zoals we eerder deden (in het dashboard). (Hier wordt niet getoond dat we de `pages` prop ook uit de `NavBar` component in `src/routes/+layout.svelte` hebben verwijderd.)

  - We gebruiken de `Modal` component van Skeleton om een zijbalknavigatie te creëren die opent wanneer op het hamburgermenu wordt geklikt.

  - De `trigger` snippet bevat het hamburgermenu-icoon, dat de modal opent wanneer erop wordt geklikt.

  - De `content` snippet bevat de inhoud van de zijbalk, waarin we de pagina's uit onze `navigation.ts` lijst weergeven.

  - Door op een paginalink in de zijbalk te klikken, wordt de zijbalk gesloten voordat naar de aangevraagde pagina wordt genavigeerd.

  - We verdelen de `NavBar` in een vijfkoloms grid, waarbij de navigatiesectie drie kolommen inneemt, en het logo en de themaswitch elk één kolom.

  - We gebruiken Lucide icons voor het website logo (`DatabaseZap`), het hamburgermenu (`Menu`) en de terugknop (`ArrowLeft`).

  - We wikkelen het logo in een knop die naar de startpagina navigeert wanneer erop wordt geklikt.

  - We hebben een `--h-navbar` CSS-variabele toegevoegd aan ons `app.css` bestand om de hoogte van de NavBar in te stellen, aangezien we deze variabele later zullen gebruiken voor een berekening:

    ```css
    /* /src/app.css */

    @theme {
        --h-navbar: calc(var(--spacing) * 24)
    }
    ```

#### Responsive NavBar

Laten we nu wat schermgrootte-prefixes toevoegen aan de `NavBar` om deze responsief te maken, zoals we eerder bespraken.

```svelte
<div class="col-span-1 flex items-center justify-start">
    <Modal classes = "block md:hidden" ... />
    <div class="hidden md:flex md:items-center md:gap-x-2">
        ...
    </div>
</div>
<div class="col-span-3 flex items-center justify-center">
    <button class="btn hover:preset-tonal md:hidden" onclick={() => goto('/')}>
        ...
    </button>
    <span class="hidden md:flex md:justify-center">
        ...        
    </span>
</div>

```

Laten we eens kijken naar de complete `NavBar` component met responsive design:

![responsive-navbar.gif](/tutorial/2-ui/img/responsive-navbar.gif)

Nogmaals, hier is de volledige code als je onderweg een beetje verdwaald bent geraakt:

```svelte
<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, DatabaseZap, Menu } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { PAGES } from '$lib/constants/navigation';
	import ThemeSwitch from '$lib/ui/control/ThemeSwitch.svelte';

	let drawerState = $state(false);

	function drawerClose() {
		drawerState = false;
	}

	function onNavItemClick(url: string) {
		drawerClose();
		goto(url);
	}
</script>

<div class="align-items-center bg-primary-200-800 grid h-[var(--h-navbar)] w-full grid-cols-5 p-4">
	<div class="col-span-1 flex items-center justify-start">
		<Modal
			classes="block md:hidden"
			open={drawerState}
			onOpenChange={(e) => (drawerState = e.open)}
			triggerBase="btn hover:preset-tonal"
			contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
			positionerJustify="justify-start"
			positionerAlign=""
			positionerPadding=""
			transitionsPositionerIn={{ x: -480, duration: 200 }}
			transitionsPositionerOut={{ x: -480, duration: 200 }}
		>
			{#snippet trigger()}
				<Menu></Menu>
			{/snippet}
			{#snippet content()}
				<header class="flex items-center gap-x-4">
					<button onclick={drawerClose} class="btn hover:preset-tonal">
						<ArrowLeft />
					</button>
					<h3 class="h3">Pagina's</h3>
				</header>
				<hr class="hr my-2" />
				<article class="flex flex-col">
					{#each PAGES as page, index (page.name)}
						<button
							class="btn hover:preset-tonal h5 justify-start"
							onclick={() => onNavItemClick(page.url)}
						>
							<h5 class="h5">
								{page.name}
							</h5>
						</button>
						{#if index < PAGES.length - 1}{/if}
					{/each}
				</article>
			{/snippet}
		</Modal>
		<div class="hidden md:flex md:items-center md:gap-x-2">
			<button class="btn hover:preset-tonal" onclick={() => goto('/')}>
				<DatabaseZap />
				<h3 class="h3">Webportaal</h3>
			</button>
		</div>
	</div>

	<div class="col-span-3 flex items-center justify-center">
		<button class="btn hover:preset-tonal md:hidden" onclick={() => goto('/')}>
			<span class="flex items-center justify-center gap-x-2">
				<DatabaseZap />
				<h3 class="h3">Webportaal</h3></span
			>
		</button>
		<span class="hidden md:flex md:justify-center">
			{#each PAGES as page (page.name)}
				<button class="btn hover:preset-tonal h5 justify-start" onclick={() => goto(page.url)}>
					<h5 class="h5">
						{page.name}
					</h5>
				</button>
			{/each}
		</span>
	</div>
	<div class="col-span-1 flex items-center justify-end">
		<ThemeSwitch />
	</div>
</div>
```

### De dashboard lay-out

Nu we een mooie NavBar hebben, laten we de lay-out voor onze dashboardpagina's verbeteren.

Hier is een voorbeeld van wat we willen bereiken voor kleinere schermen:

![bar-nav.png](/tutorial/2-ui/img/bar-nav.png)

Hierboven zie je een inhoudsgedeelte dat het grootste deel van het scherm inneemt, met [`Bar` navigatie](https://www.google.com/search?q=%5Bhttps://www.skeleton.dev/docs/components/navigation/svelte/%23bar%5D\(https://www.skeleton.dev/docs/components/navigation/svelte/%23bar\)) die navigatie naar de drie subpagina's (we tellen de `/dashboard` pagina als de 'overview' pagina) onderaan het scherm toont.

Voor grotere schermen willen we overschakelen naar [`Rail` navigatie](https://www.google.com/search?q=%5Bhttps://www.skeleton.dev/docs/components/navigation/svelte/%23rail%5D\(https://www.skeleton.dev/docs/components/navigation/svelte/%23rail\)), die het navigatie-element aan de linkerkant van het scherm plaatst:

![rail-nav.png](/tutorial/2-ui/img/rail-nav.png)

Laten we eerst het `navigation.ts` bestand (en de `PageInfo` interface) uitbreiden met Lucide icons die we voor elke pagina kunnen weergeven:

```typescript
// src/lib/types/pageInfo.ts

import type { Icon } from 'lucide-svelte';

export interface PageInfo {
	name: string;
	description: string;
	url: string;
	icon?: typeof Icon;
}


// /src/lib/constants/navigation.ts

import { PanelsTopLeft, User, Dumbbell } from 'lucide-svelte';

...

export const DASHBOARD_PAGES: PageInfo[] = [
	{
		name: 'Overzicht',
		url: '/dashboard/',
		description: 'Dashboard overzicht.',
		icon: PanelsTopLeft
	},
	{
		name: 'Gebruiker',
		url: '/dashboard/user',
		description: 'Gebruikersinformatie opvragen',
		icon: User
	},
	{
		name: 'Sessie',
		url: '/dashboard/session',
		description: 'Sessiedetails bekijken.',
		icon: Dumbbell
	}
];
```

Laten we nu `src/routes/dashboard/+layout.svelte` aanpassen om de `Rail` en `Bar` navigatiecomponenten te gebruiken, waarbij de `Rail` navigatie op kleinere schermen wordt verborgen en de `Bar` navigatie op grotere schermen wordt getoond.

```svelte
<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import { DASHBOARD_PAGES } from '$lib/constants/navigation';

	let value = $state('overview');

	let { children } = $props();
	let currentPageUrl = $derived(page.url.pathname);
</script>

<div
	class="flex h-full max-h-[calc(100dvh-var(--h-navbar))] w-full flex-col overflow-y-scroll lg:flex-row"
>
	<aside class="hidden lg:sticky lg:block">
		<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)}>
			{#snippet tiles()}
				{#each DASHBOARD_PAGES as dashboardPage (dashboardPage.name)}
					<Navigation.Tile
						href={dashboardPage.url}
						label={dashboardPage.name}
						selected={currentPageUrl === dashboardPage.url}
					>
						{#if dashboardPage.icon}
							<dashboardPage.icon />
						{/if}
					</Navigation.Tile>
				{/each}
			{/snippet}
		</Navigation.Rail>
	</aside>
	<div class="flex flex-grow flex-col overflow-y-scroll p-4">
		{@render children()}
	</div>
	<aside class="block lg:hidden">
		<Navigation.Bar classes="max-h-24" {value} onValueChange={(newValue) => (value = newValue)}>
			{#each DASHBOARD_PAGES as dashboardPage (dashboardPage.name)}
				<Navigation.Tile
					href={dashboardPage.url}
					label={dashboardPage.name}
					selected={currentPageUrl === dashboardPage.url}
				>
					{#if dashboardPage.icon}
						<dashboardPage.icon />
					{/if}
				</Navigation.Tile>
			{/each}
		</Navigation.Bar>
	</aside>
</div>
```

Belangrijke punten om hier op te merken:

  - We stellen de maximale hoogte van het hoofdinhoudsgebied in op de volledige hoogte van het scherm minus de hoogte van de NavBar met `max-h-[calc(100dvh-var(--h-navbar))]`.
      - Het gebruik van `dvh` (dynamische viewport hoogte) in plaats van `vh` (viewport hoogte) zorgt ervoor dat de hoogte correct wordt berekend, zelfs wanneer de adresbalk van de browser op mobiele apparaten is verborgen.
      - We voegen `overflow-y-scroll` toe, zodat als de inhoud de beschikbare hoogte overschrijdt, deze zal scrollen, waardoor er voldoende ruimte overblijft voor de navigatie-elementen.
      - Dit zorgt ervoor dat de navigatie-elementen altijd verticaal gecentreerd zijn, zelfs als de inhoud langer is dan de schermhoogte.
  - We gebruiken de `Navigation` component van Skeleton om de `Rail` en `Bar` navigatie te creëren.
  - We tonen en verbergen de grootbeeldscherm `Rail` navigatie met `hidden lg:block`
  - We tonen en verbergen de kleinbeeldscherm `Bar` navigatie met `block lg:hidden`
  - We gebruiken de `value` state variabele om de momenteel geselecteerde pagina bij te houden en deze bij te werken wanneer de gebruiker op een navigatie-item klikt.
  - We gebruiken de `currentPageUrl` (die is afgeleid van [de 'page' state](https://svelte.dev/docs/kit/$app-state#page)) om te bepalen welke pagina momenteel wordt bekeken, en markeren het corresponderende navigatie-item door de `selected` prop op de `Navigation.Tile` component op `true` te zetten.
  - We gebruiken de `dashboardPage.icon` direct als een component in Svelte. Dit is een handige truc - en is mogelijk omdat we de Icon Component direct hebben opgeslagen in het `icon` veld in de navigatieconstanten (`src/lib/constants/navigation.ts`).

### Een custom Card component

[Cards](https://www.skeleton.dev/docs/tailwind/cards) zijn een geweldige manier om informatie op een visueel aantrekkelijke manier weer te geven.

Laten we een custom `Card` component maken, gebaseerd op de Skeleton `Card` component, die we in onze applicatie kunnen gebruiken.

We willen een `Card` component maken die:

  - De Skeleton `Card` template als basis gebruikt
  - Ons in staat stelt een header-, artikel- en footersectie door te geven.
  - Ons in staat stelt enkele `$props` door te geven om de card styling waar nodig te overschrijven of uit te breiden.

Laten we de code voor onze custom `Card` component bekijken en deze vervolgens doorlopen:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		base = 'card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block h-fit max-w-md divide-y border-[1px]',
		baseExtension = '',
		headerBase = 'h3 p-8',
		headerExtension = '',
		articleBase = 'flex flex-col gap-4 p-8',
		articleExtension = '',
		footerBase = 'flex items-center gap-4 p-8',
		footerExtension = '',
		header,
		article,
		footer
	}: {
		base?: string;
		baseExtension?: string;
		headerBase?: string;
		headerExtension?: string;
		articleBase?: string;
		articleExtension?: string;
		footerBase?: string;
		footerExtension?: string;
		header?: Snippet;
		article?: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div class="{base} {baseExtension}">
	{#if header}
		<header class="{headerBase} {headerExtension}">
			{@render header()}
		</header>
	{/if}
	{#if article}
		<article class="{articleBase} {articleExtension}">
			{@render article()}
		</article>
	{/if}
	{#if footer}
		<footer class="{footerBase} {footerExtension}">
			{@render footer()}
		</footer>
	{/if}
</div>
```

Belangrijke punten om hier op te merken:

  - We gebruiken het `Snippet` type van Svelte om ons in staat te stellen aangepaste markup door te geven voor de header-, artikel- en footersecties van de kaart.
  - We maken variabelen voor de basisstyling van de kaart, evenals voor de header-, artikel- en footersecties. - We maken variabelen voor de extensies van de basisstyling.
  - We voegen de aangepaste markup in de `class` attributen waar nodig.
  - We gebruiken de `@render` directieven om de Snippets die zijn doorgegeven voor de header-, artikel- en footersecties te renderen.

Laten we nu deze `Card` component gebruiken op onze startpagina (op `/`) om onze demotellerknop te vervangen en in plaats daarvan een welkomstbericht weer te geven.

We maken een nieuw bestand `src/lib/constants/strings.ts` aan om de naam van het spel waarvoor we het webportaal bouwen (we noemen het `DemoBots`) in op te slaan, zodat we het later in andere pagina's of componenten kunnen hergebruiken.

```typescript
// /src/lib/constants/projectInfo.ts

export const GAME_NAME = 'DemoBots';
```

We voegen ook een afbeelding toe aan de `static` map in de root van ons project met de naam `header.jpg` die we kunnen gebruiken als headerafbeelding voor onze kaart.

Vervolgens passen we het `+page.svelte` bestand aan om onze nieuwe `Card` component te gebruiken en een welkomstbericht weer te geven.

```svelte
<script lang="ts">
	import { GAME_NAME } from '$lib/constants/strings';
	import Card from '$lib/ui/views/Card.svelte';
</script>

<div
	class="container mx-auto grid h-full w-full grid-cols-1 items-center justify-items-center gap-8 px-4"
>
	<Card footerBase="flex gap-x-4 p-8">
		{#snippet header()}
			<img src="/header.jpg" class="aspect-[21/9] w-full hue-rotate-90" alt="banner" />
		{/snippet}
		{#snippet article()}
			<div>
				<h3 class="h3">Welkom!</h3>
			</div>
			<p class="opacity-60">
				Deze website functioneert als een webportaal naar een database voor het spel '{GAME_NAME}'.
			</p>
		{/snippet}
	</Card>
</div>
```

Dat ziet er veel beter uit\!

![welcome-card.png](/tutorial/2-ui/img/welcome-card.png)

We hebben nu alle belangrijke UI-componenten op hun plaats om de rest van onze applicatie verder uit te bouwen.

We hebben een responsive lay-out met een navigatiebalk, een dashboardsectie met een eigen navigatie-UI, een themawisselaar en een aangepaste kaartcomponent om informatie weer te geven.
We zullen in de toekomst nog een paar nieuwe UI-componenten bekijken, zoals tekstvelden en tabellen, maar de meeste hiervan zullen in andere `Card` componenten komen te staan, dus we behandelen ze gaandeweg.

## Afronding

In dit hoofdstuk heb je:

  - lucide-svelte geïnstalleerd en gebruikt om icons aan je componenten toe te voegen.
  - Het Skeleton design system opgezet en geconfigureerd voor je Svelte app.
  - Een responsive, mobile-first lay-out gecreëerd met Skeleton componenten.
  - Een themawisselaar gebouwd die voorkeuren opslaat met `localStorage` en Svelte state.
  - Een dynamische NavBar geïmplementeerd die zich aanpast tussen modale en inline lay-outs.
  - Skeleton’s Navigation.Rail en Navigation.Bar gebruikt voor contextuele navigatie.
  - Een herbruikbare Card component gebouwd met flexibele lay-out slots met behulp van Svelte snippets.

Je hebt nu een sterke basis voor het bouwen van gebruiksvriendelijke, aanpasbare interfaces. [In Hoofdstuk 3](https://www.google.com/search?q=/tutorial/3-drizzle/README.md) kijken we naar het implementeren van Drizzle ORM om met onze database te communiceren, zodat we gegevens in onze applicatie kunnen ophalen en weergeven.
