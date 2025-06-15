// /src/routes/dashboard/session/+page.server.ts

import type { PageServerLoad } from './$types';
import { SessionDAO, type SessionWithUser } from '$lib/server/dao/SessionDAO';

export const load: PageServerLoad = async ({ url }) => {
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
