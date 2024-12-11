import memoize from "lodash/memoize.js";
import { parseNumbers } from "../util";

const input = parseNumbers("2 54 992917 5270417 2514 28561 0 990");

const produces = memoize(
	(n: number, itersLeft: number): number => {
		if (itersLeft === 0) {
			return 1;
		}

		if (n === 0) {
			return produces(1, itersLeft - 1);
		}

		const s = n.toString();
		if (s.length % 2 === 0) {
			const k = s.length / 2;
			return (
				produces(Number.parseInt(s.substring(0, k)), itersLeft - 1) +
				produces(Number.parseInt(s.substring(k)), itersLeft - 1)
			);
		}

		return produces(n * 2024, itersLeft - 1);
	},
	(n: number, iters: number) => `${n}@${iters}`
);

console.log(
	input.map((n) => produces(n, 75)).reduce<number>((acc, x) => acc + x, 0)
);
