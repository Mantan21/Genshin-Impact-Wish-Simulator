<script>
	import { getContext, onMount, setContext } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';

	import { data as charDB } from '$lib/data/characters.json';
	import { data as weaponDB } from '$lib/data/weapons.json';
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/app-stores';
	import { BannerManager } from '$lib/store/IDB-manager';
	import { owneditem } from '$lib/store/localstore-manager';
	import { setActiveOutfit } from '$lib/helpers/outfit';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { imageCDN } from '$lib/helpers/assets';
	import InventoryItem from './_inventory-item.svelte';

	export let activeItem = 'character';
	export let orderby = 'rarity';
	export let showAll = false;
	export let reverse = false;
	export let outfitData = { charName: '', outfitName: '' };

	let weapons = [];
	let characters = [];
	let dataToShow = [];
	let loadedData = [];
	let isLoaded = false;

	const showDetail = getContext('showDetail');
	const pickItem = (itemID) => {
		const detailData = dataToShow.find(({ itemID: id }) => itemID === id);
		showDetail(detailData);
	};
	setContext('pickItem', pickItem);

	const itemQty = { weapon: 0, character: 0 };
	const setItemQty = getContext('setItemQty');
	const ownedItems = owneditem.getAll();

	const orderData = (data, orderby) => {
		if (!orderby || !data || !Array.isArray(data)) return data;
		if (orderby === 'release') return data;
		if (orderby === 'rarity') {
			return data.sort((a, b) => b.rarity - a.rarity);
		}
		if (orderby === 'quantity') {
			return data.sort((a, b) => b.qty - a.qty);
		}
		if (orderby === 'name') {
			return data.sort((a, b) => {
				if (a.localName > b.localName) return 1;
				if (a.localName < b.localName) return -1;
				return 0;
			});
		}
		if (orderby === 'element') {
			return data.sort((a, b) => {
				if (a.vision > b.vision) return 1;
				if (a.vision < b.vision) return -1;
				return 0;
			});
		}
		if (orderby === 'type') {
			return data.sort((a, b) => {
				if (a.weaponType > b.weaponType) return 1;
				if (a.weaponType < b.weaponType) return -1;
				return 0;
			});
		}
	};

	const itemLocalName = (name, type) => {
		if (type === 'weapon') return $t(name);
		return $t(`${name}.name`);
	};

	const customItem = async () => {
		const idb = await BannerManager.getAll();
		const data = idb.reverse().map((d) => {
			const { character, status, images, hostedImages } = d;
			d.name = character;
			d.rarity = 5;
			d.custom = true;
			d.images = status != 'owned' ? imageCDN(hostedImages) : images;
			return d;
		});

		return data.filter(({ character, images }) => {
			const isComplete = character && images && images?.artURL;
			return isComplete;
		});
	};
	const loadItems = async (type) => {
		const isChar = type === 'character';
		const data = isChar ? [...(await customItem()), ...charDB] : weaponDB;
		const dataResult = data.map(({ name, itemID, rarity, weaponType, vision, images, custom }) => {
			const { wish = 0, manual = 0 } = ownedItems[itemID] || {};
			const qty = wish + manual;
			const type = weaponType ? 'weapon' : 'character';
			const localName = custom ? name : itemLocalName(name, type);
			const isOwned = qty > 0;
			itemQty[type] = qty > 0 ? itemQty[type] + 1 : itemQty[type];

			// prettier-ignore
			return { name, localName, rarity, type, vision, weaponType, qty, isOwned, images, itemID, custom };
		});
		return dataResult;
	};

	const outfitHandle = ({ outfitName, charName }) => {
		if (!isLoaded) return;
		const index = dataToShow.findIndex(({ name }) => name === charName);
		dataToShow[index].outfitName = outfitName;
		dataToShow[index].useOutfit = outfitName !== 'default';
	};

	const showHandle = (showAll, orderBy) => {
		if (!isLoaded) return;
		if (showAll) return (dataToShow = orderData([...loadedData], orderBy));
		const data = [...loadedData].filter(({ isOwned }) => isOwned);
		dataToShow = orderData(data, orderBy);
	};

	const reverseHandle = () => {
		if (!isLoaded) return;
		dataToShow = dataToShow.reverse();
		playSfx();
	};

	const proccessData = (activeItem) => {
		if (!isLoaded) return;
		loadedData = activeItem === 'character' ? characters : weapons;
		setItemQty({ owned: itemQty[activeItem], all: loadedData.length });
		showHandle(showAll, orderby);
		return;
	};

	const getAll = async () => {
		characters = (await loadItems('character')).map((c) => {
			const charData = setActiveOutfit(c);
			delete charData.offset;
			return charData;
		});
		weapons = await loadItems('lightcone');
		isLoaded = true;
		proccessData(activeItem);
	};

	$: outfitHandle(outfitData);
	$: proccessData(activeItem);
	$: showHandle(showAll, orderby);
	$: reverseHandle(reverse);
	onMount(getAll);

	let itemWidth = 150;
	const setItemWidth = (viewportWidth, isMobileMode) => {
		itemWidth = (20 / 100) * viewportWidth;
		if (isMobileMode) {
			itemWidth = (24 / 100) * $viewportHeight;
			return;
		}

		if (itemWidth < 150) {
			itemWidth = 130;
			return;
		}

		if (itemWidth > 150) {
			itemWidth = 150;
			return;
		}
	};
	$: setItemWidth($viewportWidth, $mobileMode);
</script>

<div class="list-item" style="--item-width: {itemWidth}px">
	{#if !isLoaded}
		<span style="color: white; padding: 2rem; font-size: 1.2rem">
			{$t('waiting')}...
		</span>
	{:else if !dataToShow || dataToShow.length < 1}
		<span style="color: white; padding: 2rem; font-size: 1.2rem">
			{$t('history.noData')}
		</span>
	{:else}
		{#each dataToShow as d, i (d)}
			<div
				class="item"
				animate:flip={{ duration: (i) => 25 * Math.sqrt(i) }}
				in:fade={{ duration: 300, delay: Math.sqrt(i * 2500) }}
			>
				<InventoryItem {...d} />
			</div>
		{/each}
	{/if}
</div>

<style>
	.list-item {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}

	.list-item:hover {
		will-change: scroll-position;
	}

	.item {
		margin: 0.5rem;
		aspect-ratio: 8.75 / 10;
		width: 20vh;
		max-width: 135px;
	}
	:global(.mobile) .item {
		width: 24vh;
	}

	@media screen and (max-width: 400px) {
		.item {
			width: 14vh;
		}
	}
</style>
