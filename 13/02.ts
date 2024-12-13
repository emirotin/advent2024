import { readLines } from "../util.js";

const input = readLines("./13/input.txt");

interface Coord {
	x: bigint;
	y: bigint;
}

const parseButton = (s: string): Coord => {
	const m = s.match(/Button .: X\+(\d+), Y\+(\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		x: BigInt(m[1]!),
		y: BigInt(m[2]!),
	};
};

const parsePrize = (s: string): Coord => {
	const m = s.match(/Prize: X=(\d+), Y=(\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		x: 10000000000000n + BigInt(m[1]!),
		y: 10000000000000n + BigInt(m[2]!),
	};
};

interface Run {
	a: Coord;
	b: Coord;
	p: Coord;
}

const runs: Run[] = [];

for (let i = 0; i < input.length; i += 4) {
	const a = parseButton(input[i]!);
	const b = parseButton(input[i + 1]!);
	const p = parsePrize(input[i + 2]!);
	runs.push({ a, b, p });
}

const solveRun = ({ a, b, p }: Run) => {
	const c = p.x * a.y - p.y * a.x;
	const d = b.x * a.y - b.y * a.x;

	if (d === 0n && c !== 0n) {
		return null;
	}

	if (d === 0n) {
		// that would mean infinite number of solutions,
		// of which there would be one minimizing the 3a+b binome,
		// but none of the inputs met this condition,
		// so I didn't bother either
		console.error("ooooops", { a, b, p });
		process.exit(1);
	}

	if (c % d !== 0n) {
		return null;
	}

	const countB = c / d;
	const e = p.x - countB * b.x;
	if (e % a.x !== 0n) {
		return null;
	}
	const countA = e / a.x;

	if (countA <= 0n || countB <= 0n) {
		return null;
	}

	return 3n * countA + countB;
};

console.log(
	runs
		.map((r) => solveRun(r))
		.filter((x) => x !== null)
		.reduce((acc, x) => acc + x, 0n)
);
