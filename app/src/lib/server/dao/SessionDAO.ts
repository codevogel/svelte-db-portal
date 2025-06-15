// /src/lib/server/dao/SessionDao.ts

import { db } from '$lib/server/db';
import { type Session, type User, sessions, users } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export class SessionDAO {
	static async getSessionById (id: number): Promise<Session | undefined> {
		return await db.query.sessions.findFirst({
			where: eq(sessions.id, id),
		});
	}

	static async getSessionsLikeId(id: number): Promise<SessionWithUser[]> {
		const result = await db
			.select({ session: sessions, user: users })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(like(sessions.id, `${id}%`));
		return result;
	}

	static async getSessionsLikeUserName(name: string): Promise<SessionWithUser[]> {
		return await db
			.select({
				session: sessions,
				user: users
			})
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(like(users.username, `%${name}%`));
	}
}

export interface SessionWithUser {
	session: Session;
	user: User;
}
