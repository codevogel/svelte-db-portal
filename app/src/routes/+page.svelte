<!-- /src/routes/+page.svelte -->

<script lang="ts">
	// The $state rune is used to create a reactive state variable.
	let buttonClicks: number = $state(0);
	// The $derived rune is used to create a derived variable that updates when its dependencies change.
	let timeOrTimes: string = $derived(buttonClicks === 1 ? 'time' : 'times');
</script>

<div class="flex flex-col gap-2">
	<h1 class="text-3xl font-bold">Welcome to the Web Portal</h1>
	<p>We hope you enjoy your stay!</p>

	<p>We're building this website. But for now, here's a button. How many times can you click it?</p>

	<!-- The button will increment the buttonClicks state variable when clicked. -->
	<button class="btn preset-filled-primary-500 max-w-36" onclick={() => buttonClicks++}
		>Click me!</button
	>
	<!-- The text below will update reactively based on the buttonClicks state variable. -->
	<p>You have clicked the button <span class="text-red-500">{buttonClicks}</span> {timeOrTimes}.</p>
</div>
