import { parseNumbers, readLines } from "../util";

const parseLine = (s: string) => {
	const [res, nums] = s.split(/:\s/);
	return {
		res: Number.parseInt(res!),
		nums: parseNumbers(nums!),
	};
};

const data = readLines("./07/input.txt").map(parseLine);

const canSolve = (res: number, nums: number[]): boolean => {
	if (nums.length === 1) {
		return res === nums[0];
	}

	const last = nums.at(-1)!;
	const rest = nums.slice(0, -1);

	const endsWith = res.toString().endsWith(last.toString());
	const withoutLast = endsWith
		? Number.parseInt(res.toString().slice(0, -last.toString().length))
		: 0;

	return (
		(res % last === 0 && canSolve(res / last, rest)) ||
		(res >= last && canSolve(res - last, rest)) ||
		(endsWith && canSolve(withoutLast, rest))
	);
};

console.log(
	data
		.map(({ res, nums }) => (canSolve(res, nums) ? res : 0))
		.reduce<number>((acc, x) => acc + x, 0)
);
