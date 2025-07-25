// /src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();

	const loggedIn = session?.user ? true : false;

	return {
		session,
		loggedIn
	};
};
