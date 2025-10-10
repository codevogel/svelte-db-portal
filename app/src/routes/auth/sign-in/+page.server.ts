// /src/routes/auth/sign-in/+page.server.ts

import { signIn } from '$lib/server/auth/auth';
import type { Actions } from './$types';
export const actions: Actions = { default: signIn };
