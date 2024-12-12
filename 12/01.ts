import { parseNumbers, readLines } from "../util";

const grid = readLines("./12/input.txt").map((s) => s.split(""));
const rows = grid.length;
const cols = grid[0]!.length;

const coord = ({ r, c }: { r: number; c: number }) => `${r}:${c}`;

const allCells = new Map<string, string>();
const remainingCells = new Map<string, string>();
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		allCells.set(coord({ r, c }), grid[r]![c]!);
		remainingCells.set(coord({ r, c }), grid[r]![c]!);
	}
}

const neighbors = ({ r, c }: { r: number; c: number }) =>
	[
		r > 0 ? ([r - 1, c] as const) : undefined,
		r < rows - 1 ? ([r + 1, c] as const) : undefined,
		c > 0 ? ([r, c - 1] as const) : undefined,
		c < cols - 1 ? ([r, c + 1] as const) : undefined,
	]
		.filter((x) => x !== undefined)
		.map(([r, c]) => coord({ r, c }));

let res = 0;

while (remainingCells.size > 0) {
	const k = remainingCells.keys().next().value as string;
	const v = remainingCells.get(k)!;
	remainingCells.delete(k);

	const visited = new Set<string>();
	const next = new Set([k]);
	let area = 0;
	let perim = 0;

	while (next.size > 0) {
		const k1 = next.values().next().value as string;
		next.delete(k1);

		visited.add(k1);
		remainingCells.delete(k1);

		area += 1;

		const [r, c] = parseNumbers(k1, ":") as [number, number];
		const ns = neighbors({ r, c }).filter((k2) => allCells.get(k2) === v);

		perim += 4 - ns.length;

		for (const k2 of ns) {
			if (!visited.has(k2)) {
				next.add(k2);
			}
		}
	}

	res += area * perim;
}

console.log(res);
