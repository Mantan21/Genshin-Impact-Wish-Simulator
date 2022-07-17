<script>
	import { createEventDispatcher, getContext, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';

	import { viewportHeight, viewportWidth } from '$lib/store/stores';
	import HistoryIDB from '$lib/store/historyIdb';
	import { getName } from '$lib/functions/nameText';
	import { getOutfit, isOutfitSet } from '$lib/functions/wish/outfit';
	import playSfx from '$lib/functions/audio';

	import Share from '$lib/components/utility/ShareScreenshot.svelte';
	import OutfitToggle from './_outfit-toggle.svelte';

	export let show = false;
	export let name = '';

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	let render = false;
	let rarity = 0;
	let time = '';
	let type = '';
	let vision = '';
	let weaponType = '';
	let countInfo = 0;
	let refineExtra = '';

	let defaultPath, outfitPath;
	$: ({ defaultPath, outfitPath } = getOutfit(name, rarity));

	const getDetail = async (show) => {
		if (!show && !name) return;
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
		render = show;
	};

	const dispatch = createEventDispatcher();
	const closeHandle = () => {
		playSfx('close');
		render = false;
		dispatch('close');
	};

	$: getDetail(show);

	const refreshAfterOutfitChanged = getContext('refreshList');
	$: outfitSet = isOutfitSet(name);
	const outfitChanger = {
		applyChange() {
			refreshAfterOutfitChanged(name, outfitSet);
			playSfx();
		},
		selectOutfit(val) {
			outfitSet = val;
			playSfx();
		}
	};
	setContext('outfitChanger', outfitChanger);
</script>

{#if render}
	<div
		class="wish-result"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 100 }}
		style="height: {$viewportHeight}px"
	>
		<div class="container">
			<button class="close" on:click={closeHandle}>
				<i class="gi-close" />
			</button>

			<div class="uid">WishSimulator.App</div>
			<OutfitToggle charName={name} {outfitSet} charRarity={rarity} />

			<div class="splatter" style={splatterStyle}>
				{#if type === 'weapon'}
					<div class="splash-art weapon {weaponType}-parent">
						<img
							src="/assets/images/weapons/{weaponType}/{rarity}star/{name}.webp"
							alt={name}
							class={weaponType}
						/>
					</div>
				{:else}
					<img src={outfitSet ? outfitPath : defaultPath} alt={getName(name)} class="splash-art" />
				{/if}

				<div class="info">
					{#if vision}
						<img
							src="/assets/images/utility/icon-{vision}.svg"
							alt="Vision {vision}"
							class="anim vision vision-{vision}"
						/>
					{:else}
						<i class="anim elemen gi-{weaponType}" />
					{/if}
					<div class="name">
						<div class="text">
							{$t(`character.name.${name}`)}
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
{/if}

<style>
	.close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		border-radius: 100%;
		position: fixed;
		top: 15px;
		right: 3%;
		line-height: 0;
		z-index: 10;
	}

	@media screen and (max-width: 900px) {
		.close {
			width: 2.5rem;
			height: 2.5rem;
			margin: 3px;
		}
	}

	:global(.mobile) .close {
		width: 2rem;
		height: 2rem;
		top: 0.3rem;
		right: 2%;
	}

	.wish-result {
		width: 100vw;
		background-color: #fff;
		background-image: url('/assets/images/background/detailbg.webp');
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
		width: 4rem;
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
