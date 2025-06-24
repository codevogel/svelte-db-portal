<!-- /src/routes/auth/not-whitelisted/+page.svelte -->

<script lang="ts">
	import Card from '$lib/ui/views/Card.svelte';
	import { ADMIN_EMAIL } from '$lib/constants/strings';
</script>

<div class="flex h-full items-center justify-center">
	<Card>
		{#snippet header()}
			<h1 class="text-2xl font-bold">Authentication Error</h1>
		{/snippet}
		{#snippet article()}
			<p>You are not authorized to access this page.</p>
			<p>
				Most likely, you tried to sign in to this website, but your account is not whitelisted.
			</p>
			<p>Contact the site administrator to request access, at {ADMIN_EMAIL} .</p>
		{/snippet}
	</Card>
</div>
