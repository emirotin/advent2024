import { readLines, uniqBy } from "../util";

const origGrid = readLines("./20/input.txt").map((s) => s.split(""));
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

const getGrid = (grid: Cell[][] = origGrid as Cell[][]) =>
	grid.map((r) => r.slice() as Array<Cell>);

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
		{
			r: r - 1,
			c,
		},
		{
			r: r + 1,
			c,
		},
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

const findPath = (grid: Cell[][], start: Coord, { fullPath = false } = {}) => {
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

	if (!fullPath) {
		return { len, grid, path: [] };
	}

	const path = [endPos];
	let pos = endPos;
	let d = len;
	while (!eq(pos, startPos)) {
		pos = getNeighbors(grid, pos).find((n) => at(grid, n) === d - 1)!;
		d -= 1;
		path.push(pos);
	}

	return { path, len, grid };
};

const {
	path: canonicPath,
	len: canonicLen,
	grid: baseGrid,
} = findPath(getGrid(), startPos, { fullPath: true });

const cheats = uniqBy(
	canonicPath.flatMap((p) =>
		getNeighbors(baseGrid, p, { walls: true, normal: false })
			.flatMap((n1) =>
				getNeighbors(baseGrid, n1, { walls: true })
					.filter((n2) => !eq(n2, p))
					.map((n2) => [p, n1, n2] as const)
			)
			.filter(([, , n2]) => canonicPath.some((p) => eq(p, n2)))
	),
	([_p, n1, n2]) => `${n1.r}:${n1.c}:${n2.r}:${n2.c}`
);

let res = 0;

for (const [p, n1, n2] of cheats) {
	const grid = getGrid(baseGrid);

	set(grid, n1, 1 + (at(grid, p) as number));

	set(grid, n2, 2 + (at(grid, p) as number));

	const { len } = findPath(grid, n2);
	const win = canonicLen - len;

	if (win >= 100) {
		res++;
	}
}

console.log(res);
