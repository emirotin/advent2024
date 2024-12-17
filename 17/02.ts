import { parseNumbers, readLines } from "../util";

const parseProgram = (s: string) => {
	const m = s.match(/Program: (.+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return parseNumbers(m[1]!, ",");
};

const input = readLines("./17/input.txt");
const splitIndex = input.indexOf("");
if (splitIndex < 0) {
	throw new Error("Invalid data");
}

const bs = parseProgram(input[splitIndex + 1]!);

const solve = (as: number[], bs: number[]): number[] | null => {
	if (bs.length === 0) {
		return as;
	}

	const targetB = bs[bs.length - 1];
	const candidateAs: number[] = [];

	for (let a = 0; a < 8; a++) {
		let b = a ^ 5;
		let c = 0;
		if (b === 0) {
			c = a;
		} else if (b === 1) {
			c = (a >> 1) + 4 * as[0];
		} else if (b === 2) {
			c = (a >> 2) + 2 * as[0] + 4 * as[1];
		} else {
			c = as[b - 3] + 2 * as[b - 2] + 4 * as[b - 1];
		}
		b = b ^ c ^ 6;

		if (b === targetB) {
			candidateAs.push(a);
		}
	}

	for (const a of candidateAs) {
		const a0 = a & 0b001;
		const a1 = (a & 0b010) >> 1;
		const a2 = (a & 0b100) >> 2;
		const solution = solve([a0, a1, a2, ...as], bs.slice(0, -1));
		if (solution) {
			return solution;
		}
	}

	return null;
};

// we shift A to the right by B bits, B is max 7, so we need extra 10 bits to the left
// spoiler: it works with 0 seed, but I guess it's a coincidence (nicely-prepared problem data)
for (let origSeed = 0; origSeed < 2 ** 10; origSeed++) {
	const seedArray: number[] = [];
	let seed = origSeed;
	while (seed > 0) {
		seedArray.push(seed & 1);
		seed = seed >> 1;
	}
	const as = solve(seedArray, bs);

	if (as) {
		let a = 0;
		for (let i = as.length - 1; i >= 0; i--) {
			a = a * 2 + as[i];
		}
		console.log(a);
		process.exit(0);
	}
}

console.error("Solution not found");
process.exit(1);
