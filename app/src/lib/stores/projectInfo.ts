// /src/lib/stores/projectInfo.ts

import { readable, type Readable } from 'svelte/store';

export const gameName: Readable<string> = readable('DemoBots');
export const adminEmail: Readable<string> = readable('demo@admin.com');
