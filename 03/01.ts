import { readLines } from "../util.js";

const input = readLines("./03/input.txt").join(" ");

const re = /mul\((\d{1,3}),(\d{1,3})\)/g;

let res = 0;
for (const [_, a, b] of input.matchAll(re)) {
	res += Number.parseInt(a!) * Number.parseInt(b!);
}

console.log(res);
