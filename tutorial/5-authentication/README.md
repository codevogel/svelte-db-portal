# 5 - Authentication

In the previous chapters, we've created a simple web application that pulls data from a database and displays it with various types of visualizations.
In this chapter, we will ensure that only authorized users can access our application.

Though we won't be addressing how to go live with this web application, we will still implement a basic authentication system using GitHub OAuth, just to see how we could secure our application should we decide to deploy it in the future.

## Chapter overview

### Learning goals
By the end of this chapter, you will be able to:
- Understand the basics of authentication and authorization
- Implement a simple authentication system using GitHub OAuth
- Create a login page in Svelte
- Restrict access to certain routes based on authentication status in SvelteKit
- Be able to whitelist users to access the application

### Prerequisites


### Learning resources


## Lucia

[Lucia](https://lucia-auth.com/) *was* a simple authentication library, but it has now [been deprecated](https://github.com/lucia-auth/lucia/discussions/1707) in favor of pivoting to a open resource on implementing authentication using JavaScript.
This is great news for us, as we can now use their authentication guide to implement our own authentication system, without relying on a library.

While it isn't always the best idea to roll out your own authentication system (especially in high-security environments), it is a great learning experience to understand how authentication works under the hood.

## Sessions

When you type a website into your browser (like google.com) and hit enter, your browser sends an HTTP request to Google's server saying, "Hey, can I get the homepage?" The server replies with an HTTP response, saying, "Sure! Here's the page."

HTTP is like talking to someone with short-term memory loss. Every time you send a message (request) to a website (server), it forgets everything about your past messages. It treats each message like it came from a brand-new person.

Web browsers can remember things (e.g. with local storage (we use this to remember a users' theme preferences) or cookies), but you can't trust these for sensitive information, because users can change whatever is saved there. For example, someone could change a "username" value to pretend they're someone else.

That’s why websites use sessions. A session is like giving each user a secret pass (called a session token).
The server keeps the important stuff (like who you are) on its side, linked to that secret pass. Because the secret pass is a very long string of characters, uniquely generated, and only given to you, it is very hard to impersonate someone else (though arguably, not impossible)
When you log in, the server gives you this secret pass. As long as you show that same pass with each message, the server can identify that it's you who made the request.

For additional security, the server can also check if the secret pass is still valid (it hasn't expired or been revoked).

Let's look at the [basic implementation of sessions](https://lucia-auth.com/sessions/basic).

The Lucia guide reads that a `Session` object should contain:
- `id`: A unique identifier for the session.
- `secretHash`: A [hash](https://www.geeksforgeeks.org/dsa/what-is-hashing/) of the session secret.
- `createdAt`: The timestamp when the session was created.

The `secret` is hashed, so we don't store the actual secret in the database. Instead, we store a hash of it, which is the result of a one-way transformation.
We can reproduce the same hash from the secret, but we have a much harder time going the other way around (i.e. getting the secret from the hash).
This way, if our database is compromised, the attacker won't have access to the actual session secrets, only their hashes.
Consequently they would need to figure out both the hashing algorithm and the secret to be able to impersonate a user.

In the database, the `secretHash` is generally stored as a raw binary value, though we can opt to store it as a string after encoding it in a format like [Base64](https://en.wikipedia.org/wiki/Base64).

### Adding a session table to the database

Let's create a new table in our Drizzle schema (`src/lib/db/schema.ts`) to store the session data:

```typescript
export const authSessions = mysqlTable('auth_sessions', {
	id: varchar('id').primaryKey().notNull(),
	secretHash: varchar('secret_hash').notNull(),
	createdAt: datetime('created_at').notNull()
});
```

We can add length limits to the `varchar` fields later, but for now, let's keep it simple.
We chose a `datetime` type for `createdAt` rather than an `int` unix timestamp (as shown in the Lucia guide), as to stay consistent with the rest of our schema.




