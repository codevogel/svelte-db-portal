# 4 - Load and display data 

In the previous chapters, we have learned how to set up a SvelteKit application and how to connect it to a database. We have also seen how to create Drizzle ORM models, and how to execute basic queries using the Drizzle ORM. 
In this chapter, we will learn how to use these queries to load the data from the database to the SvelteKit app, and display it using various visualization techniques.

## Chapter overview

### Learning goals


### Prerequisites


### Learning resources


## Data loading with SvelteKit
### Loading page data

Let's say we want to show a list of users from our database in a SvelteKit application.
To do this, we would need a UI element that displays the list of users, and load the data from the database into that UI element before rendering it.

The [load](https://svelte.dev/docs/kit/load) function allows us to do just that. It is a special function that lives in a sibling `+page.ts` or `+page.server.ts` file, next to a `+page.svelte` file.

The `load` function is called before the page is rendered, and it's return value is passed to the page as a `data` prop.
We can use this function to load data from a database, API, or any other source, and then pass it to the page for rendering.
So in our case, we will use the `load` function to query our database for the list of users, and then pass that data to the page, which will then use the data to render the list of users.

#### Universal loading vs server-side loading

It's important to note that there are two types of load functions in SvelteKit: **universal** and **server-side**.
Universal load functions are defined in `+page.ts` files, while server-side load functions are defined in `+page.server.ts` files. The main difference between the two is that server-side load functions run only on the server, while universal load functions can run on both the server and the client.

Without getting too deep into the details, here's a quick description of when to use each type from the [SvelteKit documentation](https://svelte.dev/docs/kit/load#Universal-vs-server-When-to-use-which):

> Server load functions are convenient when you need to access data directly from a database or filesystem, or need to use private environment variables.
Universal load functions are useful when you need to fetch data from an external API and don’t need private credentials, since SvelteKit can get the data directly from the API rather than going via your server. They are also useful when you need to return something that can’t be serialized, such as a Svelte component constructor.
In rare cases, you might need to use both together — for example, you might need to return an instance of a custom class that was initialised with data from your server. When using both, the server load return value is not passed directly to the page, but to the universal load function (as the data property)

As we will be loading data from a database, we will use the server-side load function in this chapter.

#### Loading static data 

Before we start querying our database, let's just load some static data to see how the `load` function works.

We will create a new `+page.server.ts` file in the `src/routes` directory, and add the following code:

```ts
// /src/routes/+page.server.ts

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const myData = {
		name: "John Doe",
		age: 30,
		display: true
	};
	return { myData };
}
```

We import the `PageServerLoad` type from the `$types` module, which is a [generated module](https://svelte.dev/docs/kit/types#Generated-types).
This ensures that our `load` function passes the correct type on to the `data` prop that the page will receive.

We then define the `load` function itself, which returns an object titled `myData`, with some static data.

Now, we can use this data in our `+page.svelte` file at the same level as the `+page.server.ts` file (`src/routes/+page.svelte`).
Let's quickly add some code to display this data from `myData`:

```svelte
<!-- /src/routes/+page.svelte -->

<script lang="ts">
	...
	let { data } = $props();
</script>

<div
	class="..."
>
	<Card footerBase="...">
		{#snippet header()}
			...
		{/snippet}
		{#snippet article()}
			...
			<p class="opacity-60">
				...
				{data.myData.name} is {data.myData.age} years old.
				Are they visible? {data.myData.display ? 'Yes' : 'No'}
			</p>
		{/snippet}
	</Card>
</div>
```

Et voilà! When we visit the page, we should now see that static data displayed on the page:

![[display-static-data.png]]

Let's remove the code we just added in the `+page.svelte` file, and replace the `load` function in the `+page.server.ts` file with some code that queries our database for a list of users.

#### Loading data from the database

To load data from the database, we will use the Drizzle ORM that we set up in the previous chapter.

First, to retain type safety between our database schema and the data we show in the SvelteKit app, we can infer the types for the data directly from the tables we defined in our Drizzle ORM schema.
To export the types for our Schema, we'll add the following code to (the very bottom of) our `src/lib/db/schema.ts` file:

```ts
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Score = typeof scores.$inferSelect;
export type Level = typeof levels.$inferSelect;
```
Next, let's rework the `+page.server.ts` file to query the database for a list of users.

```ts
// /src/routes/+page.server.ts

import type { PageServerLoad } from "./$types";

// We import the db instance and the schema we defined in the previous chapter
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
// We import the newly inferred User type
import type { User } from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
    // Here we perform a basic select query to get all users from the database
	const users: User[] = await db.select().from(schema.users);
    // And finally, we pass the list of users to the page's data prop
	return {
		users
	}
}
```

And then update the `+page.svelte` file to display that list of users.
We'll make use of the `$derived` rune to ensure that the list of users is reactive, meaning that if the data changes, the UI will automatically update.
(Though in our example, the data won't change reactively. But this is generally a good practice to follow.)

```svelte
<!-- /src/routes/+page.svelte -->

<script lang="ts">
    ...
    // We import the User type to ensure type safety
	import type { User } from '$lib/server/db/schema';
	
	let { data } = $props();

    // We use the $derived rune to create a reactive list of users
	let users: User[] = $derived(data.users);
</script>

<div
	class="..."
>
	<Card footerBase="...">
        ...
        {#snippet article()}
            ...	
            <!-- We display the list of users -->
            {#each users as user (user.id)}
                <p class="text-sm">
                    {user.username} 
                </p>
            {/each}
        {/snippet}
    </Card>
</div>
```

Let's take a look at the `/` route now, and confirm that we are displaying the data from the users in our database:

![[show-users.png]]

Awesome! We now know how to load data from the database and display it in our SvelteKit application.

### Adding a DAO

In the previous section, we loaded the data directly in the `+page.server.ts` file.
While this works, it can quickly become hard to manage the data loading logic as our application grows.

To make our code more modular and maintainable, we can create a [Data Access Object (DAO)](https://en.wikipedia.org/wiki/Data_access_object) that encapsulates the logic for loading data from the database. It's a layer that sits between our database and our application, allowing us to abstract away the details of how we access the data.
This simplifies the code in our `+page.server.ts` file to simply calling the DAO methods to get the data we need.

Let's create a new file called `DAO.ts` in the `src/lib/server/dao` directory, and add the following code:

```ts
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { MySql2Database } from 'drizzle-orm/mysql2';

export abstract class DAO {
	protected static readonly db: MySql2Database<typeof schema> = db;
}
```

This will form an abstract base class for our `DAO` classes.
Next, we will create a `UserDAO` class that extends this `DAO` class and provides methods for loading users from the database.

```ts
// /src/lib/server/dao/UserDAO.ts

import { DAO } from "$lib/server/dao/DAO";
import type { User } from "$lib/server/db/schema";
import { users } from "$lib/server/db/schema";

export class UserDAO extends DAO { 
	static async getAllUsers(): Promise<User[]> {
		return DAO.db.select().from(users);
	}
}
```

Now, let's use this `UserDAO` class in our `+page.server.ts` file to load the users from the database:

```ts
// /src/routes/+page.server.ts

import type { PageServerLoad } from "./$types";

import type { User } from "$lib/server/db/schema";
import { UserDAO } from "$lib/server/dao/UserDAO";

export const load: PageServerLoad = async () => {
	const users: User[] = await UserDAO.getAllUsers(); 
	return {
		users
	}
}
```

There, that looks much cleaner! Especially once we start adding more multiple and more advanced queries to our DAO, this will help us keep our code organized and maintainable.

This is neat and all, but we don't really need to show a list of users on our home page. We know how to do that now, but for now let's undo the changes we made to the `+page.svelte` file, and remove the `+page.server.ts` file as well.

Next, we'll be looking at implementing a more complex query, and display the results in a component.

### Querying with the where clause: Selecting a specific user

Let's say that we want to display some user data, but only for a specific user, identified by their ID.
We *could* use the `UserDAO` class we created earlier to get all users, and then filter the list to find the user we want. But, that would put unnecessary load on the database.
We could instead just query the database for that specific user.

Let's look at how we can do that. Let's add a method to our `UserDAO` class `findUserById` that takes a user ID as an argument and returns the user with that ID from the database:

```ts
// /src/lib/server/dao/UserDAO.ts

...
import { eq } from 'drizzle-orm';

export class UserDAO extends DAO {
    ...

	static async getUserById(id: number): Promise<User | undefined> {
		return DAO.db.query.users.findFirst({
			where: eq(users.id, id)
		});
	}
}
```

> ℹ️ Note that we could also write this query using the `select` method: `DAO.db.select().from(users).where(eq(users.id, id)).then(rows => rows[0]);`. The `findFirst` method is just a convenience method. 

Now, let's make a new route at `/src/routes/dashboard/user/[id]/` (note the square brackets around `id`, we will explain those in a moment) and create a `+page.server.ts` file in that directory.

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts 

import type { PageServerLoad } from "./$types";

import type { User } from "$lib/server/db/schema";
import { UserDAO } from "$lib/server/dao/UserDAO";

export const load: PageServerLoad = async () => {
	const id = 3;
	const user: User | undefined = await UserDAO.findUserById(id);

	return {
		user
	}
}
```

And the corresponding `+page.svelte` file:

```svelte
<!-- /src/routes/dashboard/user/[id]/+page.svelte -->

<script lang="ts">
	import type { User } from '$lib/server/db/schema';

	let { data } = $props();
	
	let user: User = $derived(data.user);

</script>

<p>
	User: {user.username}
</p>
```

Now, if we visit the [`/dashboard/user/3` route](http://localhost:5173/dashboard/user/3), we should see the username of the user with ID 3 displayed on the page.

But if we visit [`/dashboard/user/4`](http://localhost:5173/dashboard/user/4), we will still see the same user displayed, because we hardcoded the ID in the `+page.server.ts` file.
This is where the `[id]` part of the route comes in. It is a [routing](https://svelte.dev/docs/kit/routing) feature of SvelteKit, and it allows us to create dynamic routes that can accept parameters.

We can access the `id` parameter in the `load` function by passing [the `params` parameter](https://svelte.dev/docs/kit/load#Using-URL-data-params) to the `load` function.

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts 

...

export const load: PageServerLoad = async ({ params }) => {
	const id: number = parseInt(params.id);
	const user: User | undefined = await UserDAO.findUserById(id);

	return {
		user
	}
}
```

Now, if we visit [`/dashboard/user/4`](http://localhost:5173/dashboard/user/4), we should see the username of the user with ID 4 displayed on the page instead.

### Querying joined tables: Selecting the top 10 users

Now that we know how to query a single user by ID, let's look at how we can query the top 10 users.

We'll define the top 10 users as the users who have achieved the highest scores, across all sessions and levels.
So, for example, though one of our users may have a score of 100 and 95 in two different sessions and levels, we will only count the highest score of 100 for that user.
Our next top user may have a maximum score of 95, and so on, until we have the top 10 users.
If two users have the same maximum score, we won't order them (though we could, e.g. by date).

Let's create a new `ScoreDAO` that will handle the logic for querying scores from the database.

```ts
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
		const result = await DAO.db
			// Select both user and score information ...
			.select({ users, scores, sessions })
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

		// Map the results to the TopScorer type
		return result.map((row) => ({
			user: row.users,
			score: row.scores,
			session: row.sessions
		}));
	}
}

// Stores the relevant User, Score, and Session data for a top scorer
export interface TopScorer {
	user: User;
	score: Score;
	session: Session;
}
```

Key points to note here are:
- We first run a subquery to find the maximum score for each user, across all their sessions.
- We then join this subquery with the users, sessions, and scores tables to get the relevant data for each top scorer.
- We use the `max` function from Drizzle ORM to find the maximum score for each user (which executes the sql `MAX` function).
	- If we wouldn't, we would just get one of the scores for each user, which may not be the maximum score.
	- Inner joins like this can be a bit unintuitive: 
	  - A query only returns one value per row per column. 
	  - In the subquery, we have multiple scores per session
	  - When we inner join the scores on the sessions table, and then group by userId, we get only one score value per row, arbitrarely chosen by position in the database.
	  ![[query-explanation-1.png]]
	  - But the `MAX` function ensures the value is the Maximum of all possible values that could fit that row:
	  ![[query-explanation-2.png]]
	- We can see that the other columns (e.g. session id) don't change, but that's okay, because we're only after the user id and the MAX score in this subquery.
	- We will find the corresponding score, user, and session in the next query. 
- We use the `as` method to alias the maximum score column, so we can reference it later in the query.
	- We don't actually need this alias for the drizzle syntax, but if we don't add it, drizzle can't create the relevant SQL, as we need to alias subqueries.
- We use the `and` function from Drizzle ORM to combine multiple conditions in the `innerJoin` method.
- We use the `desc` function from Drizzle ORM to order the results by score in descending order.
- We limit the results to the top 10 scorers using the `limit` method.
- We create an interface `TopScorer` to store the relevant data for each top scorer, which includes the user who achieved the score, the score record itself, and the session the score was achieved in.

Now, let's use this `ScoreDAO` in our `+page.server.ts` file to load the top scorers from the database.
We'll display the top scorers in the dashboard overview, so at `/dashboard`.

By now, we should know we should create a new `+page.server.ts` file in the `src/routes/dashboard` directory, and add the following code:

```ts
// /src/routes/dashboard/+page.server.ts

import type { PageServerLoad } from './$types';

import { ScoreDAO, type TopScorer } from '$lib/server/dao/ScoreDAO';

export const load: PageServerLoad = async () => {
	const limit: number = 10;
	const topScorers: TopScorer[] = await ScoreDAO.getTopScorers(limit);

	return {
		topScorers
	};
};
```

Finally, let's create a rudimentary UI to display the top scorers in the `/routes/dashboard/+page.svelte` file.

```svelte
<!-- /src/routes/dashboard/+page.svelte -->

<script lang="ts">
	import type { TopScorer } from '$lib/server/dao/ScoreDAO';
	
	let { data } = $props();

	let topScorers: TopScorer[] = $derived(data.topScorers);
</script>

<h2 class="text-xl font-bold">Dashboard home.</h2>

{#each topScorers as scorer (scorer.user.id)}
	<div class="flex items-center">
		<span class="text-lg">Username: {scorer.user.username}</span>
		<span class="text-lg">Score: {scorer.score.score}</span>
		<span class="text-lg">In session: {scorer.session.id}</span>
	</div>
{/each}
```

![[top-scorers.png]]

Awesome! That was a pretty advanced query, but we can see that Drizzle makes it quite easy to work on complex queries like this.

> ℹ️ If you want to, you can browse around in phpMyAdmin to confirm that these top scorers are indeed the top scorers in your database.

### Responsive data loading

For our `/dashboard/user` page and the `/dashboard/session` page, we want users to be able to query for a specific user (by username) or session (by username or session ID).

We *could* create a form in which users can enter their query, and then submit that form to the server to load the data.
While this works, it is not as responsive as it can be: Let's try showing the results *as the user types their query*, without having to submit the form and wait for a new page to load.

To do this, we'll combine [URL data](https://svelte.dev/docs/kit/load#Using-URL-data) and the [data-sveltekit-keepfocus attribute](https://svelte.dev/docs/kit/link-options#data-sveltekit-keepfocus).
How it works is that we will create a form with an input field. As the user types in the input field, we will update the URL with the query they entered.
The `load` function will then automatically run, and return the data from the database based on the query in the URL.
The `data-sveltekit-keepfocus` attribute will ensure that the input field remains focused, so the user can continue typing while querying the database.
This will make it feel like a responsive search, as the user will see the results update in real-time as they type.

First, let's expand the `UserDAO` class to include a method that finds users by their username, using the `like` operator to allow for partial matches:

```ts
// /src/lib/server/dao/UserDAO.ts
...
import { like } from 'drizzle-orm';

export class UserDAO extends DAO {
	...

	static async findUsersLikeUsername(username: string): Promise<User[]> {
		return DAO.db.query.users.findMany({
			where: like(users.username, `%${username}%`)
		});
	}
}
```

Now we'll create a new file at `/src/routes/dashboard/user/+page.server.ts` to handle the loading based on the username query:

```ts
// /src/routes/dashboard/user/+page.server.ts

import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/dao/UserDAO';

export const load: PageServerLoad = async ({ url }) => {
	// Here we get the username query parameter from the URL 
	const username = url.searchParams.get('username');
	let users: User[] = [];
	if (username) {
		users = await UserDAO.findUsersLikeUsername(username);
	}
	return { users };
};
```

Next, we'll update the `/src/routes/dashboard/user/+page.svelte` file to include a form with an input field for the username query.

```svelte
<!-- /src/routes/dashboard/user/+page.svelte -->

<script lang="ts">
	import Card from '$lib/ui/views/Card.svelte';
	import type { User } from '$lib/server/db/schema';

	let { data } = $props();
	let users: User[] | undefined = $derived(data.users);

	function searchForUsersByName(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		event.currentTarget.form?.requestSubmit();
	}
</script>

<div
	class="mx-auto my-24 grid grid-cols-1 items-center gap-4 sm:my-48 lg:my-auto lg:grid-cols-[auto_1fr] lg:gap-8"
>
	<Card baseExtension="lg:min-w-md">
		{#snippet header()}
			<h1>Find a user</h1>
		{/snippet}
		{#snippet article()}
			<form data-sveltekit-keepfocus>
				<label for="username">Name: </label>
				<input class="input" type="text" name="username" oninput={searchForUsersByName} />
			</form>
		{/snippet}
	</Card>
	{#if users && users.length > 0}
		<Card baseExtension="lg:min-w-md">
			{#snippet header()}
				<h1>Found users</h1>
			{/snippet}
			{#snippet article()}
				<div class="flex max-h-64 flex-col overflow-y-scroll">
					{#each users as user (user.id)}
						<a href="/dashboard/user/{user.id}">{user.username}</a>
					{/each}
				</div>
			{/snippet}
		</Card>
	{:else}
		<div class="flex flex-col items-center justify-center lg:min-w-md">
			<p>Try searching for a user by name.</p>
		</div>
	{/if}
</div>
```

Key points to note here:
- We create a form with an input field for the username query.
- We use the `data-sveltekit-keepfocus` attribute on the form to ensure that the input field remains focused when the form is submitted.
- We use the `oninput` event on the input field to call the `searchForUsersByName` function, which submits the form when the user types in the input field.
- We show the list of users that are derived from the `data` prop, which is populated by the `load` function in the `+page.server.ts` file.
- If there are no found users, we show a message prompting the user to search for a user by name instead of the (empty) list of users.
- We make the usernames in the list clickable, so that the user can navigate to the user's detail page (`/dashboard/user/[id]`).

Now we should see the relevant users appear as we type:

![[responsive-search.gif]]

> ℹ️ Note that this does put more strain on the database, as it will query the database every time the user alters the input field. So this user friendliness comes at a cost. In a real, scalable application, you would likely want to implement some form of debouncing (so that the database is not queried on every keystroke, but rather after a short delay (e.g. 300ms) after the user stops typing), caching (so that the database is not queried for the same input multiple times), or pre-fetching all users (so that the database is queried only once, and the results are cached for subsequent queries).

Let's do the same for the sessions, so we can search for sessions by the session ID or the username of the user who created the session.

## Error handling

The keen eyed among you may have noticed that we are not handling cases such as where the user with the given ID does not exist in the database.
Let's add some error handling to our `load` function to handle this case.

We can use Svelte's [error function](https://svelte.dev/docs/kit/errors) for this, and define a custom [`+error.svelte` file](https://svelte.dev/docs/kit/routing#error) (another SvelteKit routing feature) to display the error message.

```ts
// /src/routes/dashboard/user/[id]/+page.server.ts 

...
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const id: number = parseInt(params.id);

    const user: User | undefined = await UserDAO.findUserById(id);

    if (!user) {
        // This will just log the error to our console, so we're aware of it. 
        console.error(`User with ID ${id} not found. Showing 404.`);
        // This will throw a 404 error, which will be caught by the +error.svelte file.
        throw error(404, `User with ID ${id} not found`);
    }

    return {
        user
    }
}
```

```svelte
<!-- /src/routes/+error.svelte -->
<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="text-center p-8">
	<h1 class="text-3xl font-bold">Error {page.status}</h1>
	<p>{page.error.message}</p>
</div>
```

Notable is that the `+error.svelte` file inherits layouts depending on where it's placed.
For example, if we place a `+error.svelte` file at `src/routes` it will be used to display all errors, using the layout from the `src/routes/+layout.svelte` file.
If we then add another `+error.svelte` file at `src/routes/dashboard`, that file will be used to display all errors in the `/dashboard` route (and its subroutes).
So to not lose the sidebar navigation in the `dashboard` routes, let's extract an `Error` component, and use it in both `src/routes/+error.svelte` and `src/routes/dashboard/+error.svelte`.

```svelte
<!-- /src/lib/ui/views/Error.svelte -->

<script lang="ts">
	let { status, message }: { status: number, message: string } = $props();
</script>

<div class="text-center p-8">
	<h1 class="text-3xl font-bold">Error {status}</h1>
	<p>{message}</p>
</div>
```

```svelte
<!-- /src/routes/+error.svelte AND /src/routes/dashboard/+error.svelte -->
<script>
	import { page } from '$app/state';
	import Error from '$lib/ui/views/Error.svelte';
</script>

{#if page.error}
	<Error status={page.status} message={page.error.message}/>
{/if}
```

Okay, we're all set up to handle errors now. Let's look at how we're doing so far.

Querying an existing user shows their username:

![[showing-user.png]]

And querying a non-existing user will lead us to an error page:

![[error-dashboard.png]]

And - though perhaps a little less relevant for what we're doing - visiting any other non-existing route will also lead us to an error page, but this time not sharing the layout of the dashboard:

![[error-root.png]]

### 


## Visualizing Data


