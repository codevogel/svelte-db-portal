// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int, float } from 'drizzle-orm/mysql-core';
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
	userId: int('user_id').references(() => users.id).notNull(),
	firstName: varchar('first_name', { length: 35 }).notNull(),
	lastName: varchar('last_name', { length: 35 }).notNull(),
	title: varchar('title', { length: 35 }).notNull()
});

// Holds information about user sessions
export const sessions = mysqlTable('sessions', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').references(() => users.id).notNull(),
	createdAt: datetime('created_at').notNull(),
	duration: int('duration').notNull() // in seconds
});

// Holds scores for each session and level
export const scores = mysqlTable('scores', {
	id: int('id').primaryKey().autoincrement(),
	sessionId: int('session_id').references(() => sessions.id).notNull(),
	levelId: int('level_id').references(() => levels.id).notNull(),
	createdAt: datetime('created_at').notNull(),
	score: int('score').notNull(),
	timeTaken: int('time_taken').notNull(), 
	accuracy: float('accuracy').notNull()
});

export const levels = mysqlTable('levels', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 35 }).notNull(),
	difficulty: int('difficulty').notNull()
});

// Define relations from the users table
export const usersRelations = relations(users, ({ one, many }) => ({
	// One user has one profile.
	profile: one(userProfiles),
	// One user can have many sessions.
	sessions: many(sessions)
}));

// Define relations from the userProfiles table
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	// One user profile belongs to one user.
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id]
	})
}));

// Define relations from the sessions table
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	// One session belongs to one user.
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
	scores: many(scores) // One session can have many scores.
}));

// Define relations from the score table
export const scoresRelations = relations(scores, ({ one }) => ({
	// One score belongs to one session.
	session: one(sessions, {
		fields: [scores.sessionId],
		references: [sessions.id]
	}),
	// One score belongs to one level.
	level: one(levels, {
		fields: [scores.levelId],
		references: [levels.id]
	})
}));

// Holds information about the levels in the game
export const levelsRelations = relations(levels, ({ many }) => ({
	// One level can have many scores.
	scores: many(scores)
}));

export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Score = typeof scores.$inferSelect;
export type Level = typeof levels.$inferSelect;
