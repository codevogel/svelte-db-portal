<!-- /src/routes/dashboard/+layout.svelte -->

<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import { dashboardPages } from '$lib/stores/navigation';

	let value = $state('overview');

	let { children } = $props();
	let currentPageUrl = $derived(page.url.pathname);
</script>

<div
	class="flex h-full max-h-[calc(100dvh-var(--h-navbar))] w-full flex-col overflow-y-scroll lg:flex-row"
>
	<!-- This is the rail for larger screens -->
	<aside class="hidden lg:sticky lg:block">
		<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)}>
			{#snippet tiles()}
				{#each $dashboardPages as dashboardPage (dashboardPage.name)}
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
	<!-- This is the bar for smaller screens -->
	<aside class="block lg:hidden">
		<Navigation.Bar classes="max-h-24" {value} onValueChange={(newValue) => (value = newValue)}>
			{#each $dashboardPages as dashboardPage (dashboardPage.name)}
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
