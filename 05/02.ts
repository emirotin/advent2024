import { readLines } from "../util";

const input = readLines("./05/input.txt");
const i = input.indexOf("");

if (i < 0) {
	console.error("Invalid input");
	process.exit(1);
}

const updates = input.slice(i + 1).map((s) => s.split(","));

const parseRules = (rules: string[]) => {
	const graph = new Map<string, string[]>();
	const nodes = new Set<string>();
	for (const rule of rules) {
		const [from, to] = rule.split("|") as [string, string];
		nodes.add(from);
		nodes.add(to);
		if (!graph.has(from)) {
			graph.set(from, [to]);
		} else {
			graph.set(from, [...new Set([to, ...(graph.get(from) as string[])])]);
		}
	}
	return { graph, nodes };
};

const { graph } = parseRules(input.slice(0, i));

const isProhibited = (from: string, to: string) =>
	graph.get(to)?.includes(from);

let res = 0;
const incorrect = [] as string[][];
for (const update of updates) {
	const l = update.length;
	let failed = false;
	for (let i = 0; i < l; i++) {
		for (let j = i + 1; j < l; j++) {
			if (isProhibited(update[i]!, update[j]!)) {
				failed = true;
				break;
			}
		}
		if (failed) {
			break;
		}
	}

	if (!failed) {
		continue;
	}

	update.sort((a, b) => {
		if (graph.get(a)?.includes(b)) {
			return -1;
		}
		if (graph.get(b)?.includes(a)) {
			return 1;
		}
		return 0;
	});

	res += Number.parseInt(update[(update.length - 1) / 2]!);
}

console.log(res);
