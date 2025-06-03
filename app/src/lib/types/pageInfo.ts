// src/lib/types/pageInfo.ts

import type { Icon } from 'lucide-svelte';

export interface PageInfo {
	name: string;
	description: string;
	url: string;
	icon?: typeof Icon;
}
