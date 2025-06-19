<!-- /src/routes/dashboard/+page.svelte -->

<script lang="ts">
	import type { TopScorer } from '$lib/server/dao/ScoreDAO';
	import type { User } from '$lib/server/db/schema';
	import Card from '$lib/ui/views/Card.svelte';
	import type { TableData } from '$lib/ui/views/Table.svelte';
	import Table from '$lib/ui/views/Table.svelte';
	import { ageFromDateOfBirth } from '$lib/utils/date.js';

	const { data } = $props();

	const topScoreTable: TableData = $derived({
		caption:
			'A list of the top 10 users who have the highest scores.\nClick to view the session in which they achieved it.',
		columns: [
			'Ranking',
			'Username',
			'Level ID',
			'Score',
			'Accuracy',
			'Time Taken',
			'Created At',
			'Session ID'
		],
		rows: data.topScorers.map((score: TopScorer, index: number) => ({
			values: [
				index + 1,
				score.user.username,
				score.score.levelId,
				score.score.score,
				score.score.accuracy,
				score.score.timeTaken,
				score.score.createdAt.toLocaleString(),
				score.session.id
			],
			url: `/dashboard/session/${score.session.id}`
		})),
		paginationOptions: { enabled: false }
	});

	const userTable: TableData = $derived({
		caption: 'A list of users.\nClick to view their profile.',
		columns: ['Username', 'Age', 'Created At'],
		rows: data.users.map((user: User) => ({
			values: [
				user.username,
				ageFromDateOfBirth(user.dateOfBirth),
				user.createdAt.toLocaleDateString()
			],
			url: `/dashboard/user/${user.id}`
		}))
	});
</script>

<div class="mx-auto grid grid-cols-1 gap-y-4">
	<Card baseExtension="!max-w-full w-6xl">
		{#snippet header()}
			<h1>Top 10 Users</h1>
		{/snippet}
		{#snippet article()}
			<Table table={topScoreTable} />
		{/snippet}
	</Card>
	<Card baseExtension="!max-w-full w-6xl">
		{#snippet header()}
			<h1>Users</h1>
		{/snippet}
		{#snippet article()}
			<Table table={userTable} />
		{/snippet}
	</Card>
</div>
