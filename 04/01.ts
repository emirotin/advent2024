import { readLines } from "../util.js";

const data = readLines("./04/input.txt");
const rows = data.length;
const cols = data[0]!.length;

const isMatch = (word: string[]) =>
	word.length === 4 &&
	word[0] === "X" &&
	word[1] === "M" &&
	word[2] === "A" &&
	word[3] === "S";

let res = 0;

for (let i = 0; i < rows; i++) {
	for (let j = 0; j < cols; j++) {
		res +=
			Number(
				j <= cols - 4 &&
					isMatch([
						data[i]![j]!,
						data[i]![j + 1]!,
						data[i]![j + 2]!,
						data[i]![j + 3]!,
					])
			) +
			Number(
				j >= 3 &&
					isMatch([
						data[i]![j]!,
						data[i]![j - 1]!,
						data[i]![j - 2]!,
						data[i]![j - 3]!,
					])
			) +
			Number(
				i <= rows - 4 &&
					isMatch([
						data[i]![j]!,
						data[i + 1]![j]!,
						data[i + 2]![j]!,
						data[i + 3]![j]!,
					])
			) +
			Number(
				i >= 3 &&
					isMatch([
						data[i]![j]!,
						data[i - 1]![j]!,
						data[i - 2]![j]!,
						data[i - 3]![j]!,
					])
			) +
			Number(
				i <= rows - 4 &&
					j <= cols - 4 &&
					isMatch([
						data[i]![j]!,
						data[i + 1]![j + 1]!,
						data[i + 2]![j + 2]!,
						data[i + 3]![j + 3]!,
					])
			) +
			Number(
				i >= 3 &&
					j >= 3 &&
					isMatch([
						data[i]![j]!,
						data[i - 1]![j - 1]!,
						data[i - 2]![j - 2]!,
						data[i - 3]![j - 3]!,
					])
			) +
			Number(
				i <= rows - 4 &&
					j >= 3 &&
					isMatch([
						data[i]![j]!,
						data[i + 1]![j - 1]!,
						data[i + 2]![j - 2]!,
						data[i + 3]![j - 3]!,
					])
			) +
			Number(
				i >= 3 &&
					j <= cols - 4 &&
					isMatch([
						data[i]![j]!,
						data[i - 1]![j + 1]!,
						data[i - 2]![j + 2]!,
						data[i - 3]![j + 3]!,
					])
			);
	}
}

console.log(res);
