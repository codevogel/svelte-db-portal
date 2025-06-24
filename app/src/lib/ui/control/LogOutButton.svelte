<script lang="ts">
	import { LogOut } from 'lucide-svelte';
	import { SignOut } from '@auth/sveltekit/components';
</script>

<SignOut
	provider="github"
	class="btn-icon hover:preset-tonal"
	signOutPage="auth/sign-out"
	options={{ redirectTo: '/' }}
>
	<span slot="submitButton" class="flex gap-x-1">
		<span class="hidden text-sm lg:block">Log Out</span>
		<LogOut />
	</span>
</SignOut>
