// /scripts/reseed.ts

import mysql from 'mysql2/promise';
// This import is necessary so we can load our environment variables
import 'dotenv/config';
// This should point to your schema file
import * as schema from '../src/lib/server/db/schema';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { reset, seed } from 'drizzle-seed';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

// Function to reseed the database
async function reseed_db() {
	// Ensure the DATABASE_URL environment variable is set
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	// Create a MySQL client and initialize Drizzle ORM
	const client = mysql.createPool(process.env.DATABASE_URL);
	const db = drizzle(client, { schema, mode: 'default' });

	faker.seed(1234);

	// Reset the database (drop all data from the tables)
	console.log('Resetting database...');
	await reset(db, schema);
	// Seed the database with test data
	console.log('Reseeding database...');

	await seed(db, schema).refine((f) => ({
		users: {
			count: 12,
			columns: {
				createdAt: f.date({ minDate: '2025-01-01', maxDate: '2025-02-01' }),
				dateOfBirth: f.date({ minDate: '1995-01-01', maxDate: '2005-12-31' })
			},
			with: {
				userProfiles: 1,
				sessions: 5
			}
		},
		userProfiles: {
			columns: {
				firstName: f.firstName(),
				lastName: f.lastName({ isUnique: true }),
				title: f.valuesFromArray({
					values: ['Intern', 'Junior', 'Senior']
				})
			}
		},
		sessions: {
			columns: {
				// Between 30 minutes and 4 hours
				duration: f.number({ minValue: 60 * 30, maxValue: 60 * 60 * 4 })
			},
			with: {
				scores: 5
			}
		},
		levels: {
			count: 5
		},
		scores: {
			columns: {
				score: f.number({ minValue: 0, maxValue: 5000 }),
				// Between 1 minute and 12 hours
				timeTaken: f.number({ minValue: 60, maxValue: 60 * 12 }),
				// Between 0 and 1 with 2 decimal places
				accuracy: f.number({ minValue: 0, maxValue: 1, precision: 100 })
			}
		}
	}));

	await updateUsernames(db);
	await updateLevels(db);
	await adjustSessionCreatedAt(db);
	await adjustScoresCreatedAt(db);

	// Log success message
	console.log('Database reseeded successfully');
	await client.end();
}

// Sets random internet usernames for each user
async function updateUsernames(db: MySql2Database<typeof schema>) {
	const users = await db.select().from(schema.users);
	for (const user of users) {
		await db
			.update(schema.users)
			.set({
				username: faker.internet.username().slice(0, 20)
			})
			.where(eq(schema.users.id, user.id));
	}
}

// Updates the levels table with sequential names and difficulties
async function updateLevels(db: MySql2Database<typeof schema>) {
	const levels = [
		{ name: 'Beginner', difficulty: 1 },
		{ name: 'Intermediate', difficulty: 2 },
		{ name: 'Advanced', difficulty: 3 },
		{ name: 'Expert', difficulty: 4 },
		{ name: 'Master', difficulty: 5 }
	];

	// For each level, update the name and difficulty
	for (let i = 0; i < levels.length; i++) {
		await db
			.update(schema.levels)
			.set({
				name: levels[i].name,
				difficulty: i + 1
			})
			.where(eq(schema.levels.id, i + 1));
	}
}

// Adjusts the created_at column in the sessions table to ensure that sessions are created after the user account was created
async function adjustSessionCreatedAt(db: MySql2Database<typeof schema>) {
	// Query the created users
	const createdUsers = await db.select().from(schema.users);

	// For each user...
	for (const user of createdUsers) {
		// Find their sessions
		const userSessions = await db.query.sessions.findMany({
			where: (sessions, { eq }) => eq(sessions.userId, user.id)
		});

		// Offset the sessions for that user
		let currentCreatedAt = user.createdAt;
		for (const session of userSessions) {
			// Offset the createdAt by a random amount of time (up to 48 hours)
			const offset = faker.number.int({ min: 0, max: 60 * 60 * 48 * 1000 });
			const newCreatedAt = new Date(currentCreatedAt.getTime() + offset);
			// Update the session's createdAt
			await db
				.update(schema.sessions)
				.set({ createdAt: newCreatedAt })
				.where(eq(schema.sessions.id, session.id));
			currentCreatedAt = newCreatedAt;
		}
	}
}

// Adjusts the created_at column in the scores table to ensure that scores are created in the timespan of the session
async function adjustScoresCreatedAt(db: MySql2Database<typeof schema>) {
	// Query all sessions
	const sessions = await db.select().from(schema.sessions);

	// For each session...
	for (const session of sessions) {
		// Calculate the session's start and end times
		const sessionCreatedAt = session.createdAt;
		const sessionEndedAt = new Date(sessionCreatedAt.getTime() + session.duration * 1000);

		// Find all scores for that session
		const scores = await db.query.scores.findMany({
			where: eq(schema.scores.sessionId, session.id)
		});

		// For each score, set a random createdAt time within the session's timespan
		for (const score of scores) {
			const randomTime = faker.date.between({ from: sessionCreatedAt, to: sessionEndedAt });
			await db
				.update(schema.scores)
				.set({ createdAt: randomTime })
				.where(eq(schema.scores.id, score.id));
		}
	}
}

// Entry point for the script
async function main() {
	await reseed_db();
}

// Run the main function
main();
