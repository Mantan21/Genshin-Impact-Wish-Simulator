<script>
	import { setContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { assets, pageActive } from '$lib/store/stores';
	import browserState from '$lib/helpers/browserState';
	import playSfx from '$lib/helpers/audio';
	import ResponsiveImage from '$lib/components/utility/ResponsiveImage.svelte';
	import BeginnerFrame from './frames/_beginner-frame.svelte';
	import StandardFrame from './frames/_standard-frame.svelte';
	import EventsFrame from './frames/_events-frame.svelte';
	import WeaponsFrame from './frames/_weapons-frame.svelte';

	export let data = {};

	let type, weapons, character;
	$: ({ type, weapons, character } = data);
	let clientWidth;
	let clientHeight;
	let imageError = false;

	const handleImageError = (v) => {
		imageError = v;
	};
	setContext('imageError', handleImageError);

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
		<ResponsiveImage src={$assets['beginner']} alt="Weapon Banner" wrapperClass="card-image" />
		<div class="frame">
			<BeginnerFrame {character} />
		</div>
	{:else if type === 'weapons'}
		<ResponsiveImage
			src={$assets[`${weapons.name}`]}
			alt="Weapon Banner"
			wrapperClass="card-image wide"
		/>
		<div class="frame wide">
			<WeaponsFrame data={weapons} />
		</div>
	{:else if type === 'events'}
		<ResponsiveImage
			src={$assets[`${character.name}`]}
			alt="Character Event Banner"
			wrapperClass="card-image wide"
		/>
		{#if !character.name || imageError}
			<div class="character" in:fly={{ x: 20, duration: 850 }}>
				<img class="splash-art" src={$assets[`${character.character}`]} alt="character" />
			</div>
		{/if}
		<div class="frame wide">
			<EventsFrame data={character} />
		</div>
	{:else if type === 'standard'}
		<ResponsiveImage
			src={$assets[`${character.name}`]}
			alt="Standard Banner"
			wrapperClass="card-image"
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

	.frame.wide,
	.card :global(.card-image.wide) {
		aspect-ratio: 1080/533;
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
