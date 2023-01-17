<script>
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t, locale } from 'svelte-i18n';
	import {
		viewportHeight,
		viewportWidth,
		isMobile,
		muted,
		assets,
		animeoff
	} from '$lib/store/stores';
	import { localOutfits } from '$lib/store/localstore';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { getName } from '$lib/helpers/nameText';
	import { checkActiveOutfit } from '$lib/helpers/outfit';

	// Component
	import Share from '$lib/components/utility/ShareScreenshot.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';
	import WishListResult from './WishListResult.svelte';
	import SplashLight from './_parts/_splashlight.svelte';

	export let list = [];
	export let skipSplashOneByOne = false;
	export let outfitName = '';
	export let outfitOwner = '';

	const lc = $locale?.toLowerCase() || '';
	const isYuanshen = lc.includes('cn') || lc.includes('ja');

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;
	let splashBG = outfitName ? $assets['outfit-background.webp'] : $assets['splash-background.webp'];

	const inTransition = (node, args) => {
		return args.animeoff ? fade(node, { duration: 500, delay: 200 }) : null;
	};

	const setOutfitToList = (arr) => {
		const check = checkActiveOutfit(arr.name);
		if (!check) return arr;
		const { wishBoxPosition, name } = check;
		arr.outfit = name;
		arr.outfitOffset = wishBoxPosition;
		return arr;
	};

	list = list.map(setOutfitToList);

	let showWishList = false;
	let wishResultContainer;
	let activeIndex = 0;

	let isSplashOut = false;
	let timer;
	const startTimer = () => {
		clearTimeout(timer);
		isSplashOut = false;
		timer = setTimeout(() => {
			isSplashOut = true;
			clearTimeout(timer);
		}, 1100);
	};

	const playRevealAudio = () => {
		startTimer();
		if ($muted) return;
		if (activeIndex > 0) {
			const starBefore = list[activeIndex - 1].rarity;
			playSfx(`reveal${starBefore}Star`, { paused: true });
		}
		const star = list[activeIndex].rarity;
		playSfx(`reveal${star}Star`);
	};

	const getEncoded = (index) => {
		const { fateQty, fateType, vision, rarity, name, stelaFortuna, outfit } = list[index];
		return btoa(`${name}/${rarity}/${vision}/${+stelaFortuna}/${fateQty}/${fateType}/${outfit}`);
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

	const setOutfit = () => {
		const { outfitName } = list[0];
		localOutfits.set(outfitName, true);
	};

	onMount(() => {
		if (outfitName) setOutfit();
		if (skipSplashOneByOne) return;
		showItem('start');
		wishResultContainer.addEventListener('click', showItem);
	});

	afterUpdate(() => {
		wishResultContainer?.querySelectorAll('.anim').forEach((el) => {
			if ($animeoff) return el.classList.remove('anim');
			el.addEventListener('animationend', () => el.classList.remove('anim'));
		});
	});
</script>

<div class="wish-result" style="background-image: url({splashBG});">
	<div class="uid">WishSimulator.App</div>
	<img
		src={$assets[`genshin-logo${isYuanshen ? '-cn' : ''}.webp`]}
		alt="genshin logo"
		class="logo"
		class:cn={isYuanshen}
	/>

	{#if showWishList || skipSplashOneByOne}
		<WishListResult {list} on:wishEnd={closeHandle} />
	{:else}
		<div
			class="container"
			bind:this={wishResultContainer}
			in:inTransition={{ animeoff: $animeoff }}
		>
			{#if list.length === 1}
				<button class="close" on:click={closeHandle} in:fade={{ delay: 1500 }}>
					<i class="gi-close" />
				</button>
			{:else}
				<button class="skip" on:click|stopPropagation={skipHandle}>
					{$t('wish.result.skip')} <i class="gi-caret-up" />
				</button>
			{/if}

			{#each list as { name, rarity, weaponType, type, vision, fateType, fateQty, stelaFortuna, outfit }, i}
				{#if activeIndex === i}
					<div class="splatter star{rarity}" style={splatterStyle}>
						{#if !isSplashOut && !$animeoff} <SplashLight type="in" {rarity} /> {/if}
						<!-- <img src={$assets[`splatter-${rarity}star.svg`]} alt="splatter" class="anim sprite" /> -->

						{#if type === 'weapon'}
							<div class="splash-art anim weapon {weaponType}-parent">
								<img src={$assets[`bg-${weaponType}.webp`]} alt={weaponType} class="weaponbg" />
								<img
									src={$assets[name]}
									alt={name}
									class={weaponType}
									on:error={(e) => e.target.remove()}
								/>
							</div>
						{:else if outfitName}
							<img
								src={$assets[`splash-art/${outfitName}`]}
								alt={name}
								class="splash-art anim"
								on:error={(e) => e.target.remove()}
								crossorigin="anonymous"
							/>
						{:else}
							<img
								src={$assets[`splash-art/${outfit || name}`]}
								alt={name}
								class="splash-art anim"
								on:error={(e) => e.target.remove()}
								crossorigin="anonymous"
							/>
						{/if}

						<div class="info">
							{#if vision}
								<img
									src={$assets[`icon-${vision}.svg`]}
									alt="Vision {vision}"
									class="anim vision {vision}"
								/>
							{:else}
								<i class="anim elemen gi-{weaponType}" />
							{/if}
							<div class="name">
								{#if outfitName}
									<span class="anim"> {$t('outfit.obtained')} </span>
								{/if}
								<div class="text anim">
									{#if outfitName}
										{$t(`outfit.item.${outfitName}.name`)}
									{:else if type === 'weapon'}
										{$t(name)}
									{:else}
										{$t(`${name}.name`)}
									{/if}
								</div>
								<div class="star">
									{#each Array(rarity) as _, i (i)}
										<i class="gi-star anim" style="animation-delay: {2 + i * 0.15}s" />
									{/each}
								</div>
								{#if outfitName}
									<span class="anim">
										{$t('outfit.unlocked', {
											values: { character: $t(`${outfitOwner}.name`) }
										})}</span
									>
								{/if}
							</div>

							<div class="bonus anim">
								{#if stelaFortuna}
									<div class="stella stella{rarity}">
										<img src={$assets[`stella-fortuna-${rarity}star.webp`]} alt="Stella Formula" />
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
							<div class="starfate anim {fateType}">
								<div class="icon">
									<Icon type={fateType} width={isMobile ? '50px' : '60px'} />
								</div>
								<div class="text">
									<span>{$t('extra')}</span>
									{$t(`shop.item.${fateType}`)}
									<br /> x{fateQty}
								</div>
							</div>
						{/if}

						{#if isSplashOut && !$animeoff} <SplashLight type="out" {rarity} /> {/if}
					</div>
				{/if}
			{/each}

			{#if list[activeIndex].type === 'character'}
				<div class="share">
					<Share
						page="chars"
						encodedData={getEncoded(activeIndex)}
						item={getName(list[activeIndex].name)}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.close {
		position: fixed;
		top: 15px;
		right: 3%;
		z-index: 10;
	}

	:global(.mobile) .close {
		top: 0.3rem;
		right: 6%;
	}

	.skip {
		position: absolute;
		top: 2%;
		right: 2%;
		color: #fff;
		font-size: 1.2rem;
		z-index: 10;
	}

	.gi-caret-up {
		display: inline-block;
		transform: rotate(90deg) translateX(-0.1rem);
		vertical-align: middle;
		margin-left: -0.5em;
	}

	:global(.mobile) .skip {
		font-size: 0.8rem;
		right: 5%;
		top: 0.5rem;
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
		transform: scale(1);
		animation-delay: 1.3s !important;
	}
	.starfate.anim > .icon {
		animation: starfateIcon forwards 0.4s 1;
		opacity: 0;
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
		animation-delay: 1.3s !important;
	}

	.starfate.anim .text {
		opacity: 0;
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

	.name span {
		color: rgba(255, 255, 255, 0.9);
		padding: 0.2% 0 0.5%;
		display: block;
	}
	.name span.anim {
		animation-delay: 2s !important;
		animation: revealName forwards 0.8s 1;
		opacity: 0;
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

	:global(.zh-CN) .name .text,
	:global(.ja-JP) .name .text {
		font-size: 3.5em;
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
	.info i.elemen.anim,
	.vision.anim {
		opacity: 0;
		animation-delay: 1.2s !important;
		animation: revealIcon forwards 1.3s 1;
	}

	.vision {
		height: 5rem;
	}

	:global(.mobile) .vision {
		height: 4rem;
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
		height: 100%;
		background-color: #fff;
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

	/* .sprite {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		transform-origin: 0 0;
		width: 140%;
		height: auto;
		animation-delay: 0.25s;
	}

	.sprite.anim {
		animation: sprite forwards linear 1.3s 1;
	} */

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
		filter: brightness(0) opacity(0);
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
		height: 85%;
	}
	.splash-art.weapon.anim img.weaponbg {
		opacity: 0;
		animation: weaponbg forwards 1.5s 1;
	}

	.bow-parent .weaponbg {
		height: 90% !important;
		transform: translate(-53%, -50%) !important;
	}
	.catalyst-parent .weaponbg {
		height: 90% !important;
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
		filter: drop-shadow(0.6rem 0.6rem 0.05rem rgb(0, 0, 0));
	}

	.bow {
		height: 100%;
	}

	.claymore {
		height: 105% !important;
	}

	.catalyst {
		height: 40% !important;
	}

	.polearm {
		top: 65% !important;
		left: 48% !important;
		height: 130% !important;
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
		z-index: 999;
	}
	.share.anim {
		opacity: 0;
		animation: weaponbg forwards 1.5s 1;
	}

	.shr span {
		display: inline-flex;
		align-items: center;
		-webkit-text-stroke: 0.02rem #000;
	}

	button:active {
		transform: scale(0.9);
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
		right: 2rem;
	}

	.logo.cn {
		max-height: 20vh;
		width: 20vh;
	}

	/* @keyframes sprite {
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
		74% {
			transform: scale(0.3) translate(-50%, -50%);
			opacity: 0;
		}
		87% {
			transform: scale(0.66) translate(-50%, -50%);
			opacity: 1;
			z-index: 10;
		}
		100% {
			transform: scale(1.5) translate(-50%, -50%);
			opacity: 0;
		}
	} */

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
			filter: opacity(0) brightness(0);
		}

		20% {
			transform: scale(1);
			filter: opacity(1) brightness(0);
		}
		75% {
			transform: scale(1);
			filter: brightness(0) opacity(1);
		}
		95% {
			transform: scale(1) translate(2%, 0);
			filter: brightness(1) opacity(1);
		}
		100% {
			transform: scale(1) translate(2%, 0);
			filter: brightness(1) opacity(1);
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
