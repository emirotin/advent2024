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

const input = readLines("./22/input.txt").map(BigInt);

const data = input.map((n) => {
	const prices = [];
	const diffs = [];
	let p = Number(n % 10n);
	for (let i = 0; i < 2000; i++) {
		const n1 = nextSecret(n);
		const p1 = Number(n1 % 10n);
		prices.push(p1);
		diffs.push(Number(p1 - p));
		// biome-ignore lint/style/noParameterAssign: <>
		n = n1;
		p = p1;
	}
	return { prices, diffs };
});

const seqAcc = new Map<string, number>();
for (const { diffs, prices } of data) {
	const seenSeqs = new Set<string>();
	for (let i = 0; i < diffs.length - 4; i++) {
		const seqStr = diffs.slice(i, i + 4).join(",");
		if (seenSeqs.has(seqStr)) continue;
		seqAcc.set(seqStr, (seqAcc.get(seqStr) ?? 0) + prices[i + 3]!);
		seenSeqs.add(seqStr);
	}
}

console.log(Math.max(...seqAcc.values()));
