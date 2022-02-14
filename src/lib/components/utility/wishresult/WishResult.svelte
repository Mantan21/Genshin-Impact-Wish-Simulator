<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { viewportHeight, viewportWidth, isMobile } from '$lib/store/stores';
	import { getName } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';

	// Component
	import Share from '$lib/components/utility/ShareScreenshot.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';
	import WishListResult from './WishListResult.svelte';

	export let list = [];

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	let showWishList = false;
	let audio;
	let wishResultContainer;
	let activeIndex = 0;

	const playRevealAudio = () => {
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

	onMount(() => {
		showItem('start');
		wishResultContainer.addEventListener('click', showItem);
	});
</script>

<audio bind:this={audio} />

<div class="wish-result">
	<div class="uid">WishSimulator.vercel.app</div>
	<img src="/assets/images/utility/genshin-logo.webp" alt="genshin logo" class="logo" />

	{#if showWishList}
		<WishListResult {list} on:wishEnd={closeHandle} />
	{:else}
		<div class="container" bind:this={wishResultContainer}>
			{#if list.length === 1}
				<button class="close" on:click={closeHandle}>
					<i class="gi-close" />
				</button>
			{/if}

			{#each list as { name, rarity, weaponType, type, vision, fateType, fateQty, stelaFortuna }, i}
				{#if activeIndex === i}
					<div class="splatter star{rarity}" style={splatterStyle}>
						<div class="orbs orb5" />
						<div class="orbs orb1" />
						<div class="orbs orb2" />
						<div class="orbs orb3" />
						<div class="orbs orb4" />
						<img
							src="/assets/images/utility/splatter-{rarity}star.svg"
							alt="splatter"
							class="sprite"
						/>

						{#if type === 'weapon'}
							<div class="splash-art weapon {weaponType}-parent">
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
								class="splash-art"
							/>
						{/if}

						<div class="info">
							{#if vision}
								<img
									src="/assets/images/utility/icon-{vision}.svg"
									alt="Vision {vision}"
									class="vision vision-{vision}"
								/>
							{:else}
								<i class="elemen gi-{weaponType}" />
							{/if}
							<div class="name">
								<div class="text">
									{getName(name)}
								</div>
								<div class="star">
									{#each Array(rarity) as _, i (i)}
										<i class="gi-star" style={`animation-delay: ${2 + i * 0.15}s`} />
									{/each}
								</div>
							</div>

							<div class="bonus">
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

						<div class="orbs out1" />
						<div class="orbs out2" />
						<div class="orbs out3" />
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
		line-height: 0;
		z-index: 10;
		opacity: 0;
		animation: weaponbg forwards 1.5s;
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
		animation-delay: 1.3s !important;
		animation: starfateIcon forwards 0.4s;
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
		animation: starfateText forwards 0.7s;
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

	.name .text {
		animation-delay: 1.3s !important;
		animation: revealName forwards 0.8s;
		max-width: 38%;
		font-size: 2.5em;
		line-height: 1.2em;
		opacity: 0;
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
		opacity: 0;
		animation-delay: 1.2s !important;
		animation: revealIcon forwards 1.3s;
	}
	.vision {
		width: 4rem;
	}

	.gi-star {
		color: #f7cf33;
		font-size: 1.525em;
		display: inline-block;
		opacity: 0;
		animation: revealStar forwards 0.4s;
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

	.sprite {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transform-origin: 0 0;
		width: 140%;
		height: auto;
		animation-delay: 0.25s;
		animation: sprite forwards linear 1.3s;
	}

	.splash-art {
		height: 120%;
		filter: brightness(0);
		animation: splashart forwards 1.5s;
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
		opacity: 0;
		animation: weaponbg forwards 1.5s;
	}

	.bow,
	.polearm,
	.sword,
	.claymore,
	.catalyst {
		animation: weaponShadow forwards 0.1s;
		animation-delay: 1.2s;
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

	/* Light */
	.orbs {
		background-color: transparent;
		border-radius: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transform-origin: 0 0;
		opacity: 0;
	}
	.orb1 {
		animation: orbs forwards 0.7s;
		width: 300%;
		height: 300%;
	}

	.orb2 {
		width: 180%;
		height: 180%;
		animation: orbs forwards 1.2s;
	}

	.orb3 {
		animation: orbs forwards 1.4s;
		width: 80%;
		height: 80%;
	}

	.orb4 {
		width: 120%;
		height: 120%;
		animation: orbs forwards 0.75s;
	}

	.orb5 {
		top: unset;
		transform: translateX(-50%);
		bottom: -40%;
		width: 160vw;
		height: 70%;
		animation: orbs2 forwards 1s;
	}

	.out1 {
		width: 50%;
		height: 50%;
		background-color: rgb(254 133 63 / 5%);
		animation: outOrbs forwards 0.8s;
		animation-delay: 1s;
	}

	.out2 {
		width: 100%;
		height: 100%;
		animation: outOrbs forwards 1.2s;
		animation-delay: 1s;
	}

	.out3 {
		width: 150%;
		height: 150%;
		animation-delay: 0.78s;
		animation: outOrbs forwards 1.2s;
		transform: scale(0) translate(-50%, -50%);
	}

	/* 5Star Color */
	.star5 .orb1 {
		background-color: rgb(254 133 63 / 5%);
		box-shadow: 0 0 50px rgb(254 133 63 / 10%), inset 0 0 70px rgb(254 133 63 / 10%);
	}
	.star5 .orb2 {
		box-shadow: 0 0 50px rgb(253 148 48 / 30%), inset 0 0 70px rgb(253 148 48 / 30%);
	}
	.star5 .orb3 {
		box-shadow: 0 0 50px rgb(251 193 60 / 50%), inset 0 0 70px rgb(251 193 60 / 0%);
		background-image: radial-gradient(rgba(251, 193, 60, 1), rgb(251, 193, 60, 0));
	}
	.star5 .orb4 {
		box-shadow: 0 0 30px rgb(253 148 48 / 10%), inset 0 0 30px rgb(253 148 48 / 10%);
	}
	.star5 .orb5 {
		background-image: radial-gradient(
			rgba(253, 148, 48, 0.5),
			rgb(253, 148, 48, 0),
			rgba(253, 148, 48, 0)
		);
	}
	.star5 .out1 {
		box-shadow: 0 0 50px rgb(251 193 60 / 50%), inset 0 0 50px rgb(251 193 60 / 50%);
	}
	.star5 .out2 {
		box-shadow: 0 0 150px rgb(255 255 255 / 50%), inset 0 0 170px rgb(255 255 255 / 50%);
	}
	.star5 .out3 {
		box-shadow: 0 0 200px rgb(253 148 48 / 60%), inset 0 0 170px rgb(253 148 48 / 60%);
	}

	/* 4 Star Color */
	.star4 .orb1 {
		background-color: rgb(156, 71, 218 / 5%);
		box-shadow: 0 0 50px rgb(156, 71, 218 / 10%), inset 0 0 70px rgb(156, 71, 218 / 10%);
	}
	.star4 .orb2 {
		box-shadow: 0 0 50px rgb(113 34 221 / 30%), inset 0 0 70px rgb(113 34 221 / 30%);
	}
	.star4 .orb3 {
		box-shadow: 0 0 50px rgb(180 47 248 / 50%), inset 0 0 70px rgb(180 47 248 / 0%);
		background-image: radial-gradient(rgba(156, 71, 218, 1), rgb(180, 47, 248, 0));
	}
	.star4 .orb4 {
		box-shadow: 0 0 30px rgb(113 34 221 / 10%), inset 0 0 30px rgb(113 34 221 / 10%);
	}
	.star4 .orb5 {
		background-image: radial-gradient(
			rgba(156, 71, 218, 0.5),
			rgb(156, 71, 218, 0),
			rgba(156, 71, 218, 0)
		);
	}
	.star4 .out1 {
		box-shadow: 0 0 50px rgb(180 47 248 / 50%), inset 0 0 50px rgb(180 47 248 / 50%);
	}
	.star4 .out2 {
		box-shadow: 0 0 150px rgb(255 255 255 / 50%), inset 0 0 170px rgb(255 255 255 / 50%);
	}
	.star4 .out3 {
		box-shadow: 0 0 200px rgb(113 34 221 / 60%), inset 0 0 170px rgb(113 34 221 / 60%);
	}

	/* 3 Star Color */
	.star3 .orb1 {
		background-color: rgb(254 133 63 / 5%);
		box-shadow: 0 0 50px rgb(254 133 63 / 10%), inset 0 0 70px rgb(254 133 63 / 10%);
	}
	.star3 .orb2 {
		box-shadow: 0 0 50px rgb(85 93 255 / 30%), inset 0 0 70px rgb(85 93 255 / 30%);
	}
	.star3 .orb3 {
		box-shadow: 0 0 50px rgb(106 128 254 / 50%), inset 0 0 70px rgb(106 128 254 / 0%);
		background-image: radial-gradient(rgba(99, 124, 205, 1), rgba(99, 124, 205, 0));
	}
	.star3 .orb4 {
		box-shadow: 0 0 30px rgb(85 93 255 / 10%), inset 0 0 30px rgb(85 93 255 / 10%);
	}
	.star3 .orb5 {
		background-image: radial-gradient(
			rgba(99, 124, 205, 0.5),
			rgba(99, 124, 205, 0),
			rgba(99, 124, 205, 0)
		);
	}
	.star3 .out1 {
		box-shadow: 0 0 50px rgb(157 217 252 / 50%), inset 0 0 50px rgb(157 217 252 / 50%);
	}
	.star3 .out2 {
		box-shadow: 0 0 150px rgb(255 255 255 / 50%), inset 0 0 170px rgb(255 255 255 / 50%);
	}
	.star3 .out3 {
		box-shadow: 0 0 200px rgb(85 93 255 / 60%), inset 0 0 170px rgb(85 93 255 / 60%);
	}
	.bonus {
		position: absolute;
		display: flex;
		bottom: -25vh;
		left: 50%;
		transform: translateX(-50%);
		animation: weaponbg forwards 1.5s;
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
		animation: weaponbg forwards 1.5s;
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
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes revealName {
		0% {
			transform: translateX(20px);
			opacity: 0;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes revealStar {
		0% {
			transform: scale(5);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes starfateIcon {
		0% {
			transform: scale(0);
			opacity: 0;
		}
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
	@keyframes orbs {
		0% {
			transform: scale(0) translate(-50%, -50%);
			opacity: 0;
		}
		90% {
			transform: scale(1) translate(-50%, -50%);
			opacity: 1;
		}
		100% {
			transform: scale(1) translate(-50%, -50%);
			opacity: 0;
		}
	}

	@keyframes orbs2 {
		0% {
			transform: scale(0) translateX(-50%);
			opacity: 1;
		}
		90% {
			transform: scale(1) translateX(-50%);
			opacity: 1;
		}
		100% {
			transform: scale(1) translateX(-50%);
			opacity: 0;
		}
	}

	@keyframes outOrbs {
		0% {
			transform: scale() translate(-50%, -50%);
			opacity: 1;
		}
		100% {
			transform: scale(3) translate(-50%, -50%);
			opacity: 0;
		}
	}

	@keyframes splashart {
		0% {
			transform: scale(5) translate(0, -10%);
			opacity: 0;
			filter: brightness(0);
		}

		20% {
			transform: scale(1);
			opacity: 1;
			filter: brightness(0);
		}
		75% {
			transform: scale(1);
			opacity: 1;
			filter: brightness(0);
		}
		95% {
			transform: scale(1) translate(2%, 0);
			opacity: 1;
			filter: brightness(1);
		}
		100% {
			transform: scale(1) translate(2%, 0);
			opacity: 1;
			filter: brightness(1);
		}
	}

	@keyframes sprite {
		0% {
			transform: scale(0) translate(-50%, -50%);
			opacity: 0;
		}
		25% {
			transform: scale(0.75) translate(-50%, -50%);
			opacity: 1;
		}
		50% {
			transform: scale(1.5) translate(-50%, -50%);
			opacity: 0;
		}
		80% {
			transform: scale(0.6) translate(-50%, -50%);
			opacity: 0;
		}
		90% {
			transform: scale(0.8) translate(-50%, -50%);
			opacity: 1;
			z-index: 10;
		}
		100% {
			transform: scale(1.5) translate(-50%, -50%);
			opacity: 0;
		}
	}

	@keyframes weaponbg {
		0% {
			opacity: 0;
		}
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
		0% {
			filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
		}
		100% {
			filter: drop-shadow(10px 8px 1px rgba(0, 0, 0, 0.7));
		}
	}
</style>
