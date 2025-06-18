<!-- /src/routes/dashboard/user/[id]/+page.svelte -->

<script lang="ts">
	import type { UserWithProfile } from '$lib/server/dao/UserDAO';
	import type { SessionWithAverageScore } from '$lib/server/dao/SessionDAO';
	import type { TableData } from '$lib/ui/views/Table.svelte';
	import Card from '$lib/ui/views/Card.svelte';
	import Table from '$lib/ui/views/Table.svelte';
	import { ageFromDateOfBirth, dateAddSeconds } from '$lib/utils/date';

	let { data } = $props();

	let user: UserWithProfile = $derived(data.user);

	const table: TableData = $derived({
		caption: 'Scores in this session.',
		columns: ['ID', 'Duration', 'Created At', 'Ended At', 'Average Score'],
		rows: data.sessionsByUser.map((session: SessionWithAverageScore) => ({
			values: [
				session.id,
				session.duration,
				session.createdAt.toLocaleString(),
				dateAddSeconds(session.createdAt, session.duration).toLocaleString(),
				session.averageScore
			],
			url: `/dashboard/session/${session.id}`
		}))
	});

	const userAge = $derived(ageFromDateOfBirth(user.dateOfBirth));

</script>

<div class="m-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
	<Card>
		{#snippet header()}
			<h1>User Profile</h1>
		{/snippet}
		{#snippet article()}
			<div class="grid grid-cols-2 justify-between">
				<span>Username:</span>
				<span>{user.username}</span>
				<span>First Name:</span>
				<span>{user.profile.firstName}</span>
				<span>Last Name:</span>
				<span>{user.profile.lastName}</span>
				<span>Age:</span>
				<span>{userAge}</span>
				<span>User Since:</span>
				<span>{user.createdAt.toLocaleDateString()}</span>
			</div>
		{/snippet}
	</Card>

	<Card>
		{#snippet header()}
			<h1>Sessions</h1>
		{/snippet}
		{#snippet article()}
			<Table {table} />
		{/snippet}
	</Card>
</div>
