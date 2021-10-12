<script>
	// library
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import OverlayScrollbars from 'overlayscrollbars';

	// Components
	import PopUp from '$lib/utility/PopUp.svelte';
	import InventoryHeader from '$lib/inventory/InventoryHeader.svelte';
	import InventoryItem from '$lib/inventory/InventoryItem.svelte';

	// Store
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';
	import HistoryIDB from '$lib/store/historyIdb';
	import { APP_TITLE } from '$lib/env';

	import factoryReset from '$lib/functions/factoryReset';
	import playSfx from '$lib/functions/audio';
	import charDB from '$lib/setup/characters.json';
	import weaps from '$lib/setup/weapons.json';

	const rand = (array) => array[Math.floor(Math.random() * array.length)];
	const bg = ['dendro', 'anemo', 'cryo', 'hydro', 'electro', 'pyro', 'geo'];

	let itemWidth;
	$: if ($mobileMode) {
		itemWidth = (24 / 100) * $viewportHeight;
	} else if ($viewportWidth < 560) {
		itemWidth = (14 / 100) * $viewportHeight;
	} else itemWidth = (20 / 100) * $viewportHeight;

	$: itemStyle = `width: ${itemWidth}px; height:${itemWidth + 20}px`;

	let activeItem = 'Character';
	let showOrder = false;
	let orderby = 'rarity';

	const select = (item) => {
		activeItem = item;
		orderby = 'rarity';
		playSfx();
	};

	let weapons = [];
	let characters = [];
	let dataToShow = [];
	let dataQty = 0;
	let content;

	const { getAllHistories, countItem } = HistoryIDB;

	const getAll = async () => {
		const data = await getAllHistories();
		const filtered = [...new Map(data.map((d) => [d.name, d])).values()];
		weapons = filtered
			.filter(({ type }) => type === 'weapon')
			.map(async (w) => {
				w.weaponType = weaps[`star${w.rarity}`][w.name].type;
				w.qty = await countItem(w.name);
				return w;
			});

		characters = filtered
			.filter(({ type }) => type === 'character')
			.map(async (d) => {
				d.vision = charDB[`star${d.rarity}`][d.name].vision;
				d.qty = await countItem(d.name);
				return d;
			});
	};

	const getTotalItem = () => {
		dataQty = dataToShow.map((v) => v.qty).reduce((a, b) => a + b, 0);
	};

	const proccessData = async (activeItem) => {
		const data = activeItem === 'Character' ? characters : weapons;
		const promise = await Promise.all(data);
		dataToShow = promise.sort((a, b) => b.rarity - a.rarity);
		getTotalItem();
	};

	onMount(async () => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
		await getAll();
		await proccessData(activeItem);
	});

	$: proccessData(activeItem);

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

	let showPopup = false;
	const confirmReset = () => {
		factoryReset();
		showPopup = false;
		dataToShow = [];
		weapons = [];
		characters = [];
	};

	const cancelReset = () => {
		showPopup = false;
	};
</script>

<svelte:head>
	<title>Inventory | {APP_TITLE}</title>
</svelte:head>

<PopUp
	title="Factory Reset"
	show={showPopup}
	button="all"
	on:confirm={confirmReset}
	on:cancel={cancelReset}
>
	<div class="confirmation">
		<div style="padding: 1rem">
			Are You sure to clear <strong> All Data </strong> and restore to default ?
			<br /> <small> Note : It includes History, Pity, Funds and all items from Inventory.</small>
		</div>
	</div>
</PopUp>

