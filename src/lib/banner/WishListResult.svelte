<script>
	import { onMount } from 'svelte';
	import { showWish, wishes, backsound } from '$lib/store/stores';
	import Icon from '$lib/utility/Icon.svelte';

	// const sortedWish = [
	// 	{ name: 'jean', rarity: 5, type: 'character', vision: 'anemo' },
	// 	{ name: 'ningguang', rarity: 4, type: 'character', vision: 'geo' },
	// 	{ name: 'qiqi', rarity: 5, type: 'character', vision: 'cryo' },
	// 	{ name: 'chongyun', rarity: 4, type: 'character', vision: 'cryo' },
	// 	{ name: 'xinyan', rarity: 4, type: 'character', vision: 'pyro' },
	// 	{ name: 'noelle', rarity: 4, type: 'character', vision: 'geo' },
	// 	{ name: 'beidou', rarity: 4, type: 'character', vision: 'electro' },
	// 	{ name: 'xiangling', rarity: 4, type: 'character', vision: 'pyro' },
	// 	{ name: 'bennet', rarity: 4, type: 'character', vision: 'pyro' },
	// 	{ name: 'xingqiu', rarity: 4, type: 'character', vision: 'hydro' }
	// ];

	const fiveStar = $wishes.filter(({ rarity }) => rarity === 5).sort((a, b) => a.type - b.type);
	const fourStar = $wishes.filter(({ rarity }) => rarity === 4).sort((a, b) => a.type - b.type);
	const threeStar = $wishes.filter(({ rarity }) => rarity === 3);
	const sortedWish = [...fiveStar, ...fourStar, ...threeStar];

	let audio;
	let wishHeight;

	onMount(() => audio.play());
	const closeHandle = () => {
		backsound.set(true);
		showWish.set(false);
		const buttonSfx = document.querySelector('#button-sfx');
		buttonSfx.currentTime = 0;
		buttonSfx.play();
	};
</script>

<svg viewBox="0 0 302.22 1333.94" height="0" width="0">
	<clipPath id="wishframe" transform="scale(0.003308 0.00074965)" clipPathUnits="objectBoundingBox">
		<path
			d="M0.01 168.12l0 -9.64c4.32,-21.34 12,-32.33 25.46,-25.58 -2.35,-10.3 -1.53,-26.06 5.79,-25.96 19.18,0.25 29.95,-3.14 40.24,-13.16 -4.5,-66.43 51.39,-54.26 79.61,-93.78l0 0c28.22,39.52 84.1,27.34 79.61,93.78 10.29,10.02 21.06,13.41 40.24,13.16 7.32,-0.1 8.13,15.66 5.79,25.96 13.46,-6.75 21.14,4.24 25.46,25.58l0 9.64 0.01 0 0 1004.21 -0.01 0 0 3.13c-4.32,21.34 -12,32.33 -25.46,25.58 2.35,10.3 1.53,26.06 -5.79,25.96 -19.18,-0.25 -29.95,3.14 -40.24,13.16 4.5,66.43 -51.39,54.26 -79.61,93.78l0 0c-28.22,-39.52 -84.1,-27.34 -79.61,-93.78 -10.29,-10.02 -21.06,-13.41 -40.24,-13.16 -7.32,0.1 -8.13,-15.66 -5.79,-25.96 -13.46,6.75 -21.14,-4.24 -25.46,-25.58l0 -3.13 -0.01 0 0 -1004.21 0.01 0z"
		/>
	</clipPath>
</svg>

<button class="close" on:click={closeHandle}>
	<i class="gi-close" />
