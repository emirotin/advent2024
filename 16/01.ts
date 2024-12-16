import { readLines } from "../util";

const origGrid = readLines("./16/input.txt").map((s) => s.split(""));
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

type Dir = "n" | "s" | "w" | "e";

type CellStats = Partial<Record<Dir, number>>;

const grid = origGrid.map((r) =>
	r.map((s) => (s === "#" ? "#" : ({} as CellStats)))
);

const at = ({ r, c }: Coord) => grid[r]![c]!;
const set = ({ r, c }: Coord, v: CellStats) => {
	grid[r]![c] = v;
};
const isWall = (pos: Coord) => at(pos) === "#";

set(startPos, { e: 0 });
const nextCells: Array<{ p: Coord; d: Dir }> = [
	{
		p: startPos,
		d: "e",
	},
];

const getNeighbors = (p: Coord, d: Dir) => {
	const ns: Array<{ p: Coord; inc: number; d: Dir }> = [];
	const prev = (at(p) as CellStats)[d]!;

	switch (d) {
		case "n":
			ns.push(
				{ p: { r: p.r - 1, c: p.c }, d: "n", inc: 1 },
				{ p: { r: p.r, c: p.c - 1 }, d: "w", inc: 1001 },
				{ p: { r: p.r, c: p.c + 1 }, d: "e", inc: 1001 }
			);
			break;
		case "s":
			ns.push(
				{ p: { r: p.r + 1, c: p.c }, d: "s", inc: 1 },
				{ p: { r: p.r, c: p.c - 1 }, d: "w", inc: 1001 },
				{ p: { r: p.r, c: p.c + 1 }, d: "e", inc: 1001 }
			);
			break;
		case "w":
			ns.push(
				{ p: { r: p.r, c: p.c - 1 }, d: "w", inc: 1 },
				{ p: { r: p.r + 1, c: p.c }, d: "s", inc: 1001 },
				{ p: { r: p.r - 1, c: p.c }, d: "n", inc: 1001 }
			);
			break;
		case "e":
			ns.push(
				{ p: { r: p.r, c: p.c + 1 }, d: "e", inc: 1 },
				{ p: { r: p.r + 1, c: p.c }, d: "s", inc: 1001 },
				{ p: { r: p.r - 1, c: p.c }, d: "n", inc: 1001 }
			);
			break;
	}

	return ns
		.filter(
			({ p: { r, c } }) =>
				r >= 0 && r < rows && c >= 0 && c < cols && !isWall({ r, c })
		)
		.map((o) => ({ ...o, prev }));
};

while (nextCells.length) {
	const curr = nextCells.shift()!;
	const ns = getNeighbors(curr.p, curr.d);

	for (const n of ns) {
		const nStats = at(n.p) as CellStats;
		if (nStats[n.d] === undefined || nStats[n.d] > n.inc + n.prev) {
			nStats[n.d] = n.inc + n.prev;
			nextCells.push({
				p: n.p,
				d: n.d,
			});
		}
	}
}

console.log(Math.min(...Object.values(at(endPos) as CellStats)));
