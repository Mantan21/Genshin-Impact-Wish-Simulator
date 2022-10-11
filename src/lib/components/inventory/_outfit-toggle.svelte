<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { localOutfits } from '$lib/store/localstore';
	import { getName } from '$lib/helpers/nameText';
	import {
		checkOutfitAvaibility,
		getOutfit,
		isOutfitOwned,
		isOutfitSet
	} from '$lib/helpers/wish/outfit';
	import ButtonGeneral from '../utility/ButtonGeneral.svelte';
	import { assets } from '$lib/store/stores';

	export let charName;
	export let charRarity;
	export let outfitSet;

	const { outfitPath, defaultPath, outfitName, outfitRarity } = getOutfit(
		charName,
		charRarity,
		true
	);

	const { applyChange, selectOutfit } = getContext('outfitChanger');

	let hasChange = false;
	const set = (val) => {
		outfitSet = val;
		hasChange = !(isOutfitSet(charName) === val);
		selectOutfit(val);
	};
	const apply = () => {
		localOutfits.set(outfitName, outfitSet);
		hasChange = false;
		applyChange();
	};

	const { outfitAvailable } = checkOutfitAvaibility(charName);
	const outfitOwned = isOutfitOwned(charName);
</script>

{#if outfitAvailable}
	<div class="outfit-toggle">
		<div class="content">
			<div class="column">
				<button class:selected={!outfitSet} on:click={() => set(false)}>
					<picture class="star4" style="background-image:url('{$assets['4star-bg.webp']}');">
						<img src={defaultPath} alt={getName(charName)} />
					</picture>
					<caption>
						<span> {$t(`${charName}.name`)}</span>
					</caption>
				</button>
			</div>

			<div class="column" class:disabled={!outfitOwned} data-text={$t('inventory.notOwned')}>
				<button class:selected={outfitSet} on:click={() => set(true)}>
					<picture
						class="star{outfitRarity}"
						style="background-image:url('{$assets[`${outfitRarity}star-bg.webp`]}');"
					>
						<img src={outfitPath} alt={getName(outfitName)} />
					</picture>
					<caption>
						<span> {$t(`outfit.item.${outfitName}.name`)}</span>
					</caption>
				</button>
			</div>
		</div>
		<div class="apply">
			{#if hasChange}
				<div transition:fade={{ duration: 200 }}>
					<ButtonGeneral on:click={apply}>
						{$t('outfit.setOutfit')}
					</ButtonGeneral>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.outfit-toggle {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		max-width: 320px;
		width: 50%;
		padding-top: 1rem;
		padding-left: 1rem;
		z-index: +2;
	}

	:global(.mobile) .outfit-toggle {
		width: 25%;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
	}
	.column button {
		border-radius: 0.5em;
		display: flex;
		flex-direction: column;
		text-align: center;
		background-color: #596982;
		color: #e8dfbb;
		line-height: 1.2rem;
		position: relative;
	}

	.column button::after {
		content: '';
		position: absolute;
		z-index: -1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border-radius: 0.8rem;
		border: 0.25rem solid rgba(234, 195, 67, 0.7);
		opacity: 0;
		transition: opacity 0.15s;
	}
	.column:not(.disabled):hover button::after,
	.content button.selected::after {
		opacity: 1;
	}

	.column {
		width: 50%;
		aspect-ratio: 1/1;
		padding: 0.4rem;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.column.disabled::before {
		content: attr(data-text);
		color: #e8dfbb;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: calc(100% - 0.8rem);
		height: calc(100% - 0.8rem);
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 0.5em;
		z-index: +2;
	}

	.column button {
		width: 100%;
		height: 100%;
	}

	caption {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40%;
		font-size: 0.9rem;
		line-height: 1.15em;
	}
	:global(.mobile) caption {
		font-size: 0.7rem;
	}

	picture {
		display: block;
		width: 100%;
		height: 70%;
		margin: auto;
		background-size: cover;
		border-top-right-radius: 0.5em;
		border-top-left-radius: 0.5em;
	}

	img {
		height: 100%;
	}

	.apply {
		width: 100%;
		text-align: center;
	}
</style>
