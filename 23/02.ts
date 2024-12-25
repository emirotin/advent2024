import fs from "node:fs";
import { readLines } from "../util";

const input = readLines("./23/input.txt").map(
	(s) => s.split("-") as [string, string]
);

const verts = Array.from(new Set(input.flat()));

const edges = new Set();
for (const [s1, s2] of input) {
	edges.add(`${s1}-${s2}`);
	edges.add(`${s2}-${s1}`);
}

// const adjLists = new Map<string, Set<string>>();
// for (const [s1, s2] of input) {
// 	if (!adjLists.has(s1)) {
// 		adjLists.set(s1, new Set([s2]));
// 	} else {
// 		adjLists.get(s1)!.add(s2);
// 	}

// 	if (!adjLists.has(s2)) {
// 		adjLists.set(s2, new Set([s1]));
// 	} else {
// 		adjLists.get(s2)!.add(s1);
// 	}
// }

const matrix = Array.from({ length: verts.length }, (_, i) =>
	Array.from({ length: verts.length }, (_, j) =>
		edges.has(`${verts[i]}-${verts[j]}`) ? 1 : 0
	)
);

fs.writeFileSync(
	"./23/matrix.csv",
	matrix.map((row) => row.join(",")).join("\n")
);
fs.writeFileSync("./23/vert.csv", verts.join(","));
