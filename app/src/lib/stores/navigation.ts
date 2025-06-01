// /src/lib/stores/navigation.ts

import { readable } from "svelte/store";

export const pages = readable([
	{ name: 'Home', url: '/', description: 'The home page.' },
	{ name: 'About Us', url: '/about', description: 'Learn more about us.' },
	{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' }
]);

export const dashboardPages = readable([
	{ name: 'User', url: '/dashboard/user', description: 'Query user information' },
	{ name: 'Session', url: '/dashboard/session', description: 'View session details.' }
]);
