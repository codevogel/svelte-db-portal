<!-- /src/routes/dashboard/session/[id]/+page.svelte -->

<script lang="ts">
	import type { TableData } from '$lib/ui/views/Table.svelte';
	import Card from '$lib/ui/views/Card.svelte';
	import Table from '$lib/ui/views/Table.svelte';
	import type { Score } from '$lib/server/db/schema';
	import type { SessionWithUser } from '$lib/server/dao/SessionDAO.js';
	import { dateAddSeconds } from '$lib/utils/date';
	import ScoreOverTimeInSessionChart from '$lib/ui/views/charts/ScoreOverTimeInSessionChart.svelte';

	let { data } = $props();

	const session: SessionWithUser = $derived(data.session);
	const user = $derived(session.user);

	const table: TableData = $derived({
		caption: 'A list of scores in this session.',
		columns: ['Level ID', 'Score', 'Accuracy', 'Time Taken', 'Created At'],
		rows: data.scoresInSession.map((score: Score) => ({
			values: [
				score.levelId,
				score.score,
				score.accuracy,
				score.timeTaken,
				score.createdAt.toLocaleString()
			]
		}))
	});

	const sessionEnd = $derived(dateAddSeconds(session.createdAt, session.duration));
</script>

<div class="m-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
	<Card>
		{#snippet header()}
			<h1>Session Information</h1>
		{/snippet}
		{#snippet article()}
			<div class="grid grid-cols-2 justify-between">
				<span>ID</span>
				<span>{session.id}</span>
				<span>Created At</span>
				<span>{session.createdAt.toLocaleString()}</span>
				<span>Ended At</span>
				<span>{sessionEnd.toLocaleString()}</span>
				<span>By</span>
				<a href="/dashboard/user/{user.id}" class="underline">{user.username}</a>
			</div>
		{/snippet}
	</Card>

	<Card>
		{#snippet header()}
			<h1>Scores</h1>
		{/snippet}
		{#snippet article()}
			<Table {table} />
		{/snippet}
	</Card>
	<Card baseExtension="lg:col-span-2 !max-w-full">
		{#snippet header()}
			<h1>Score over time</h1>
		{/snippet}
		{#snippet article()}
			<div class="justify-center">
				<ScoreOverTimeInSessionChart scores={data.scoresInSession} />
			</div>
		{/snippet}
	</Card>
</div>
