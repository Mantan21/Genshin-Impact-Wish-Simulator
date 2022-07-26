<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import {
		primogem,
		isAcquaintUsed,
		acquaint,
		intertwined,
		bannerList,
		bannerActive,
		muted,
		viewportHeight
	} from '$lib/store/stores';
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import { localBalance } from '$lib/store/localstore';
	import Toast from '$lib/components/utility/Toast.svelte';

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
	let showToast = false;

	const dispatch = createEventDispatcher();
	$: balance = $isAcquaintUsed ? $acquaint : $intertwined;
	$: isBeginner = $bannerList[$bannerActive]?.type === 'beginner';
	$: balanceNeededToRoll = (isBeginner && rollCount > 1 ? 8 : rollCount) - balance;
	$: popupButton = $primogem < balanceNeededToRoll * 160 ? 'cancel' : 'all';
	$: fateType = $isAcquaintUsed ? 'acquaint' : 'intertwined';

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
		});
		dispatch('skiped');
	};

	const showVideoHandle = (rarity, single = true) => {
		let videoContent = v3star;
		if (single && rarity !== 3) {
			videoContent = rarity === 5 ? v5starSingle : v4starSingle;
		}
		if (!single) {
			videoContent = rarity === 5 ? v5star : v4star;
		}

		if (isNaN(videoContent.duration)) {
			showToast = true;
			console.error("Can't play Meteor Animation because it cannot be loaded");
			return dispatch('endAnimation');
		}
		videoContent.style.display = 'unset';
		return videoContent.play();
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
	title={$t('shop.paimonBargains')}
	sfx={false}
	button={popupButton}
	show={showConvertPopup}
	on:cancel={closeExchangePopup}
	on:confirm={handleExchangePopup}
>
	<div class="exchange">
		<div>
			{@html $t('shop.fateNeeded', {
				values: {
					rollQty: `<span class="yellow">${balanceNeededToRoll}</span>`,
					currency: $t(`shop.item.${fateType}`)
				}
			})}
			<br />

			{@html $t('shop.primoNeeded', {
				values: {
					primoPrice: `<span class="${$primogem < balanceNeededToRoll * 160 ? 'red' : 'yellow'}"> ${
						balanceNeededToRoll * 160
					} </span>`
				}
			})}

			{#if $primogem < balanceNeededToRoll * 160}
				<br />
				<br />
				<span class="red">{$t('shop.infsufficientFunds')}</span>
			{/if}
		</div>
	</div>
</PopUp>

{#if showToast}
	<Toast on:close={() => (showToast = false)}>{$t('wish.result.meteorFailed')}</Toast>
{/if}

<div class="wish-output" class:show={showMeteor} style="height: {$viewportHeight}px">
	<div class="video">
		<video bind:this={v3star} preload="auto" muted={$muted}>
			<source src="/assets/videos/3star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v4starSingle} preload="auto" muted={$muted}>
			<source src="/assets/videos/4star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v4star} preload="auto" muted={$muted}>
			<source src="/assets/videos/4star.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v5starSingle} preload="auto" muted={$muted}>
			<source src="/assets/videos/5star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v5star} preload="auto" muted={$muted}>
			<source src="/assets/videos/5star.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<button class="skip" on:click={skip}>{$t('wish.result.skip')} <i class="gi-caret-up" /></button>
	</div>
</div>

<style>
	.exchange :global(.red) {
		color: #de2f22 !important;
	}
	.exchange :global(.yellow) {
		color: rgb(218, 177, 45) !important;
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
	}
	.wish-output.show {
		display: block;
		background-color: #fff;
	}
	.video {
		position: relative;
		width: 100vw;
		height: 100%;
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
		right: 1rem;
		top: 1rem;
	}
	video {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
