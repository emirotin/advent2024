import { readLines } from "../util";

const MAX_CHEAT = 20;

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
	set(grid, start, 0);

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

	const path = [endPos];
	let pos = endPos;
	let d = at(grid, endPos) as number;
	while (!eq(pos, startPos)) {
		pos = getNeighbors(grid, pos).find((n) => at(grid, n) === d - 1)!;
		d -= 1;
		path.push(pos);
	}
	path.reverse();

	return path;
};

const canonicPath = findPath(getGrid(), startPos);

let res = 0;
for (let i = 0; i < canonicPath.length - 1; i++) {
	const p1 = canonicPath[i]!;
	for (let j = i + 1; j < canonicPath.length; j++) {
		const p2 = canonicPath[j]!;

		const d = Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c);

		if (d > MAX_CHEAT) continue;

		const win = j - i - d;
		if (win >= 100) {
			res += 1;
		}
	}
}

console.log(res);
