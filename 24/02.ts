import { readLines } from "../util";

const input = readLines("./24/input.txt");

const sep = input.indexOf("");
if (sep < 0) {
	throw new Error("invalid data");
}

interface Block {
	operator: "AND" | "OR" | "XOR";
	input1: string;
	input2: string;
}

const blocks = new Map<string, Block>();

const prefix = (key: string) => (!key.match(/[xyz]\d\d/) ? `_${key}` : key);

for (let i = sep + 1; i < input.length; i++) {
	const m = input[i]!.match(/(\w+) (AND|OR|XOR) (\w+) -> (\w+)/);
	if (!m) {
		throw new Error(`unclear block ${input[i]}`);
	}
	const b = {
		input1: prefix(m[1]!),
		input2: prefix(m[3]!),
		operator: m[2]! as "AND" | "OR" | "XOR",
	} satisfies Block;
	blocks.set(prefix(m[4]!), b);
}

const renames = new Map<string, string>();
const swaps: [string, string][] = [];

const renameKey = (from: string, to: string) => {
	if (blocks.has(to)) {
		throw new Error(`key already exists ${to}`);
	}
	blocks.set(to, blocks.get(from)!);
	blocks.delete(from);
	renames.set(from, to);
	renames.set(to, from);

	for (const b of blocks.values()) {
		if (b.input1 === from) {
			b.input1 = to;
		}
		if (b.input2 === from) {
			b.input2 = to;
		}
		if (b.input1 > b.input2) {
			const t = b.input1;
			b.input1 = b.input2;
			b.input2 = t;
		}
	}
};

const swap = (k1: string, k2: string) => {
	if (!blocks.has(k1) || !blocks.has(k2)) {
		throw new Error(`Unknown key ${k1} or ${k2}`);
	}
	const t = blocks.get(k1)!;
	blocks.set(k1, blocks.get(k2)!);
	blocks.set(k2, t);

	swaps.push([k1, k2]);
};

swap("_btb", "_mwp");
swap("_rmj", "z23");
swap("_cmv", "z17");
swap("_rdg", "z30");

for (const b of blocks.values()) {
	if (b.input1 > b.input2) {
		const t = b.input1;
		b.input1 = b.input2;
		b.input2 = t;
	}
}

const sameNum = (s1: string, s2: string) => s1.slice(1) === s2.slice(1);
const lowerBy1 = (s1: string, s2: string) =>
	Number.parseInt(s1.slice(1), 10) + 1 === Number.parseInt(s2.slice(1));

for (const key of [...blocks.keys()]) {
	const b = blocks.get(key)!;

	if (
		b.operator === "XOR" &&
		b.input1.match(/x\d\d/) &&
		b.input2.match(/y\d\d/) &&
		b.input1 !== "x00" &&
		b.input2 !== "y00" &&
		sameNum(b.input1, b.input2) &&
		key.startsWith("_")
	) {
		renameKey(key, b.input1.replace("x", "a"));
	}

	if (
		b.operator === "AND" &&
		b.input1.match(/x\d\d/) &&
		b.input2.match(/y\d\d/) &&
		b.input1 !== "x00" &&
		b.input2 !== "y00" &&
		sameNum(b.input1, b.input2) &&
		key.startsWith("_")
	) {
		renameKey(key, b.input1.replace("x", "b"));
	}
}

let changed = true;
while (changed) {
	changed = false;

	for (const key of [...blocks.keys()]) {
		const b = blocks.get(key)!;
		if (
			b.operator === "AND" &&
			b.input1.match(/a\d\d/) &&
			b.input2.match(/c\d\d/) &&
			Number.parseInt(b.input1.slice(1), 10) ===
				Number.parseInt(b.input2.slice(1), 10) + 1 &&
			key.startsWith("_")
		) {
			renameKey(key, b.input1.replace("a", "d"));
			changed = true;
			break;
		}
	}

	for (const key of [...blocks.keys()]) {
		const b = blocks.get(key)!;
		if (
			b.operator === "OR" &&
			b.input1.match(/b\d\d/) &&
			b.input2.match(/d\d\d/) &&
			b.input1.slice(1) === b.input2.slice(1) &&
			key.startsWith("_")
		) {
			renameKey(key, b.input1.replace("b", "c"));
			changed = true;
			break;
		}
	}

	for (const key of [...blocks.keys()]) {
		const b = blocks.get(key)!;
		if (
			b.operator === "XOR" &&
			key.match(/z\d\d/) &&
			b.input2.match(/a\d\d/) &&
			key.slice(1) === b.input2.slice(1) &&
			b.input1.startsWith("_")
		) {
			renameKey(
				b.input1,
				`c${(Number.parseInt(key.slice(1)) - 1).toString().padStart(2, "0")}`
			);
			changed = true;
			break;
		}
	}
}

for (const [k, b] of blocks) {
	if (
		k === "z00" &&
		b.operator === "XOR" &&
		b.input1 === "x00" &&
		b.input2 === "y00"
	)
		continue;

	if (
		k === "c00" &&
		b.operator === "AND" &&
		b.input1 === "x00" &&
		b.input2 === "y00"
	)
		continue;

	if (
		k === "z45" &&
		b.operator === "OR" &&
		b.input1 === "b44" &&
		b.input2 === "d44"
	)
		continue;

	if (
		k.match(/a\d\d/) &&
		b.operator === "XOR" &&
		b.input1.match(/x\d\d/) &&
		b.input2.match(/y\d\d/) &&
		sameNum(k, b.input1) &&
		sameNum(k, b.input2)
	)
		continue;

	if (
		k.match(/b\d\d/) &&
		b.operator === "AND" &&
		b.input1.match(/x\d\d/) &&
		b.input2.match(/y\d\d/) &&
		sameNum(k, b.input1) &&
		sameNum(k, b.input2)
	)
		continue;

	if (
		k.match(/d\d\d/) &&
		b.operator === "AND" &&
		b.input1.match(/a\d\d/) &&
		b.input2.match(/c\d\d/) &&
		sameNum(k, b.input1) &&
		lowerBy1(b.input2, k)
	)
		continue;

	if (
		k.match(/c\d\d/) &&
		b.operator === "OR" &&
		b.input1.match(/b\d\d/) &&
		b.input2.match(/d\d\d/) &&
		sameNum(k, b.input1) &&
		sameNum(k, b.input2)
	)
		continue;

	if (
		k.match(/z\d\d/) &&
		b.operator === "XOR" &&
		b.input1.match(/a\d\d/) &&
		b.input2.match(/c\d\d/) &&
		sameNum(k, b.input1) &&
		lowerBy1(b.input2, k)
	)
		continue;

	console.log(`${k} = ${b.input1} ${b.operator} ${b.input2}`);
}

console.log(
	swaps
		.flat()
		.map((s) => (s.startsWith("_") ? s.slice(1) : s))
		.sort()
		.join(",")
);
