<script>
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { viewportHeight, viewportWidth, isMobile, muted } from '$lib/store/stores';
	import { getName } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';

	// Component
	import Share from '$lib/components/utility/ShareScreenshot.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';
	import WishListResult from './WishListResult.svelte';
	import SplashLight from './SplashLight.svelte';

	export let list = [];
	export let skipSplashOneByOne = false;

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	let showWishList = false;
	let audio;
	let wishResultContainer;
	let activeIndex = 0;

	const playRevealAudio = () => {
		if ($muted) return;
		const star = list[activeIndex].rarity;
		audio.src = `/assets/sfx/reveal-${star}star.ogg`;
		audio.currentTime = 0;
		audio.play();
	};

	const getEncoded = (index) => {
		const { fateQty, fateType, vision, rarity, name, stelaFortuna } = list[index];
		return btoa(`${name}/${rarity}/${vision}/${+stelaFortuna}/${fateQty}/${fateType}`);
	};

	const showItem = (startIndex) => {
		// Single Pull
		if (list.length === 1) {
			if (startIndex === 'start') {
				playRevealAudio();
			}
			return;
		}

		// Multi Pull
		if (activeIndex > list.length - 2) {
			showWishList = true;
			return;
		}
		if (startIndex !== 'start') {
			activeIndex = activeIndex + 1;
		}
		playRevealAudio();
	};

	const dispatch = createEventDispatcher();
	const closeHandle = () => {
		dispatch('wishEnd');
		playSfx('close');
		return;
	};

	const skipHandle = () => {
		playSfx();
		skipSplashOneByOne = true;
	};

	onMount(() => {
		if (skipSplashOneByOne) return;
		showItem('start');
		wishResultContainer.addEventListener('click', showItem);
	});

	afterUpdate(() => {
		wishResultContainer?.querySelectorAll('.anim').forEach((el) => {
			el.addEventListener('animationend', () => el.classList.remove('anim'));
		});
	});
</script>

<audio bind:this={audio} />

