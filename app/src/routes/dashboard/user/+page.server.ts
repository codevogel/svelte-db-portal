// /src/routes/dashboard/user/+page.server.ts

import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/dao/UserDAO';
import { error } from '@sveltejs/kit';
import { NOT_LOGGED_IN_ERROR } from '$lib/constants/strings';

export const load: PageServerLoad = async ({ url, locals }) => {
	const session = await locals.auth();

	if (!session?.user) {
		return error(401, NOT_LOGGED_IN_ERROR);
	}

	// Here we query the user data using our DAO and return it
	const username = url.searchParams.get('username');
	let users: User[] = [];
	if (username) {
		users = await UserDAO.findUsersLikeUsername(username);
	}
	return { users };
};
