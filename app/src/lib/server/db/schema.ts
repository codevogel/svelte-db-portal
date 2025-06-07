// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
	id: int('id').primaryKey().autoincrement(),
	createdAt: datetime('created_at').notNull(),
	username: varchar('username', { length: 20 }).unique().notNull(),
	dateOfBirth: date('date_of_birth').notNull()
});

