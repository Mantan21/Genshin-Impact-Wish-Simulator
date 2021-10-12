<script>
	// Library
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import OverlayScrollbars from 'overlayscrollbars';

	// store
	import { beginnerRoll, pity4star, pity5star } from '$lib/store/localstore';
	import { bannerActive, pageActive, showBeginner } from '$lib/store/stores';
	import HistoryIDB from '$lib/store/historyIdb';

	import { getName } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';
	import PopUp from '$lib/utility/PopUp.svelte';
	import { APP_TITLE } from '$lib/env';

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});

	const bannerList = [
		{
			name: 'Standard Wish',
			path: 'standard'
		},
		{
			name: 'Beginner Wish',
			path: 'beginner'
		},
		{
			name: 'Character Event Wish',
			path: 'limited'
		},
		{
			name: 'Weapon Wish',
			path: 'weapon'
		}
	];
	$: banner = $bannerActive;
	$: nowOpen = bannerList.findIndex((b) => b.path === banner.toLocaleLowerCase());
	$: selected = nowOpen < 0 ? 2 : nowOpen;
	// eslint-disable-next-line
	$: pity = globalThis.window ? pity5star.get(banner) || 0 : 0;

	let showSelectList = false;
	let activepage = 1;
	let itemPerPage = 6;
	let showPopup = false;
	let data = [];

	const { getList, resetHistory } = HistoryIDB;
	const readData = async () => {
		// eslint-disable-next-line
		if (!globalThis.window) return [];
		const list = await getList(banner);
		data = list.map((d) => d).reverse();
		return data;
	};

	const selectBanner = (path) => {
		showSelectList = !showSelectList;
		activepage = 1;
		banner = path;
		readData();
	};

	const confirmReset = async () => {
		playSfx();
		await resetHistory(banner);
		pity5star.set(banner, 0);
		pity4star.set(banner, 0);
		if (banner === 'beginner') {
			beginnerRoll.set(0);
			showBeginner.set(true);
		}
		pity = 0;
		data = [];
		showPopup = false;
	};
</script>

<svelte:head>
	<title>
		{bannerList[selected].name} | {APP_TITLE}
	</title>
</svelte:head>

<PopUp
	show={showPopup}
	title="Reset History ?"
	on:cancel={() => {
		showPopup = false;
		playSfx();
	}}
	on:confirm={confirmReset}
>
	<div class="confirmation">
		<p>
			It's also remove all Characters and Weapons related to <strong
				>{bannerList[selected].name}</strong
			>
			Banner from your Inventory. <br />
			Are You Sure to Reset ?
		</p>
	</div>
</PopUp>

