// /src/lib/server/auth/auth.ts

import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { ALLOWED_GITHUB_IDS } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [GitHub],
	callbacks: {
		async signIn({ account, profile }) {
			if (!account || !account.provider || !profile || !profile.id) {
				return false;
			}
			if (account.provider === 'github') {
				// Check if user's GitHub ID is in your whitelist
				const allowedIds = ALLOWED_GITHUB_IDS.split(',').map((id) => id.trim());
				return allowedIds.includes(profile.id.toString());
			}
			return false;
		}
	},
	pages: {
		error: '/auth/not-whitelisted'
	}
});
