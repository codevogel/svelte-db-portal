// /src/routes/dashboard/session/+page.server.ts

import type { PageServerLoad } from './$types';
import { SessionDAO, type SessionWithUser } from '$lib/server/dao/SessionDAO';
import { error } from '@sveltejs/kit';
import { NOT_LOGGED_IN_ERROR } from '$lib/constants/strings';

export const load: PageServerLoad = async ({ url, locals }) => {
	const session = await locals.auth();

	if (!session?.user) {
		return error(401, NOT_LOGGED_IN_ERROR);
	}

	let sessions: SessionWithUser[] = [];

	// Either query by username or by id
	const userNameParam = url.searchParams.get('username');
	if (userNameParam) {
		sessions = await SessionDAO.getSessionsLikeUserName(userNameParam);
		return { sessions };
	}

	const idParam = url.searchParams.get('id');
	const id = idParam ? parseInt(idParam) : null;
	if (id) {
		sessions = await SessionDAO.getSessionsLikeId(id);
	}
	return { sessions };
};
