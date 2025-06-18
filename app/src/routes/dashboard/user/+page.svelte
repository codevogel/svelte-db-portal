<!-- /src/routes/dashboard/user/+page.svelte -->

<script lang="ts">
	import Card from '$lib/ui/views/Card.svelte';
	import type { User } from '$lib/server/db/schema';
	import Table from '$lib/ui/views/Table.svelte';

	let { data } = $props();
	let userResults: User[] | undefined = $derived(data.users);

	function searchForUsersByName(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		event.currentTarget.form?.requestSubmit();
	}

	let table = $derived({
		columns: ['Username', 'Created At'],
		rows: userResults?.map((user) => ({
			values: [user.username, user.createdAt.toLocaleDateString()],
			url: `/dashboard/user/${user.id}`
		}))
	});
</script>

<div
	class="mx-auto my-24 grid grid-cols-1 items-center gap-4 sm:my-48 lg:my-auto lg:grid-cols-[auto_1fr] lg:gap-8"
>
	<Card baseExtension="lg:min-w-md">
		{#snippet header()}
			<h1>Find a user</h1>
		{/snippet}
		{#snippet article()}
			<form data-sveltekit-keepfocus>
				<label for="username">Name: </label>
				<input class="input" type="text" name="username" oninput={searchForUsersByName} />
			</form>
		{/snippet}
	</Card>
	{#if userResults && userResults.length > 0}
		<Card baseExtension="lg:min-w-md">
			{#snippet header()}
				<h1>Found users</h1>
			{/snippet}
			{#snippet article()}
				<div class="flex max-h-64 flex-col overflow-y-scroll">
					<Table {table} />
				</div>
			{/snippet}
		</Card>
	{:else}
		<div class="flex flex-col items-center justify-center lg:min-w-md">
			<p>Try searching for a user by name.</p>
		</div>
	{/if}
</div>
