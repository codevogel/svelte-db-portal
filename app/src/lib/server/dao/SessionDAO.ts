// /src/lib/server/dao/SessionDao.ts

import { type Session, type User, scores, sessions, users } from '$lib/server/db/schema';
import { avg, eq, like } from 'drizzle-orm';
import { DAO } from '$lib/server/dao/DAO';

export class SessionDAO extends DAO {
	static async getSessionById(id: number): Promise<Session | undefined> {
		return await DAO.db.query.sessions.findFirst({
			where: eq(sessions.id, id)
		});
	}

	static async getSessionByIdWithUser(id: number): Promise<SessionWithUser | undefined> {
		const result = await DAO.db.select({
			session: sessions,
			user: users
		})
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, id))
			.limit(1)
			.then((rows) => rows[0]);
		return result ? { ...result.session, user: result.user } : undefined;
	}

	static async getSessionsLikeId(id: number): Promise<SessionWithUser[]> {
		const result = await DAO.db
			.select({ session: sessions, user: users })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(like(sessions.id, `${id}%`));
		return result.map((row) => ({
			...row.session,
			user: row.user
		}));
	}

	static async getSessionsLikeUserName(name: string): Promise<SessionWithUser[]> {
		const result = await DAO.db
			.select({
				session: sessions,
				user: users
			})
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(like(users.username, `%${name}%`));
		return result.map((row) => ({
			...row.session,
			user: row.user
		}));
	}

	static async findSessionsByUserId(userId: number): Promise<SessionWithAverageScore[]> {
		const result = await DAO.db
			.select({
				session: sessions,
				averageScore: avg(scores.score).mapWith(Number)
			})
			.from(sessions)
			.innerJoin(scores, eq(sessions.id, scores.sessionId))
			.where(eq(sessions.userId, userId))
			.groupBy(sessions.id);

		return result.map((row) => ({
			...row.session,
			averageScore: row.averageScore
		}));
	}
}

export type SessionWithUser = Session & {
	user: User;
};

export type SessionWithAverageScore = Session & {
	averageScore: number;
};
