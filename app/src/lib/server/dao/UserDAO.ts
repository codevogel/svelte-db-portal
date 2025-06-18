import { DAO } from '$lib/server/dao/DAO';
import type { User, UserProfile } from '$lib/server/db/schema';
import { userProfiles, users } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export class UserDAO extends DAO {
	static async getAllUsers(): Promise<User[]> {
		return DAO.db.select().from(users);
	}

	static async findUserById(id: number): Promise<User | undefined> {
		return DAO.db.query.users.findFirst({
			where: eq(users.id, id)
		});
	}

	static async findUserWithProfileById(id: number): Promise<UserWithProfile | undefined> {
		const result = await DAO.db
			.select({
				users,
				userProfiles
			})
			.from(users)
			.innerJoin(userProfiles, eq(users.id, userProfiles.userId))
			.where(eq(users.id, id));

		if (result.length !== 1) {
			return undefined;
		}

		return {
			...result[0].users,
			profile: result[0].userProfiles
		};
	}

	static async findUsersLikeUsername(username: string): Promise<User[]> {
		return DAO.db.query.users.findMany({
			where: like(users.username, `%${username}%`)
		});
	}
}

export type UserWithProfile = User & {
	profile: UserProfile;
};
