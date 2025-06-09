<script>
	import { page } from '$app/state';
	import Error from '$lib/ui/views/Error.svelte';
</script>

{#if page.error}
	<Error status={page.status} message={page.error.message} />
{/if}
