<!-- /src/routes/dashboard/user/[id]/+page.svelte -->

<script lang="ts">
	import type { User } from '$lib/server/db/schema';

	let { data } = $props();
	
	let user: User = $derived(data.user);

</script>

<p>
	User: {user.username}
</p>
