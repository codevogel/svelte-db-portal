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

## Setting up Drizzle ORM

During the setup of our SvelteKit project, we already installed `drizzle`, and the `sv` CLI has already generated the necessary configuration files for us. If you didn't install `drizzle` during the setup, you can do so now with the `sv` cli:

```bash
npx sv add drizzle
```

Or, if you wanted to, you could follow the [installation instructions](https://orm.drizzle.team/docs/get-started/mysql-new) on the Drizzle website instead. We'll be covering some of the files that the `sv` CLI generated for us, so if you want to follow along, make sure to use the same configuration.

## Drizzle configuration

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

> ℹ️ We won't be going live with this database, but it might be best practice to secure it using a password anyway. You can do so by editing `/opt/lampp/etc/my.cnf` (needs sudo access). Make sure you use the same login credentials in `/opt/lampp/phpmyadmin/config.inc.php`. Don't forget to restart the XAMPP server (`sudo /opt/lampp/lampp restart`) afterwards. Should you ever run into issues, you can always attempt to [reset the password](https://dev.mysql.com/doc/refman/8.4/en/resetting-permissions.html).

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


