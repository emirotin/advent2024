import { readLines } from "../util.js";
import memoize from "lodash/memoize.js";

const input = readLines("./13/input.txt");

interface Coord {
	x: number;
	y: number;
}

const parseButton = (s: string): Coord => {
	const m = s.match(/Button .: X\+(\d+), Y\+(\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		x: Number.parseInt(m[1]!),
		y: Number.parseInt(m[2]!),
	};
};

const parsePrize = (s: string): Coord => {
	const m = s.match(/Prize: X=(\d+), Y=(\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		x: Number.parseInt(m[1]!),
		y: Number.parseInt(m[2]!),
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

const solveRun = memoize(
	(
		{ a, b, p }: Run,
		acc: number,
		counts: { a: number; b: number }
	): number | null => {
		if (counts.a > 100 || counts.b > 100) {
			return null;
		}
		if (p.x === 0 && p.y === 0) {
			return acc;
		}

		const branches: (number | null)[] = [];

		if (p.x >= a.x && p.y >= a.y) {
			branches.push(
				solveRun(
					{
						a,
						b,
						p: {
							x: p.x - a.x,
							y: p.y - a.y,
						},
					},
					acc + 3,
					{
						a: counts.a + 1,
						b: counts.b,
					}
				)
			);
		}
		if (p.x >= b.x && p.y >= b.y) {
			branches.push(
				solveRun(
					{
						a,
						b,
						p: {
							x: p.x - b.x,
							y: p.y - b.y,
						},
					},
					acc + 1,
					{
						a: counts.a,
						b: counts.b + 1,
					}
				)
			);
		}

		const ns = branches.filter((x) => x !== null);
		return ns.length === 0 ? null : Math.min(...ns);
	},
	({ a, b, p }: Run, _acc: number, counts: { a: number; b: number }) =>
		`${p.x}|${p.y}|${counts.a}|${counts.b}`
);

console.log(
	runs
		.map((r) => solveRun(r, 0, { a: 0, b: 0 }))
		.filter((x) => x !== null)
		.reduce((acc, x) => acc + x, 0)
);
