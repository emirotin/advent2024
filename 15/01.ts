import { readLines } from "../util";

const data = readLines("./15/input.txt");

const i = data.indexOf("");
if (i < 0) {
	console.error("Invalid data");
	process.exit(1);
}

const grid = data.slice(0, i).map((s) => s.split(""));
const rows = grid.length;
const cols = grid[0]!.length;

interface Coord {
	r: number;
	c: number;
}

let robotPos: Coord | null = null;

for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		if (grid[r]![c] === "@") {
			robotPos = { r, c };
			grid[r]![c] = ".";
			break;
		}
	}
	if (robotPos) break;
}

if (robotPos === null) {
	console.error("Invalid data");
	process.exit(1);
}

const at = ({ r, c }: Coord) => grid[r]![c]!;
const set = ({ r, c }: Coord, v: string) => {
	grid[r]![c] = v;
};

const isWall = (pos: Coord) => at(pos) === "#";

type Dir = "^" | "v" | "<" | ">";

const steps = data
	.slice(i + 1)
	.join("")
	.split("") as Array<Dir>;

const next = ({ r, c }: Coord, d: Dir) => {
	switch (d) {
		case "<":
			return { r, c: c - 1 };
		case ">":
			return { r, c: c + 1 };
		case "^":
			return { r: r - 1, c };
		case "v":
			return { r: r + 1, c };
	}
};

for (const d of steps) {
	let pos = next(robotPos, d);
	while (!isWall(pos) && at(pos) === "O") {
		pos = next(pos, d);
	}
	if (isWall(pos)) {
		continue;
	}
	set(pos, "O");
	robotPos = next(robotPos, d);
	set(robotPos, ".");
}

const gps = ({ r, c }: Coord) => r * 100 + c;

let res = 0;
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		if (at({ r, c }) === "O") {
			res += gps({ r, c });
		}
	}
}
console.log(res);
