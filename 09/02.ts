import { readLines } from "../util";

const input = readLines("./09/input.txt")[0]!;
// const input = "2333133121414131402";

const blocks = input
	.split("")
	.map((s) => Number.parseInt(s))
	.map((n, i) => ({
		length: n,
		id: i % 2 ? null : i / 2,
	}));

for (let i = blocks.length - 1; i >= 1; i--) {
	if (blocks[i]!.id === null) {
		continue;
	}
	const file = blocks[i]!;
	for (let j = 1; j < i; j++) {
		if (blocks[j]!.id !== null) {
			continue;
		}
		if (blocks[j]!.length < file.length) {
			continue;
		}
		const diff = blocks[j]!.length - file.length;
		blocks[j] = file;
		blocks[i] = { ...file, id: null };
		if (diff > 0) {
			blocks.splice(j + 1, 0, { id: null, length: diff });
			i += 1;
		}
		break;
	}
}

const flatBlocks = blocks.flatMap(({ length, id }) =>
	Array.from({ length }, () => id)
);

console.log(
	flatBlocks
		.map((x, i) => (x === null ? 0 : x * i))
		.reduce<number>((acc, x) => acc + x, 0)
);
