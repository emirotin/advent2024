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
	computed: boolean | null;
}

const clearBlocks = new Map<string, Block>();

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
	clearBlocks.set(m[4]!, b);
}

const getValue = (
	inputs: Map<string, boolean>,
	blocks: Map<string, Block>,
	node: string,
	seenNodes: string[] = []
): null | boolean => {
	if (seenNodes.includes(node)) {
		return null;
	}

	if (inputs.has(node)) {
		return inputs.get(node)!;
	}
	const b = blocks.get(node);
	if (!b) {
		throw new Error(`unknown node ${node}`);
	}
	if (b.computed === null) {
		const i1 = getValue(inputs, blocks, b.input1, [...seenNodes, node]);
		const i2 = getValue(inputs, blocks, b.input2, [...seenNodes, node]);

		if (i1 === null || i2 === null) {
			return null;
		}

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

const checkBitN = (
	originalBlocks: Map<string, Block>,
	n: number,
	x: boolean,
	y: boolean
) => {
	const inputs = new Map<string, boolean>();
	const blocks = new Map(
		[...originalBlocks.entries()].map(([k, v]) => [k, { ...v }])
	);
	for (let i = 0; i < 45; i++) {
		inputs.set(`x${i.toString().padStart(2, "0")}`, i === n ? x : false);
		inputs.set(`y${i.toString().padStart(2, "0")}`, i === n ? y : false);
	}
	return [
		getValue(inputs, blocks, `z${(n + 1).toString().padStart(2, "0")}`),
		getValue(inputs, blocks, `z${n.toString().padStart(2, "0")}`),
	];
};

const validateConfig = (blocks: Map<string, Block>) => {
	for (let n = 0; n < 45; n++) {
		const z00 = checkBitN(blocks, n, false, false);
		const z01 = checkBitN(blocks, n, false, true);
		const z10 = checkBitN(blocks, n, true, false);
		const z11 = checkBitN(blocks, n, true, true);

		if (
			z00.includes(null) ||
			z01.includes(null) ||
			z10.includes(null) ||
			z11.includes(null)
		) {
			return null;
		}

		if (
			!(
				z00[0] === false &&
				z00[1] === false &&
				z01[0] === false &&
				z01[1] === true &&
				z10[0] === false &&
				z10[1] === true &&
				z11[0] === true &&
				z11[1] === false
			)
		) {
			return n;
		}
	}

	return -1;
};

const allNodes = [...clearBlocks.keys()];
let lastFail = validateConfig(clearBlocks)!;
const swappedNodes: string[] = [];
let recentBlocks = clearBlocks;
while (true) {
	if (lastFail === -1) {
		break;
	}

	let found = false;
	for (let i = 0; i < allNodes.length - 1; i++) {
		if (found) {
			found = false;
			break;
		}

		const k1 = allNodes[i]!;
		if (swappedNodes.includes(k1)) continue;

		for (let j = i + 1; j < allNodes.length; j++) {
			const k2 = allNodes[j]!;
			if (swappedNodes.includes(allNodes[j]!)) continue;

			const blocks = new Map(
				[...recentBlocks.entries()].map(([k, v]) => [k, { ...v }])
			);
			const t = blocks.get(k1)!;
			blocks.set(k1, blocks.get(k2)!);
			blocks.set(k2, t);

			const newFail = validateConfig(blocks);
			if (newFail === null) {
				continue;
			}
			if (newFail > lastFail || newFail === -1) {
				lastFail = newFail;
				swappedNodes.push(k1, k2);
				found = true;
				recentBlocks = blocks;
				break;
			}
		}
	}
}

console.log(swappedNodes.sort().join(","));
