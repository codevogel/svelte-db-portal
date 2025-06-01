<!-- /src/lib/nav/NavBar.svelte -->

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
