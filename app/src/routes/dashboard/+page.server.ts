// /src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';

import { ScoreDAO, type TopScorer } from '$lib/server/dao/ScoreDAO';

export const load: PageServerLoad = async () => {
	const limit: number = 10;
	const topScorers: TopScorer[] = await ScoreDAO.getTopScorers(limit);

	return {
		topScorers
	};
};