<section>
	<img src="/assets/images/background/element-{rand(bg)}-bg.webp" alt="Background" class="bg" />

	<div class="header" transition:fly={{ y: -20 }}>
		<InventoryHeader {activeItem} />
	</div>
	<div class="body" transition:fade={{ duration: 400 }}>
		<div class="navigation">
			<nav>
				<button
					class="nav-link"
					class:active={activeItem === 'Character'}
					on:click={() => select('Character')}
				>
					<i class="gi-character" />
				</button>
				<button
					class="nav-link"
					class:active={activeItem === 'Weapon'}
					on:click={() => select('Weapon')}
				>
					<i class="gi-weapon" />
				</button>
			</nav>
		</div>
		<div class="body-content">
			<div class="container" bind:this={content}>
				<div class="list-item">
					{#if dataToShow.length < 1}
						<span style="color: white; padding: 2rem; font-size: 1.2rem">No data Found </span>
					{:else}
						{#each dataToShow as d (d)}
							<div
								class="item"
								style={itemStyle}
								animate:flip={{ duration: (i) => 30 * Math.sqrt(i) }}
							>
								<InventoryItem
									width={itemWidth}
									name={d.name}
									rarity={d.rarity}
									type={d.type}
									vision={d.vision}
									weaponType={d.weaponType}
									qty={d.qty}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div class="filter">
				<div class="row">
					<button class="sort-button" on:click={() => reverse()} title="Reverse Order">
						<i class="gi-exchange" />
					</button>
					<div class="sort-selector">
						<div class="selected-order" on:click={() => selectOrder()}>
							Sort / {orderby}

							{#if showOrder}
								<i class="gi-caret-up" />
							{:else}
								<i class="gi-caret-down" />
							{/if}
						</div>

						{#if showOrder}
							<div class="order-list" transition:fade={{ duration: 200 }}>
								<a
									href="##"
									class:selected={orderby == 'rarity'}
									on:click|preventDefault={() => selectOrder('rarity', false)}
								>
									Rarity
								</a>
								<a
									href="##"
									class:selected={orderby == 'name'}
									on:click|preventDefault={() => selectOrder('name', false)}
								>
									Name
								</a>
								<a
									href="##"
									class:selected={orderby == 'quantity'}
									on:click|preventDefault={() => selectOrder('quantity', false)}
								>
									Quantity
								</a>

								{#if activeItem === 'Character'}
									<a
										href="##"
										class:selected={orderby == 'element'}
										on:click|preventDefault={() => selectOrder('element', false)}
									>
										Element
									</a>
								{/if}

								{#if activeItem === 'Weapon'}
									<a
										href="##"
										class:selected={orderby == 'type'}
										on:click|preventDefault={() => selectOrder('type', false)}
									>
										Type
									</a>
								{/if}
							</div>
						{/if}
					</div>
					<button
						class="reset"
						title="Reset All Data"
						on:click={() => {
							showPopup = true;
							playSfx('popup');
						}}
					>
						<i class="gi-delete" />
					</button>
					<div class="total">{dataQty} Items</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.confirmation {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	section {
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
	}

	img.bg {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.header {
		position: relative;
		width: 100%;
		display: flex;
		padding: 15px 2%;
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
		width: 44px;
		height: 44px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #ede5d8;
		font-size: 2rem;
		margin: 0 15px;
		border-radius: 100%;
		opacity: 0.6;
		transition: all 0.2s;
	}
	nav .nav-link.active {
		color: #fff;
		opacity: 1;
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
		width: unset;
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
		height: calc(100vh - 150px);
		display: block;
		width: 100%;
		padding: 0 2%;
		margin-top: 2px;
	}
	.list-item {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}
	:global(.mobile) .container {
		margin-top: 45px;
		height: calc(100% - 85px);
	}
	.item {
		margin: 0.5rem;
		will-change: auto;
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

	.sort-button,
	.reset {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		height: 2rem;
		line-height: 1rem;
		color: #3a4156;
		background-color: #ede5d8;
		transform: rotate(90deg);
		font-size: 1.2rem;
		border-radius: 100%;
	}

	.reset {
		transform: unset;
		margin-right: 0.5rem;
		color: #bd6932;
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
	}
	.selected-order {
		background-color: #ede5d8;
		padding: 0.05rem 1rem;
		border-radius: 10px;
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
	}

	.order-list a {
		padding: 0.2rem 1rem;
		text-decoration: none;
		color: #3a4156;
	}
	.order-list a.selected {
		background-color: rgb(218, 202, 177);
	}

	.total {
		color: #d2c69c;
		font-size: 1rem;
		line-height: 1rem;
	}

	@media screen and (max-width: 900px) {
		:global(main):not(.mobile) .navigation nav {
			height: 40px;
			width: 100%;
		}
		nav .nav-link {
			width: 40px;
			height: 40px;
		}
	}
</style>
