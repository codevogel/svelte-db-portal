// /src/routes/dashboard/session/[id]/+page.server.ts 

import type { PageServerLoad } from "./$types";

import type { Session} from "$lib/server/db/schema";
import { SessionDAO } from "$lib/server/dao/SessionDAO";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
	const id: number = parseInt(params.id);

	const session: Session | undefined = await SessionDAO.getSessionById(id);

	if (!session) {
		console.error(`Session with ID ${id} not found. Showing 404.`);
		throw error(404, `Session with ID ${id} not found`);
	}

	return {
		session
	}
}
