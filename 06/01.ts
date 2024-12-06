import { readLines } from "../util";

const grid = readLines("./06/input.txt")
	.filter(Boolean)
	.map((s) => s.split(""));

const rows = grid.length;
const cols = grid[0]!.length;

type Point = { r: number; c: number };
type Dir = "u" | "r" | "d" | "l";

const nextDir = (d: Dir) => {
	switch (d) {
		case "u":
			return "r";
		case "r":
			return "d";
		case "d":
			return "l";
		case "l":
			return "u";
	}
};

const nextPos = ({ r, c }: Point, d: Dir): Point => {
	switch (d) {
		case "u":
			return { r: r - 1, c };
		case "r":
			return { r, c: c + 1 };
		case "d":
			return { r: r + 1, c };
		case "l":
			return { r, c: c - 1 };
	}
};

let pos!: Point;
let dir: Dir = "u";

const isOff = ({ r, c }: Point) => r < 0 || r >= rows || c < 0 || c >= cols;

for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		if (grid[r]![c] === "^") {
			grid[r]![c] = ".";
			pos = { r, c };
		}
	}
}

while (true) {
	grid[pos.r]![pos.c] = "X";
	const next = nextPos(pos, dir);
	if (isOff(next)) {
		break;
	}
	if (grid[next.r]![next.c] === "#") {
		dir = nextDir(dir);
	} else {
		pos = next;
	}
}

let res = 0;
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		res += Number(grid[r]![c] === "X");
	}
}
console.log(res);
