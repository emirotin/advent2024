import { readLines } from "../util.js";

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

interface Box {
	r: number;
	c1: number;
	c2: number;
}

const at = ({ r, c }: Coord) => grid[r]![c]!;

let robotPos: Coord | null = null;
const walls: Coord[] = [];
const boxes: Box[] = [];

for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		switch (at({ r, c })) {
			case "@":
				robotPos = { r, c: 2 * c };
				continue;
			case "O":
				boxes.push({
					r,
					c1: c * 2,
					c2: c * 2 + 1,
				});
				continue;
			case "#":
				walls.push({ r, c: 2 * c });
				walls.push({ r, c: 2 * c + 1 });
				continue;
		}
	}
}

if (robotPos === null) {
	console.error("Invalid data");
	process.exit(1);
}

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

const hasBox = ({ r, c }: Coord, exclude: Box[]) => {
	return (
		boxes
			.filter((b) => b.r === r && (b.c1 === c || b.c2 === c))
			.filter((b) => !exclude.some((b1) => b1 === b)).length > 0
	);
};

const hasWall = ({ r, c }: Coord) => {
	return walls.some((w) => w.r === r && w.c === c);
};

for (const d of steps) {
	let lastLayer: Box[] = [
		{
			r: robotPos.r,
			c1: robotPos.c,
			c2: robotPos.c,
		},
	];
	const layers = [];
	while (true) {
		const nextCells = lastLayer.flatMap(({ r, c1, c2 }) => {
			switch (d) {
				case "^":
					return [
						{ r: r - 1, c: c1 },
						{ r: r - 1, c: c2 },
					];
				case "v":
					return [
						{ r: r + 1, c: c1 },
						{ r: r + 1, c: c2 },
					];
				case "<":
					return { r, c: c1 - 1 };
				case ">":
					return { r, c: c2 + 1 };
			}
		});
		lastLayer = boxes.filter((b) =>
			nextCells.some(({ r, c }) => b.r === r && (b.c1 === c || b.c2 === c))
		);
		if (lastLayer.length === 0) {
			break;
		}
		layers.push(lastLayer);
	}
	layers.reverse();

	const allMoveCandidates = layers.flat();
	const canMove =
		allMoveCandidates.length === 0 ||
		allMoveCandidates.every(
			({ r, c1, c2 }) =>
				!hasWall(next({ r, c: c1 }, d)) &&
				!hasWall(next({ r, c: c2 }, d)) &&
				!hasBox(next({ r, c: c1 }, d), allMoveCandidates) &&
				!hasBox(next({ r, c: c2 }, d), allMoveCandidates)
		);

	if (!canMove) {
		continue;
	}

	for (const layer of layers) {
		for (const block of layer) {
			const { r, c: c1 } = next({ r: block.r, c: block.c1 }, d);
			const { c: c2 } = next({ r: block.r, c: block.c2 }, d);
			if (
				hasWall({ r, c: c1 }) ||
				hasWall({ r, c: c2 }) ||
				hasBox({ r, c: c1 }, [block]) ||
				hasBox({ r, c: c2 }, [block])
			) {
				continue;
			}
			Object.assign(block, {
				r,
				c1,
				c2,
			});
		}
	}
	if (canMove) {
		const nextPos = next(robotPos, d);
		if (!hasBox(nextPos, []) && !hasWall(nextPos)) {
			robotPos = nextPos;
		}
	}
}

const gps = ({ r, c1 }: Box) => r * 100 + c1;

console.log(boxes.map(gps).reduce((acc, x) => acc + x, 0));
