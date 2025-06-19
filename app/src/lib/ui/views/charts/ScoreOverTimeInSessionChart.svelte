<!-- /src/lib/ui/views/charts/ScoreOverTimeInSessionChart.svelte -->

<script lang="ts">
	import type { Score } from '$lib/server/db/schema';
	import { nl } from 'date-fns/locale';
	import Chart from '$lib/ui/views/charts/Chart.svelte';

	let { scores }: { scores: Score[] } = $props();

	// We sort the scores by createdAt,
	// then map the x values (time) to the createdAt,
	// and the y values (score) to the score.
	const inData = scores
		.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
		.map((score) => {
			return {
				x: score.createdAt,
				y: score.score
			};
		});

	const chartData = {
		// Display a line chart 
		type: 'line',

		data: {
			// Labels for the x-axis
			labels: inData.map((score) => score.x),
			// Datasets for the y-axis
			datasets: [
				// Just one dataset: the score over time
				{
					label: 'Score',
					data: inData.map((score) => score.y)
				}
			]
		},
		options: {
			// Define how the chart scales should behave
			scales: {
				// The x-axis is of type 'time' and has a date adapter for the 'nl' locale
				x: {
					type: 'time',
					adapters: {
						date: {
							locale: nl
						}
					},
					bounds: 'data'
				},
				// The y-axis starts at zero (rather than the lowest value)
				y: {
					beginAtZero: true
				}
			}
		}
	};
</script>

<Chart type={chartData.type} data={chartData.data} options={chartData.options} />
