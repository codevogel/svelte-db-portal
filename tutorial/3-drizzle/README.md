# 3 - Drizzle ORM

Now that we have a basic website up and running, we can start adding some data to it. In this chapter, we will set up [Drizzle](https://orm.drizzle.team/) as our Object Relational Mapper (ORM) to interact with our MySQL database.

## Chapter Overview

### Learning goals
At the end of this chapter, you will:
- Understand what an ORM is and how it can simplify database interactions.
- Be able to set up Drizzle ORM with a MySQL database.
- Know how to define a database schema using Drizzle.
- Be able to seed your database with initial data using drizzle-seed.
- Understand how to create a Data Access Object (DAO) to handle database queries.
- Be able to load data in Svelte using server-side load functions.
- Know how to use the `$props` rune to access data in Svelte components.

### Prerequisites
- Basic understanding of SQL and relational databases.

### Learning resources

## Introduction to ORMs

An ORM (Object Relational Mapper) is a programming technique that allows us to interact with a database using an object-oriented approach. Instead of writing raw SQL queries, we can use an ORM to define our database tables and relationships as classes and objects in our code. This allows us to work with our data in a more intuitive way, and can help us avoid some of the common pitfalls of raw SQL queries, such as SQL injection attacks.
i
[Drizzle](https://orm.drizzle.team/) is a TypeScript ORM that is designed to be simple and easy to use. It allows us to define our database tables and relationships using TypeScript classes, and provides a simple API for querying and manipulating our data. Drizzle also provides drizzle-seed, a tool for seeding our database with initial data. This can be useful for testing and development purposes, as it allows us to quickly populate our database with some sample data without having to write a bunch of SQL queries by hand.

It is a code-first ORM, meaning that we define our database schema in code, and then use the Drizzle CLI to push that schema to our database.

## Setting up Drizzle ORM

During the setup of our SvelteKit project, we already installed `drizzle`, and the `sv` CLI has already generated the necessary configuration files for us. If you didn't install `drizzle` during the setup, you can do so now with the `sv` cli:

```bash
npx sv add drizzle
```

Or, if you wanted to, you could follow the [installation instructions](https://orm.drizzle.team/docs/get-started/mysql-new) on the Drizzle website instead. We'll be covering some of the files that the `sv` CLI generated for us, so if you want to follow along, make sure to use the same configuration.

### Drizzle configuration

As the `sv` CLI has already installed Drizzle into our project during setup, let's talk about some of the files it's created for us.

- `.env` and `.env.example`
    - These files are used to store environment variables. The `.env` file is used to store sensitive information, such as database connection strings, while the `.env.example` file is used to provide a template for the `.env` file, and leaves the values empty. 

	 > ⚠️ **Important**: The `.env` file should **never** be committed to version control, as it contains sensitive information such as database credentials. The `.env.example` file is safe to commit, as it should not contain any sensitive information.

- `drizzle.config.ts`
    - This file is used to configure Drizzle. It contains the database connection string and other configuration options. You can find more information about the configuration options in the [Drizzle documentation](https://orm.drizzle.team/docs/get-started/mysql-new).
- `src/lib/server/db/index.ts`
    - This file is used to create a connection to the database and export the Drizzle instance. You can find more information about the configuration options in the [Drizzle documentation](https://orm.drizzle.team/docs/get-started/mysql-new). 
- `src/lib/server/db/schema.ts`
    - This file is used to define the database schema. It contains the database tables and relationships. You can find more information about the schema options in the [Drizzle documentation](https://orm.drizzle.team/docs/sql-schema-declaration).

In `.env`, we want to update the `DATABASE_URL` to reflect the proper configuration. I'm using `root` (the default privileged MySQL user in XAMPP) as the `username` here (and optionally, a `password`), the `host` is `localhost`, on port `3306` (default port for the SQL database provided in XAMPP), and we point at a database `db-demobots` (that we have yet to create!). If you've messed around with the usernames, ports and/or passwords, fill those in instead. 

> ℹ️ We won't be going live with this database, but it might be best practice to secure it using a password anyway. You can do so by running a query in the MySQL server (launch it by running /opt/lampp/bin/mysql): `SET PASSWORD FOR 'root'@'localhost' = PASSWORD('my_very_secretive_password'); FLUSH PRIVILEGES;`. Be sure to update your `mysql` and `phpmyadmin` credentials by editing `/opt/lampp/etc/my.cnf` (needs sudo access) and `/opt/lampp/phpmyadmin/config.inc.php` respectively. Don't forget to restart the XAMPP server (`sudo /opt/lampp/lampp restart`) afterwards. Should you ever run into issues, you can always attempt to [reset the password](https://dev.mysql.com/doc/refman/8.4/en/resetting-permissions.html).

Following above instructions, your `.env` file should look something like this:

```shellscript
# Replace with your DB credentials!
DATABASE_URL="mysql://root:a_very_secretive_password@localhost:3306/db-demobots"
```

Your `/opt/lampp/etc/my.cnf` file should include something like this (note that this file is overridden by the alternative locations mentioned in the my.cnf file, `/opt/lampp/var/mysql/my.cnf` and `~/.my.cnf`):

```
# The following options will be passed to all MySQL clients
[client]
password       =my_very_secretive_password
port            =3306
```

And your `/opt/lampp/phpmyadmin/config.inc.php` file should include something like this:

```php
/* Authentication type */
$cfg['Servers'][$i]['auth_type'] = 'config';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = 'my_very_secretive_password';
```

(Re)start the XAMPP server now to ensure the changes take effect:

```bash
sudo /opt/lampp/lampp restart
```

Next, let's take a look at the `src/lib/server/db/index.ts` file that was generated for us:

```typescript
// /src/lib/server/db/index.ts

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(client, { schema, mode: 'default' });
```

It's responsible for creating a connection to the MySQL database using the `mysql2` package, and exporting a Drizzle instance (`db`) that we can use to interact with our database. The `env` import is used to access the environment variables defined in our `.env` file.

We don't need to change anything in this file, but it's good to know what it does.

### Creating the database

> ℹ️ If you already have an existing database that you want to use, you *can* skip this step, but it is highly recommended to create a new database entirely to avoid any data loss while we're figuring Drizzle out.

Now that we have our Drizzle configuration set up, before we start defining our database schema, we need to create the database itself.

This is as simple as visiting `[http://localhost/phpmyadmin](http://localhost/phpmyadmin)` in your browser, which should log you in automatically using the credentials we provided in the `/opt/lampp/phpmyadmin/config.inc.php` file.

Once at the landing page, click on the "Databases" tab at the top, and then in the "Create database" field, enter `db-demobots` (or whatever name you set up earlier in your `.env` file), and click the "Create" button.

We won't be doing anything else in phpMyAdmin for now, as we will be using Drizzle (`drizzle-seed` to be exact) to set up our database schema and seed our database with some test data.

### Defining a simple database schema

> ℹ️ If you already have an existing database with a schema that you want to use, you can skip this step and instead skip forward to the sub-section on "Pulling a schema from an existing database". However, once again, it is highly recommended to just follow along with the steps we're taking here to avoid any data loss while we're figuring Drizzle out.

#### Simple table

Let's take a look at the `src/lib/server/db/schema.ts` file that was generated for us:

```typescript
// /src/lib/db/schema.ts

import { mysqlTable, serial, int } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: serial('id').primaryKey(),
	age: int('age')
});
```

This file currently defines a single table called `user`, with two columns: `id` and `age`. The `id` column is a serial (auto-incrementing) primary key, and the `age` column is an integer.
It imports the necessary functions from the `drizzle-orm/mysql-core` package to define the type of table and column types.

> ℹ️ Even though present in the default schema, the SQL Database we've installed along with XAMPP (MariaDB) does not support the `serial` type directly. We will change this in the next step, but keep this in mind, as you might run into similar column type errors pushing your schema to the database.

Let's expand our database with a simple user table that contains some more information about the users. Looking at the [column types](https://orm.drizzle.team/docs/column-types/mysql) that Drizzle supports, we'll add the following columns to our `user` table:
We'll add the following columns to the `user` table.

```typescript
// /src/lib/db/schema.ts

import { mysqlTable, date, datetime, varchar, int } from 'drizzle-orm/mysql-core';

// Holds user information.
export const userTable = mysqlTable('user', {
	id: int('id').primaryKey().autoincrement(),
	createdAt: datetime('created_at').notNull(),
	username: varchar('username', { length: 20 }).notNull(),
	dateOfBirth: date('date_of_birth').notNull()
});
```

We've now defined a `user` table that contains the following columns:
- `id`: an auto-incrementing primary key of type `int`.
- `createdAt`: a `datetime` column that stores the date and time when the user was created.
- `firstName`: a `varchar` column that stores the user's first name, with a maximum length of 30 characters.
- `lastName`: a `varchar` column that stores the user's last name, with a maximum length of 30 characters.
- `username`: a `varchar` column that stores the user's username, with a maximum length of 20 characters.
- `dateOfBirth`: a `date` column that stores the user's date of birth.

Furthermore, we've ensured that none of the columns can be `null` by using the `.notNull()` method.

Now we want to have Drizzle create this table in our database.
So let's try pushing this schema to our database.

#### Pushing a schema

[Pushing a schema](https://orm.drizzle.team/docs/drizzle-kit-push) to the database is the act of altering the database to match the schema defined in our code.

To do this, we can use the `drizzle-kit` CLI tool that was installed as part of the Drizzle setup. We can run it with `npx`:

```bash
npx drizzle-kit push
```

We will be met with a message showing the SQL statement that was generated to add these changes to our database. Confirming that this is what we want to do, the statement will be executed, and the table will be created in our database:

![[drizzle-kit-push.png]]

> ⚠️ If you push to a database that already has tables, Drizzle will attempt to *alter* the existing tables to match the schema defined in your code. This can however cause some issues with data loss. For simplicity during this course, just *drop* all the tables in your dummy database before pushing the schema, so that Drizzle can create the tables from scratch, and then seed the database (see next section) to repopulate the tables with data. 

Let's go over to [`http://localhost/phpmyadmin/`](http://localhost/phpmyadmin/), open up the `db-demobots` database, and then click on the `user` table to see the structure of the table we just created:
![[created-user-table.png]]

Looks good! We'll create some more interesting tables that share relations later, but for now, let's try and do the reverse: let's pull a schema from an existing database instead.
#### Pulling a schema

[Pulling a schema](https://orm.drizzle.team/docs/drizzle-kit-pull) is the opposite of pushing a schema. It takes a look at an existing database and generates a Drizzle schema file that matches the structure of the database.
If you already have an existing database with a schema that you want to use, you can use `drizzle-kit` to pull the schema from the database and generate the corresponding Drizzle schema file.

Let's do this by running the following command:

```bash
npx drizzle-kit pull
```

As seen below, the CLI pulls the schema from the database, and spits out a `drizzle/schema.ts` file and `drizzle/relations.ts` file (we'll get into relations later) that, when pushed, would recreate the database structure.

![[drizzle-kit-pull.png]]

We won't be using this feature too much, so you can go ahead and delete the created `drizzle` folder, but it's neat to know about. 

> ℹ️ If you had an existing database with a schema that you wanted to use, it is still a good recommendation to create a new dummy database and run through the steps of defining the schema from scratch, as it will help you understand how Drizzle works and how to define your own schema in the future, and since we'll be dropping tables instead of migrating between changes, you will lose data in your real database.

Now that we know how to push and pull our schema, let's move on to seeding our database with some initial data.
#### Seeding the database

To be able to test our application, we need some initial data in our database. Now we *could* painstakingly write SQL queries to manually insert data into our database, or use PHPMyAdmin to do so, but Drizzle offers a much simpler way to seed our database with some realistic data using `drizzle-seed`.

[`drizzle-seed` (link)](https://orm.drizzle.team/docs/seed-overview) is a TypeScript library that helps you generate deterministic, yet realistic, fake data to populate your database.

To use `drizzle-seed`, we need to install a few dependencies;
- `drizzle-seed` itself, which provides the seeding functionality.
- `dotenv`, which allows us to load environment variables from a `.env` file.
- `tsx`, which is a TypeScript execution environment that allows us to run TypeScript files directly.

We can install these dependencies by running the following command in our terminal:

```bash
npm install --save-dev drizzle-seed dotenv tsx
```

Now that we have the necessary dependencies installed, we can create a seeding script to populate our database with some initial data. Let's create a new file called `reseed.ts` in a new directory `scripts` which we'll place in the root directory of our svelte project (`/scripts/reseed.ts`):

```typescript
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
	await seed(db, schema);

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
```

If we run this script, our database will be reset (all data will be lost(!)) and then (re)seeded with some initial data.
This data is generated using a pseudo-random number generator, meaning that the data will be random, but with a deterministic seed, so that we can generate the same data every time we run the script. (You can see that that becomes very useful when testing things later on.)

To run the script, we can use the `tsx` command, which allows us to run TypeScript files directly:

```bash
npx tsx scripts/reseed.ts
```

If everything goes well, we should see our message logs indicating that the database has been reset and reseeded successfully:

![[reseed.png]]

Let's go take a look at our table in `phpMyAdmin` again, so we can see the newly generated data:

![[reseed-data.png]]

Cool. This will save us a lot of time doing data-entry by hand, and ensures that we make no mistakes in the data we enter. 

> ℹ️ Just as a heads-up, we can (and will) later refine this data to adhere to specific testing needs (such as the date of births all being in a certain range, or adding special characters to usernames).

### Tables that share relations

Remember, an ORM stands for Object *Relational* Mapper, but right now, we only really have a single table with some Objects in it. We can do better than that: we can create tables that share relations with each other, allowing us to model more complex data structures.

### Soft Relations vs Foreign Keys

Before we dive into implementing relations in Drizzle, let's clarify the difference between **relations** and **foreign keys**.
- **Foreign keys** are a database-level constraint that allows us to link two tables together. A foreign key is a column in one table that references the primary key of another table. This creates a relationship between the two tables, allowing us to join them together in queries. Foreign key constraints make sure that when inserting/updating/deleting data, the data remains consistent and valid across the tables. For example, if we have a `user_profiles` table that references the `users` table, we can ensure that every profile belongs to a valid user.
- **Soft Relations** on the other hand, are an application-level abstraction that Drizzle provides to make it easier to work with related data. Crucial to know is that they do not affect the database schema directly, but they can be very useful for making queries more readable and easier to work with.
- We can define soft relations without foreign keys and vice versa, but in most cases, it is a good idea to use both.

It's okay to be a bit confused by this at first, we just wanted to clarify the difference between the two before we start thinking of them as interchangeable.
For now, let's just take a look at a simple relationship between two tables: the One-to-One relationship.

### One-to-one

[One to One relationships](https://orm.drizzle.team/docs/relations#one-to-one) are the simplest type of relationship, where one record in a table is related to one record in another table. For example, we could have a `profile` table that contains additional information about a user, rather than storing less crucial data it in the `user` table itself:

```typescript
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

```

Now we have two tables: `users` and `user_profiles`. One user can have one profile, and one profile belongs to one user.
- The `users` table now leaves out the `firstName` and `lastName` columns.
- The `user_profiles` table is new, and contains:
	- `id`: an auto-incrementing primary key of type `int`.
	- `userId`: a foreign key that references the `id` column in the `users` table. More on foreign keys later.
	- `firstName`: a `varchar` column that stores the user's first name, with a maximum length of 30 characters.
	- `lastName`: a `varchar` column that stores the user's last name, with a maximum length of 30 characters.
	- `title`: a `varchar` column that stores the user's title (e.g. their job title), with a maximum length of 50 characters.

We also define the **relations** between the two tables using the `relations` function from Drizzle. This allows us to easily query the related data later on.

Let's drop the existing `user` tables in our database using PHPMyAdmin (click the ⛔ icon in the table overview), and then push our schema again with `npx drizzle-kit push`. We can see how the SQL statement generated by Drizzle automatically adds the constraints that we defined in our schema:

![[two-tables.png]]

#### Refining seeding for relations

What's cool is that `drizzle-seed` allows us to now refine our seeding script so every user will have exactly one profile.

```typescript
// /scripts/reseed.ts

...
// Seed the database with test data
console.log('Reseeding database...');
const seedSchema = {
    users: schema.users,
    userProfiles: schema.userProfiles,
    usersRelations: schema.usersRelations,
    userProfilesRelations: schema.userProfilesRelations
};

await seed(db, seedSchema).refine((f) => ({
    users: {
        count: 10,
        with: {
            userProfiles: 1
        }
    }
}));
...
```

Now when seeding, each database user will have exactly one profile, and the userProfiles' `userId` column will be populated with a real user ID from the `users` table.


