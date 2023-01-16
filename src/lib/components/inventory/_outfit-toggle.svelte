<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { localOutfits } from '$lib/store/localstore';
	import { assets } from '$lib/store/stores';
	import { getName } from '$lib/helpers/nameText';
	import { checkOutfitAvaibility } from '$lib/helpers/outfit';
	import ButtonGeneral from '../utility/ButtonGeneral.svelte';

	export let charName;

	const { outfitList } = checkOutfitAvaibility(charName);
	const outfitAvailable = outfitList.length > 0;
	let activeOutfit = outfitList.filter(({ name }) => localOutfits.get(name)?.isSet)[0]?.name;
	const listToShow = outfitList.map((d) => {
		const purchased = localOutfits.get(d.name);
		d.owned = !d.version || purchased;
		return d;
	});

	const { applyChange, selectOutfit } = getContext('outfitChanger');

	let selectedOutfit = activeOutfit;
	let hasChange = false;

	const preview = (val) => {
		if (selectedOutfit === val) return;
		hasChange = activeOutfit !== val;
		selectedOutfit = val;

		if (val === 'default') {
			hasChange = !!activeOutfit;
			val = null;
		}
		selectOutfit(val);
	};

	const apply = () => {
		if (activeOutfit && activeOutfit !== 'default') localOutfits.set(activeOutfit, false);
		if (selectedOutfit !== 'default') localOutfits.set(selectedOutfit, true);
		activeOutfit = selectedOutfit;

		hasChange = false;
		applyChange();
	};

	let columnWidth;
</script>

{#if outfitAvailable}
	<div class="outfit-toggle" style="--width: {columnWidth}px">
		<div class="column" bind:clientWidth={columnWidth}>
			<button
				class:selected={!selectedOutfit || selectedOutfit === 'default'}
				on:click={() => preview('default')}
			>
				<picture class="star4" style="background-image:url('{$assets['4star-bg.webp']}');">
					<img
						src={$assets[`face/${charName}`]}
						alt={getName(charName)}
						on:error={(e) => e.target.remove()}
						crossorigin="anonymous"
					/>
				</picture>
				<caption>
					<span> {$t('outfit.default')} </span>
				</caption>
			</button>
		</div>

		{#each listToShow as { name, rarity, owned }}
			<div class="column" class:disabled={!owned} data-text={$t('inventory.notOwned')}>
				<button class:selected={name === selectedOutfit} on:click={() => preview(name)}>
					<picture
						class="star{rarity}"
						style="background-image:url('{$assets[`${rarity}star-bg.webp`]}');"
					>
						<img
							src={$assets[`face/${name}`]}
							alt={getName(name)}
							on:error={(e) => e.target.remove()}
							crossorigin="anonymous"
						/>
					</picture>
					<caption>
						<span> {$t(`outfit.item.${name}.name`)}</span>
					</caption>
				</button>
			</div>
		{/each}
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
		padding-top: 1rem;
		padding-left: 1rem;
		z-index: +2;
		width: fit-content;
	}

	.column {
		width: 10vw;
		max-width: 120px;
		min-width: 90px;
		aspect-ratio: 1/1;
		padding: 0.3rem;
		display: inline-block;
		flex-direction: column;
		position: relative;
	}

	.column button {
		border-radius: 5%;
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
		border-radius: 8%;
		border: 0.2rem solid rgba(234, 195, 67, 0.7);
		opacity: 0;
		transition: opacity 0.15s;
	}
	.column:not(.disabled):hover button::after,
	button.selected::after {
		opacity: 1;
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
		width: calc(100% - 0.6rem);
		height: calc(100% - 0.6rem);
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 0.5em;
		z-index: +2;
		font-size: calc(0.12 * var(--width));
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
		font-size: calc(0.095 * var(--width));
		line-height: 1.15em;
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
		font-size: 90%;
	}
</style>
