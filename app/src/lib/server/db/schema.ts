// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Holds user information.
export const users = mysqlTable('users', {
	id: int('id').primaryKey().autoincrement(),
	createdAt: datetime('created_at').notNull(),
	username: varchar('username', { length: 20 }).unique().notNull(),
	dateOfBirth: date('date_of_birth').notNull()
});

// Holds user profile information.
export const userProfiles = mysqlTable('user_profiles', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').references(() => users.id),
	firstName: varchar('first_name', { length: 30 }).notNull(),
	lastName: varchar('last_name', { length: 30 }).notNull(),
	title: varchar('title', { length: 255 }).notNull()
});

// One user has one profile.
export const usersRelations = relations(users, ({ one }) => ({
	profile: one(userProfiles)
}));

// One profile belongs to one user.
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id]
	})
}));
