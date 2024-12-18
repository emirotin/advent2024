import { parseNumbers, readLines } from "../util";

// const input = readLines("./18/demo.txt")
// 	.slice(0, 12)
// 	.map((s) => parseNumbers(s, ",") as [number, number]);
const input = readLines("./18/input.txt")
	.slice(0, 1024)
	.map((s) => parseNumbers(s, ",") as [number, number]);

// const width = 7;
// const height = 7;
const width = 71;
const height = 71;
const grid = Array.from({ length: height }, () =>
	Array.from({ length: width }, () => "." as string | number)
);

interface Coord {
	r: number;
	c: number;
}

const at = ({ r, c }: Coord) => grid[r]![c]!;
const set = ({ r, c }: Coord, v: string | number) => {
	grid[r]![c] = v;
};

const isWall = (pos: Coord) => at(pos) === "#";

for (const [c, r] of input) {
	set({ r, c }, "#");
}

const getNeighbors = ({ r, c }: Coord) =>
	[
		{ r: r - 1, c },
		{ r: r + 1, c },
		{ r: r, c: c - 1 },
		{ r: r, c: c + 1 },
	]
		.filter(({ r, c }) => r >= 0 && r < height && c >= 0 && c < width)
		.filter(({ r, c }) => !isWall({ r, c }));

set({ r: 0, c: 0 }, 0);
const next = [{ r: 0, c: 0 }];

while (next.length) {
	const n = next.shift()!;
	const d = 1 + (at(n) as number);
	for (const n1 of getNeighbors(n)) {
		const d1 = at(n1) as number | ".";
		if (d1 === "." || d < d1) {
			set(n1, d);
			next.push(n1);
		}
	}
}

console.log(at({ r: height - 1, c: width - 1 }));
