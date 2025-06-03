<!-- src/routes/+layout.svelte -->

<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/nav/NavBar.svelte';
	import { pages } from '$lib/stores/navigation';

	let { children } = $props();
</script>

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header>
		<NavBar pages={$pages} />
	</header>
	<!-- Page -->
	<main class="space-y-4">
		{@render children()}
	</main>
	<!-- Footer -->
	<footer></footer>
</div>
