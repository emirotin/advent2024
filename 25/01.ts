import { readLines } from "../util";

const input = readLines("./25/input.txt");

const inputs: string[][] = [];

let last = 0;
let next: number;
// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
while ((next = input.indexOf("", last)) > 0) {
	inputs.push(input.slice(last, next));
	last = next + 1;
}
inputs.push(input.slice(last));

const getData = (s: string[]) => {
	const isLock = s[0][0] === "#";
	const height = s.length;
	const width = s[0]!.length;

	const heights = Array.from({ length: width }, (_, c) => {
		if (isLock) {
			for (let r = 0; r < height; r++) {
				if (s[r][c] === ".") return r;
			}
		}
		for (let r = height - 1; r >= 0; r--) {
			if (s[r][c] === ".") return height - 1 - r;
		}
	});

	return { isLock, width, height, heights };
};

const data = inputs.map(getData);
const locks = data.filter(({ isLock }) => isLock) as Array<
	Item & { isLock: true }
>;
const keys = data.filter(({ isLock }) => !isLock) as Array<
	Item & { isLock: false }
>;

type Item = ReturnType<typeof getData>;

const fit = (l: Item & { isLock: true }, k: Item & { isLock: false }) => {
	return (
		l.height === k.height &&
		l.width === k.width &&
		l.heights.every((h, c) => {
			return k.heights[c] + h <= k.height;
		})
	);
};

let res = 0;
for (const l of locks) {
	for (const k of keys) {
		res += Number(fit(l, k));
	}
}
console.log(res);
