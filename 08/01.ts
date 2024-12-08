import { readLines, uniq } from "../util";

const grid = readLines("./08/input.txt").map((s) => s.split(""));
const rows = grid.length;
const cols = grid[0]!.length;

type Point = { r: number; c: number };

const gridWithPos = grid.flatMap((row, r) =>
	row.map((m, c) => ({ m, pos: { r, c } as Point }))
);

const uniqueMarkers = uniq(gridWithPos.map(({ m }) => m)).filter(
	(x) => x !== "."
);

const getAntinodes = (p1: Point, p2: Point) => {
	const vec = [p2.r - p1.r, p2.c - p1.c] as const;

	const a1: Point = {
		r: p1.r - vec[0],
		c: p1.c - vec[1],
	};
	const a2: Point = {
		r: p2.r + vec[0],
		c: p2.c + vec[1],
	};

	return [a1, a2];
};

const antinodes: Point[] = [];

for (const m of uniqueMarkers) {
	const positions = gridWithPos
		.filter((cell) => cell.m === m)
		.map(({ pos }) => pos);

	const l = positions.length;
	for (let i = 0; i < l; i++) {
		for (let j = i + 1; j < l; j++) {
			antinodes.push(...getAntinodes(positions[i]!, positions[j]!));
		}
	}
}

console.log(
	uniq(
		antinodes
			.filter((a) => a.r >= 0 && a.r < rows && a.c >= 0 && a.c < cols)
			.map(({ r, c }) => `${r}:${c}`)
	).length
);
