<!-- /src/lib/nav/NavBar.svelte -->

<script lang="ts">
	import type { PageInfo } from '$lib/types/pageInfo';

	let pages: PageInfo[] = [
		{ name: 'Home', url: '/', description: 'The home page.' },
		{ name: 'About Us', url: '/about', description: 'Learn more about us.' },
		{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' },
	];
</script>

<div class="flex gap-x-4">
	{#each pages as page (page.url)}
		<a href={page.url} class="underline" title={page.description}>
			{page.name}
		</a>
	{/each}
</div>
