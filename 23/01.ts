import { readLines } from "../util";

const input = readLines("./23/input.txt").map(
	(s) => s.split("-") as [string, string]
);

const verts = Array.from(new Set(input.flat()));

const adj = new Set();
for (const [s1, s2] of input) {
	adj.add(`${s1}-${s2}`);
	adj.add(`${s2}-${s1}`);
}

let res = 0;

for (let i = 0; i < verts.length; i++) {
	const v1 = verts[i]!;
	// if (!v1.startsWith("t")) continue;
	for (let j = i + 1; j < verts.length; j++) {
		const v2 = verts[j]!;
		if (!adj.has(`${v1}-${v2}`)) continue;
		for (let k = j + 1; k < verts.length; k++) {
			const v3 = verts[k]!;
			if (
				adj.has(`${v1}-${v2}`) &&
				adj.has(`${v2}-${v3}`) &&
				adj.has(`${v3}-${v1}`) &&
				(v1.startsWith("t") || v2.startsWith("t") || v3.startsWith("t"))
			) {
				res += 1;
			}
		}
	}
}

console.log(res);
