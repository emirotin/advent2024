import { readLines, uniqBy } from "../util";

const origGrid = readLines("./20/demo.txt").map((s) => s.split(""));
const rows = origGrid.length;
const cols = origGrid[0]!.length;

interface Coord {
	r: number;
	c: number;
}

let startPos: Coord | null = null;
let endPos: Coord | null = null;

const origAt = ({ r, c }: Coord) => origGrid[r]![c]!;
const origSet = ({ r, c }: Coord, v: string) => {
	origGrid[r]![c] = v;
};

for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		if (origAt({ r, c }) === "S") {
			startPos = { r, c };
			origSet({ r, c }, ".");
		} else if (origAt({ r, c }) === "E") {
			endPos = { r, c };
			origSet({ r, c }, ".");
		}
	}
}

if (startPos === null || endPos === null) {
	console.error("Invalid data");
	process.exit(1);
}

type Cell = "." | "#" | number;

const getGrid = () => origGrid.map((r) => r.slice() as Array<Cell>);

const eq = (c1: Coord, c2: Coord) => c1.r === c2.r && c1.c === c2.c;

const at = (grid: Cell[][], { r, c }: Coord) => grid[r]![c]!;
const set = (grid: Cell[][], { r, c }: Coord, v: Cell) => {
	grid[r]![c] = v;
};
const isWall = (grid: Cell[][], pos: Coord) => at(grid, pos) === "#";

const getNeighbors = (
	grid: Cell[][],
	{ r, c }: Coord,
	{ walls = false, normal = true } = {}
) => {
	return [
		{ r: r - 1, c },
		{ r: r + 1, c },
		{ r, c: c - 1 },
		{ r, c: c + 1 },
	].filter(
		({ r, c }) =>
			r >= 0 &&
			r < rows &&
			c >= 0 &&
			c < cols &&
			(walls || !isWall(grid, { r, c })) &&
			(normal || isWall(grid, { r, c }))
	);
};

const findPath = (grid: Cell[][], start: Coord) => {
	if (at(grid, start) === ".") {
		set(grid, start, 0);
	}

	const nextCells: Array<Coord> = [start];

	while (nextCells.length) {
		const curr = nextCells.shift()!;
		const currStat = at(grid, curr) as number;
		const ns = getNeighbors(grid, curr);

		for (const n of ns) {
			const nStat = at(grid, n);
			if (nStat === "." || (nStat as number) > currStat + 1) {
				set(grid, n, currStat + 1);
				nextCells.push(n);
			}
		}
	}

	const len = at(grid, endPos) as number;

	const path = [endPos];
	let pos = endPos;
	let d = len;
	while (!eq(pos, startPos)) {
		pos = getNeighbors(grid, pos).find((n) => at(grid, n) === d - 1)!;
		d -= 1;
		path.push(pos);
	}
	path.reverse();

	return { path, len, grid };
};

const { path: canonicPath, grid: canonicGrid } = findPath(getGrid(), startPos);

const findShortcuts = (start: Coord, maxLen: number) => {
	const grid = getGrid();

	const res: (readonly [Coord, number])[] = [];

	let currLayer = [start];
	const seenCells = [start];

	for (let d = 0; d < maxLen; d++) {
		const nextLayer = currLayer.flatMap((p) =>
			getNeighbors(grid, p, { walls: true, normal: true }).filter(
				(p1) => !seenCells.some((p) => eq(p, p1))
			)
		);
		seenCells.push(...nextLayer);

		res.push(
			...nextLayer
				.filter((p) => !isWall(grid, p))
				.map((exit) => [exit, d + 1] as const)
		);

		currLayer = nextLayer.filter((p) => isWall(grid, p));
	}

	console.log(Math.max(...res.map(([, d]) => d)));

	return res;
};

const wins = new Map<string, number>();
for (let i = 0; i < canonicPath.length - 1; i++) {
	const entry = canonicPath[i]!;
	for (const [exit, d] of findShortcuts(entry, 20)) {
		const j = canonicPath.findIndex((p) => eq(p, exit));
		if (j <= i) {
			continue;
		}
		const key = `${entry.r}:${entry.c}:${exit.r}:${exit.c}`;
		const win =
			(at(canonicGrid, exit) as number) -
			(at(canonicGrid, entry) as number) -
			d;
		if (!wins.has(key) || wins.get(key)! < win) {
			wins.set(key, win);
		}
	}
}

for (const k of wins.keys()) {
	if (wins.get(k) === 76) {
		console.log(k);
	}
}

const res = new Map<number, number>();
for (const win of wins.values()) {
	if (!res.has(win)) {
		res.set(win, 1);
	} else {
		res.set(win, res.get(win)! + 1);
	}
}

console.log(
	Array.from(res.entries())
		.sort(([k1], [k2]) => k1 - k2)
		.map(([k, v]) => `${k} => ${v}`)
);
