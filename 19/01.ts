import { readLines } from "../util";

const input = readLines("./19/input.txt");

const towels = input[0]!.split(", ");

const designs = input.slice(2);

const hasSolution = (design: string): boolean => {
	if (!design) return true;

	const matchingTowels = towels.filter((t) => design.startsWith(t));

	return matchingTowels.some((t) => hasSolution(design.slice(t.length)));
};

console.log(designs.filter(hasSolution).length);
