import memoize from "lodash/memoize";

import { readLines } from "../util";

const input = readLines("./19/input.txt");

const towels = input[0]!.split(", ");

const designs = input.slice(2);

const countSolutions = memoize((design: string): number => {
	if (!design) return 1;

	const matchingTowels = towels.filter((t) => design.startsWith(t));

	return matchingTowels
		.map((t) => countSolutions(design.slice(t.length)))
		.reduce((acc, x) => acc + x, 0);
});

console.log(designs.map(countSolutions).reduce((acc, x) => acc + x, 0));
