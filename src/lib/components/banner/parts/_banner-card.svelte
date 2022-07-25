<script>
	import { t } from 'svelte-i18n';
	import { fatePoint, selectedCourse, pageActive } from '$lib/store/stores';
	import browserState from '$lib/functions/browserState';
	import playSfx from '$lib/functions/audio';
	import ResponsiveImage from '$lib/components/utility/ResponsiveImage.svelte';
	import BeginnerFrame from './frames/_beginner-frame.svelte';
	import StandardFrame1 from './frames/_standard-frame1.svelte';

	export let data = {};

	let { type, weapons, character } = data;
	let clientWidth;

	const openDetails = () => {
		pageActive.set('details');
		browserState.set('details');
		return playSfx();
	};
</script>

<div class="card" bind:clientWidth style="--content-width:{clientWidth}px">
	{#if type === 'beginner'}
		<ResponsiveImage
			src="/images/banner/beginner.webp"
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

		{#if $selectedCourse.name}
			<div class="selected" class:fill={$fatePoint === 2}>
				{$t('wish.epitomizedPath.courseSetFor', {
					values: { selectedCourse: $t($selectedCourse.name) }
				})}
			</div>
		{/if}
	{:else if type === 'events'}
		<ResponsiveImage
			src="/images/banner/character-events/{character.name}.webp"
			alt="Character Event Banner"
			wrapperClass="card-image"
		/>
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

	.selected {
		position: absolute;
		bottom: 0rem;
		right: 0;
		max-width: 80%;
		padding: 0.2rem 1rem;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.4);
		font-size: 1rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.selected.fill {
		background-color: #62c5ff;
	}
</style>
