<script>
	console.log("Component is loading!");
	import { onDestroy, onMount, tick } from 'svelte';
	import { t } from 'svelte-i18n';
	import { assets, activeVersion, customData, isCustomBanner } from '$lib/store/app-stores';
	import ButtonGeneral from '$lib/components/ButtonGeneral.svelte';
	import updates from '$lib/data/updates.json';
	import characters from '$lib/data/characters.json';
	import HealthBar from '$lib/helpers/health-bar.js';
	import DieBar from '$lib/helpers/damage.js';

	let canvas;
	let health = 3000;
	const healthBarWidth = 480;
	const healthBarHeight = 10;
	let healthBar;
	
	async function setupCanvas() {
		await tick();
		console.log("onMount() is running!");
    	if (!canvas) {
    		console.error("Canvas not found!");
			return;
    }
		const context = canvas.getContext("2d");
		if (!context) {
    	console.error("Failed to get 2D context!");
    	return;
    }
		
		const width = canvas.width = 640;
		const height = canvas.height = 280;

		const x = width / 2 - healthBarWidth / 2;
		const y = 20;

		healthBar = new HealthBar(x, y, healthBarWidth, healthBarHeight, health, "red");

		const frame = function() {
		context.clearRect(0, 0, width, height);
		healthBar.show(context);
		requestAnimationFrame(frame);
	}

		frame();
	};

	function dealDamage() {
		DieBar();
    	health -= 10;
		healthBar.updateHealth(health);
	}

	onMount(setupCanvas);

	onDestroy(() => {
		console.log("✅ Cleaning up!");
		healthBar = null; // Ensure it runs after mount
	});


</script>

<div class="list">
	<div class="center-container">
		<img src="videos/dvalin_boss.webp" alt="boss" class="background-gif"/>
		<p class=overlay-name>Stormterror - Dvalin</p>
		<canvas bind:this={canvas} width={640} height={640} class="overlay-canvas">
		</canvas>
		<button class="overlay-button" on:click={dealDamage}>Fight</button>
	</div>
</div>

<style>
	.center-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

	canvas {
	background: none;
	display: block;
	margin: 0 auto;
	border: none;
	}

	.background-gif {
		align-items: center;
		width: 95%;
		height: auto;
		display: block;
		
	}

	.overlay-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.overlay-name {
		position: absolute;
		top: 0.5%;
        left: 40%;
		color: white;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.overlay-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(162, 128, 82, 0.7);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .overlay-button:hover {
        background-color: rgba(162, 128, 82, 0.9);
    }

	.v2 canvas {
	background: #EEE;
	display: block;
	margin: 0 auto;
	border: solid 6px #444;
	}


	.gi-arrow-up {
		font-size: 1.2rem;
		vertical-align: middle;
		line-height: 0;
		color: #51be51;
	}

	.gi-star {
		color: #feca33;
	}

	:not(.v2) h3,
	:not(.v2) .table .body .row {
		vertical-align: middle;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	h3 {
		padding: 0 0.7rem;
		font-weight: 400;
		background-color: #a28052;
		display: flex;
		align-items: center;
		margin-bottom: 1%;
	}

	.v2 h3 {
		color: #fff;
		font-size: calc(0.015 * var(--content-width));
		padding: 0.5% 2%;
		margin: 0;
	}

	h3 span {
		padding-left: 2rem;
	}

	h3.star5 {
		background-color: #dbbba4;
	}
	.v2 h3.star5 {
		background-color: #cfb383;
	}

	h3.star4 {
		background-color: #b7abbf;
	}
	.v2 h3.star4 {
		background-color: #b5a8c9;
	}

	h3.star3 {
		background-color: #a5bacc;
	}
	.v2 h3.star3 {
		background-color: #aabdc9;
	}

	h4,
	h5 {
		color: #a28052;
		font-weight: 500;
		font-size: larger;
		margin-top: 1%;
		margin-bottom: 2%;
	}

	.v2 h4,
	.v2 h5 {
		color: var(--text-color);
		font-size: calc(0.015 * var(--content-width));
	}

	h5 {
		margin: 1%;
	}
	h5 i {
		color: #a28052;
	}

	.table {
		padding: 0 0 2rem;
		width: 100%;
		font-size: 0.9rem;
	}
	.v2 .table {
		padding: 0 0 calc(0.02 * var(--content-width));
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		border: 0.2px solid #b5b2ae;
	}
	.row.head {
		background-color: #dbd7d3;
		font-family: var(--genshin-font);
	}
	.v2 .row.head {
		background-color: #ede1ca;
	}
	.body .row {
		border-top: 0;
	}

	.cell:nth-child(odd) {
		width: calc(3 / 14 * 100%);
	}
	.cell:nth-child(even) {
		width: calc(4 / 14 * 100%);
	}

	.cell {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0.5rem;
		height: 100%;
		text-align: center;
		line-height: 1.2rem;
		height: 3.2rem;
	}

	.v2 .cell {
		font-size: calc(0.015 * var(--content-width));
		height: calc(0.05 * var(--content-width));
	}

	.head .cell {
		border: solid #b5b2ae;
		border-width: 0 0.07rem;
	}
	.body .cell {
		border: solid #b5b2ae;
		border-width: 0 0.07rem 0.07rem 0;
		color: #a7865a;
	}
	.v2 .head .cell {
		border-color: #d3bc8e;
	}
	.v2 .body .cell {
		border-color: #d3bc8e;
		color: #5b5453;
	}

</style>
