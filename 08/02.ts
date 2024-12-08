import { gcd, readLines, uniq } from "../util";

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

const isInBounds = (p: Point) =>
	p.r >= 0 && p.r < rows && p.c >= 0 && p.c < cols;

function* getAntinodes(p1: Point, p2: Point) {
	const vec1 = [p2.r - p1.r, p2.c - p1.c] as const;
	const d = gcd(vec1[0], vec1[1]);
	const vec = [vec1[0] / d, vec1[1] / d] as const;

	const p = { ...p1 };

	while (isInBounds(p)) {
		p.r -= vec[0];
		p.c -= vec[1];
	}

	while (true) {
		p.r += vec[0];
		p.c += vec[1];
		if (!isInBounds(p)) {
			break;
		}
		yield { ...p } as Point;
	}
}

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

console.log(uniq(antinodes.map(({ r, c }) => `${r}:${c}`)).length);
