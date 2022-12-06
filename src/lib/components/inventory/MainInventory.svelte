<script>
	// library
	import { onMount, setContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { flip } from 'svelte/animate';
	import OverlayScrollbars from 'overlayscrollbars';

	// Components
	import InventoryHeader from './InventoryHeader.svelte';
	import InventoryItem from './InventoryItem.svelte';

	// Store
	import HistoryIDB from '$lib/store/historyIdb';
	import { APP_TITLE } from '$lib/env';
	import playSfx from '$lib/helpers/audio/audio';
	import charDB from '$lib/data/characters.json';
	import weaponDB from '$lib/data/weapons.json';
	import { localConfig } from '$lib/store/localstore';
	import { assets, mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';
	import InventoryDetails from './InventoryDetails.svelte';
	import { isOutfitSet } from '$lib/helpers/outfit';

	const bg = ['dendro', 'anemo', 'cryo', 'hydro', 'electro', 'pyro', 'geo'];
	let activeBgIndex = Math.floor(Math.random() * bg.length);
	let headerHeight = 0;

	setInterval(() => {
		activeBgIndex = activeBgIndex === bg.length - 1 ? 0 : activeBgIndex + 1;
	}, 6500);

	const inTransition = (node, args) => {
		return args.mobile ? fly(node, { x: -20, duration: 400 }) : fade(node, { duration: 400 });
	};

	$: itemWidth = (20 / 100) * $viewportWidth;
	$: if ($mobileMode) {
		itemWidth = (24 / 100) * $viewportHeight;
	} else if (itemWidth < 150) {
		itemWidth = 130;
	} else if (itemWidth > 150) {
		itemWidth = 150;
	}

	let activeItem = 'character';
	let showOrder = false;
	let orderby = 'rarity';

	const select = (item) => {
		if (activeItem === item) return;
		playSfx('shopnav');
		activeItem = item;
		orderby = 'rarity';
		proccessData(item, showAll);
	};

	let weapons = [];
	let characters = [];
	let dataToShow = [];
	let dataQty = 0;
	let showAll = !!localConfig.get('showAllItems');

	// Read All date
	const listWithRarity = (list, rarity) => {
		return list.map((l) => {
			l.rarity = rarity;
			return l;
		});
	};
	const allCharacters = () =>
		charDB.data.reduce((prev, { list, rarity }) => {
			return [...prev, ...listWithRarity(list, rarity)];
		}, []);
	const allWeapons = () =>
		weaponDB.data.reduce((prev, { list, rarity }) => {
			return [...prev, ...listWithRarity(list, rarity)];
		}, []);

	// Read Data From IndeedDB
	const { getAllHistories, countItem } = HistoryIDB;

	const getAll = async () => {
		const data = await getAllHistories();
		const filtered = [...new Map(data.map((d) => [d.name, d])).values()];
		weapons = filtered
			.filter(({ type }) => type === 'weapon')
			.map(async (w) => {
				w.qty = await countItem(w.name);
				return w;
			});

		characters = filtered
			.filter(({ type }) => type === 'character')
			.map(async (d) => {
				d.qty = await countItem(d.name);
				return d;
			});
	};

	const getTotalItem = (data) => {
		dataQty = data.map((v) => v.qty).reduce((a, b) => a + b, 0);
	};

	const filterObjProps = (obj) => {
		const { name, type, rarity, isOwned, outfitSet, vision, weaponType, qty } = obj;
		return { name, type, rarity, isOwned, outfitSet, vision, weaponType, qty };
	};

	const proccessData = async (activeItem, isShowAll = false) => {
		const data = activeItem === 'character' ? characters : weapons;
		const promise = await Promise.all(data);
		const dataFromIDB = promise.sort((a, b) => b.rarity - a.rarity);
		getTotalItem(dataFromIDB);
		if (!isShowAll) {
			dataToShow = dataFromIDB.map((d) => {
				const dd = filterObjProps(d);
				dd.isOwned = true;
				if (dd.type === 'weapon') return dd;
				dd.outfitSet = isOutfitSet(dd.name);
				return dd;
			});
			return;
		}

		// If Show All Items
		const allData = activeItem === 'character' ? allCharacters() : allWeapons();
		const mergeData = allData.map((dd) => {
			const d = filterObjProps(dd);
			const owned = dataFromIDB.find(({ name }) => d.name === name);
			d.type = activeItem;
			if (!owned) {
				d.qty = 0;
				d.isOwned = false;
				return d;
			}
			const { qty } = owned;
			d.qty = qty;
			d.isOwned = true;
			return d;
		});

		dataToShow = mergeData.map((d) => {
			if (d.type === 'weapon') return d;
			d.outfitSet = isOutfitSet(d.name);
			return d;
		});
		return;
	};

	let content;
	onMount(async () => {
		await getAll();
		await proccessData(activeItem, showAll);
		OverlayScrollbars(content, {
			sizeAutoCapable: false,
			className: 'os-theme-light'
		});
	});

	$: localConfig.set('showAllItems', showAll);

	const sort = (order) => {
		if (order === 'rarity') {
			dataToShow = dataToShow.sort((a, b) => b.rarity - a.rarity);
		}
		if (order === 'quantity') {
			dataToShow = dataToShow.sort((a, b) => b.qty - a.qty);
		}
		if (order === 'name') {
			dataToShow = dataToShow.sort((a, b) => {
				if (a.name > b.name) return 1;
				if (a.name < b.name) return -1;
				return 0;
			});
		}
		if (order === 'element') {
			dataToShow = dataToShow.sort((a, b) => {
				if (a.vision > b.vision) return 1;
				if (a.vision < b.vision) return -1;
				return 0;
			});
		}
		if (order === 'type') {
			dataToShow = dataToShow.sort((a, b) => {
				if (a.weaponType > b.weaponType) return 1;
				if (a.weaponType < b.weaponType) return -1;
				return 0;
			});
		}

		if (order === 'owned') {
			dataToShow = dataToShow.sort((a, b) => {
				if (a.isOwned < b.isOwned) return 1;
				if (a.isOwned > b.isOwned) return -1;
				return 0;
			});
		}
	};

	const selectOrder = (order = null, value = null) => {
		showOrder = value !== null ? value : !showOrder;
		playSfx();
		if (!order) return;
		orderby = order;
		sort(order);
	};

	const reverse = () => {
		dataToShow = dataToShow.reverse();
		playSfx();
	};

	const handleCancelSelect = () => {
		showOrder = false;
	};

	let detailName = '';
	let showInventoryDetail = false;
	const handleShowDetails = (e) => {
		playSfx('collectionitem');
		const { name } = e.detail;
		detailName = name;
		showInventoryDetail = true;
	};

	const refreshAfterOutfitChanged = (charName, val) => {
		const index = dataToShow.findIndex(({ name }) => name === charName);
		dataToShow[index].outfitSet = val;
	};
	setContext('refreshList', refreshAfterOutfitChanged);
</script>

<svelte:head>
	<title>{$t(`inventory.text`)} | {$t('title', { default: APP_TITLE })}</title>
</svelte:head>

<InventoryDetails
	show={showInventoryDetail}
	name={detailName}
	on:close={() => (showInventoryDetail = false)}
/>

<section on:click={handleCancelSelect}>
	{#each bg as b, i}
		<img
			src={$assets[`element-${b}-bg.webp`]}
			alt="Background"
			class="bg"
			class:active={activeBgIndex === i}
		/>
	{/each}

	<div class="header" bind:clientHeight={headerHeight} in:fly={{ y: -20 }}>
		<InventoryHeader {activeItem} />
	</div>
	<div class="body">
		<div class="navigation" in:inTransition={{ mobile: $mobileMode }}>
			<nav>
				<button
					class="nav-link"
					class:active={activeItem === 'character'}
					on:click={() => select('character')}
				>
					<i class="gi-character" />
					{$mobileMode ? '' : $t('character')}
				</button>
				<button
					class="nav-link"
					class:active={activeItem === 'weapon'}
					on:click={() => select('weapon')}
				>
					<i class="gi-weapon" />
					{$mobileMode ? '' : $t('weapon')}
				</button>
			</nav>
		</div>
		<div class="body-content" in:fade={{ duration: 400 }}>
			<div
				class="container"
				bind:this={content}
				style="--headerHeight:{$viewportHeight - headerHeight}px;"
			>
				<div class="list-item" style="--item-width: {itemWidth}px">
					{#if dataToShow.length < 1}
						<span style="color: white; padding: 2rem; font-size: 1.2rem">
							{$t('history.noData')}
						</span>
					{:else}
						{#each dataToShow as d, i (d)}
							<div
								class="item"
								animate:flip={{ duration: (i) => 30 * Math.sqrt(i) }}
								in:fade={{ duration: 300, delay: Math.sqrt(i * 2500) }}
							>
								<InventoryItem {...d} on:click={handleShowDetails} />
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div class="filter">
				<div class="row">
					<button class="sort-button" on:click={reverse} title="Reverse Order">
						<i class="gi-exchange" />
					</button>
					<div class="sort-selector">
						<div class="selected-order" on:click|stopPropagation={() => selectOrder()}>
							{$t('inventory.sort')} / {$t(`inventory.${orderby}`)}

							{#if showOrder}
								<i class="gi-caret-up" />
							{:else}
								<i class="gi-caret-down" />
							{/if}
						</div>

						{#if showOrder}
							<div class="order-list" transition:fade={{ duration: 200 }}>
								{#each ['rarity', 'name', 'quantity'] as val}
									<a
										href="##"
										class:selected={orderby == val}
										on:click|preventDefault={() => selectOrder(val, false)}
									>
										{$t(`inventory.${val}`)}
									</a>
								{/each}

								{#if activeItem === 'character'}
									<a
										href="##"
										class:selected={orderby == 'element'}
										on:click|preventDefault={() => selectOrder('element', false)}
									>
										{$t(`inventory.element`)}
									</a>
								{/if}

								{#if activeItem === 'weapon'}
									<a
										href="##"
										class:selected={orderby == 'type'}
										on:click|preventDefault={() => selectOrder('type', false)}
									>
										{$t(`inventory.type`)}
									</a>
								{/if}

								{#if showAll}
									<a
										href="##"
										class:selected={orderby == 'owned'}
										on:click|preventDefault={() => selectOrder('owned', false)}
									>
										{$t(`inventory.owned`)}
									</a>
								{/if}
							</div>
						{/if}
					</div>
					<div class="showAll">
						<input
							type="checkbox"
							name="showAll"
							id="showAll"
							bind:checked={showAll}
							on:change={(e) => proccessData(activeItem, e.target.checked)}
						/>
						<label for="showAll">
							<i>✔</i>
							{$t(`inventory.showAllOption`, {
								values: { item: $t(activeItem), qty: dataQty }
							})}
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #000;
	}

	img.bg {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity 6s ease;
	}

	img.bg.active {
		opacity: 1;
	}

	.header {
		position: relative;
		width: 100%;
		display: flex;
		padding: 15px 2%;
		z-index: +2;
	}

	/* mobile */

	:global(.mobile) .header {
		position: fixed;
		top: 0;
		right: 0;
		width: calc(100% - 65px);
		display: flex;
		justify-content: space-between;
		padding: 5px 2%;
	}

	.body {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		position: relative;
		z-index: +1;
	}

	.navigation {
		text-align: center;
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 10;
		width: 100%;
	}

	.navigation nav {
		width: 80%;
		height: 44px;
		margin-top: 5px;
		border-width: 0.1rem 0 !important;
		border: solid rgba(207, 186, 143, 0.5);
		display: flex;
		justify-content: center;
		background-image: linear-gradient(
			to left,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 0.6),
			rgba(0, 0, 0, 0.6),
			rgba(0, 0, 0, 0)
		);
	}

	nav .nav-link {
		height: 44px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #ede5d8;
		margin: 0 15px;
		line-height: 0;
		border-radius: 100%;
		opacity: 0.6;
		transition: all 0.2s;
	}
	nav .nav-link.active {
		color: #fff;
		opacity: 1;
	}

	nav .nav-link i {
		font-size: 1.5rem;
	}

	:global(.mobile) .navigation {
		flex-direction: column;
		align-items: flex-end;
		width: 70px;
		margin-top: 0;
		height: 100%;
		justify-content: flex-start;
		padding-top: 0;
	}

	:global(.mobile) .body {
		flex-direction: row;
	}
	:global(.mobile) nav {
		display: block;
		height: 100vh;
		background-color: #484f62;
		z-index: -1;
		text-align: center;
		border-width: 0 0.1rem !important;
		width: 40px;
		margin-top: 0;
		padding-top: 50px;
		background-image: none;
	}

	:global(.mobile) nav .nav-link {
		margin: 0;
		font-size: 1.7rem;
		margin: 5px 0;
		height: unset;
		position: relative;
		line-height: 1rem;
		padding: 0.3rem;
		opacity: unset;
		background-color: #3a4156;
	}
	:global(.mobile) nav .nav-link.active {
		color: #3a4156;
		background-color: transparent;
	}
	:global(.mobile) nav .nav-link::after {
		position: absolute;
		top: 0;
		right: -0.2rem;
		content: '';
		display: block;
		width: 1000%;
		height: 100%;
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		z-index: -1;
		transition: all 0.2s;
	}
	:global(.mobile) nav .nav-link.active::after {
		background-color: #ede5d8;
	}

	/* List */
	.body-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.container {
		height: calc(var(--headerHeight) - 6.3rem);
		display: block;
		width: 100%;
		padding: 0 2%;
		margin-top: 2px;
		/* overflow-y: auto; */
	}

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

	:global(.mobile) .container {
		margin-top: 45px;
		height: calc(100% - 85px);
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

	.filter {
		height: 3rem;
		width: 100%;
	}

	.filter .row {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 2%;
	}

	.sort-button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 1.8rem;
		height: 1.8rem;
		line-height: 1rem;
		color: #3a4156;
		background-color: #ede5d8;
		transform: rotate(90deg);
		font-size: 1rem;
		border-radius: 100%;
	}

	.sort-selector {
		color: #3a4156;
		font-size: 1rem;
		margin: 0 0.5rem;
		display: inline-block;
		width: 200px;
		max-width: 35%;
		position: relative;
		text-transform: capitalize;
		font-size: 0.85rem;
	}
	.selected-order {
		background-color: #ede5d8;
		padding: 0.3rem 1rem;
		border-radius: 10rem;
	}

	.selected-order i {
		display: inline-block;
		position: absolute;
		right: 1rem;
	}

	.order-list {
		position: absolute;
		top: -30%;
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: #ede5d8;
		transform: translateY(-100%);
		border-radius: 0.3rem;
		padding: 0.2rem 0;
		z-index: +10;
	}

	.order-list a {
		padding: 0.7rem 1rem;
		text-decoration: none;
		color: #3a4156;
		transition: all 0.2s;
	}
	.order-list a.selected,
	.order-list a:hover {
		background-color: rgb(218, 202, 177);
	}

	.showAll {
		margin-left: 0.5rem;
		color: var(--tertiary-color);
		text-transform: capitalize;
	}
	label {
		cursor: inherit;
	}
	.showAll input + label i {
		color: white;
		display: inline-block;
		padding: 0.1rem 0.2rem 0.1rem 0.1rem;
		line-height: 1rem;
		background-color: #fff;
	}
	.showAll input:checked + label i {
		background-color: #06bbff;
	}

	.showAll input {
		display: none;
	}

	@media screen and (max-width: 900px) {
		:global(main):not(.mobile) .navigation nav {
			height: 40px;
			width: 100%;
		}
		nav .nav-link {
			height: 40px;
		}
		.container {
			height: calc(var(--headerHeight) - 7rem);
			margin-top: 0;
		}
	}

	@media screen and (max-width: 400px) {
		.item {
			width: 14vh;
		}
	}
</style>
