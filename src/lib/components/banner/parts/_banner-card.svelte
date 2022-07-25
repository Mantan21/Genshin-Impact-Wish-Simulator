<script>
	import { t } from 'svelte-i18n';
	import { pageActive } from '$lib/store/stores';
	import browserState from '$lib/functions/browserState';
	import playSfx from '$lib/functions/audio';
	import ResponsiveImage from '$lib/components/utility/ResponsiveImage.svelte';
	import BeginnerFrame from './frames/_beginner-frame.svelte';
	import StandardFrame1 from './frames/_standard-frame1.svelte';
	import EventsFrame from './frames/_events-frame.svelte';
	import WeaponsFrame from './frames/_weapons-frame.svelte';

	export let data = {};

	let { type, weapons, character } = data;
	let clientWidth;
	let clientHeight;

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
			src="/images/banner/beginner/beginner.webp"
			alt="Weapon Banner"
			wrapperClass="card-image"
		/>
		<div class="frame">
			<BeginnerFrame {character} />
		</div>
	{:else if type === 'weapons'}
		<ResponsiveImage
			src="/images/banner/weapons/{weapons.name}.webp"
			alt="Weapon Banner"
			wrapperClass="card-image"
		/>
		<div class="frame">
			<WeaponsFrame data={weapons} />
		</div>
	{:else if type === 'events'}
		<ResponsiveImage
			src="/images/banner/character-events/{character.name}.webp"
			alt="Character Event Banner"
			wrapperClass="card-image"
		/>
		<div class="frame">
			<EventsFrame data={character} />
		</div>
	{:else if type === 'standard'}
		<ResponsiveImage
			src="/images/banner/standard/{character.name}.webp"
			alt="Standard Banner"
			wrapperClass="card-image"
		/>
		<div class="frame">
			<StandardFrame1 />
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
	.card {
		position: relative;
	}
	.frame,
	.card :global(.card-image) {
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.detail {
		position: absolute;
		left: 5%;
		bottom: 13%;
		background-color: #eee8e3;
		color: rgba(0, 0, 0, 0.5);
		padding: 0.2rem 1.5rem;
		border-radius: 20px;
		border: #e2d7b6 0.1rem solid;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.detail:hover {
		background-color: #e0ddd4;
		color: rgba(0, 0, 0, 1);
	}
</style>
