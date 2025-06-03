// /src/lib/stores/navigation.ts

import { PanelsTopLeft, User, Dumbbell } from 'lucide-svelte';
import type { PageInfo } from '$lib/types/pageInfo';
import { readable, type Readable } from 'svelte/store';

export const pages: Readable<PageInfo[]> = readable([
	{ name: 'Home', url: '/', description: 'The home page.' },
	{ name: 'Dashboard', url: '/dashboard', description: 'View the dashboard.' },
	{ name: 'About Us', url: '/about', description: 'Learn more about us.' }
]);

export const dashboardPages: Readable<PageInfo[]> = readable([
	{
		name: 'Overview',
		url: '/dashboard/',
		description: 'Dashboard overview.',
		icon: PanelsTopLeft
	},
	{ name: 'User', url: '/dashboard/user', description: 'Query user information', icon: User },
	{
		name: 'Session',
		url: '/dashboard/session',
		description: 'View session details.',
		icon: Dumbbell
	}
]);
