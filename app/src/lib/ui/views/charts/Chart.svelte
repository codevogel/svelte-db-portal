<!-- /src/lib/ui/views/charts/Chart.svelte -->

<script lang="ts">
	//@ts-nocheck
	import { Chart } from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { onMount } from 'svelte';

	let { type, data, options } = $props();

	let chartElement;
	let chartInstance: Chart | null = null;

	onMount(() => {
		renderChart();
		window.addEventListener('resize', renderChart);
	});

	function renderChart() {
		// When resizing, it's possible the chart gets stuck in it's smallest state.
		// To avoid this, we destroy the chart instance and create a new one, disabling the pop-in animation.
		let animate = true;
		if (chartInstance) {
			chartInstance.destroy();
			animate = false;
		}
		chartInstance = new Chart(chartElement, {
			type: type,
			data: data,
			options: {
				...options,
				animation: animate
			}
		});
	}
</script>

<canvas id="chart" bind:this={chartElement}></canvas>