</button>
<audio src="./assets/sfx/result-list.ogg" bind:this={audio} />
<div class="container">
	<div class="wishlist" bind:clientHeight={wishHeight}>
		{#each sortedWish as { name, rarity, weaponType, type, vision, style }, i (i)}
			<div
				id="wish{i}"
				class="item star{rarity} {type}"
				style={`width:${wishHeight / 4.41}px;animation-delay: ${0.5 + i * 0.1}s`}
			>
				<div class="new">new</div>
				<div class="item-body">
					<div class="item-content">
						<i class="gi-primo-star primo1" />
						<i class="gi-primo-star primo2" />
						<i class="gi-primo-star primo3" />
						<div class="pic">
							{#if type === 'weapon'}
								<img
									src="./assets/images/weapons/{weaponType}/{rarity}star/{name}.webp"
									alt={name}
									class="wishpic {weaponType}-item"
									{style}
								/>
							{:else}
								<img
									src="./assets/images/characters/splash-art/{rarity}star/{name}.webp"
									alt={name}
									class="wishpic"
									{style}
								/>
							{/if}

							<div class="info">
								{#if type === 'weapon'}
									<img
										src="./assets/images/utility/{weaponType}-white.svg"
										alt="{weaponType} icon"
										style="width: 60%; height: auto"
									/>
								{:else}
									<i class="gi-{vision} vision" />
								{/if}

								<div class="star">
									{#each Array(rarity) as _, i}
										<div class="i gi-star" />
									{/each}
								</div>

								<!-- <div class="masterless starglitter">
									<Icon type="starglitter" width="80%" />
									<span>10</span>
								</div>

								<div class="stella stella{rarity}">
									<img
										src="./assets/images/utility/stella-fortuna-{rarity}star.webp"
										alt="Stella Formula"
									/>
								</div> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
<div class="share">
	<span> Reward for first share : 1600 <Icon type="primogem" width="18px" /> </span>
	<button> Share </button>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-5%);
		overflow: auto;
	}
	.container::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #fff;
		animation: reveal forwards 1s;
		pointer-events: none;
	}

	.close {
		display: block;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		border-radius: 100%;
		position: fixed;
		top: 10px;
		right: 10px;
		font-size: 1.5rem;
		line-height: 1rem;
		z-index: 10;
		opacity: 0;
		animation: fadeIn forwards 1s;
	}

	:global(.mobile) .close {
		transform: scale(0.7);
	}

	.wishlist {
		display: block;
		height: 40vw;
		max-height: 75vh;
		min-height: 50vh;
		width: 100%;
		padding: 0 20px;
		white-space: nowrap;
		text-align: center;
	}
	.item {
		height: 100%;
		display: inline-block;
		border-radius: 100%;
		filter: drop-shadow(0px 0px 6px rgb(101, 187, 246));
		position: relative;
		transform: scale(0);
		animation: wishReveal forwards 1s;
	}
	.item::before {
		content: '';
		width: 100%;
		height: 97%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 100%;
		/* filter: drop-shadow(0 0 10px rgb(249, 121, 2)); */
		background-image: linear-gradient(to bottom, #aac8f1, #fff, #aac8f1);
	}
	.star5.item::before {
		box-shadow: 0 0 7px rgb(255, 255, 255), 0 0 10px rgb(249, 170, 2), 0 0 21px rgb(249, 170, 2),
			0 0 35px rgb(249, 121, 2);
	}
	.star5 .item-body {
		background-image: linear-gradient(
			to bottom,
			rgb(249, 170, 2),
			rgb(255, 255, 255),
			rgb(249, 170, 2)
		);
	}

	.star4.item::before {
		box-shadow: 0 0 7px rgb(255, 255, 255), 0 0 10px rgb(255, 255, 255), 0 0 21px rgb(156, 39, 176),
			0 0 35px rgb(70, 57, 190);
	}
	.star4 .item-body {
		background-image: linear-gradient(
			to bottom,
			rgb(196, 77, 218),
			rgb(255, 255, 255),
			rgb(196, 77, 218)
		);
	}

	.new {
		position: absolute;
		z-index: 10;
		display: block;
		top: 3%;
		left: 80%;
		transform: translateX(-50%);
		padding: 0 0.4rem;
		border-radius: 4px 0 4px 0;
		color: #fffa66;
		background-color: #c3882a;
		border: 1px solid #fffa66;
		font-size: 0.7rem;
	}

	.item-body {
		height: 100%;
		clip-path: url(#wishframe);
		margin: 0 0.5px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: linear-gradient(to bottom, #aac8f1, #fff, #aac8f1);
	}

	.item-content {
		width: 97%;
		height: 99%;
		clip-path: url(#wishframe);
		background-image: linear-gradient(
			to bottom,
			rgb(82, 107, 129),
			rgb(187, 197, 172),
			rgb(82, 107, 129)
		);
	}

	.pic {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.pic::after {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50%;
		background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
	}
	.pic img.wishpic {
		position: absolute;
		top: 75%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 180%;
	}

	.weapon .pic img.wishpic {
		top: 50%;
		height: 100%;
	}
	.pic > .wishpic.catalyst-item {
		height: 40% !important;
	}

	.stella {
		margin-top: 10%;
	}
	.stella,
	.masterless {
		width: 70%;
		border-radius: 10%;
		overflow: hidden;
		display: block;
		position: relative;
		margin-left: auto;
		margin-right: auto;
		box-shadow: 0 0 7px rgba(255, 255, 255, 0.7), 0 0 14px rgba(255, 255, 255, 0.5),
			0 0 21px rgba(255, 255, 255, 0.2), 0 0 42px rgba(255, 255, 255, 1);
	}
	.stella::after,
	.masterless span {
		width: 100%;
		/* height: 5px; */
		font-size: 0.6rem;
		content: '1';
		display: block;
		position: absolute;
		left: 0;
		bottom: 0;
		color: #fff;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.stella img,
	.masterless img {
		width: 80%;
		height: auto;
	}

	.stella5,
	.starglitter {
		background-image: linear-gradient(to top, #ca8937, #a47853);
	}

	.stella4 {
		background-image: linear-gradient(to top, #a47ab9, #7e78a9);
	}

	.info {
		position: absolute;
		bottom: 10%;
		text-align: center;
		width: 100%;
		z-index: 10;
	}

	.info .gi-star {
		color: #f7cf33;
		display: inline-block;
		font-size: 0.8rem;
	}
	.vision {
		font-size: 3rem;
		line-height: 1rem;
	}

	.gi-primo-star {
		color: #fff;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.primo1 {
		top: 3%;
		font-size: 0.5rem;
	}
	.primo2 {
		top: 10%;
		font-size: 1.3rem;
	}
	.primo3 {
		top: 20%;
		font-size: 0.5rem;
	}

	.share {
		display: flex;
		width: 100%;
		text-align: right;
		justify-content: flex-end;
		align-items: center;
		position: absolute;
		bottom: 5%;
		right: 8%;
		color: #fff;
		font-size: 0.8rem;
	}
	.share span {
		display: flex;
		align-items: center;
	}

	.share button {
		background-color: #d9d2c8;
		color: #000;
		border-radius: 30px;
		/* height: 20px; */
		font-size: 0.8rem;
		/* width: 70px; */
		padding: 0.3rem 2rem;
		margin-left: 10px;
	}

	@keyframes wishReveal {
		0% {
			transform: translateX(200%) scale(0);
		}
		/* 70% {
			transform: translateX(200%) scale(0.6);
		} */
		100% {
			transform: translateX(0) scale(1);
		}
	}

	@keyframes reveal {
		0% {
			opacity: 1;
		}
		20% {
			opacity: 1;
		}
		99% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
