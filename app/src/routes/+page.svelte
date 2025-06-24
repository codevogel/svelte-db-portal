<!-- /src/routes/+page.svelte -->

<script lang="ts">
	import { GAME_NAME } from '$lib/constants/strings';
	import Card from '$lib/ui/views/Card.svelte';
</script>

<div
	class="container mx-auto grid h-full w-full grid-cols-1 items-center justify-items-center gap-8 px-4"
>
	<Card footerBase="flex gap-x-4 p-8">
		{#snippet header()}
			<img src="/header.jpg" class="aspect-[21/9] w-full hue-rotate-90" alt="banner" />
		{/snippet}
		{#snippet article()}
			<div>
				<h3 class="h3">Welcome!</h3>
			</div>
			<p class="opacity-60">
				This website functions as a web portal to a database for the game '{GAME_NAME}'.
			</p>
		{/snippet}
	</Card>
</div>
