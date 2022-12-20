<script>
	import { getContext, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { toBlob } from 'html-to-image';
	import { saveAs } from 'file-saver';

	import { APP_TITLE, HOST } from '$lib/env';
	import { primogem, viewportHeight } from '$lib/store/stores';
	import { firstShare, localBalance } from '$lib/store/localstore';
	import { copy } from '$lib/helpers/nameText';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import Icon from './Icon.svelte';
	import ButtonGeneral from './ButtonGeneral.svelte';

	export let encodedData = '';
	export let page = '';
	export let item = '';

	let show = false;
	let showOnProgress = false;
	let showToast = false;
	let width = 873;
	let height = 393;
	let isFirstShare = true;
	let obtain = false;
	let btnTxt = page ? $t('share') : $t('screenshot');

	let blob;
	const featuredItem = item ? `I got ${item}` : "Wow! I'm so lucky ";
	const shareText = `${featuredItem} when pulling on Wish Simulator, how lovely!`;
	let url = '/images/meta-picture.jpg';
	$: shareLink = `${HOST}/screen/${page}?a=${encodedData}`;

	onMount(() => {
		isFirstShare = firstShare.check();
	});

	const addFunds = () => {
		if (!isFirstShare) return (obtain = false);
		primogem.update((n) => {
			const settled = n + 16000;
			localBalance.set('primogem', settled);
			return settled;
		});
		firstShare.set('yes');
		isFirstShare = false;
		obtain = true;
	};

	const filterShot = (node) => {
		const notIncluded = ['close', 'share', 'skip', 'outfit-toggle'];
		if (node.classList) return !notIncluded.some((cl) => node.classList.contains(cl));
		return true;
	};

	const takeShot = async () => {
		playSfx();
		obtain = false;
		showOnProgress = true;
		btnTxt = `${$t('waiting')}...`;
		const node = document.querySelector('.wish-result');
		node.classList.add('preview');

		blob = await toBlob(node, { filter: filterShot });
		playSfx('camera');
		url = URL.createObjectURL(blob);
		show = true;
		showOnProgress = false;
		btnTxt = page ? $t('share') : $t('screenshot');
		node.classList.remove('preview');
	};

	const saveHandler = () => {
		playSfx();
		saveAs(blob, `WishSimulator.App - ${new Date().toLocaleString()}.png`);
		addFunds();
	};

	const copyHandle = async () => {
		playSfx();
		copy(shareLink);
		showToast = true;
		const t = setTimeout(() => {
			showToast = false;
			clearTimeout(t);
		}, 2000);
		addFunds();
	};

	const facebookHandle = () => {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=${shareText}`;
		window.open(url, '_blank');
		addFunds();
	};

	const twitterHandle = () => {
		const url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareLink}`;
		window.open(url, '_blank');
		addFunds();
	};

	const webShareHandle = async () => {
		try {
			const dataToShare = {
				title: APP_TITLE,
				text: shareText,
				url: shareLink
			};
			await navigator.share(dataToShare);
			addFunds();
		} catch (e) {
			console.error('Abort Sharing', e);
		}
	};

	const showObtained = getContext('handleObtained');
	const closehandle = () => {
		playSfx('close');
		show = false;
		if (!obtain) return;
		showObtained('primogem', 16000);
	};
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#if show}
	<div
		class="screenshot"
		style="height: {$viewportHeight}px;"
		out:fade={{ duration: 200 }}
		on:click|stopPropagation
	>
		<button class="close" on:click={closehandle}>
			<i class="gi-close" />
		</button>

		<picture>
			<div class="letshare">
				{#if page}
					<div class="copy">
						<span class="text">{shareLink}</span>
						<button on:click={copyHandle}> <i class="gi-link" /> </button>
					</div>
				{/if}

				<button class="save" on:click={saveHandler}> <i class="gi-save" /> </button>

				{#if page}
					<div class="divider" />
					<button class="save" on:click={twitterHandle}>
						<i class="gi-twitter" />
					</button>
					<button class="save" on:click={facebookHandle}>
						<i class="gi-facebook" />
					</button>
					<button class="save" on:click={webShareHandle}> <i class="gi-dot-3" /> </button>
				{/if}
			</div>
			<img src={url} alt="screenshot" on:contextmenu|stopPropagation />
		</picture>

		{#if showToast}
			<div class="toast" in:fly={{ y: 10 }} out:fade>Copied to Clipboard</div>
		{/if}
	</div>
{/if}

{#if showOnProgress}
	<div class="progress" transition:fade={{ duration: 200 }}>
		<div class="row">
			<div class="loading" />
			<div class="text">{$t('capturing')} ..</div>
		</div>
	</div>
{/if}

<div class="shr">
	{#if isFirstShare && page}
		<span>
			{$t('rewardFirstShare', { values: { qty: 16000 } })}
			<Icon type="primogem" width="18px" style="margin-left: .5rem" />
		</span>
	{/if}
	<ButtonGeneral on:click={takeShot} disabled={showOnProgress}>
		{btnTxt}
	</ButtonGeneral>
</div>

<style>
	.shr {
		width: 100%;
	}
	.shr span {
		display: inline-flex;
		align-items: center;
		-webkit-text-stroke: 0.02rem #000;
	}
	button:not(.close) {
		background-color: #d9d2c8;
		color: #000;
		border-radius: 30px;
		font-size: 0.8rem;
		padding: 0.3rem 2rem;
		margin-left: 10px;
		transition: all 0.2s;
	}
	button:not(.close, .save):active {
		transform: scale(0.9);
	}

	button:active,
	button:hover {
		background-color: #fff;
	}

	.screenshot {
		width: 100vw;
		position: fixed;
		z-index: 998;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(2px);
	}
	.screenshot::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #fff;
		pointer-events: none;
		animation: flash forwards 1s;
	}

	.screenshot picture {
		width: 80%;
		max-height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		animation: scale forwards 0.6s;
		box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
	}
	.screenshot img {
		max-height: 100%;
		max-width: 100%;
	}
	.screenshot button {
		padding: 0;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0;
	}

	.letshare button {
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		padding: 0;
		border-radius: 100%;
		font-size: 1rem;
		z-index: 10;
	}

	.letshare button {
		aspect-ratio: 1 / 1;
		width: 2.2rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0;
		margin: 0 0.2rem;
		font-size: 1.3rem !important;
	}

	.divider {
		background-color: #fff;
		height: 1.7rem;
		width: 0.1rem;
		display: inline-block;
		margin: 0 0.6rem;
	}

	.toast {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background-color: rgba(173, 128, 65, 0.8);
		color: #fff;
		font-size: 0.75rem;
	}

	.close {
		position: fixed;
		top: 15px;
		right: 3%;
	}

	:global(.mobile) .close {
		top: 0.3rem;
		right: 6%;
	}
	:global(.mobile) .letshare {
		transform: scale(0.8) translate(10%, -120%);
	}

	.letshare {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		transform: translate(0, -120%);
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.copy {
		display: inline-flex;
		align-items: center;
	}

	.copy span {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: inline-block;
		width: 12rem;
		max-width: 50vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.progress {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--text-color);
		color: var(--tertiary-color);
		padding: 2rem;
		border: 1px solid var(--tertiary-color);
		border-radius: 0.5rem;
	}
	.progress .row {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading {
		border: 0.2rem solid #f3f3f3;
		border-top: 0.2rem solid var(--text-color);
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		margin-right: 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes flash {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes scale {
		0% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
