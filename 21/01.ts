import { readLines } from "../util";

const parsePad = (s: string) =>
	s
		.trim()
		.split("\n")
		.map((s) => s.split("").map((s) => (s === "x" ? null : s)));

const PAD1 = parsePad(`
789
456
123
x0A
`);

const PAD2 = parsePad(`
x^A
<v>
`);

type Pad = (string | null)[][];

const getCoord = (s: string, pad: Pad) => {
	const r = pad.findIndex((r) => r.includes(s));
	if (r < 0) {
		throw new Error(`Not found ${s} in ${pad}`);
	}
	const c = pad[r]!.indexOf(s);
	if (c < 0) {
		throw new Error(`Not found ${s} in ${pad}`);
	}

	return { r, c };
};

type Coord = ReturnType<typeof getCoord>;

const repeat = (s: string, n: number) => new Array(n + 1).join(s);

const goUp = (p1: Coord, p2: Coord) => {
	if (p2.r < p1.r) {
		return repeat("^", p1.r - p2.r);
	}
	return "";
};
const goDown = (p1: Coord, p2: Coord) => {
	if (p2.r > p1.r) {
		return repeat("v", p2.r - p1.r);
	}
	return "";
};
const goLeft = (p1: Coord, p2: Coord) => {
	if (p2.c < p1.c) {
		return repeat("<", p1.c - p2.c);
	}
	return "";
};
const goRight = (p1: Coord, p2: Coord) => {
	if (p2.c > p1.c) {
		return repeat(">", p2.c - p1.c);
	}
	return "";
};

const getPath = (
	s1: string,
	s2: string,
	pad: Pad,
	order: ("^" | "v" | ">" | "<")[]
) => {
	const p1 = getCoord(s1, pad);
	const p2 = getCoord(s2, pad);
	let res = "";
	for (const dir of order) {
		switch (dir) {
			case "^":
				res += goUp(p1, p2);
				break;
			case "v":
				res += goDown(p1, p2);
				break;
			case ">":
				res += goRight(p1, p2);
				break;
			case "<":
				res += goLeft(p1, p2);
				break;
		}
	}

	return `${res}A`;
};

const getProgram = (
	start: string,
	result: string,
	pad: Pad,
	order: ("^" | "v" | ">" | "<")[]
) => {
	let curr = start;
	let res = "";
	for (const c of result.split("")) {
		res += getPath(curr, c, pad, order);
		curr = c;
	}
	return res;
};
const getProgram1 = (result: string) => {
	return getProgram("A", result, PAD1, ["^", ">", "v", "<"]);
};
const getProgram2 = (result: string) => {
	return getProgram("A", result, PAD2, [">", "v", "^", "<"]);
};

const codes = readLines("./21/demo.txt");
let res = 0;
for (const code of codes) {
	const p1 = getProgram1(code);
	const p2 = getProgram2(p1);
	const p3 = getProgram2(p2);
	const p4 = getProgram2(p3);

	console.log(code, p4.length);
	res += p4.length * Number.parseInt(code.slice(0, -1), 10);
}

console.log(res);
