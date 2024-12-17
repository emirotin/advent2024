import { parseNumbers, readLines } from "../util";

const parseRegistry = (s: string): { r: string; v: bigint } => {
	const m = s.match(/Register (.): (\d+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return {
		r: m[1]!,
		v: BigInt(m[2]!),
	};
};

const parseProgram = (s: string) => {
	const m = s.match(/Program: (.+)/);
	if (!m) {
		throw new Error(`Invalid input ${s}`);
	}
	return m[1]!.split(",").map(BigInt);
};

const input = readLines("./17/input.txt");
const i = input.indexOf("");
if (i < 0) {
	throw new Error("Invalid data");
}

const regs: Record<string, bigint> = {};
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
		case 4n:
			return regs.A!;
		case 5n:
			return regs.B!;
		case 6n:
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
		case 0n: {
			regs.A = regs.A! >> read(true);
			break;
		}
		case 6n: {
			regs.B = regs.A! >> read(true);
			break;
		}
		case 7n: {
			regs.C = regs.A! >> read(true);
			break;
		}
		case 1n: {
			regs.B! ^= read();
			break;
		}
		case 2n: {
			regs.B = read(true) % 8n;
			break;
		}
		case 3n: {
			if (regs.A) {
				const p = read();
				pointer = Number(p);
			}
			break;
		}
		case 4n: {
			read();
			// biome-ignore lint/suspicious/noExtraNonNullAssertion: <explanation>
			regs.B! ^= regs.C!;
			break;
		}
		case 5n: {
			output.push(Number(read(true) % 8n));
			break;
		}
		default:
			throw new Error(`Unexpected opcode ${opcode}`);
	}
}

console.log(output.join(","));
