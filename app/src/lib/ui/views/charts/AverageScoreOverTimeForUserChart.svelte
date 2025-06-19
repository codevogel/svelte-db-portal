<script lang="ts">
	import { nl } from 'date-fns/locale';
	import Chart from '$lib/ui/views/charts/Chart.svelte';
	import type { SessionWithAverageScore } from '$lib/server/dao/SessionDAO';

	let { scores: sessions }: { scores: SessionWithAverageScore[] } = $props();

	// We sort the scores by createdAt,
	// then map the x values to the createdAt,
	// and the y values to the score.
	const inData = sessions
		.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
		.map((score) => {
			return {
				x: score.createdAt,
				y: score.averageScore
			};
		});

	const chartData = {
		type: 'line',
		data: {
			labels: inData.map((score) => score.x),
			datasets: [
				{
					label: 'Average Score',
					data: inData.map((score) => score.y)
				}
			]
		},
		options: {
			scales: {
				x: {
					type: 'time',
					adapters: {
						date: {
							locale: nl
						}
					},
					bounds: 'data'
				},
				y: {
					beginAtZero: true
				}
			}
		}
	};
</script>

<Chart type={chartData.type} data={chartData.data} options={chartData.options} />
