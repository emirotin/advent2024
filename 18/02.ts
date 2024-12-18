import { parseNumbers, readLines } from "../util";

// const input = readLines("./18/demo.txt").map(
// 	(s) => parseNumbers(s, ",") as [number, number]
// );
const input = readLines("./18/input.txt").map(
	(s) => parseNumbers(s, ",") as [number, number]
);

// const width = 7;
// const height = 7;
const width = 71;
const height = 71;

interface Coord {
	r: number;
	c: number;
}

const getPath = (n: number) => {
	const grid = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => "." as string | number)
	);

	const at = ({ r, c }: Coord) => grid[r]![c]!;
	const set = ({ r, c }: Coord, v: string | number) => {
		grid[r]![c] = v;
	};

	for (const [c, r] of input.slice(0, n)) {
		set({ r, c }, "#");
	}

	const isWall = (pos: Coord) => at(pos) === "#";

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

	return at({ r: height - 1, c: width - 1 }) !== ".";
};

let lo = 0;
let hi = input.length - 1;

while (lo < hi - 1) {
	const mi = ~~((lo + hi) / 2);
	if (getPath(mi)) {
		lo = mi;
	} else {
		hi = mi;
	}
}

const i = getPath(lo) ? lo : hi;

console.log(input[i]?.join(","));
