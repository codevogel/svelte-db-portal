// /src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';

import { ScoreDAO, type TopScorer } from '$lib/server/dao/ScoreDAO';
import { UserDAO } from '$lib/server/dao/UserDAO';
import type { User } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { NOT_LOGGED_IN_ERROR } from '$lib/constants/strings';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user) {
		return error(401, NOT_LOGGED_IN_ERROR);
	}

	const limit: number = 10;
	const users: User[] = await UserDAO.getAllUsers();
	const topScorers: TopScorer[] = await ScoreDAO.getTopScorers(limit);

	return {
		users,
		topScorers
	};
};
