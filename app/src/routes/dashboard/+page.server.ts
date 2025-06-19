// /src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';

import { ScoreDAO, type TopScorer } from '$lib/server/dao/ScoreDAO';
import { UserDAO } from '$lib/server/dao/UserDAO';
import type { User } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const limit: number = 10;
	const users: User[] = await UserDAO.getAllUsers();
	const topScorers: TopScorer[] = await ScoreDAO.getTopScorers(limit);

	return {
		users,
		topScorers
	};
};
