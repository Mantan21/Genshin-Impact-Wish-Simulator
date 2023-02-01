<script>
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { assets, pageActive } from '$lib/store/stores';
	import browserState from '$lib/helpers/browserState';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import ResponsiveImage from './ResponsiveImage.svelte';
	import BeginnerFrame from './frames/_beginner-frame.svelte';
	import StandardFrame from './frames/_standard-frame.svelte';
	import EventsFrame from './frames/_events-frame.svelte';
	import WeaponsFrame from './frames/_weapons-frame.svelte';

	export let data = {};
	export let index = -1;

	let type, weapons, character;
	$: ({ type, weapons, character } = data);

	let clientWidth;
	let clientHeight;

	let imageError = false;
	const handleimageError = () => {
		imageError = true;
	};

	const openDetails = () => {
		pageActive.set('details');
		browserState.set('details');
		return playSfx();
	};
</script>

<div
	class="card"
	bind:clientWidth
	bind:clientHeight
	style="--content-width:{clientWidth}px; --content-height:{clientHeight}px"
>
	{#if type === 'beginner'}
		<ResponsiveImage
			on:error={handleimageError}
			isError={imageError}
			src={$assets['beginner']}
			alt="Weapon Banner"
			wrapperClass="card-image skeleton"
		/>
		<div class="frame skeleton">
			<BeginnerFrame {character} />
		</div>
	{:else if type === 'weapons'}
		<ResponsiveImage
			on:error={handleimageError}
			isError={imageError}
			src={$assets[`${weapons.name}`]}
			alt="Weapon Banner"
			wrapperClass="card-image skeleton-event"
		/>
		<div class="frame skeleton-event">
			<WeaponsFrame data={weapons} />
		</div>
	{:else if type === 'events'}
		<ResponsiveImage
			on:error={handleimageError}
			isError={imageError}
			src={$assets[`${character.name}`]}
			alt="Character Event Banner"
			wrapperClass="card-image skeleton-event"
		/>
		{#if !character.name || imageError}
			<div class="character" in:fly={{ x: 20, duration: 850 }}>
				<img
					class="splash-art"
					src={$assets[`splash-art/${character.character}`]}
					alt="character"
					on:error={(e) => e.target.remove()}
					crossorigin="anonymous"
				/>
			</div>
		{/if}
		<div class="frame skeleton-event">
			<EventsFrame data={character} event2={index === 2} />
		</div>
	{:else if type === 'standard'}
		<ResponsiveImage
			on:error={handleimageError}
			isError={imageError}
			src={$assets[`${character.name}`]}
			alt="Standard Banner"
			wrapperClass="card-image {imageError ? 'skeleton' : ''}"
		/>
		<div class="frame">
			<StandardFrame {data} />
		</div>
	{/if}

	<button class="detail" on:click={openDetails}> {$t('details.text')} </button>
</div>

<style>
	.card,
	.frame {
		width: 100%;
		height: fit-content;
		aspect-ratio: 27/14;
	}

	.frame.skeleton-event,
	.card :global(.card-image.skeleton-event) {
		aspect-ratio: 1080/533;
	}

	.frame.skeleton,
	.card :global(.card-image.skeleton) {
		aspect-ratio: 738.55/382.95;
	}

	.card {
		position: relative;
	}
	.frame,
	.card :global(.card-image) {
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.character {
		position: absolute;
		height: 100%;
		right: 0;
		top: 0;
		overflow: hidden;
	}

	img.splash-art {
		height: 150%;
	}

	.detail {
		position: absolute;
		left: 5%;
		bottom: 8%;
		background-color: #eee8e3;
		color: rgba(0, 0, 0, 0.5);
		padding: calc(0.5 / 100 * var(--content-width)) calc(2.5 / 100 * var(--content-width));
		border-radius: 20px;
		border: #e2d7b6 0.1rem solid;
		font-size: calc(1.5 / 100 * var(--content-width));
		transition: all 0.2s;
	}

	.detail:hover {
		background-color: #e0ddd4;
		color: rgba(0, 0, 0, 1);
	}
</style>
