// /src/routes/auth/sign-out/+server.ts

import { signOut } from '$lib/server/auth/auth';
import type { Actions } from './$types';
export const actions: Actions = { default: signOut };
