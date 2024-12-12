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

const hasAngles = ({ r, c }: { r: number; c: number }) => {
	const v = allCells.get(coord({ r, c }));
	const ns = {
		nw: allCells.get(coord({ r: r - 1, c: c - 1 })),
		n: allCells.get(coord({ r: r - 1, c })),
		ne: allCells.get(coord({ r: r - 1, c: c + 1 })),
		e: allCells.get(coord({ r, c: c + 1 })),
		se: allCells.get(coord({ r: r + 1, c: c + 1 })),
		s: allCells.get(coord({ r: r + 1, c })),
		sw: allCells.get(coord({ r: r + 1, c: c - 1 })),
		w: allCells.get(coord({ r: r, c: c - 1 })),
	} as const;

	return (
		Number(ns.w !== v && ns.n !== v) +
		Number(ns.n !== v && ns.e !== v) +
		Number(ns.e !== v && ns.s !== v) +
		Number(ns.s !== v && ns.w !== v) +
		Number(ns.s === v && ns.e === v && ns.se !== v) +
		Number(ns.s === v && ns.w === v && ns.sw !== v) +
		Number(ns.n === v && ns.e === v && ns.ne !== v) +
		Number(ns.n === v && ns.w === v && ns.nw !== v)
	);
};

let res = 0;
let i = 0;
while (remainingCells.size > 0) {
	i++;
	const id = i.toString();

	const k = remainingCells.keys().next().value as string;
	const v = remainingCells.get(k)!;
	remainingCells.delete(k);

	const visited = new Set<string>();
	const next = new Set([k]);
	let area = 0;
	let sides = 0;

	while (next.size > 0) {
		const k1 = next.values().next().value as string;
		next.delete(k1);

		visited.add(k1);
		remainingCells.delete(k1);

		area += 1;

		const [r, c] = parseNumbers(k1, ":") as [number, number];

		const ns = neighbors({ r, c }).filter((k2) => allCells.get(k2) === v);
		for (const k2 of ns) {
			if (!visited.has(k2)) {
				next.add(k2);
			}
		}
	}

	// distinguish between different clusters of equally marked cells
	for (const k of visited.values()) {
		allCells.set(k, id);
	}

	for (const k of visited.values()) {
		const [r, c] = parseNumbers(k, ":") as [number, number];
		sides += hasAngles({ r, c });
	}

	res += area * sides;
}

console.log(res);
