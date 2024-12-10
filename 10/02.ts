import { parseNumbers, readLines, uniq } from "../util";

const data = readLines("./10/input.txt").map((s) => parseNumbers(s, ""));
const rows = data.length;
const cols = data[0]!.length;

const findTrails = (r: number, c: number, pastTrail: string): string[] => {
	const currentTrail = `${pastTrail}-${r}:${c}`;
	const v = data[r]![c]!;
	if (v === 9) {
		return [currentTrail];
	}

	const neighbors = [
		r > 0 ? ([r - 1, c] as const) : undefined,
		r < rows - 1 ? ([r + 1, c] as const) : undefined,
		c > 0 ? ([r, c - 1] as const) : undefined,
		c < cols - 1 ? ([r, c + 1] as const) : undefined,
	]
		.filter((x) => x !== undefined)
		.filter(([r, c]) => data[r]![c] === v + 1);

	return uniq(
		neighbors.flatMap(([r1, c1]) => findTrails(r1, c1, currentTrail))
	);
};

let res = 0;
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		if (data[r]![c]! === 0) {
			res += findTrails(r, c, "").length;
		}
	}
}

console.log(res);
