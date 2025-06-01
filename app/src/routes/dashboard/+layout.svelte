<!-- /src/routes/dashboard/+layout.svelte -->

<script lang="ts">
	import NavBar from '$lib/nav/NavBar.svelte';
	import { dashboardPages } from '$lib/stores/navigation';

	let { children } = $props();
</script>

<h1 class="text-3xl font-bold">Dashboard.</h1>

<NavBar pages={$dashboardPages} />

<!-- Here, the content from the sub-routes renders -->
{@render children()}
