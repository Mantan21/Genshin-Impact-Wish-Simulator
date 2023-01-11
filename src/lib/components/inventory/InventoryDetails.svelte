<script>
	import { createEventDispatcher, getContext, onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';

	import { assets, viewportHeight, viewportWidth } from '$lib/store/stores';
	import HistoryIDB from '$lib/store/historyIdb';
	import { getName } from '$lib/helpers/nameText';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';

	import Share from '$lib/components/utility/ShareScreenshot.svelte';
	import OutfitToggle from './_outfit-toggle.svelte';

	export let name = '';
	export let outfit = '';

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	let rarity = 0;
	let time = '';
	let type = '';
	let vision = '';
	let weaponType = '';
	let countInfo = 0;
	let refineExtra = '';

	onMount(async () => {
		if (!name) return;
		const dt = await HistoryIDB.getByName(name);
		({ time, vision, type, weaponType, rarity } = dt[0]);
		const count = dt.length;
		if (type === 'weapon') {
			refineExtra = $t(`inventory.extra`, { values: { count: `5 + ${count - 5}` } });
			countInfo = $t(`inventory.refinement`, {
				values: { count: count > 5 ? refineExtra : count }
			});
		} else {
			refineExtra = $t(`inventory.extra`, { values: { count: `6 + ${count - 7}` } });
			countInfo = $t(`inventory.constellation`, {
				values: { count: count > 7 ? refineExtra : count - 1 }
			});
		}
	});

	const dispatch = createEventDispatcher();
	const closeHandle = () => {
		playSfx('close');
		dispatch('close');
	};

	const refreshAfterOutfitChanged = getContext('refreshList');
	const outfitChanger = {
		applyChange() {
			refreshAfterOutfitChanged(name, outfit);
			playSfx();
		},
		selectOutfit(val) {
			outfit = val;
			playSfx();
		}
	};
	setContext('outfitChanger', outfitChanger);
</script>

<div
	class="wish-result"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 100 }}
	style="height: {$viewportHeight}px; background-image: url({$assets['detailbg.webp']})"
>
	<div class="container">
		<button class="close" on:click={closeHandle}>
			<i class="gi-close" />
		</button>

		<div class="uid">WishSimulator.App</div>
		<OutfitToggle charName={name} />

		<div class="splatter" style={splatterStyle}>
			{#if type === 'weapon'}
				<div class="splash-art weapon {weaponType}-parent">
					<img
						src={$assets[name]}
						alt={name}
						class={weaponType}
						on:error={(e) => e.target.remove()}
						crossorigin="anonymous"
					/>
				</div>
			{:else}
				<img
					src={$assets[`splash-art/${outfit || name}`]}
					alt={getName(name)}
					class="splash-art"
					on:error={(e) => e.target.remove()}
					crossorigin="anonymous"
				/>
			{/if}

			<div class="info">
				{#if vision}
					<img
						src={$assets[`icon-${vision}.svg`]}
						alt="Vision {vision}"
						class="anim vision filter-drop {vision}"
						crossorigin="anonymous"
					/>
				{:else}
					<i class="anim elemen gi-{weaponType}" />
				{/if}
				<div class="name">
					<div class="text">
						{type === 'weapon' ? $t(name) : $t(`${name}.name`)}
					</div>
					<div class="star">
						{#each Array(rarity) as _, i (i)}
							<i class="gi-star" />
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="detail">
			<span class="count"> {countInfo} </span>
			<span> <small> {$t('inventory.firstSummon', { values: { date: time } })}: </small></span>
		</div>
		<div class="share">
			<Share />
		</div>
	</div>
</div>

<style>
	.close {
		position: fixed;
		top: 2%;
		right: 2%;
		z-index: 10;
	}

	:global(.mobile) .close {
		top: 1.5%;
		right: 5.5%;
	}

	.wish-result {
		width: 100vw;
		background-color: #fff;
		background-size: cover;
		background-position: center;
		position: fixed;
		top: 0;
		left: 0;
		z-index: +10;
	}

	.container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.share {
		position: absolute;
		bottom: 5%;
		right: 10%;
	}

	.splatter {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.splash-art {
		height: 120%;
	}

	.splash-art.weapon {
		height: 100%;
		width: 100%;
		position: relative;
	}
	.splash-art.weapon img {
		height: 120%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.bow {
		height: 100%;
	}

	.claymore {
		height: 105% !important;
	}

	.catalyst {
		height: 45% !important;
	}

	.polearm {
		top: 65% !important;
		left: 48% !important;
		height: 130% !important;
	}

	.info,
	.starfate {
		position: fixed;
		top: 60%;
		z-index: 10;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		width: 1100px;
		max-width: 95%;
	}
	.info {
		left: 50%;
		transform: translate(-50%, -50%);
	}

	:global(.mobile) .info {
		max-width: 83%;
	}

	.info i.elemen,
	.vision {
		font-size: 5.2em;
		margin-right: -7px;
		margin-top: -5px;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		z-index: -2;
	}

	.vision {
		height: 5rem;
	}

	:global(.mobile) .vision {
		height: 4rem;
	}

	.name {
		position: relative;
		z-index: +2;
		width: 100%;
	}

	.name .text {
		max-width: 38%;
		font-size: 2.5em;
		line-height: 1.2em;
		color: #fff;
		-webkit-text-stroke: 0.015em #000;
	}

	:global(.zh-CN) .name .text,
	:global(.ja-JP) .name .text {
		font-size: 3.5em;
	}

	.gi-star {
		color: #f7cf33;
		font-size: 1.525em;
		display: inline-block;
	}

	.detail,
	.uid {
		color: #fff;
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		padding: 0.5rem 1rem;
		-webkit-text-stroke: #000 0.015rem;
	}
	.detail span {
		display: block;
	}
	span.count {
		font-size: larger;
	}

	.uid {
		left: unset;
		right: 0;
		width: fit-content;
		display: none;
	}

	.preview .uid {
		display: unset;
	}
</style>
