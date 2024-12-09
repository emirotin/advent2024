import { readLines } from "../util";

const input = readLines("./09/input.txt")[0]!;

const blocks = input
	.split("")
	.map((s) => Number.parseInt(s))
	.flatMap((n, i) => Array.from({ length: n }, () => (i % 2 ? null : i / 2)));

let ins = 0;
let pluck = blocks.length - 1;

while (pluck > ins) {
	while (blocks[ins] !== null) {
		ins++;
	}
	while (blocks[pluck] === null) {
		pluck--;
	}
	blocks[ins] = blocks[pluck] as number | null;
	blocks[pluck] = null;
	ins++;
	pluck--;
}

console.log(
	blocks
		.map((x, i) => (x === null ? 0 : x * i))
		.reduce<number>((acc, x) => acc + x, 0)
);
