<!-- /src/lib/nav/NavBar.svelte -->

<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, DatabaseZap, Menu } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { pages } from '$lib/stores/navigation';
	import ThemeSwitch from '$lib/ui/control/ThemeSwitch.svelte';

	let drawerState = $state(false);

	function drawerClose() {
		drawerState = false;
	}

	function onNavItemClick(url: string) {
		drawerClose();
		goto(url);
	}
</script>

<div class="align-items-center bg-primary-200-800 grid h-[var(--h-navbar)] w-full grid-cols-5 p-4">
	<div class="col-span-1 flex items-center justify-start">
		<Modal
			classes="block md:hidden"
			open={drawerState}
			onOpenChange={(e) => (drawerState = e.open)}
			triggerBase="btn hover:preset-tonal"
			contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
			positionerJustify="justify-start"
			positionerAlign=""
			positionerPadding=""
			transitionsPositionerIn={{ x: -480, duration: 200 }}
			transitionsPositionerOut={{ x: -480, duration: 200 }}
		>
			{#snippet trigger()}
				<Menu></Menu>
			{/snippet}
			{#snippet content()}
				<header class="flex items-center gap-x-4">
					<button onclick={drawerClose} class="btn hover:preset-tonal">
						<ArrowLeft />
					</button>
					<h3 class="h3">Pages</h3>
				</header>
				<hr class="hr my-2" />
				<article class="flex flex-col">
					{#each $pages as page, index (page.name)}
						<button
							class="btn hover:preset-tonal h5 justify-start"
							onclick={() => onNavItemClick(page.url)}
						>
							<h5 class="h5">
								{page.name}
							</h5>
						</button>
						{#if index < $pages.length - 1}{/if}
					{/each}
				</article>
			{/snippet}
		</Modal>
		<div class="hidden md:flex md:items-center md:gap-x-2">
			<button class="btn hover:preset-tonal" onclick={() => goto('/')}>
				<DatabaseZap />
				<h3 class="h3">Web Portal</h3>
			</button>
		</div>
	</div>

	<div class="col-span-3 flex items-center justify-center">
		<button class="btn hover:preset-tonal md:hidden" onclick={() => goto('/')}>
			<span class="flex items-center justify-center gap-x-2">
				<DatabaseZap />
				<h3 class="h3">Web Portal</h3></span
			>
		</button>
		<span class="hidden md:flex md:justify-center">
			{#each $pages as page (page.name)}
				<button class="btn hover:preset-tonal h5 justify-start" onclick={() => goto(page.url)}>
					<h5 class="h5">
						{page.name}
					</h5>
				</button>
			{/each}
		</span>
	</div>
	<div class="col-span-1 flex items-center justify-end">
		<ThemeSwitch />
	</div>
</div>
