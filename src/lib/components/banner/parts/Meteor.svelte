<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		primogem,
		isAcquaintUsed,
		acquaint,
		intertwined,
		bannerList,
		bannerActive
	} from '$lib/store/stores';
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import { localBalance } from '$lib/store/localstore';

	export let showMeteor = false;
	export let meteorStar = 3;
	export let singleMeteor = true;
	export let showConvertPopup = false;
	export let rollCount = 0;

	let v3star;
	let v4starSingle;
	let v4star;
	let v5starSingle;
	let v5star;

	const dispatch = createEventDispatcher();
	$: balance = $isAcquaintUsed ? $acquaint : $intertwined;
	$: isBeginner = $bannerList[$bannerActive]?.type === 'beginner';
	$: balanceNeededToRoll = (isBeginner && rollCount > 1 ? 8 : rollCount) - balance;
	$: popupButton = $primogem < balanceNeededToRoll * 160 ? 'cancel' : 'all';
	$: fateType = $isAcquaintUsed ? 'Acquaint' : 'Intertwined';

	const closeExchangePopup = () => {
		dispatch('cancelPopup');
	};

	const handleExchangePopup = async () => {
		const promise = new Promise((resolve, reject) => {
			if ($primogem < balanceNeededToRoll * 160) return reject('not enough primogem');
			primogem.update((n) => {
				const q = n - balanceNeededToRoll * 160;
				localBalance.set('primogem', q);
				return q;
			});

			if ($isAcquaintUsed) {
				acquaint.update((n) => {
					const q = n + balanceNeededToRoll;
					localBalance.set('acquaint', q);
					resolve('ok');
					return q;
				});
				return;
			}

			intertwined.update((n) => {
				const q = n + balanceNeededToRoll;
				localBalance.set('intertwined', q);
				resolve('ok');
				return q;
			});
		});
		await promise;
		dispatch('confirmPopup');
	};

	const skip = () => {
		[v3star, v4starSingle, v4star, v5starSingle, v5star].forEach((video) => {
			video.pause();
			video.currentTime = 0;
			video.style.display = 'none';
			dispatch('endAnimation');
		});
	};

	const showVideoHandle = (rarity, single = true) => {
		if (single) {
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

	onMount(() => {
		[v3star, v4starSingle, v4star, v5starSingle, v5star].forEach((video) => {
			video.addEventListener('ended', () => {
				video.style.display = 'none';
				video.currentTime = 0;
				dispatch('endAnimation');
			});
		});
	});

	$: if (showMeteor) showVideoHandle(meteorStar, singleMeteor);
</script>

<PopUp
	title="Paimon Bargains"
	sfx={false}
	button={popupButton}
	show={showConvertPopup}
	on:cancel={closeExchangePopup}
	on:confirm={handleExchangePopup}
>
	<div class="exchange">
		<div>
			An Aditional <span class="yellow">{balanceNeededToRoll}</span>
			{fateType}
			Fate are needed. <br />
			Purchase with
			<span class="yellow" class:red={$primogem < balanceNeededToRoll * 160}>
				{balanceNeededToRoll * 160}
			</span>
			Primogem ?

			{#if $primogem < balanceNeededToRoll * 160}
				<br />
				<br />
				<span class="red">Infsufficient Funds</span>
			{/if}
		</div>
	</div>
</PopUp>

<div class="wish-output" class:show={showMeteor}>
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
</style>
