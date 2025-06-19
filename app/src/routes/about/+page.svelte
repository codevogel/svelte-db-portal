<script lang="ts">
	import Card from '$lib/ui/views/Card.svelte';
	import { gameName, adminEmail } from '$lib/stores/projectInfo';
</script>

<div class="flex h-full items-center justify-center p-4">
	<Card>
		{#snippet header()}
			<h1 class="text-center text-2xl font-bold">About</h1>
		{/snippet}
		{#snippet article()}
			<p>
				This website functions as a web portal to a database for the game '{$gameName}'.
			</p>
			<p>
				To gain access to the database, please log in using your GitHub account. Note that your
				GitHub account has to be whitelisted by the site administrator in order to access this
				website.
			</p>
			<p>
				You can contact the administrator via email at {$adminEmail}.
			</p>

			<p>
				Once logged in, you can view the <a href="/dashboard" class="text-primary-500">dashboard</a
				>, which provides an overview of the database. There, you can also view data about specific
				<a href="/dashboard/user" class="text-primary-500">users</a>
				or <a href="/dashboard/session" class="text-primary-500">sessions</a>.
			</p>
		{/snippet}
	</Card>
</div>
