// /src/routes/dashboard/user/[id]/+page.server.ts

import type { PageServerLoad } from './$types';

import { UserDAO, type UserWithProfile } from '$lib/server/dao/UserDAO';
import { error } from '@sveltejs/kit';
import { SessionDAO, type SessionWithAverageScore } from '$lib/server/dao/SessionDAO';

export const load: PageServerLoad = async ({ params }) => {
	const id: number = parseInt(params.id);

	const user: UserWithProfile | undefined = await UserDAO.findUserWithProfileById(id);
	const sessionsByUser: SessionWithAverageScore[] = await SessionDAO.findSessionsByUserId(id);
	

	if (!user) {
		console.error(`User with ID ${id} not found. Showing 404.`);
		throw error(404, `User with ID ${id} not found`);
	}

	return {
		user,
		sessionsByUser
	};
};
