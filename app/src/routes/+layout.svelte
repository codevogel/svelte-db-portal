<!-- src/routes/+layout.svelte -->

<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/nav/NavBar.svelte';
	import { pages } from '$lib/stores/navigation';
	import ThemeSwitch from '$lib/ui/control/ThemeSwitch.svelte';

	let { children } = $props();
</script>

<ThemeSwitch />
<NavBar pages={$pages} />
{@render children()}
