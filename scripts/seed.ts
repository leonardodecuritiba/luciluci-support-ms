export const SUPPORT_SEED_UNAVAILABLE_MESSAGE =
	'Support seed is unavailable during RF01: deterministic W1 seed data is not defined yet.';

function main(): never {
	throw new Error(SUPPORT_SEED_UNAVAILABLE_MESSAGE);
}

main();
