import { readLines } from "../util.js";

const input = readLines("input.txt").join(" ");

const re = /do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g;

let res = 0;
let enabled = true;
for (const m of input.matchAll(re)) {
	if (m[0] === "do()") {
		enabled = true;
		continue;
	}

	if (m[0] === "don't()") {
		enabled = false;
		continue;
	}

	if (!enabled) {
		continue;
	}

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	res += Number.parseInt(m[1]!) * Number.parseInt(m[2]!);
}

console.log(res);
