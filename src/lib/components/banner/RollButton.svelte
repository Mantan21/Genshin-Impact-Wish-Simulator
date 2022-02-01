<script>
	import { onMount } from 'svelte';
	import {
		bannerActive,
		showWish,
		wishes,
		backsound,
		acquaint,
		intertwined,
		starglitter,
		stardust,
		primogem,
		isAcquaintUsed,
		bannerList
	} from '$lib/store/stores';
	import { myFunds } from '$lib/store/localstore';
	import roll from '$lib/functions/roll';
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';
	import playSfx from '$lib/functions/audio';

	$: fateType = $isAcquaintUsed ? 'acquaint' : 'intertwined';
	$: fateQty = $isAcquaintUsed ? $acquaint : $intertwined;

	let audio;
	let v3star;
	let v4starSingle;
	let v4star;
	let v5starSingle;
	let v5star;
	let showOutput = false;
	let showExchangePopup = false;
	let rollCount = 0;

	$: activeBanner = $bannerList[$bannerActive];
	$: bannerActiveType = activeBanner.type + (isNaN(activeBanner.index) ? '' : activeBanner.index);
	$: multiRollPrice = bannerActiveType === 'beginner' ? 8 : 10;

	const showOutputHandle = (rarity, rolltype = 'tenroll') => {
		showOutput = true;
		if (rolltype === 'single') {
			if (rarity === 5) {
				v5starSingle.style.display = 'unset';
				return v5starSingle.play();
			}
			if (rarity === 4) {
				v4starSingle.style.display = 'unset';
				return v4starSingle.play();
			}
			v3star.style.display = 'unset';
			return v3star.play();
		}

		// Multiple Roll
		if (rarity === 5) {
			v5star.style.display = 'unset';
			return v5star.play();
		}
		if (rarity === 4) {
			v4star.style.display = 'unset';
			return v4star.play();
		}
	};

	const updateFunds = (fateType, fateQty) => {
		let funds;
		if (fateType === 'starglitter') funds = starglitter;
		if (fateType === 'stardust') funds = stardust;
		if (fateType === 'acquaint') funds = acquaint;
		if (fateType === 'intertwined') funds = intertwined;
		if (!funds) return;
		funds.update((v) => {
			const q = v + fateQty;
			myFunds.set(fateType, q);
			return q;
		});
	};

	const updateFates = (banner, qty) => {
		const fateQty = banner === 'standard' || banner === 'beginner' ? $acquaint : $intertwined;
		if (fateQty < qty) {
			showExchangePopup = true;
			return false;
		}
		updateFunds(fateType, qty * -1);
		return true;
	};

	const singleRoll = async () => {
		audio.currentTime = 0;
		audio.play();
		rollCount = 1;
		if (!updateFates(bannerActiveType, 1)) return;

		backsound.set(false);
		const wish = await roll(bannerActiveType);
		wishes.set([wish]);
		showOutputHandle(wish.rarity, 'single');
		updateFunds(wish.fateType, wish.fateQty);
	};

	const tenRoll = async () => {
		audio.currentTime = 0;
		audio.play();
		rollCount = $isAcquaintUsed ? multiRollPrice - $acquaint : multiRollPrice - $intertwined;
		if (!updateFates(bannerActiveType, multiRollPrice)) return;
		backsound.set(false);

		const wishStar = [];
		const wishOutput = [];
		for (let i = 0; i < 10; i++) {
			const wish = await roll(bannerActiveType);
			wishStar.push(wish.rarity);
			wishOutput.push(wish);
			updateFunds(wish.fateType, wish.fateQty);
		}

		wishes.set(wishOutput);
		if (wishStar.includes(5)) return showOutputHandle(5);
		if (wishStar.includes(4)) return showOutputHandle(4);
		return showOutputHandle(3);
	};

	const skip = () => {
		[v3star, v4starSingle, v4star, v5starSingle, v5star].forEach((video) => {
			video.pause();
			video.currentTime = 0;
			video.style.display = 'none';
		});
		showOutput = false;
		showWish.set(true);
	};

	onMount(() => {
		[v3star, v4starSingle, v4star, v5starSingle, v5star].forEach((video) => {
			video.addEventListener('ended', () => {
				video.style.display = 'none';
				showOutput = false;
				showWish.set(true);
			});
		});
	});

	const closeExchangePopup = () => {
		showExchangePopup = false;
		playSfx();
	};

	const handleExchangePopup = () => {
		showExchangePopup = false;
		if ($primogem < rollCount * 160) return;
		primogem.update((n) => {
			const q = n - rollCount * 160;
			myFunds.set('primogem', q);
			return q;
		});

		if ($isAcquaintUsed) {
			acquaint.update((n) => {
				const q = n + rollCount;
				myFunds.set('acquaint', q);
				return q;
			});
			if (rollCount > 1 || $acquaint > 1) tenRoll();
			if (rollCount === 1) singleRoll();
			return;
		}

		intertwined.update((n) => {
			const q = n + rollCount;
			myFunds.set('intertwined', q);
			return q;
		});
		if (rollCount > 1 || $intertwined > 1) tenRoll();
		if (rollCount === 1) singleRoll();
	};

	$: popupButton = $primogem < rollCount * 160 ? 'cancel' : 'all';
