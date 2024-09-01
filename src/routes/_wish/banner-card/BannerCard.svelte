<script>
	import { getContext, setContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { assets, isCustomBanner } from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';

	import FrameBeginner from './_frame-beginner.svelte';
	import FrameCharacter from './_frame-character.svelte';
	import FrameWeapon from './_frame-weapon.svelte';
	import FrameStandard from './_frame-standard.svelte';
	import FrameCustom from './_frame-custom.svelte';
	import BannerImage from './_banner-image.svelte';
	import ProbEditor from './_probability-editor.svelte';
	import ChronicledSpace from './_chronicled/bannerSpace.svelte';
	import { isSafari } from '$lib/helpers/mobileDetect';

	export let data = {};
	export let index = -1;
	export let fullscreenEditor = false;
	export let editor = false;

	// prettier-ignore
	let type, featured, character, bannerName, rateup, textOffset, charTitle, vision, images, artPosition;
	// prettier-ignore
	$: ({ type, featured, character, bannerName, rateup, textOffset, charTitle, vision, images, artPosition, watermark } = data);

	let clientWidth;
	let clientHeight;

	let animate = !!editor;
	let imageError = false;
	setContext('imageError', () => (imageError = true));
	const editProb = getContext('editprob');
	const openRateEditor = () => {
		animate = true;
		editProb();
	};
	const closeRateEditor = () => {
		if (editor) return;
		animate = false;
	};

	const navigate = getContext('navigate');
	const openDetails = () => {
		navigate('details');
		return playSfx();
	};
</script>

<div
	class="card"
	class:editor
	class:fullscreenEditor
	class:animate
	class:safari={isSafari()}
	bind:clientWidth
	bind:clientHeight
	style="--content-width:{clientWidth}px; --content-height:{clientHeight}px"
	on:transitionend|self={closeRateEditor}
>
	<div class="back" on:mousedown|self={openRateEditor}>
		{#if editor}
			<ProbEditor {fullscreenEditor} element={vision} />
		{/if}
	</div>
	<div class="front">
		<!-- Custom Banner -->
		{#if $isCustomBanner}
			<BannerImage
				custom
				src={images?.artURL}
				alt={bannerName}
				wrapperClass="card-image skeleton"
				{artPosition}
				{vision}
				{rateup}
			/>
			<div class="frame skeleton">
				<FrameCustom {bannerName} {character} {charTitle} {vision} {watermark} />
			</div>

			<!-- Beginner Banner -->
		{:else if type === 'beginner'}
			<BannerImage
				src={$assets['beginner']}
				isError={imageError}
				alt="Weapon Banner"
				wrapperClass="card-image skeleton"
			/>
			<div class="frame skeleton">
				<FrameBeginner {character} />
			</div>

			<!-- Weapon Banner -->
		{:else if type === 'weapon-event'}
			<BannerImage
				isError={imageError}
				src={$assets[bannerName]}
				alt="Weapon Banner"
				wrapperClass="card-image skeleton-event"
			/>
			<div class="frame skeleton-event">
				<FrameWeapon {featured} {rateup} {textOffset} />
			</div>

			<!-- Character Banner -->
		{:else if type === 'character-event'}
			<BannerImage
				isError={imageError}
				src={$assets[bannerName]}
				alt="Character Event Banner"
				wrapperClass="card-image skeleton-event"
			/>
			{#if !bannerName || imageError}
				<div class="character" in:fly={{ x: 20, duration: 850 }}>
					<img
						class="splash-art"
						src={$assets[`splash-art/${character}`]}
						alt="character"
						crossorigin="anonymous"
						on:error={(e) => e.target.remove()}
					/>
				</div>
			{/if}
			<div class="frame skeleton-event">
				<FrameCharacter {character} {textOffset} {bannerName} event2={index === 2} />
			</div>

			<!-- Chronicled Banner -->
		{:else if type === 'chronicled'}
			<ChronicledSpace />

			<!-- Standard Banner -->
		{:else if type === 'standard'}
			<BannerImage
				isError={imageError}
				src={$assets[bannerName]}
				alt="Standard Banner"
				wrapperClass="card-image {imageError ? 'skeleton' : ''}"
			/>
			<div class="frame">
				<FrameStandard {bannerName} />
			</div>
		{/if}

		<div class="info">
			<button class="detail" on:click={openDetails}> {$t('details.text')} </button>
			{#if type !== 'beginner'}
				<button class="gear" on:click={openRateEditor}><i class="gi-gear" /></button>
			{/if}
		</div>
	</div>
</div>

<style>
	.card,
	.front,
	.back,
	.card :global(.frame) {
		width: 100%;
		height: fit-content;
		aspect-ratio: 27/14;
	}

	.back {
		position: absolute;
		transform: rotateX(180deg);
		z-index: +9;
		transition: all 0.5s;
	}

	.editor.fullscreenEditor .back {
		position: fixed;
		transform: unset;
		aspect-ratio: unset;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.25);
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(8px);
		z-index: +15;
	}

	.front,
	.back {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.editor .front {
		transform: rotateX(0deg);
	}

	.card :global(.skeleton-event) {
		aspect-ratio: 1080/533;
	}
	.card :global(.skeleton) {
		aspect-ratio: 738.55/382.95;
	}
	.card :global(h1 .block) {
		display: block;
	}

	.card {
		position: relative;
	}

	.card.animate:not(.fullscreenEditor) {
		transition: transform 0.5s;
		transform-style: preserve-3d;
	}

	.card.editor:not(.fullscreenEditor) {
		transform: rotateX(180deg);
	}

	.card.editor.safari:not(.fullscreenEditor) .front {
		display: none;
	}

	.editor .front {
		pointer-events: none;
	}

	.card :global(.frame),
	.card :global(.card-image) {
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.card:not(.fullscreenEditor) :global(.frame),
	.card:not(.fullscreenEditor) :global(.card-image) {
		z-index: +10;
	}

	.character {
		position: absolute;
		z-index: +10;
		height: 100%;
		right: 0;
		top: 0;
		overflow: hidden;
	}

	img.splash-art {
		height: 150%;
	}

	.info {
		position: absolute;
		left: 5%;
		bottom: 4%;
		display: flex;
		align-items: center;
		z-index: +10;
	}

	:global(.mobile) .info {
		z-index: +10;
	}

	.info button {
		background-color: #eee8e3;
		color: rgba(0, 0, 0, 0.65);
		border-radius: 50px;
		border: #e2d7b6 0.12rem solid;
		font-size: calc(1.75 / 100 * var(--content-width));
		transition: background 0.25s, color 0.25s;
	}

	.info button:hover {
		background-color: #e0ddd4;
		color: rgba(0, 0, 0, 1);
	}

	.info button.gear {
		width: calc(3.5 / 100 * var(--content-width));
		font-size: calc(2.7 / 100 * var(--content-width));
		aspect-ratio: 1/1;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0;
		margin-left: calc(1 / 100 * var(--content-width));
	}

	.info button.detail {
		padding: calc(0.5 / 100 * var(--content-width)) calc(2.5 / 100 * var(--content-width));
	}
</style>
