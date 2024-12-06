import { readLines } from "../util.js";

const data = readLines("./04/input.txt");
const rows = data.length;
const cols = data[0]!.length;

const isMatch = (i: number, j: number) =>
	i <= rows - 3 &&
	j <= cols - 3 &&
	data[i + 1]![j + 1] === "A" &&
	((data[i]![j] === "M" && data[i + 2]![j + 2] === "S") ||
		(data[i]![j] === "S" && data[i + 2]![j + 2] === "M")) &&
	((data[i]![j + 2] === "M" && data[i + 2]![j] === "S") ||
		(data[i]![j + 2] === "S" && data[i + 2]![j] === "M"));

let res = 0;

for (let i = 0; i < rows - 2; i++) {
	for (let j = 0; j < cols - 2; j++) {
		res += Number(isMatch(i, j));
	}
}

console.log(res);
