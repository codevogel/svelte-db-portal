// /src/lib/server/dao/SessionDao.ts

import { db } from '$lib/server/db';
import { type Session, type User, sessions, users } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export class SessionDAO {
	static async getSessionsLikeId(id: number): Promise<SessionWithUser[]> {
		const result = await db
			.select({ sessions, users })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(like(sessions.id, `${id}%`));

		
		return result.map((row) => ({
			session: row.sessions,
			user: row.users
		}));
	}

	static async getSessionsLikeUserName(name: string): Promise<SessionWithUser[]> {
		const result: SessionWithUser[] = await db
			.select({
				users,
				sessions
			})
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(like(users.username, `%${name}%`));
		return result;
	}
}

export interface SessionWithUser extends Session {
	session: Session;
	user: User;
}
