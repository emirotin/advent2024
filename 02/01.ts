import { readLines, parseNumbers } from "../util.js";

const data = readLines("./input.txt").map(parseNumbers);

const isBetween = (a: number, b: number) => (x: number) => x >= a && x <= b;

const isSafe = (ns: number[]) => {
	const [a, b] = ns;
	if (a === b) {
		return false;
	}

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const isSafeStep = a! < b! ? isBetween(1, 3) : isBetween(-3, -1);
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	return ns.every((x, i) => i === 0 || isSafeStep(x - ns[i - 1]!));
};

console.log(data.filter(isSafe).length);
