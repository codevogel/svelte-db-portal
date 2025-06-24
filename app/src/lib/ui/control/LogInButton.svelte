<script lang="ts">
	import { LogIn } from 'lucide-svelte';
	import { SignIn } from '@auth/sveltekit/components';

	let { primary = false } = $props();
</script>

<SignIn
	provider="github"
	class={primary ? 'btn preset-filled-primary-500' : 'btn-icon hover:preset-tonal'}
	signInPage="auth/sign-in"
>
	<span slot="submitButton" class="flex gap-x-1">
		<span class="{primary ? '' : 'hidden'} text-sm lg:block">Log In</span>
		<LogIn />
	</span>
</SignIn>
