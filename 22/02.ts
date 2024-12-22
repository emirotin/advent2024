import { readLines } from "../util";

const nextSecret = (secret: bigint) => {
	let x1 = secret << 6n;
	let x2 = x1 ^ secret;
	// biome-ignore lint/style/noParameterAssign: <>
	secret = x2 & 0b111111111111111111111111n;
	x1 = secret >> 5n;
	x2 = x1 ^ secret;
	// biome-ignore lint/style/noParameterAssign: <>
	secret = x2 & 0b111111111111111111111111n;
	x1 = secret << 11n;
	x2 = x1 ^ secret;
	// biome-ignore lint/style/noParameterAssign: <>
	secret = x2 & 0b111111111111111111111111n;

	return secret;
};

const input = readLines("./22/demo.txt").map(BigInt);

const data = input.map((n) => {
	const prices = [];
	const diffs = [];
	let p = n % 10n;
	for (let i = 0; i < 2000; i++) {
		const n1 = nextSecret(n);
		const p1 = n1 % 10n;
		prices.push(p1);
		diffs.push(p1 - p);
		// biome-ignore lint/style/noParameterAssign: <>
		n = n1;
		p = p1;
	}
	return { prices, diffs };
});

type Seq = readonly [bigint, bigint, bigint, bigint];

const findSeq = (a: bigint[], s: Seq) => {
	for (let i = 0; i < a.length - 4; i++) {
		if (
			a[i] === s[0] &&
			a[i + 1] === s[1] &&
			a[i + 2] === s[2] &&
			a[i + 3] === s[3]
		) {
			return i + 3;
		}
	}
	return null;
};

let bestResult = 0n;
const seqs: Seq[] = [];
for (let a = -9n; a <= 9n; a++) {
	for (let b = -9n; b <= 9n; b++) {
		for (let c = -9n; c <= 9n; c++) {
			for (let d = -9n; d <= 9n; d++) {
				seqs.push([a, b, c, d]);
			}
		}
	}
}

for (const seq of seqs) {
	let res = 0n;

	for (let i = 0; i < data.length; i++) {
		const j = findSeq(data[i]!.diffs, seq);
		if (j !== null) {
			res += data[i]!.prices[j]!;
		}
	}

	if (res > bestResult) {
		bestResult = res;
	}
}

console.log(bestResult);
