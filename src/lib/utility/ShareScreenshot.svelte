<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { toBlob } from 'html-to-image';
	import { saveAs } from 'file-saver';
	import { PROTOCOL, HOST } from '$lib/env';
	import { primogem } from '$lib/store/stores';
	import { firstShare, myFunds } from '$lib/store/localstore';
	import { copy } from '$lib/functions/nameText';
	import Icon from '$lib/utility/Icon.svelte';

	export let encodedData;
	export let page;

	let audio;
	let show = false;
	let showToast = false;
	let width = 873;
	let height = 393;
	let isFirstShare = true;

	let blob;
	let url = '/assets/images/meta-picture.jpg';
	$: shareLink = `${PROTOCOL}://${HOST}/screen/${page}/?a=${encodedData}`;

	onMount(() => {
		isFirstShare = firstShare.check();
		audio = document.querySelector('#button-sfx');
	});

	const addFunds = () => {
		if (!isFirstShare) return;
		primogem.update((n) => {
			const settled = n + 16000;
			myFunds.set('primogem', settled);
			return settled;
		});
		firstShare.set('yes');
		isFirstShare = false;
	};

	const takeShot = async (e) => {
		audio.play();
		e.target.innerText = 'wait..';
		const filter = (node) => {
			const notIncluded = ['close', 'share'];
			if (node.classList) return !notIncluded.some((cl) => node.classList.contains(cl));
			return true;
		};
		const node = document.querySelector('.wish-result');
		node.classList.add('preview');
		blob = await toBlob(node, { filter });
		url = URL.createObjectURL(blob);
		show = true;
		e.target.innerText = 'Share';
		node.classList.remove('preview');
	};

	const saveHandler = () => {
		audio.play();
		saveAs(blob, `WishSimulator.vercel.app - ${new Date().toLocaleString()}.png`);
		addFunds();
	};

	const copyHandle = async () => {
		audio.play();
		copy();
		showToast = true;
		const t = setTimeout(() => {
			showToast = false;
			clearTimeout(t);
		}, 2000);
		addFunds();
	};

	const closehandle = () => {
		audio.play();
		show = false;
	};
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#if show}
	<div class="screenshot" out:fade={{ duration: 200 }} on:click|stopPropagation>
		<button class="close" on:click={closehandle}>
			<i class="gi-close" />
		</button>

		<picture>
			<div class="copy">
				<span class="text">{shareLink}</span>
				<button on:click={copyHandle}> <i class="gi-copy" /> </button>
			</div>
			<button class="save" on:click={saveHandler}><i class="gi-save" /></button>
			<img src={url} alt="screenshot" />
		</picture>
		{#if showToast}
			<div class="toast" in:fly={{ y: 10 }} out:fade>Copied to Clipboard</div>
		{/if}
	</div>
{/if}

<div class="shr">
	{#if isFirstShare}
		<span>
			Reward for first share : 16000
			<Icon type="primogem" width="18px" style="margin-left: .5rem" />
		</span>
	{/if}
	<button on:click|stopPropagation={takeShot}> Share </button>
</div>

<style>
	.shr span {
		display: inline-flex;
		align-items: center;
	}
	button {
		background-color: #d9d2c8;
		color: #000;
		border-radius: 30px;
		font-size: 0.8rem;
		padding: 0.3rem 2rem;
		margin-left: 10px;
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
		height: 100vh;
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
		width: 30px;
		height: 30px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0;
	}

	.close,
	.save,
	.copy button {
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		padding: 0;
		border-radius: 100%;
		font-size: 1rem;
		z-index: 10;
	}
	.save,
	.copy button {
		font-size: 1.4rem !important;
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
		border: 3.5px solid #abbcc6;
		position: fixed;
		top: 10px;
		right: 10px;
	}

	:global(.mobile) .close {
		transform: scale(0.87);
	}
	:global(.mobile) .save {
		transform: scale(0.8) translate(0, -120%);
	}
	:global(.mobile) .copy {
		transform: scale(0.8) translate(-10px, -120%);
	}

	.save,
	.copy {
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(0, -120%);
	}
	.copy {
		display: inline-flex;
		align-items: center;
		transform: translate(-40px, -120%);
	}

	.copy span {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: inline-block;
		width: 200px;
		max-width: 50vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
