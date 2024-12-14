<script lang="ts">
	import data from "./input.txt?raw";

	const width = 101;
	const height = 103;
	let time = $state(7132);

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

	const initialRobots = data.split("\n").filter(Boolean).map(parseRobot);

	const mod = (a: number, b: number) => {
		while (a < 0) a += b;
		while (a >= b) a -= b;
		return a;
	};

	const getCurrentRobots = (time: number) => {
		return initialRobots.map(({ x0, y0, vx, vy }) => {
			const x = mod(x0 + vx * time, width);
			const y = mod(y0 + vy * time, height);
			return { x, y };
		});
	};

	const currentRobots = $derived(getCurrentRobots(time));

	function countRobots(x: number, y: number) {
		const rs = currentRobots.filter((r) => r.x === x && r.y === y).length;

		return rs > 0 ? rs.toString() : ".";
	}

	// setInterval(() => {
	// 	time++;
	// }, 1000);
</script>

<main>
	<strong>{time}</strong>
	<div class="grid">
		{#each Array.from({ length: height }, (_, j) => j) as y}
			<div class="row">
				{#each Array.from({ length: width }, (_, i) => i) as x}
					<div class="cell">
						{countRobots(x, y)}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
	.grid {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	.cell {
		width: 8px;
		height: 8px;
		flex-grow: 0;
		flex-shrink: 0;
		font-size: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
