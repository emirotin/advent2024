import { readLines } from "../util";

const gridTemplate = readLines("./06/input.txt")
	.filter(Boolean)
	.map((s) => s.split(""));

const rows = gridTemplate.length;
const cols = gridTemplate[0]!.length;

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

const isOff = ({ r, c }: Point) => r < 0 || r >= rows || c < 0 || c >= cols;

let initialPos!: Point;
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		if (gridTemplate[r]![c] === "^") {
			gridTemplate[r]![c] = ".";
			initialPos = { r, c };
		}
	}
}

const findVisited = () => {
	const grid = gridTemplate.map((row) => [...row]);

	let pos = initialPos;
	let dir: Dir = "u";

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

	const res: Point[] = [];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (grid[r]![c] === "X") {
				res.push({ r, c });
			}
		}
	}
	return res;
};

const checkWithObstacle = ({ r, c }: Point) => {
	const grid = gridTemplate.map((row) =>
		row.map((char) => ({ char, dirs: [] as string[] }))
	);
	grid[initialPos.r]![initialPos.c] = { char: ".", dirs: ["u"] };
	grid[r]![c]!.char = "#";

	let pos = initialPos;
	let dir: Dir = "u";

	while (true) {
		const next = nextPos(pos, dir);
		if (isOff(next)) {
			return false;
		}
		if (grid[next.r]![next.c]!.dirs.includes(dir)) {
			return true;
		}
		if (grid[next.r]![next.c]!.char === "#") {
			dir = nextDir(dir);
		} else {
			grid[next.r]![next.c]!.dirs.push(dir);
			pos = next;
		}
	}
};

let res = 0;
for (const { r, c } of findVisited()) {
	if (r === initialPos.r && c === initialPos.c) {
		continue;
	}
	res += Number(checkWithObstacle({ r, c }));
}

console.log(res);
