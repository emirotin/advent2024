import { readLines, parseNumbers } from "./util.js";

const data = readLines("./input.txt").map(parseNumbers);

const isBetween = (a: number, b: number) => (x: number) => x >= a && x <= b;
const isOK = isBetween(1, 3);

const isAcceptable = (ns: number[]) => {
	let jumps = ns.map((x, i) => x - (i > 0 ? ns[i - 1] : 0)).slice(1);
	const pos = jumps.filter((x) => x > 0);
	const sign = pos.length > jumps.length / 2 ? 1 : -1;
	if (sign === -1) {
		jumps = jumps.map((x) => -x);
	}

	const idx = [];
	for (let i = 0; i < jumps.length; i++) {
		if (!isOK(jumps[i])) {
			idx.push(i);
		}
	}

	// all is good already
	if (idx.length === 0) return true;

	// too many wrong jumps
	if (idx.length > 2) return false;
	// two non-adjacent wrong jumps, cannot fix both of them
	if (idx.length === 2 && idx[1] > idx[0] + 1) return false;
	// exactly two adjacent wrong jumps, the only potential fix is collapsing them
	if (idx.length === 2) return isOK(jumps[idx[0]] + jumps[idx[1]]);
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const i = idx[0]!;
	// exactly one jump
	return (
		// can drop the first number
		i === 0 ||
		// can drop the last number
		i === jumps.length - 1 ||
		// can drop the number to the left, collapsing
		(i > 0 && isOK(jumps[i - 1] + jumps[i])) ||
		// can drop the number to the right, collapsing
		(i < jumps.length - 1 && isOK(jumps[i] + jumps[i + 1]))
	);
};

console.log(data.filter(isAcceptable).length);