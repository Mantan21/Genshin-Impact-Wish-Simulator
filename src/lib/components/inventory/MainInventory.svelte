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
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import charDB from '$lib/data/characters.json';
	import weaponDB from '$lib/data/weapons.json';
	import { localConfig } from '$lib/store/localstore';
	import { assets, mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';
	import InventoryDetails from './InventoryDetails.svelte';
	import { checkActiveOutfit } from '$lib/helpers/outfit';

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

	let weapons = [];
	let characters = [];
	let loadedData = [];
	let dataToShow = [];
	let showAll = !!localConfig.get('showAllItems');

	// Read Data From IndeedDB
	const { getAllHistories } = HistoryIDB;

	const getAll = async () => {
		const data = await getAllHistories();
		const grouped = data.reduce((prev, current) => {
			const obj = prev || {};
			obj[current.name] = obj[current.name] || [];
			obj[current.name].push(current);
			return obj;
		}, {});

		const filtered = Object.values(grouped)
			.map((val) => {
				const { name, type, rarity, isOwned, vision, weaponType } = val[0];
				return { name, type, rarity, isOwned, vision, weaponType };
			})
			.map((v) => {
				v.qty = grouped[v.name].length;
				return v;
			});

		weapons = filtered.filter(({ type }) => type === 'weapon');
		characters = filtered.filter(({ type }) => type === 'character');

		proccessData(activeItem);
		filter();
		sort(orderby);
	};

	const filter = () => {
		if (showAll) {
			dataToShow = [...loadedData];
			return;
		}
		dataToShow = [...loadedData].filter(({ isOwned }) => isOwned);
	};

	const filterObjProps = (obj) => {
		const { name, type, rarity, isOwned, outfit, vision, weaponType, qty } = obj;
		return { name, type, rarity, isOwned, outfit, vision, weaponType, qty };
	};

	const dataCounter = (data) => data.map((v) => v.qty).reduce((a, b) => a + b, 0);

	const proccessData = (activeItem) => {
		const dataFromIDB = activeItem === 'character' ? characters : weapons;
		const allData = (activeItem === 'character' ? charDB : weaponDB).data;
		loadedData = allData.map((dd) => {
			const d = filterObjProps(dd);
			const owned = dataFromIDB.find(({ name }) => d.name === name);

			d.type = activeItem;
			if (d.type === 'character') {
				d.localName = $t(`${d.name}.name`);
				d.outfit = checkActiveOutfit(d.name)?.name;
			}
			if (d.type === 'weapon') d.localName = $t(d.name);

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
		return;
	};

	const select = (item) => {
		if (activeItem === item) return;
		playSfx('shopnav');
		activeItem = item;
		orderby = 'rarity';
		proccessData(item);
		filter();
		sort(orderby);
	};

	let content;
	onMount(() => {
		OverlayScrollbars(content, {
			sizeAutoCapable: false,
			className: 'os-theme-light'
		});
	});

	$: localConfig.set('showAllItems', showAll);

	const sort = (order) => {
		if (order === 'release') {
			dataToShow = loadedData;
			filter();
		}
		if (order === 'rarity') {
			dataToShow = dataToShow.sort((a, b) => b.rarity - a.rarity);
		}
		if (order === 'quantity') {
			dataToShow = dataToShow.sort((a, b) => b.qty - a.qty);
		}
		if (order === 'name') {
			dataToShow = dataToShow.sort((a, b) => {
				if (a.localName > b.localName) return 1;
				if (a.localName < b.localName) return -1;
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

	let detailItem = {};
	let showInventoryDetail = false;
	const handleShowDetails = (e) => {
		playSfx('collectionitem');
		detailItem = e.detail;
		showInventoryDetail = true;
	};

	const refreshAfterOutfitChanged = (charName, outfitName) => {
		const index = dataToShow.findIndex(({ name }) => name === charName);
		dataToShow[index].outfit = outfitName;
	};
	setContext('refreshList', refreshAfterOutfitChanged);
</script>

<svelte:head>
	<title>{$t(`inventory.text`)} | {$t('title', { default: APP_TITLE })}</title>
</svelte:head>

{#if showInventoryDetail}
	<InventoryDetails {...detailItem} on:close={() => (showInventoryDetail = false)} />
{/if}

<section on:click={handleCancelSelect}>
	{#each bg as b, i}
		<img
			src={$assets[`element-${b}-bg.webp`]}
			alt="Background"
			class="bg"
			crossorigin="anonymous"
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
					{#await getAll()}
						<span style="color: white; padding: 2rem; font-size: 1.2rem">
							{$t('waiting')}...
						</span>
					{:then data}
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
					{/await}
				</div>
			</div>
			<div class="filter">
				<div class="row">
					<button class="btn reverse" on:click={reverse} title="Reverse Order">
						<i class="gi-exchange" />
					</button>
					<div class="selector">
						<div class="selected-option" on:click|stopPropagation={() => selectOrder()}>
							{$t('inventory.sort')} / {$t(`inventory.${orderby}`)}

							{#if showOrder}
								<i class="gi-caret-up" />
							{:else}
								<i class="gi-caret-down" />
							{/if}
						</div>

						{#if showOrder}
							<div class="option-list above" transition:fade={{ duration: 200 }}>
								{#each ['release', 'rarity', 'name', 'quantity'] as val}
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
							</div>
						{/if}
					</div>
					<div class="showAll">
						<input
							type="checkbox"
							name="showAll"
							id="showAll"
							bind:checked={showAll}
							on:change={() => {
								playSfx();
								filter();
								sort(orderby);
							}}
						/>
						<label for="showAll">
							<i>✔</i>
							{$t(`inventory.showAllOption`, {
								values: { item: $t(activeItem), qty: dataCounter(dataToShow) }
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

	nav .nav-link:hover {
		opacity: 0.9;
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
		border: 1px solid transparent;
		transition: all 0.2s;
	}
	.showAll input:checked + label i {
		background-color: #06bbff;
	}

	.showAll:hover input + label i {
		border: 1px solid #06bbff;
		box-shadow: rgba(106, 168, 230, 0.6) 0px 0px 7px 5px;
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
