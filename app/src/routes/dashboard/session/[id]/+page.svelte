<!-- /src/routes/dashboard/session/[id]/+page.svelte -->

<script lang="ts">
	import type { Session } from '$lib/server/db/schema';

	let { data } = $props();

	let session: Session = $derived(data.session);
</script>

<p>
	Session: {session.id}
</p>
