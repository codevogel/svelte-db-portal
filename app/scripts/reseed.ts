// /scripts/reseed.ts

import mysql from 'mysql2/promise';
// This import is necessary so we can load our environment variables
import 'dotenv/config';
// This should point to your schema file
import * as schema from '../src/lib/server/db/schema';
import { drizzle } from 'drizzle-orm/mysql2';
import { reset, seed } from 'drizzle-seed';

// Function to reseed the database
async function reseed_db() {
	// Ensure the DATABASE_URL environment variable is set
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	// Create a MySQL client and initialize Drizzle ORM
	const client = mysql.createPool(process.env.DATABASE_URL);
	const db = drizzle(client, { schema, mode: 'default' });

	// Reset the database (drop all data from the tables)
	console.log('Resetting database...');
	await reset(db, schema);
	// Seed the database with test data
	console.log('Reseeding database...');

	await seed(db, schema).refine((f) => ({
		users: {
			count: 12,
			with: {
				userProfiles: 1,
				sessions: 5
			}
		},
		sessions: {
			with: {
				scores: 5
			}
		},
		levels: {
			count: 5
		}
	}));

	// Log success message
	console.log('Database reseeded successfully');
	await client.end();
}

// Entry point for the script
async function main() {
	await reseed_db();
}

// Run the main function
main();
