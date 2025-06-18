// /src/lib/utils/date.ts

export function dateAddSeconds(createdAt: Date, duration: number): Date {
	return new Date(createdAt.getTime() + duration * 1000);
}

export function ageFromDateOfBirth(dateOfBirth: Date): number {
	const now = new Date();
	let age = now.getFullYear() - dateOfBirth.getFullYear();
	const monthDiff = now.getMonth() - dateOfBirth.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())) {
		age--;
	}
	return age;
}
