<!-- /src/lib/ui/views/Error.svelte -->

<script lang="ts">
	let { status, message }: { status: number, message: string } = $props();
</script>

<div class="text-center p-8">
	<h1 class="text-3xl font-bold">Error {status}</h1>
	<p>{message}</p>
</div>
