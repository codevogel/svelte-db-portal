<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		base = 'card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block h-fit max-w-md divide-y border-[1px]',
		baseExtension = '',
		headerBase = 'h3 p-8',
		headerExtension = '',
		articleBase = 'flex flex-col gap-4 p-8',
		articleExtension = '',
		footerBase = 'flex items-center gap-4 p-8',
		footerExtension = '',
		header,
		article,
		footer
	}: {
		base?: string;
		baseExtension?: string;
		headerBase?: string;
		headerExtension?: string;
		articleBase?: string;
		articleExtension?: string;
		footerBase?: string;
		footerExtension?: string;
		header?: Snippet;
		article?: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div class="{base} {baseExtension}">
	{#if header}
		<header class="{headerBase} {headerExtension}">
			{@render header()}
		</header>
	{/if}
	{#if article}
		<article class="{articleBase} {articleExtension}">
			{@render article()}
		</article>
	{/if}
	{#if footer}
		<footer class="{footerBase} {footerExtension}">
			{@render footer()}
		</footer>
	{/if}
</div>
