import { parseNumbers } from "../util";

const stones = parseNumbers("2 54 992917 5270417 2514 28561 0 990");

const tick = () => {
	let i = -1;
	while (true) {
		i++;
		if (i >= stones.length) {
			break;
		}

		const v = stones[i]!;

		if (v === 0) {
			stones[i] = 1;
			continue;
		}

		const s = v.toString();
		if (s.length % 2 === 0) {
			const k = s.length / 2;
			const s1 = s.substring(0, k);
			const s2 = s.substring(k);
			stones[i] = Number.parseInt(s1);
			stones.splice(i, 0, Number.parseInt(s2));
			i++;
			continue;
		}

		stones[i]! *= 2024;
	}
};

for (let i = 0; i < 25; i++) {
	tick();
}

console.log(stones.length);
