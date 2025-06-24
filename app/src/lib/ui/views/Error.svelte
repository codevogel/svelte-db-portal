<!-- /src/lib/ui/views/Error.svelte -->

<script lang="ts">
	import LogInButton from '$lib/ui/control/LogInButton.svelte';
	let { status, message }: { status: number; message: string } = $props();
</script>

<div class="flex flex-grow flex-col items-center justify-center gap-y-4 p-8">
	<h1 class="text-3xl font-bold">Error {status}</h1>
	<p class="text-center">{message}</p>
	{#if status === 401}
		<LogInButton primary={true} />
	{/if}
</div>
