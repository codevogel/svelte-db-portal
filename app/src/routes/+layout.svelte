<!-- src/routes/+layout.svelte -->

<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/ui/nav/NavBar.svelte';

	let { children, data } = $props();

	const loggedIn = $derived(data.loggedIn);
</script>

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header>
		<NavBar {loggedIn} />
	</header>
	<!-- Page -->
	<main class="space-y-4">
		{@render children()}
	</main>
	<!-- Footer -->
	<footer></footer>
</div>
