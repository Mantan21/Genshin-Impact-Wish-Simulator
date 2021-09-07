<script>
	import { onMount } from 'svelte';
	import {
		viewportHeight,
		viewportWidth,
		isMobile,
		showWish,
		wishes,
		backsound
	} from '$lib/store/stores';
	import { getName } from '$lib/functions/nameText';
	import Icon from '$lib/utility/Icon.svelte';
	import WishListResult from './WishListResult.svelte';
	import weapons from '$lib/setup/weapons.json';
	import chars from '$lib/setup/characters.json';

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	const wish = $wishes.map((w) => {
		if (w.type === 'weapon') {
			w.weaponType = weapons[`star${w.rarity}`][w.name].type;
			w.style = weapons[`star${w.rarity}`][w.name].style || '';
		}
		if (w.type === 'character') {
			w.vision = chars[`star${w.rarity}`][w.name].vision;
			w.style = chars[`star${w.rarity}`][w.name].style || '';
		}
		return w;
	});

	wishes.set(wish);

	let showWishList = false; //false
	let audio;
	let wishResult;
	let activeIndex = 0;

	const playAudio = () => {
		const star = wish[activeIndex].rarity;
		audio.src = `/assets/sfx/reveal-${star}star.ogg`;
		audio.currentTime = 0;
		audio.play();
	};

	const showItem = (startIndex) => {
		// Single Pull
		if (wish.length === 1 && startIndex === 'start') {
			playAudio();
			return;
		}

		// Multi Pull
		if (activeIndex > wish.length - 2) {
			if (wish.length < 2) {
				showWish.set(false);
				const buttonSfx = document.querySelector('#button-sfx');
				buttonSfx.currentTime = 0;
				buttonSfx.play();
				backsound.set(true);
				return;
			}
			showWishList = true;
			return;
		}
		if (startIndex !== 'start') {
			activeIndex = activeIndex + 1;
		}
		playAudio();
	};

	onMount(() => {
		showItem('start');
		wishResult.addEventListener('click', showItem);
	});
</script>

<audio bind:this={audio} />

<div class="wish-result">
	{#if showWishList}
		<WishListResult />
	{:else}
		<div class="container" bind:this={wishResult}>
			{#each wish as { name, rarity, weaponType, type, vision, fateType, fateQty }, i}
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
							<i class="elemen gi-{vision || weaponType}" />
							<div class="name">
								<div class="text">
									{getName(name)}
								</div>
								<div class="star">
									{#each Array(rarity) as _, i (i)}
										<i class="gi-star" style={`animation-delay: ${2.3 + i * 0.15}s`} />
									{/each}
								</div>
							</div>
						</div>

						{#if type === 'weapon'}
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

			{#if wish.length === 1 || wish[activeIndex].type === 'character'}
				<div class="share">
					<span> Reward for first share : 1600 <Icon type="primogem" width="18px" /> </span>
					<button> Share </button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
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
		animation-delay: 1.5s !important;
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
		animation-delay: 1.5s !important;
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
		/* transform: translateX(-50%); */
		font-size: smaller;
	}

	/* Infoemation */
	.info,
	.starfate {
		position: fixed;
		top: 60%;
		z-index: 10;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		width: 1100px;
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
		animation-delay: 1.5s !important;
		animation: revealName forwards 1s;
		max-width: 38%;
		font-size: 2.5em;
		line-height: 1.2em;
		opacity: 0;
		color: #fff;
		-webkit-text-stroke: 0.2px #000;
	}
	.info i.elemen {
		font-size: 5.2em;
		margin-right: -7px;
		margin-top: -5px;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		z-index: -2;
		opacity: 0;
		animation-delay: 1.5s !important;
		animation: revealIcon forwards 1.5s;
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
		animation-delay: 0.3s;
		animation: sprite forwards linear 1.8s;
	}

	.splash-art {
		height: 120%;
		filter: brightness(0);
		animation: splashart forwards 2s;
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
		animation: weaponbg forwards 2s;
	}

	.bow,
	.polearm,
	.sword,
	.claymore,
	.catalyst {
		animation: weaponShadow forwards 0.1s;
		animation-delay: 1.5s;
	}

	.bow {
		height: 100%;
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
		animation: orbs forwards 1s;
		width: 300%;
		height: 300%;
	}

	.orb2 {
		width: 180%;
		height: 180%;
		animation: orbs forwards 1.5s;
	}

	.orb3 {
		animation: orbs forwards 1.8s;
		width: 80%;
		height: 80%;
	}

	.orb4 {
		width: 120%;
		height: 120%;
		animation: orbs forwards 1s;
	}

	.orb5 {
		top: unset;
		transform: translateX(-50%);
		bottom: -40%;
		width: 160vw;
		height: 70%;
		animation: orbs2 forwards 1.5s;
	}

	.out1 {
		width: 50%;
		height: 50%;
		background-color: rgb(254 133 63 / 5%);
		animation: outOrbs forwards 1s;
		animation-delay: 1.5s;
	}

	.out2 {
		width: 100%;
		height: 100%;
		animation: outOrbs forwards 1.5s;
		animation-delay: 1.5s;
	}

	.out3 {
		width: 150%;
		height: 150%;
		animation-delay: 1.5s;
		animation: outOrbs forwards 1.5s;
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

		40% {
			transform: scale(1);
			opacity: 1;
			filter: brightness(0);
		}
		70% {
			transform: scale(1);
			opacity: 1;
			filter: brightness(0);
		}
		90% {
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
