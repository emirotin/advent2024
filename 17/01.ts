import { parseNumbers, readLines } from "../util";

const parseRegistry = (s: string): { r: string; v: number } => {
	const m = s.match(/Register (.): (\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		r: m[1]!,
		v: Number.parseInt(m[2]!),
	};
};

const parseProgram = (s: string) => {
	const m = s.match(/Program: (.+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return parseNumbers(m[1]!, ",");
};

const input = readLines("./17/input.txt");
const i = input.indexOf("");
if (i < 0) {
	throw new Error("Invalid data");
}

const regs: Record<string, number> = {};
for (let k = 0; k < i; k++) {
	const { r, v } = parseRegistry(input[k]!);
	regs[r] = v;
}

const program = parseProgram(input[i + 1]!);

let pointer = 0;

const read = (combo = false) => {
	const v = program[pointer]!;
	pointer++;
	if (!combo || v < 4) return v;
	switch (v) {
		case 4:
			return regs.A!;
		case 5:
			return regs.B!;
		case 6:
			return regs.C!;
		default:
			throw new Error(`Unexpected operand ${v}`);
	}
};

const output: number[] = [];

while (true) {
	if (pointer >= program.length - 1) break;
	const opcode = read();
	switch (opcode) {
		case 0: {
			const d = 2 ** read(true);
			regs.A = ~~(regs.A! / d);
			break;
		}
		case 6: {
			const d = 2 ** read(true);
			regs.B = ~~(regs.A! / d);
			break;
		}
		case 7: {
			const d = 2 ** read(true);
			regs.C = ~~(regs.A! / d);
			break;
		}
		case 1: {
			regs.B! ^= read();
			break;
		}
		case 2: {
			regs.B = read(true) % 8;
			break;
		}
		case 3: {
			if (regs.A) {
				const p = read();
				pointer = p;
			}
			break;
		}
		case 4: {
			read();
			// biome-ignore lint/suspicious/noExtraNonNullAssertion: <explanation>
			regs.B! ^= regs.C!;
			break;
		}
		case 5: {
			output.push(read(true) % 8);
			break;
		}
		default:
			throw new Error(`Unexpected opcode ${opcode}`);
	}
}

console.log(output.join(","));
