import { readLines, parseNumbers } from "../util.js";

const data = readLines("./02/input.txt").map((s) => parseNumbers(s));

const isBetween = (a: number, b: number) => (x: number) => x >= a && x <= b;

const isSafe = (ns: number[]) => {
	const [a, b] = ns;
	if (a === b) {
		return false;
	}

	const isSafeStep = a! < b! ? isBetween(1, 3) : isBetween(-3, -1);
	return ns.every((x, i) => i === 0 || isSafeStep(x - ns[i - 1]!));
};

console.log(data.filter(isSafe).length);