<div class="wish-result">
	<div class="uid">WishSimulator.vercel.app</div>
	<img src="/assets/images/utility/genshin-logo.webp" alt="genshin logo" class="logo" />

	{#if showWishList || skipSplashOneByOne}
		<WishListResult {list} on:wishEnd={closeHandle} />
	{:else}
		<div class="container" bind:this={wishResultContainer}>
			{#if list.length === 1}
				<button class="close" on:click={closeHandle} in:fade={{ delay: 1500 }}>
					<i class="gi-close" />
				</button>
			{:else}
				<button class="skip" on:click|stopPropagation={skipHandle}>Skip</button>
			{/if}

			{#each list as { name, rarity, weaponType, type, vision, fateType, fateQty, stelaFortuna }, i}
				{#if activeIndex === i}
					<div class="splatter star{rarity}" style={splatterStyle}>
						<SplashLight type="in" {rarity} />

						{#if type === 'weapon'}
							<div class="splash-art anim weapon {weaponType}-parent">
								<img
									src="/assets/images/utility/bg-{weaponType}.svg"
									alt={weaponType}
									class="weaponbg"
								/>
								<img
									src="/assets/images/weapons/{weaponType}/{rarity}star/{name}.webp"
									alt={name}
									class={weaponType}
								/>
							</div>
						{:else}
							<img
								src="/assets/images/characters/splash-art/{rarity}star/{name}.webp"
								alt={name}
								class="splash-art anim"
							/>
						{/if}

						<div class="info">
							{#if vision}
								<img
									src="/assets/images/utility/icon-{vision}.svg"
									alt="Vision {vision}"
									class="anim vision vision-{vision}"
								/>
							{:else}
								<i class="anim elemen gi-{weaponType}" />
							{/if}
							<div class="name">
								<div class="text anim">
									{getName(name)}
								</div>
								<div class="star">
									{#each Array(rarity) as _, i (i)}
										<i class="gi-star anim" style="animation-delay: {2 + i * 0.15}s" />
									{/each}
								</div>
							</div>

							<div class="bonus anim">
								{#if stelaFortuna}
									<div class="stella stella{rarity}">
										<img
											src="/assets/images/utility/stella-fortuna-{rarity}star.webp"
											alt="Stella Formula"
										/>
									</div>
								{/if}

								{#if type === 'character' && fateType}
									<div class="masterless starglitter">
										<Icon type="starglitter" width="80%" />
										<span> {fateQty} </span>
									</div>
								{/if}
							</div>
						</div>

						{#if type === 'weapon' && fateQty > 1}
							<div class="starfate {fateType}">
								<div class="icon">
									<Icon type={fateType} width={isMobile ? '50px' : '60px'} />
								</div>
								<div class="text">
									<span>Extra</span>
									Masterless {fateType}
									<br /> x{fateQty}
								</div>
							</div>
						{/if}

						<SplashLight type="out" {rarity} />
					</div>
				{/if}
			{/each}

			{#if list[activeIndex].type === 'character'}
				<div class="share">
					<Share page="chars" encodedData={getEncoded(activeIndex)} />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		border-radius: 100%;
		position: fixed;
		top: 15px;
		right: 3%;
		width: 35px;
		height: 35px;
		line-height: 0;
		z-index: 10;
	}

	@media screen and (max-width: 900px) {
		.close {
			width: 2.5rem;
			height: 2.5rem;
			margin: 3px;
		}
	}

	:global(.mobile) .close {
		width: 2rem;
		height: 2rem;
	}

	.skip {
		position: absolute;
		top: 2%;
		right: 2%;
		color: #fff;
		font-size: 1.5rem;
		z-index: 10;
	}

	:global(.mobile) .skip {
		font-size: 1.4rem;
		right: 1rem;
		top: 1rem;
	}

	/* Fate */
	.starfate {
		justify-content: flex-end;
		right: 0;
		transform: translateY(-50%);
		text-transform: capitalize;
	}
	.starfate > .icon {
		margin-right: -25px;
		position: relative;
		z-index: +1;
		opacity: 0;
		transform: scale(1);
		animation-delay: 1.3s !important;
		animation: starfateIcon forwards 0.4s 1;
	}
	.starfate.starglitter :global(img) {
		filter: drop-shadow(0 0 6px rgba(245, 193, 63, 1));
	}
	.starglitter .text {
		background-image: linear-gradient(to right, rgba(245, 193, 63, 0.9), rgba(245, 193, 63, 0.1));
		color: rgb(255, 255, 77);
	}
	.starfate.stardust :global(img) {
		filter: drop-shadow(0 0 6px rgba(221, 203, 245, 1));
	}
	.stardust .text {
		background-image: linear-gradient(to right, rgba(104, 47, 173, 0.9), rgba(104, 47, 173, 0.1));
		color: rgb(198, 130, 214);
	}
	.starfate .text {
		width: 330px;
		max-width: 50%;
		padding: 2px 25px;
		position: relative;
		z-index: -1;
		opacity: 0;
		animation-delay: 1.3s !important;
		animation: starfateText forwards 0.7s 1;
	}
	:global(.mobile) .starfate .text {
		width: 230px;
	}
	.starfate span {
		color: #ddd;
		position: absolute;
		top: -45%;
		left: 25px;
		font-size: smaller;
	}

	/* Infoemation */
	.info,
	.starfate {
		position: fixed;
		top: 60%;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		width: 1200px;
		max-width: 95%;
	}
	.info {
		left: 50%;
		transform: translate(-50%, -50%);
	}

	:global(.mobile) .info {
		max-width: 83%;
	}
	.name {
		position: relative;
		z-index: +2;
		width: 100%;
	}

	.name .text.anim {
		animation-delay: 1.3s !important;
		animation: revealName forwards 0.8s 1;
		opacity: 0;
		transform: translateX(20px);
	}
	.name .text {
		max-width: 38%;
		font-size: 2.5em;
		line-height: 1.2em;
		color: #fff;
		-webkit-text-stroke: 0.04rem #000;
	}
	.info i.elemen {
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 5.2em;
	}
	.info i.elemen,
	.vision {
		margin-right: -7px;
		margin-top: -5px;
		position: relative;
		z-index: -2;
	}
	.info i.elemen,
	.vision.anim {
		opacity: 0;
		animation-delay: 1.2s !important;
		animation: revealIcon forwards 1.3s 1;
	}
	.vision {
		width: 4rem;
	}

	.gi-star {
		color: #f7cf33;
		font-size: 1.525em;
		display: inline-block;
	}
	.gi-star.anim {
		opacity: 0;
		transform: scale(5);
		animation: revealStar forwards 0.4s 1;
	}

	.gi-polearm,
	.gi-bow,
	.gi-bow,
	.gi-claymore,
	.gi-sword,
	.gi-catalyst {
		background-image: linear-gradient(to right, #585a66, #bed0d4, #585a66);
		margin-top: -25px !important;
	}

	.wish-result {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 998;
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		background-image: url('/assets/images/background/splash-background.webp');
		background-size: cover;
	}
	.container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.splatter {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.splash-art {
		height: 120%;
		transform: scale(1) translate(2%, 0);
	}
	.splash-art.anim {
		filter: brightness(0);
		animation: splashart forwards 1.5s 1;
	}

	.splash-art.weapon {
		height: 100%;
		width: 100%;
		position: relative;
	}
	.splash-art.weapon img {
		height: 120%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.splash-art.weapon img.weaponbg {
		height: 80%;
	}
	.splash-art.weapon.anim img.weaponbg {
		opacity: 0;
		animation: weaponbg forwards 1.5s 1;
	}

	.anim .bow,
	.anim .polearm,
	.anim .sword,
	.anim .claymore,
	.anim .catalyst {
		animation: weaponShadow forwards 0.1s 1;
		animation-delay: 1.2s;
		filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
	}

	.bow,
	.polearm,
	.sword,
	.claymore,
	.catalyst {
		filter: drop-shadow(0.7rem 0.6rem 0.2rem rgba(0, 0, 0, 0.7));
	}

	.bow {
		height: 100%;
	}

	.claymore {
		height: 105% !important;
	}

	.catalyst-parent .weaponbg {
		height: 100% !important;
	}
	.catalyst {
		height: 45% !important;
	}

	.polearm {
		top: 65% !important;
		left: 48% !important;
		height: 130% !important;
	}

	.sword-parent .weaponbg {
		height: 60% !important;
	}

	.bonus {
		position: absolute;
		display: flex;
		bottom: -25vh;
		left: 50%;
		transform: translateX(-50%);
	}
	.bonus.anim {
		opacity: 0;
		animation: weaponbg forwards 1.5s 1;
	}
	.stella,
	.bonus .masterless {
		width: 3.5rem;
		border-radius: 10%;
		overflow: hidden;
		display: block;
		text-align: center;
		position: relative;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		padding-bottom: 0.5rem;
		box-shadow: 0 0 7px rgba(255, 255, 255, 0.5), 0 0 14px rgba(255, 255, 255, 0.3),
			0 0 30px rgba(255, 255, 255, 0.2);
	}
	.stella::after,
	.bonus .masterless span {
		width: 100%;
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
	.bonus .masterless img {
		width: 80%;
		height: auto;
	}

	.stella5,
	.bonus .starglitter {
		background-image: linear-gradient(to top, #ca8937, #a47853);
	}

	.stella4 {
		background-image: linear-gradient(to top, #a47ab9, #7e78a9);
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
	.share.anim {
		opacity: 0;
		animation: weaponbg forwards 1.5s 1;
	}

	:global(.preview) .uid {
		position: fixed;
		left: 1rem;
		bottom: 1rem;
		display: block !important;
		color: #fff;
		text-shadow: 0 0 1.5px rgba(0, 0, 0, 0.7);
	}
	.logo,
	.uid {
		display: none;
		transition: all 0.1.5s;
		z-index: 999;
		pointer-events: none;
	}
	:global(.preview) .logo {
		display: block;
		width: 30vh;
		max-width: 30%;
		position: fixed;
		bottom: 0px;
		right: 5px;
	}

	@keyframes revealIcon {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes revealName {
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes revealStar {
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes starfateIcon {
		30% {
			transform: scale(1.5);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes starfateText {
		0% {
			transform: translateX(-10px);
			opacity: 0;
		}
		100% {
			transform: translateX(0px);
			opacity: 1;
		}
	}

	@keyframes splashart {
		0% {
			transform: scale(5) translate(0, -10%);
			opacity: 0;
		}

		20% {
			transform: scale(1);
			opacity: 1;
		}
		75% {
			transform: scale(1);
			filter: brightness(0);
		}
		95% {
			transform: scale(1) translate(2%, 0);
			opacity: 1;
			filter: brightness(1);
		}
		100% {
			transform: scale(1) translate(2%, 0);
			filter: brightness(1);
		}
	}

	@keyframes weaponbg {
		80% {
			opacity: 0;
		}
		85% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes weaponShadow {
		to {
			filter: drop-shadow(0.7rem 0.6rem 0.2rem rgba(0, 0, 0, 0.7));
		}
	}
</style>
