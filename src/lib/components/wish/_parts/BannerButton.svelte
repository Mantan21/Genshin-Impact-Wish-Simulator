<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { data as charDB } from '$lib/data/characters.json';
	import { data as weaponDB } from '$lib/data/weapons.json';
	import positionToStyle from '$lib/helpers/cssPosition';
	import { noticeMark } from '$lib/helpers/noticeMark';
	import {
		mobileMode,
		patchVersion,
		bannerPhase,
		isFatepointSystem,
		assets
	} from '$lib/store/stores';
	import NoticeMark from '$lib/components/utility/NoticeMark.svelte';

	export let active = false;
	export let type = 'events';
	export let bannerData;
	export let index = 0;

	const buttonOffset = (itemName, buttonPosition = {}) => {
		const data = type === 'weapons' ? weaponDB : charDB;
		const { buttonOffset } = data.find(({ name }) => name === itemName) || {};
		Object.keys(buttonPosition).forEach((key) => (buttonOffset[key] = buttonPosition[key]));
		return buttonOffset;
	};

	$: baseNoticeName = `${$patchVersion}-${$bannerPhase}-${index}`;
	$: isWeapon = type === 'weapons' && $isFatepointSystem;
	$: noticeName = isWeapon ? `fatepoint${$patchVersion}-${$bannerPhase}` : baseNoticeName;

	const buttonStyle = (position, isActive = false) => {
		if (!position) return;
		const tempPosition = { ...position };
		if (!tempPosition.t) tempPosition.t = 0;
		if (!$mobileMode) tempPosition.t = tempPosition.t - 10;
		if (isActive) tempPosition.t = tempPosition.t - 10;
		return positionToStyle(tempPosition);
	};

	const setNotice = () => {
		if (!active) return;
		if (['weapons', 'events'].includes(type)) {
			noticeMark.openNotice(baseNoticeName);
		}
	};
	const dispatch = createEventDispatcher();
	const buttonClick = () => dispatch('click');
	$: setNotice(active);
</script>

<button class="button {type}" class:active on:click={buttonClick}>
	{#if ['weapons', 'events'].includes(type)}
		<NoticeMark
			name={noticeName}
			style="transform: translateY(-130%) translateX(50%); z-index:+10"
		/>
	{/if}
	<i class="gi-primo-star" />
	<i class="gi-companion" />
	<div class="picture">
		{#if type === 'weapons'}
			{#each bannerData.featured as { name, buttonPosition }}
				<img
					in:fade
					src={$assets[name]}
					alt="Weapon Wish"
					style={buttonStyle(buttonOffset(name, buttonPosition), active)}
					on:error={(e) => e.target.remove()}
					crossorigin="anonymous"
				/>
			{/each}
		{:else}
			<img
				in:fade
				src="/images/characters/banner-button/{bannerData.character}.webp"
				alt="{type} Wish"
				style={buttonStyle(buttonOffset(bannerData.character), active)}
				on:error={(e) => e.target.remove()}
				crossorigin="anonymous"
			/>
		{/if}
	</div>
	{#if type === 'beginner'}
		<div class="discount">-20%</div>
	{/if}
</button>

<style>
	button {
		display: block;
		background-color: var(--secondary-color);
		border-radius: 0.25rem;
		width: 90px;
		min-width: 50px;
		aspect-ratio: 2.4/1;
		margin: 0.6em;
		position: relative;
		transition: all.2s;
	}
	button::after,
	button::before {
		content: '';
		display: block;
		width: 90%;
		height: 75%;
		border: 2.5px solid #6d8fbb;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: all 0.2s;
	}

	button::after {
		border-radius: 0.4rem;
	}

	button::before {
		border-radius: 40px;
	}

	button.active,
	button:hover {
		background-color: var(--tertiary-color);
	}

	button.active::before,
	button.active::after,
	button:hover::before,
	button:hover::after {
		border: 2.5px solid #eee2c8;
	}

	button.active,
	button:hover {
		transform: scale(1.1);
	}

	.gi-primo-star {
		left: 15px;
		font-size: 0.7rem;
	}
	.gi-companion {
		right: 5px;
		font-size: 3rem;
		line-height: 0;
		top: 55% !important;
	}

	.gi-primo-star,
	.gi-companion {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: #6d8fbb;
		transition: all 0.2s;
	}

	.active .gi-primo-star,
	.active .gi-companion,
	button:hover .gi-primo-star,
	button:hover .gi-companion {
		color: #eee2c8;
	}

	.picture {
		width: 100%;
		height: 150%;
		position: absolute;
		bottom: 0;
		left: 0;
		overflow: hidden;
		pointer-events: none;
		border-bottom-left-radius: 7px;
		border-bottom-right-radius: 7px;
	}
	img {
		position: absolute;
		z-index: +1;
		left: 50%;
		transform: translateX(-50%);
		transition: all 0.2s;
	}

	.discount {
		background-color: #8ab958;
		position: absolute;
		z-index: +2;
		left: 50%;
		bottom: -5px;
		border-radius: 20px;
		color: #fff;
		transform: scale(0.65) translateX(-50%);
		padding: 0.2rem 0.5rem;
	}

	@media screen and (min-width: 750px) {
		.discount {
			font-size: 0.7rem;
		}
	}

	/* mobile */
	:global(.mobile) button {
		transform: scale(0.88);
		margin: 2.5% 0;
		aspect-ratio: 2.2/1;
	}

	:global(.mobile) button.active {
		transform: scale(0.9);
	}
</style>
