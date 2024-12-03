import { readLines } from "./util";

const input = readLines("input.txt").join(" ");

const re = /mul\((\d{1,3}),(\d{1,3})\)/g;

let res = 0;
for (const [_, a, b] of input.matchAll(re)) {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	res += Number.parseInt(a!) * Number.parseInt(b!);
}

console.log(res);
