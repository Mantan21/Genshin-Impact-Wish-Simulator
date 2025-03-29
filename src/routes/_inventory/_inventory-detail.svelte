<script>
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import hotkeys from 'hotkeys-js';

	import { assets } from '$lib/store/app-stores';
	import { HistoryManager } from '$lib/helpers/dataAPI/api-indexeddb';
	import { playSfx } from '$lib/helpers/audio/audio';

	// Component
	import ScreenshotShare from '../_index/ScreenshotShare.svelte';
	import ButtonGeneral from '$lib/components/ButtonGeneral.svelte';
	import OutfitToggle from './_outfit-toggle.svelte';
	import SplashArt from '../_custom-banner/SplashArtEditor/SplashArt.svelte';

	// Modal
	import ModalDetail from './_modal-inventory-detail.svelte';

	export let itemID;
	export let useOutfit = false;
	export let outfitName = '';
	export let custom = false;
	export let rarity = 3;
	export let type = 'character';
	export let name = '';
	export let localName = '';
	export let vision = '';
	export let weaponType = '';
	export let qty = 0;
	export let isOwned = true;
	export let images = {};
	export let offset = {};

	let hideInfo = false;
	setContext('toggleInfoHide', () => {
		hideInfo = !hideInfo;
		playSfx();
	});

	let showModal = false
    const closeModal = () => {
        playSfx('close');
        showModal = false;
    };
    setContext('closeModal', closeModal);

	const openModal = () => {
		showModal = true;
		playSfx();
	};

	const previewOutfit = (outfit, position) => {
		outfitName = outfit;
		offset = position;
		useOutfit = outfit !== 'default';
	};
	setContext('previewOutfit', previewOutfit);

	let onshot = false;
	const closeDetail = getContext('closeDetail');
	setContext('preview', (val) => (onshot = val));

	const getQtyInfo = (type, qty) => {
		if (type === 'weapon') {
			const refineExtra = $t(`inventory.extra`, { values: { count: `5 + ${qty - 5}` } });
			const info = $t(`inventory.refinement`, {
				values: { count: qty > 5 ? refineExtra : qty }
			});
			return info;
		}

		const refineExtra = $t(`inventory.extra`, { values: { count: `6 + ${qty - 7}` } });
		const info = $t(`inventory.constellation`, {
			values: { count: qty > 7 ? refineExtra : qty - 1 }
		});
		return info;
	};

	const getArtURL = (outfitName) => {
		if (custom) return images?.artURL;
		if (type === 'weapon') return $assets[name];

		const useOutfit = outfitName && outfitName !== 'default';
		const artKey = useOutfit ? outfitName : name;
		return $assets[`splash-art/${artKey}`];
	};

	let time = '';
	onMount(async () => {
		const idbData = await HistoryManager.getByID(itemID);
		({ time = 'UnTracked' } = idbData[0] || {});
	});

	// Shortcut
	hotkeys('esc', 'itemdetail', (e) => {
		e.preventDefault();
		closeDetail();
	});
	hotkeys.setScope('itemdetail');
	onDestroy(() => hotkeys.deleteScope('itemdetail', 'inventory'));
</script>

{#if showModal}
<ModalDetail character={name} charion={vision} charpon={weaponType} outfit={outfitName}/>
{/if}

<SplashArt
	character={name}
	artURL={getArtURL(outfitName)}
	position={offset}
	preview
	isCustom={custom}
	{weaponType}
	{localName}
	{vision}
	{onshot}
	{isOwned}
	{rarity}
	{hideInfo}
	on:close={closeDetail}
/>

{#if !hideInfo}
	<div transition:fade={{ duration: 250 }} class="handler-container">
		<div class="wrapper">
			<div class="boomboom">
				{#if type === 'character' && rarity === 5}
				<button class="damage" on:click={openModal} style="--bg:url({$assets['button.webp']})">
					{$t('details.text')}
				</button>
				{/if}
			</div>

			{#if qty > 0}
				<div class="detail">
					<span class="qty"> {getQtyInfo(type, qty)} </span>
					<small> {$t('inventory.firstSummon', { values: { date: time } })} </small>
				</div>
			{/if}

			{#if qty > 0}
				<div class="share">
					<ScreenshotShare />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.handler-container {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: +15;
		pointer-events: none;
	}

	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.wrapper > :global(div),
	.wrapper :global(button) {
		pointer-events: initial;
	}

	.share {
		display: flex;
		width: 100%;
		text-align: right;
		justify-content: flex-end;
		align-items: center;
		position: absolute;
		bottom: 5%;
		right: 8%;
		color: #fff;
		font-size: 0.8rem;
		z-index: 999;
	}

	.boomboom {
		position: absolute;
		left: 5%;
		top: 2%;
	}

	.damage {
		background-image: var(--bg);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		width: 200px;
		aspect-ratio: 355/88;
		margin: 0 5px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: rgba(0, 0, 0, 0.65);
		transition: all 0.2s;
	}

	.damage:hover {
		filter: brightness(0.7);
	}

	.detail {
		position: absolute;
		left: 5%;
		bottom: 2%;
		display: block;
		color: #fff;
		font-size: large;
		-webkit-text-stroke: #000 0.015rem;
		filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.5)) drop-shadow(0 0 1rem rgba(0, 0, 0, 1));
	}
	.detail span,
	.detail small {
		display: block;
		white-space: nowrap;
	}

	.detail .qty {
		font-size: larger;
	}

	@media screen and (max-width: 520px) {
		.detail {
			font-size: 120%;
		}
	}
</style>
