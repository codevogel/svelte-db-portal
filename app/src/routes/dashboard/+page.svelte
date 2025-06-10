<!-- /src/routes/dashboard/+page.svelte -->

<script lang="ts">
	import type { TopScorer } from '$lib/server/dao/ScoreDAO';
	
	let { data } = $props();

	let topScorers: TopScorer[] = $derived(data.topScorers);
</script>

<h2 class="text-xl font-bold">Dashboard home.</h2>

	<div class="grid grid-cols-3 ">
		<span class="text-lg">Top Scorers</span>
		<span class="text-lg">Score</span>
		<span class="text-lg">Session ID</span>
{#each topScorers as scorer (scorer.user.id)}
		<span class="text-lg">{scorer.user.username}</span>
		<span class="text-lg">{scorer.score.score}</span>
		<span class="text-lg">{scorer.session.id}</span>
{/each}
	</div>
