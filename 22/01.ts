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

console.log(
	input
		.map((n) => {
			for (let i = 0; i < 2000; i++) {
				// biome-ignore lint/style/noParameterAssign: <>
				n = nextSecret(n);
			}
			return n;
		})
		.reduce((acc, x) => acc + x, 0n)
);
