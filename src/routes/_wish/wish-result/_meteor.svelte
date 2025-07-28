<script>
	import { getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import hotkeys from 'hotkeys-js';

	import { localConfig } from '$lib/helpers/dataAPI/api-localstore';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { assets } from '$lib/store/app-stores';
	import { pushToast } from '$lib/helpers/toast';

	export let rarity = 3;
	export let show = false;
	export let isSingle = false;
	export let radiance = false;

	let videoContent;
	let showSkipButton = false;

	const showSplashArt = getContext('showSplashArt');
	const meteorEnd = ({ skip = false } = {}) => {
		showSplashArt({ skip });
		showSkipButton = false;
	};

	const skip = () => {
		playSfx();
		meteorEnd({ skip: true });
		videoContent.load();
		videoContent.style.display = 'none';
	};

	onMount(() => {
		videoContent.addEventListener('ended', () => {
			videoContent.style.display = 'none';
			videoContent.load();
			meteorEnd();
		});

		videoContent.addEventListener('error', () => {
			const statusCode = videoContent.error.message;
			const message = `${$t('wish.result.meteorFailed')} "${statusCode}" - ${videoContent.src}`;
			pushToast({ message });

			console.error(`Failed to load the Falling Star Animation`);
			return meteorEnd();
		});
	});

	const showVideoHandle = async (rarity, single = true, radiance) => {
		const muted = localConfig.get('muted');
		let vidSrc = '3star-single';
		if (radiance) {
			vidSrc = 'capturing-radiance';
		} else {
			if (single && rarity !== 3) {
				vidSrc = rarity === 5 ? '5star-single' : '4star-single';
			}
			if (!single && rarity !== 3) {
				vidSrc = rarity === 5 ? '5star-multi' : '4star-multi';
			}
		}

		videoContent.src = $assets[`${vidSrc}.mp4`];
		videoContent.style.display = 'unset';
		videoContent.muted = !!muted;
		await videoContent.play();
		return;
	};

	$: if (show) showVideoHandle(rarity, isSingle, radiance);

	// Shortcut
	hotkeys('esc', 'index', (e) => {
		if (!show) return;
		e.preventDefault();
		skip();
	});

	hotkeys('enter', 'index', (e) => {
		if (!show) return;
		e.preventDefault();
		if (showSkipButton) return skip();
		showSkipButton = true;
	});
</script>

<div class="meteor-wrapper" class:show on:mousedown={() => (showSkipButton = true)}>
	<div class="video">
		<video playsinline bind:this={videoContent} type="video/mp4">
			<track kind="captions" />
		</video>
		{#if showSkipButton}
			<button class="skip" on:click={skip} in:fade={{ duration: 250 }}>
				{$t('wish.result.skip')} <i class="gi-caret-up" />
			</button>
		{/if}
	</div>
</div>

<style>
	.meteor-wrapper {
		width: 100vw;
		height: var(--screen-height);
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.25s;
	}
	.meteor-wrapper.show {
		display: block;
		background-color: #fff;
		opacity: 1;
	}
	.video {
		position: relative;
		width: 100vw;
		height: 100%;
	}

	.skip {
		position: absolute;
		top: 30px;
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
		top: 0.3rem;
		right: 6%;
	}
	video {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 105%;
		height: 105%;
		object-fit: cover;
	}
</style>
