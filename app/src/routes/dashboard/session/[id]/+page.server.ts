// /src/routes/dashboard/session/[id]/+page.server.ts

import type { PageServerLoad } from './$types';

import type { Score } from '$lib/server/db/schema';
import { SessionDAO, type SessionWithUser } from '$lib/server/dao/SessionDAO';
import { error } from '@sveltejs/kit';
import { ScoreDAO } from '$lib/server/dao/ScoreDAO';
import { NOT_LOGGED_IN_ERROR } from '$lib/constants/strings';

export const load: PageServerLoad = async ({ params, locals }) => {
	const authSession = await locals.auth();

	if (!authSession?.user) {
		return error(401, NOT_LOGGED_IN_ERROR);
	}

	const id: number = parseInt(params.id);

	const session: SessionWithUser | undefined = await SessionDAO.getSessionByIdWithUser(id);
	const scores: Score[] = await ScoreDAO.findScoresForSession(id);

	if (!session) {
		console.error(`Session with ID ${id} not found. Showing 404.`);
		throw error(404, `Session with ID ${id} not found`);
	}

	return {
		session,
		scoresInSession: scores
	};
};