<section bind:this={content}>
	<div class="header">
		<button
			on:click={() => {
				playSfx('close');
				pageActive.set('index');
			}}
		>
			<i class="gi-reply" />
		</button>
	</div>
	<div class="history-content">
		<div class="wish-type">
			<span> Select Wish Type: </span>
			<div class="select-box">
				<div
					class="selected"
					on:click={() => {
						showSelectList = !showSelectList;
					}}
				>
					{bannerList[selected].name}

					<i class="gi-caret-{showSelectList ? 'up' : 'down'}" />
				</div>

				{#if showSelectList}
					<div class="select-list" transition:fade={{ duration: 200 }}>
						{#each bannerList as { name, path }, i}
							<a
								class="item"
								href="/"
								class:active={selected === i}
								on:click|preventDefault={() => selectBanner(path)}
							>
								{name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<p>
			We Never save your data on cloud storage. All data was stored to IndexedDB, it means the data
			is saved on your browser storage. It will never delete till you delete it manualy throught
			delete/reset button or clear the browser data.
		</p>

		<div class="info row">
			<div class="cell">Pity : <span class="lighted"> <strong> {pity} </strong> </span></div>
			<div class="cell">
				Total Pull : <span class="lighted"> <strong> {data.length} </strong> </span> ~
				<span class="lighted"> <strong> ${((data.length * 160) / 60).toFixed(2)} </strong> </span>
			</div>
			<div class="cell">
				<button
					class="reset"
					on:click={() => {
						showPopup = true;
					}}><i class="gi-delete" /> Reset</button
				>
			</div>
		</div>

		<div class="table">
			<div class="row head">
				<div class="cell cell1">Item Type</div>
				<div class="cell cell2">Item Name</div>
				<div class="cell cell3">Time Received</div>
			</div>

			<div class="body">
				{#await readData()}
					<div class="row" style="justify-content: center">
						<div class="cell">Waiting ...</div>
					</div>
				{:then list}
					{#if data.length < 1}
						<div class="row" style="justify-content: center">
							<div class="cell">No data available .</div>
						</div>
					{:else}
						{#each data as { name, type, rarity, time }, i}
							{#if i > (activepage - 1) * itemPerPage - 1 && i < itemPerPage * activepage}
								<div class="row">
									<div class="cell cell1">{type}</div>
									<div class="cell cell2 star{rarity}">
										{getName(name)}
										{#if rarity > 3} ( {rarity} <i class="gi-star" /> ) {/if}
									</div>
									<div class="cell cell3">{time}</div>
								</div>
							{/if}
						{/each}
					{/if}
				{/await}
			</div>
		</div>

		<div class="pagination">
			<button
				class="prev"
				on:click={() => {
					if (activepage > 1) activepage--;
				}}
			>
				<i class="gi-angle-left" />
			</button>
			<span class="active">{activepage}</span>
			<button
				class="next"
				on:click={() => {
					if (data.length > activepage * itemPerPage) activepage++;
				}}
			>
				<i class="gi-angle-right" />
			</button>
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
	a {
		text-decoration: none;
		display: inline-block;
		margin: 5px;
	}
	section {
		background-color: #ebebeb;
		width: 100%;
		height: 100%;
		color: #757575;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.header {
		display: block;
		background-color: rgb(20, 18, 15);
		width: 100%;
	}

	.gi-reply {
		color: #dbd7d3;
		font-size: 2.2rem;
	}

	.history-content {
		padding: 20px 5% 10px;
		width: 100%;
	}
	.wish-type {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.wish-type span {
		padding: 5px;
	}

	.select-box {
		width: 270px;
		max-width: 100%;
		position: relative;
		margin: 0 15px;
	}

	.selected i {
		position: absolute;
		top: 50%;
		right: 1rem;
		font-size: 2rem;
		transform: translateY(-50%);
	}

	.selected,
	.select-list {
		width: 100%;
		border: 0.15rem solid #b5b2ae;
		background-color: #dbd7d3;
		border-radius: 0.25rem;
	}
	.selected,
	.item {
		display: block;
		color: #757575;
		text-decoration: none;
		padding: 6px 15px;
		transition: all 0.2s;
	}
	.item.active,
	.item:hover {
		background-color: #efebe7;
	}

	.select-list {
		position: absolute;
		top: 130%;
		left: 50%;
		transform: translateX(-50%);
	}

	p {
		margin: 20px 0;
	}

	.row {
		display: flex;
		justify-content: stretch;
		align-items: center;
		width: 100%;
		border: 0.2px solid #b5b2ae;
	}
	.row.head {
		background-color: #dbd7d3;
		font-weight: bold;
	}
	.body .row {
		border-top: 0;
	}
	.cell1 {
		flex: 1;
		min-width: 100px;
		width: calc(1 / 6 * 100%);
		border-right: 0.2px solid #b5b2ae;
	}
	.cell2 {
		flex: 3;
		width: calc(3 / 6 * 100%);
		border-right: 0.2px solid #b5b2ae;
	}
	.cell3 {
		width: calc(2 / 6 * 100%);
		flex: 2;
	}
	.cell {
		display: block;
		padding: 10px;
		text-align: center;
		text-transform: capitalize;
	}

	.info.row {
		border: 0;
		width: 100%;
		justify-content: space-between;
		margin-bottom: 5px;
	}

	.gi-star {
		font-size: 0.8em;
	}

	.star4,
	.lighted {
		color: #a256e1;
	}
	.star5,
	.reset {
		color: #bd6932;
	}

	.reset {
		font-size: 1em;
	}
	.reset:hover {
		text-decoration: underline;
	}

	:global(.mobile) .wish-type {
		font-size: 0.9em;
	}

	.pagination {
		display: flex;
		width: 100%;
		margin: 10px;
		text-align: center;
		justify-content: center;
	}

	.pagination button,
	.pagination span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 2px;
		margin: 5px;
	}
	.pagination button {
		background-color: #c3a280;
		color: #d7cbbd;
	}
	.pagination span {
		background-color: #918981;
		color: #fff;
	}

	@media screen and (max-width: 495px) {
		.wish-type {
			flex-direction: column;
		}
		section {
			font-size: 1.2rem;
		}
	}

	@media screen and (max-width: 900px) {
		section {
			font-size: 1.1rem;
		}
	}
</style>