</script>

<PopUp
	title="Paimon Bargains"
	sfx={false}
	button={popupButton}
	show={showExchangePopup}
	on:cancel={closeExchangePopup}
	on:confirm={handleExchangePopup}
>
	<div class="exchange">
		<div>
			An Aditional <span class="yellow">{rollCount}</span>
			{fateType}
			Fate are needed. <br />
			Purchase with
			<span class="yellow" class:red={$primogem < rollCount * 160}>
				{rollCount * 160}
			</span>
			Primogem ?

			{#if $primogem < rollCount * 160}
				<br />
				<br />
				<span class="red">Infsufficient Funds</span>
			{/if}
		</div>
	</div>
</PopUp>

<audio bind:this={audio}>
	<source src="/assets/sfx/roll-button-click.ogg" type="audio/ogg" />
</audio>

<div class="wish-output" class:show={showOutput}>
	<div class="video">
		<video bind:this={v3star} preload="auto">
			<source src="/assets/videos/3star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v4starSingle} preload="auto">
			<source src="/assets/videos/4star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v4star} preload="auto">
			<source src="/assets/videos/4star.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v5starSingle} preload="auto">
			<source src="/assets/videos/5star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v5star} preload="auto">
			<source src="/assets/videos/5star.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<button class="skip" on:click={skip}>Skip</button>
	</div>
</div>

<button class="single" on:click={singleRoll}>
	<div class="top">Wish x1</div>
	<div class="bottom">
		<Icon type={fateType} />
		<span style="margin-left: 7px"> x <span class:red={fateQty < 1}> 1 </span></span>
	</div>
</button>

<button class="ten" on:click={tenRoll}>
	<div class="top">Wish x10</div>
	<div class="bottom">
		<Icon type={fateType} />
		<span style="margin-left: 7px">
			x
			<span class:red={fateQty < multiRollPrice}> {multiRollPrice} </span>
		</span>
	</div>
</button>

<style>
	.red {
		color: #de2f22 !important;
	}
	.yellow {
		color: rgb(218, 177, 45);
	}
	.exchange {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.wish-output {
		position: fixed;
		z-index: 998;
		display: none;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
	.wish-output.show {
		display: block;
		background-color: #fff;
	}
	.video {
		position: relative;
		width: 100vw;
		height: 100vh;
	}

	.skip {
		position: absolute;
		top: 2%;
		right: 2%;
		color: #fff;
		font-size: 1.5rem;
	}

	:global(.mobile) .skip {
		font-size: 1.4rem;
		right: 1rem;
		top: 1rem;
	}

	video {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 100%;
		min-height: 100%;
		width: auto;
		height: auto;
	}

	/* Button */
	button:not(.skip) {
		background-image: url('/assets/images/utility/button.svg');
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		width: 230px;
		height: 60px;
		margin: 0 5px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #a49a90;
		transition: all 0.2s;
	}

	button:active {
		transform: scale(0.95);
	}

	button .bottom {
		display: flex;
		align-items: center;
	}

	:global(.mobile) button:not(.skip) {
		margin-right: -0.7rem !important;
		margin-left: -0.7rem !important;
		font-size: 0.75rem;
		transform: scale(0.87);
	}

	:global(.mobile .right img, .mobile .wish img) {
		transform: scale(0.7);
	}
	:global(.mobile) .bottom {
		margin-top: -3px;
	}

	@media screen and (max-width: 900px) {
		button:not(.skip) {
			width: 180px;
			height: 40px;
			margin: 0;
		}
		:global(.right img, .wish img) {
			transform: scale(0.8);
		}
	}
	@media screen and (max-width: 400px) {
		button:not(.skip) {
			width: 140px;
			height: 30px;
			margin: 0;
		}
		:global(.right img, .wish img) {
			transform: scale(0.7);
		}
		.bottom {
			margin-top: -3px;
		}
	}
</style>
