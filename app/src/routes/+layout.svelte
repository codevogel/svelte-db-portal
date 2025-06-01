<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/nav/NavBar.svelte';

	let { children } = $props();
</script>

<NavBar />
{@render children()}
