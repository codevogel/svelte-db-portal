// /src/lib/server/dao/ScoreDAO.ts

import { DAO } from '$lib/server/dao/DAO';
import {
	users,
	scores,
	sessions,
	type User,
	type Score,
	type Session
} from '$lib/server/db/schema';
import { eq, and, desc, max } from 'drizzle-orm';

export class ScoreDAO extends DAO {
	static async getTopScorers(limit: number): Promise<TopScorer[]> {
		// First, find the maximum score for each user
		const maxScoreSubquery = DAO.db
			// We want to find the maximum score for each user,
			// across all their sessions.
			.select({
				// We want to select the userId that achieved the max score ...
				userId: sessions.userId,
				// ... and the maximum of all scores for that user.
				maxScore: max(scores.score).as('max_score')
			})
			// We start with the sessions (the bridge between users and scores) ...
			.from(sessions)
			// ... and join with the scores table to get the scores for each session ...
			.innerJoin(scores, eq(scores.sessionId, sessions.id))
			// ... then group by userId to return all scores per user ...
			.groupBy(sessions.userId)
			// ... and finally alias this subquery so it can be referenced later.
			.as('max_scores');

		// Then find the score records that match these maximums
		return await DAO.db
			// Select both user and score information ...
			.select({ user: users, score: scores, session: sessions })
			// ... from the users table...
			.from(users)
			// ... joined with the maximum scores subquery ...
			.innerJoin(maxScoreSubquery, eq(maxScoreSubquery.userId, users.id))
			// ... joined with the sessions that match the users id ...
			.innerJoin(sessions, eq(sessions.userId, users.id))
			// ... and the score that matches both the relevant sessionId and the maximum score ...
			.innerJoin(
				scores,
				and(eq(scores.sessionId, sessions.id), eq(scores.score, maxScoreSubquery.maxScore))
			)
			// ... then order the results by score in descending order ...
			.orderBy(desc(scores.score))
			// ... and limit the results to the top 10 scorers.
			.limit(limit);
	}

	static async findScoresForSession(sessionId: number): Promise<Score[]> {
		return await DAO.db.query.scores.findMany({
			where: eq(scores.sessionId, sessionId)
		});
	}
}

// Stores the relevant User, Score, and Session data for a top scorer
export interface TopScorer {
	user: User;
	score: Score;
	session: Session;
}
