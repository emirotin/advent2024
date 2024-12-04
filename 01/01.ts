import { readLines, compNumbers } from "../util.js";

const data = readLines("./input.txt");
const pairs = data.map((s) => s.split(/\s+/).map((s) => Number.parseInt(s)));

const first = pairs.map(([x]) => x as number).sort(compNumbers);
const second = pairs.map(([_, y]) => y as number).sort(compNumbers);

console.log(
	first
		.map((x, i) => Math.abs(x - (second[i] as number)))
		.reduce((acc, x) => acc + x, 0)
);
