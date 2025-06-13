import { DAO } from '$lib/server/dao/DAO';
import type { User } from '$lib/server/db/schema';
import { users } from '$lib/server/db/schema';
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

	static async findUsersLikeUsername(username: string): Promise<User[]> {
		return DAO.db.query.users.findMany({
			where: like(users.username, `%${username}%`)
		});
	}
}
