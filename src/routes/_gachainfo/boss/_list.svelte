<script>
	import { onDestroy, onMount, tick, createEventDispatcher, getContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { assets, activeVersion, customData, isCustomBanner, primogem } from '$lib/store/app-stores';
	import { storageLocal } from '$lib/helpers/dataAPI/api-localstore';

	import updates from '$lib/data/updates.json';
	import bosses from '$lib/data/boss.json';
	import HealthBar from '$lib/helpers/health-bar.js';
	import DieBar from '$lib/helpers/damage.js';

	const { patch: version} = $activeVersion;

	const openObtained = getContext('openObtained');

	let banner;

	let processedUpdates = [...updates.data].reverse();
	let bossSeq = [...bosses.data].reverse();

	let image;
	let name;

	for(let uppy of processedUpdates){
    	if (Number(uppy.patch) === Number(version)) {
			banner = uppy.banner;
        	break;
    	}
	}

	for(let boss of bossSeq){
    	if (Number(boss.patch) === Number(version)) {
			name = boss.name;
			image = boss.path;
        	break;
    	}
	}

	let eleDMG = ['#7BB42D','#E2311D','#D376F0','#1C72FD','#33CCB3','#98C8E8','#CFA726'];

	let canvas;
	let health = 300;
	const healthBarWidth = 480;
	const healthBarHeight = 10;
	let healthBar;
	let boom;
	let bossFought = false;
	let bossFighting = false;
	let bossDefeated = false;
	const sendBoss = createEventDispatcher();

	let color = '#ffffff';

	function healthier(){ // HP Scaling
		let mult = Number(version);

		if(mult > 1){
			health = health * (10 * mult);
		}

		return health;

	}
	
	async function setupCanvas() {
		await tick();
    	if (!canvas) {
    		console.error("Canvas not found!");
			return;
    }
		const context = canvas.getContext("2d");
		if (!context) {
    	console.error("Failed to get 2D context!");
    	return;
    }

		health = healthier();
		
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

		let boss = storageLocal.get('boss')
		if (!boss) {
    		boss = {};
		}
		storageLocal.set('boss', boss);
	};

	async function dealDamage() {
		color = eleDMG[Math.floor(Math.random()*eleDMG.length)];
		boom = await DieBar();
		bossFighting = true;
    	health -= boom;

		if(health <= 0){
			health = 0;
			bossDefeated = true;

			let boss = storageLocal.get('boss')
			for(let ban of banner){
				if(!boss[ban]) {
					if(banner.length >= 2){
						openObtained([{ item: 'primogem', qty: 900 }]);
						primogem.update((n) => n + 450)
					}
					else{
						openObtained([{ item: 'primogem', qty: 900 }]);
						primogem.update((n) => n + 900)
					}
				}	
			}
		} 

		bossFought = true;

		sendBoss("didFight", bossFought);

		healthBar.updateHealth(health);

		let boss = storageLocal.get('boss')
		for(let ban of banner){
			boss[ban] = bossDefeated;
			storageLocal.set('boss', boss);
		}
	}



	onMount(setupCanvas);

	onDestroy(() => {
		healthBar = null;
	});
</script>

<div class="list">
	<div class="center-container">
		<img src={image} alt="boss" class="background-gif"/>
		<p class=overlay-name>{name}</p>
		<canvas bind:this={canvas} width={640} height={640} class="overlay-canvas">
		</canvas>
		{#if !bossFought}
			<button class="overlay-button" on:click={dealDamage} style="--bg:url({$assets['button-fight.webp']})"></button>
		{/if}
		{#if bossFighting}
			<p class=overlay-damage style="--boom:{color}">{boom}</p>
		{/if}
	</div>
</div>

<style>
	.center-container {
        display: flex;
        justify-content: center;
        align-items: top center;
    }

	canvas {
	background: none;
	display: block;
	margin: 0 auto;
	border: none;
	}

	.background-gif {
		align-items: center;
		height: 680px;
		width: 1200px;
		top: 0;
		object-fit: cover;
		object-position: top center;
		overflow: hidden;
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
		text-align: center;
		color: white;
		width: 100%;
		height: 100%;
		top: 2px;
		pointer-events: none;
	}

	.overlay-damage {
		position: absolute;
		top: 12%;
		text-align: center;
		color: white;
		width: 100%;
		height: 100%;
		pointer-events: none;
		animation:boomOut 0.5s 1;
		animation-duration: 2s;
	}

	@keyframes boomOut {
	0%   {font-size: 70px; left:0px; top:20%; opacity :0; color: var(--boom,white)}
	5%  {font-size: 100px; left:0px; top:15%; opacity :1; color: var(--boom,white)}
	20%  {font-size: 100px; left:0px; top:15%; opacity :1; color: var(--boom,white)}
	25%	{opacity :0.5; color: var(--boom,white)}
	70% {font-size: 70px; left:0px; top:80%; opacity :0;}
	100% {font-size: 0px; left:0px; top:80%; opacity :0;}
	}

	.overlay-button {
        background-image: var(--bg);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
        position: absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		aspect-ratio: unset;
		clip-path: circle(50%);
		margin: 0 1px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #a49a90;
        padding: 1px 1px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
		opacity: 0.7;
    }

    .overlay-button:hover {
        opacity: 0.9;
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
