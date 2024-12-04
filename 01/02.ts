import { readLines, compNumbers } from "../util.js";

const data = readLines("./input.txt");
const pairs = data.map((s) => s.split(/\s+/).map((s) => Number.parseInt(s)));

const first = pairs.map(([x]) => x as number).sort(compNumbers);
const secondIndex = pairs
	.map(([_, y]) => y as number)
	.reduce<Record<number, number>>((acc, x) => {
		acc[x] = (acc[x] ?? 0) + 1;
		return acc;
	}, {});

console.log(
	first.map((x) => x * (secondIndex[x] ?? 0)).reduce((acc, x) => acc + x, 0)
);
