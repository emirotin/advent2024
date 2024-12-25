import { readLines } from "../util";

const input = readLines("./24/input.txt");

const sep = input.indexOf("");
if (sep < 0) {
	throw new Error("invalid data");
}

const inputs = new Map<string, boolean>();
for (let i = 0; i < sep; i++) {
	const m = input[i]!.match(/(\w+): (0|1)/);
	if (!m) {
		throw new Error(`unclear input ${input[i]}`);
	}
	inputs.set(m[1]!, m[2] === "1");
}

interface Block {
	operator: "AND" | "OR" | "XOR";
	input1: string;
	input2: string;
	computed: boolean | null;
}

const blocks = new Map<string, Block>();

for (let i = sep + 1; i < input.length; i++) {
	const m = input[i]!.match(/(\w+) (AND|OR|XOR) (\w+) -> (\w+)/);
	if (!m) {
		throw new Error(`unclear block ${input[i]}`);
	}
	const b = {
		input1: m[1]!,
		input2: m[3]!,
		operator: m[2]! as "AND" | "OR" | "XOR",
		computed: null,
	} satisfies Block;
	blocks.set(m[4]!, b);
}

const getValue = (node: string): boolean => {
	if (inputs.has(node)) {
		return inputs.get(node)!;
	}
	const b = blocks.get(node);
	if (!b) {
		throw new Error(`unknown node ${node}`);
	}
	if (b.computed === null) {
		const i1 = getValue(b.input1);
		const i2 = getValue(b.input2);

		switch (b.operator) {
			case "AND":
				b.computed = i1 && i2;
				break;
			case "OR":
				b.computed = i1 || i2;
				break;
			case "XOR":
				b.computed = i1 !== i2;
				break;
		}
	}
	return b.computed;
};

const zValues = [...blocks.keys()]
	.filter((k) => k.startsWith("z"))
	.map((k) => [k, getValue(k)])
	.sort()
	.reverse()
	.map(([, v]) => v);

console.log(zValues);

console.log(zValues.reduce((acc, x) => acc * 2 + Number(x), 0));
