import { readLines } from "../util.js";

const input = readLines("./14/input.txt");

const parseRobot = (s: string) => {
	const m = s.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		x0: Number.parseInt(m[1]!),
		y0: Number.parseInt(m[2]!),
		vx: Number.parseInt(m[3]!),
		vy: Number.parseInt(m[4]!),
	};
};

const robots = input.map(parseRobot);

const width = 101;
const height = 103;
const time = 100;

let nw = 0;
let ne = 0;
let se = 0;
let sw = 0;

const wMid = (width - 1) / 2;
const hMid = (height - 1) / 2;

const mod = (a: number, b: number) => {
	while (a < 0) a += b;
	while (a >= b) a -= b;
	return a;
};

for (const { x0, y0, vx, vy } of robots) {
	const x = mod(x0 + vx * time, width);
	const y = mod(y0 + vy * time, height);

	if (x < wMid) {
		if (y < hMid) {
			nw++;
		} else if (y > hMid) {
			sw++;
		}
	} else if (x > wMid) {
		if (y < hMid) {
			ne++;
		} else if (y > hMid) {
			se++;
		}
	}
}

console.log(nw * ne * se * sw);
