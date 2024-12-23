import { readLines } from "../util";
import memoize from "lodash/memoize.js";

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

const coordsPad1 = Object.fromEntries(
	PAD1.flat()
		.filter((x) => x !== null)
		.map((s) => [s, getCoord(s, PAD1)])
);

const coordsPad2 = Object.fromEntries(
	PAD2.flat()
		.filter((x) => x !== null)
		.map((s) => [s, getCoord(s, PAD2)])
);

type Coord = ReturnType<typeof getCoord>;

const repeat = memoize(
	(s: string, n: number) => new Array(n + 1).join(s),
	(s: string, n: number) => `${s}@${n}`
);

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

const MAX_LENGTH = 50_000_000;

class Strings {
	private prevStrings: string[] = [];
	private lastString = "";

	appendString(s: string) {
		this.lastString += s;
		while (this.lastString.length > MAX_LENGTH) {
			this.prevStrings.push(this.lastString.slice(0, MAX_LENGTH));
			this.lastString = this.lastString.slice(MAX_LENGTH);
		}
	}

	appendStrings(s: Strings) {
		for (let i = 0; i < s.prevStrings.length; i++) {
			this.appendString(s.prevStrings[i]!);
		}
		this.appendString(s.lastString);
	}

	get length() {
		return (
			this.prevStrings.reduce((acc, s) => acc + s.length, 0) +
			this.lastString.length
		);
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.prevStrings.length; i++) {
			yield* this.prevStrings[i]![Symbol.iterator]();
		}
		yield* this.lastString[Symbol.iterator]();
	}

	toString() {
		return this.prevStrings.join("") + this.lastString;
	}
}

const getPath = (
	p1: Coord,
	p2: Coord,
	order: readonly ("^" | "v" | ">" | "<")[]
) => {
	const res = new Strings();
	for (const dir of order) {
		switch (dir) {
			case "^":
				res.appendString(goUp(p1, p2));
				break;
			case "v":
				res.appendString(goDown(p1, p2));
				break;
			case ">":
				res.appendString(goRight(p1, p2));
				break;
			case "<":
				res.appendString(goLeft(p1, p2));
				break;
		}
	}

	res.appendString("A");

	return res;
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

const getOrder1 = memoize(
	(from: string, to: string) =>
		getOrder(getCoord(from, PAD1), getCoord(to, PAD1), PAD1),
	(from: string, to: string) => `${from}->${to}`
);

const getOrder2 = memoize(
	(from: string, to: string) =>
		getOrder(getCoord(from, PAD2), getCoord(to, PAD2), PAD2),
	(from: string, to: string) => `${from}->${to}`
);

const getPath1 = memoize(
	(from: string, to: string) => {
		const p1 = coordsPad1[from]!;
		const p2 = coordsPad1[to]!;
		return getPath(p1, p2, getOrder1(from, to));
	},
	(from: string, to: string) => `${from}->${to}`
);
const getPath2 = memoize(
	(from: string, to: string) => {
		const p1 = coordsPad2[from]!;
		const p2 = coordsPad2[to]!;
		return getPath(p1, p2, getOrder2(from, to));
	},
	(from: string, to: string) => `${from}->${to}`
);

const paths: Record<string, string> = {};
for (const from of Object.keys(coordsPad2)) {
	for (const to of Object.keys(coordsPad2)) {
		paths[`${from}${to}`] = getPath2(from, to).toString();
	}
}

const getProgram1 = (result: string) => {
	let curr = "A";
	const res = new Strings();
	for (const c of result.split("")) {
		res.appendStrings(getPath1(curr, c));
		curr = c;
	}
	return res;
};
const getProgram2 = (result: Strings) => {
	let curr = "A";
	const res = new Strings();
	for (const c of result) {
		res.appendString(paths[`${curr}${c}`]!);
		curr = c;
	}
	return res;
};

const codes = readLines("./21/input.txt");
let res = 0;
for (const code of codes) {
	let p = getProgram1(code);
	for (let i = 0; i < 25; i++) {
		console.log(code, i, p.length);
		p = getProgram2(p);
	}

	res += p.length * Number.parseInt(code.slice(0, -1), 10);
}

console.log(res);
