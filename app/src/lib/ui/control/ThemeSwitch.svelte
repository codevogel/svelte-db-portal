<script lang="ts">
	import { THEMES } from '$lib/constants/themes';
	import { Popover, Switch } from '@skeletonlabs/skeleton-svelte';
	import { X, Palette } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// Stores the currently selected theme and dark mode state.
	let selectedTheme: string | undefined = $state();
	let darkMode: boolean | undefined = $state();

	// openState determines whether the popover is open or closed.
	let openState = $state(false);

	// The onMount function is a Svelte lifecycle hook that runs as soon as the component is mounted in the DOM.
	onMount(() => {
		// Retrieve the stored theme and mode (if any), or use the default theme given in the HTML document.
		const storedTheme =
			localStorage.getItem('theme.name') || document.documentElement.dataset.themeDefault;
		const storedMode =
			(localStorage.getItem('theme.mode') || document.documentElement.dataset.modeDefault) ===
			'dark';
		// Set the initial values for selectedTheme and darkMode based on the stored values.
		selectedTheme = storedTheme;
		darkMode = storedMode;
	});

	function popoverClose() {
		openState = false;
	}

	// This function is called when the user selects a theme from the dropdown.
	function handleThemeSelect(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		// When the user selects a theme, update the selectedTheme variable and store it in localStorage.
		selectedTheme = event.currentTarget.value;
		localStorage.setItem('theme.name', selectedTheme);
		document.documentElement.dataset.theme = selectedTheme;
	}

	// This function is called when the user toggles the dark mode switch.
	function handleDarkModeSelect(details: { checked: boolean }): void {
		// When the user toggles dark mode, update the darkMode variable and store it in localStorage.
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
			<p class="text-xl font-bold">Choose Theme</p>
			<button class="btn-icon hover:preset-tonal" onclick={popoverClose}><X /></button>
		</header>
		<article>
			<form>
				<label class="label">
					<span class="label-text">Select</span>
					<!-- Dropdown to select a theme from the available themes in the store -->
					<!-- The value of the select is bound to selectedTheme -->
					<select class="select" bind:value={selectedTheme} onchange={handleThemeSelect}>
						<!-- Loop through the themes store to create an option for each theme -->
						{#each THEMES as theme (theme.value)}
							<option value={theme.value}>{theme.label}</option>
						{/each}
					</select>
				</label>
			</form>
		</article>
		<span class="flex">
			<!-- Switch to toggle dark mode -->
			<span class="label">Dark Mode</span>
			<!-- The checked state is set to whether darkMode is on or not -->
			<Switch name="darkMode" checked={darkMode} onCheckedChange={handleDarkModeSelect} />
		</span>
	{/snippet}
</Popover>
