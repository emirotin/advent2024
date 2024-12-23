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
	p1: Coord,
	p2: Coord,
	order: readonly ("^" | "v" | ">" | "<")[]
) => {
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

// The order optimizes travel distance across the directional pad,
// unless it's impossible to take the optimal path due to the empty space
const getOrder = (from: Coord, to: Coord, pad: Pad) => {
	if (from.c === to.c) {
		if (from.r < to.r) return ["v"] as const;
		if (from.r > to.r) return ["^"] as const;
	}

	if (from.r === to.r) {
		if (from.c < to.c) return [">"] as const;
		if (from.c > to.c) return ["<"] as const;
	}

	// down and right
	if (from.r < to.r && from.c < to.c) {
		if (pad[to.r]![from.c] === null) return [">", "v"] as const;
		return ["v", ">"] as const;
	}

	// down and left
	if (from.r < to.r && from.c > to.c) {
		if (pad[from.r]![to.c] === null) return ["v", "<"] as const;
		return ["<", "v"] as const;
	}

	// up and right
	if (from.r > to.r && from.c < to.c) {
		return [">", "^"] as const;
	}

	// up and left
	if (from.r > to.r && from.c > to.c) {
		if (pad[from.r]![to.c] === null) return ["^", "<"] as const;
		return ["<", "^"] as const;
	}

	return [];
};

const getProgram = (start: string, result: string, pad: Pad) => {
	let curr = start;
	let res = "";
	for (const c of result.split("")) {
		const p1 = getCoord(curr, pad);
		const p2 = getCoord(c, pad);
		res += getPath(p1, p2, getOrder(p1, p2, pad));
		curr = c;
	}
	return res;
};

const getProgram1 = (result: string) => {
	return getProgram("A", result, PAD1);
};
const getProgram2 = (result: string) => {
	return getProgram("A", result, PAD2);
};

const codes = readLines("./21/input.txt");
let res = 0;
for (const code of codes) {
	const p1 = getProgram1(code);
	const p2 = getProgram2(p1);
	const p3 = getProgram2(p2);

	res += p3.length * Number.parseInt(code.slice(0, -1), 10);
}

console.log(res);
