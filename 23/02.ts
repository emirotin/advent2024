import { readLines } from "../util";

const input = readLines("./23/input.txt").map(
	(s) => s.split("-") as [string, string]
);

const verts = Array.from(new Set(input.flat()));
console.log(verts.length);

const edges = new Set();
for (const [s1, s2] of input) {
	edges.add(`${s1}-${s2}`);
	edges.add(`${s2}-${s1}`);
}

const adjLists = new Map<string, Set<string>>();
for (const [s1, s2] of input) {
	if (!adjLists.has(s1)) {
		adjLists.set(s1, new Set([s2]));
	} else {
		adjLists.get(s1)!.add(s2);
	}

	if (!adjLists.has(s2)) {
		adjLists.set(s2, new Set([s1]));
	} else {
		adjLists.get(s2)!.add(s1);
	}
}
