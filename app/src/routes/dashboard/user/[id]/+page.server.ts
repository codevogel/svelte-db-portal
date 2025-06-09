// /src/routes/dashboard/user/[id]/+page.server.ts 

import type { PageServerLoad } from "./$types";

import type { User } from "$lib/server/db/schema";
import { UserDAO } from "$lib/server/dao/UserDAO";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
	const id: number = parseInt(params.id);

	const user: User | undefined = await UserDAO.findUserById(id);

	if (!user) {
		console.error(`User with ID ${id} not found. Showing 404.`);
		throw error(404, `User with ID ${id} not found`);
	}

	return {
		user
	}
}
