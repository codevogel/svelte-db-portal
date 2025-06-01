<!-- src/routes/+layout.svelte -->

<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/nav/NavBar.svelte';
	import { pages } from '$lib/stores/navigation';

	let { children } = $props();
</script>

<NavBar pages={$pages} />
{@render children()}
