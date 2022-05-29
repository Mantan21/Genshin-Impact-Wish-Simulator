<script>
	// Library
	import { browser } from '$app/env';
	import { afterUpdate, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import OverlayScrollbars from 'overlayscrollbars';

	// store
	import { beginnerRoll, guaranteedStatus, pity4star, pity5star } from '$lib/store/localstore';
	import { bannerActive, bannerList, pageActive, showBeginner, query } from '$lib/store/stores';
	import HistoryIDB from '$lib/store/historyIdb';

	import { APP_TITLE } from '$lib/env';
	import browserState from '$lib/functions/browserState';
	import { getName } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';

	// Components
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import Toast from '../utility/Toast.svelte';

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});

	$: list = $bannerList.filter((item, i, arr) => i === arr.findIndex((v) => v.type === item.type));
	//  check if beginner banner already gone, push it to hostory list
	$: if (list.findIndex(({ type }) => type === 'beginner') < 0) list.unshift({ type: 'beginner' });

	$: banner = $bannerList.find((v, i) => i === $bannerActive).type;
	$: nowOpenIndex = list.findIndex(({ type }) => type === banner.toLocaleLowerCase());
	$: selected = nowOpenIndex < 0 ? 2 : nowOpenIndex;

	$: pity5 = browser ? pity5star.get(banner) || 0 : 0;
	$: pity4 = browser ? pity4star.get(banner) || 0 : 0;

	let showSelectList = false;
	let activepage = 1;
	let itemPerPage = 6;
	let showPopup = false;
	let showToast = false;
	let data = [];
	let table;

	const { getList, resetHistory } = HistoryIDB;
	const readData = async () => {
		if (!browser) return [];
		const bannerList = await getList(banner);
		data = bannerList.map((d) => d).reverse();
		return data;
	};

	const search = (bannerName) => {
		query.set(getName(bannerName));
		pageActive.set('previous-banner');
	};

	const selectBanner = (path) => {
		showSelectList = !showSelectList;
		activepage = 1;
		banner = path;
		readData();
	};

	const confirmReset = async () => {
		await resetHistory(banner);
		pity5star.set(banner, 0);
		pity4star.set(banner, 0);
		guaranteedStatus.set(banner, false);
		if (!['beginner', 'standard'].includes(banner)) guaranteedStatus.set(`${banner}4Star`, false);
		if (banner === 'beginner') {
			beginnerRoll.set(0);
			showBeginner.set(true);
		}
		pity4 = pity5 = 0;
		data = [];
		showPopup = false;
		showToast = true;
	};

	const handleCLose = () => {
		browserState.back();
		pageActive.set('index');
		playSfx('close');
	};

	afterUpdate(() => {
		OverlayScrollbars(table, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<svelte:head>
	<title>
		{getName(banner)} Wish | {APP_TITLE}
	</title>
</svelte:head>

<PopUp
	show={showPopup}
	title="Reset History ?"
	on:cancel={() => {
		showPopup = false;
	}}
	on:confirm={confirmReset}
>
	<div class="confirmation">
		<p>
			It's also remove all Characters and Weapons related to <strong>
				{banner === 'events' ? 'Character Event' : getName(banner)}
			</strong>
			Banner from your Inventory. <br />
			Are You Sure to Reset ?
		</p>
	</div>
</PopUp>

{#if showToast}
	<Toast on:close={() => (showToast = false)}>Reset Successful</Toast>
{/if}

<section bind:this={content} transition:fade={{ duration: 200 }}>
	<div class="header">
		<button on:click={handleCLose}>
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
					{banner === 'events' ? 'Character Event' : getName(banner)} Wish

					<i class="gi-caret-{showSelectList ? 'up' : 'down'}" />
				</div>

				{#if showSelectList}
					<div class="select-list" transition:fade={{ duration: 200 }}>
						{#each list as { type }, i}
							<a
								class="item"
								href="/"
								class:active={selected === i}
								on:click|preventDefault={() => selectBanner(type)}
							>
								{type === 'events' ? 'Character Event' : getName(type)} Wish
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<p>
			We Never save your data on cloud storage. All data was stored to IndexedDB, it means the data
			is saved on your browser storage. It will never delete till you delete it manualy through
			delete/reset button or clear the browser data.
		</p>

		<div class="info row">
			<div class="cell">
				Current Pity : &nbsp; <strong class="star5"> {pity5} </strong> &nbsp; - &nbsp;
				<strong class="star4"> {pity4} </strong>
			</div>
			<div class="cell">
				Total Pull : <span class="lighted"> <strong> {data.length} </strong> </span> ~
				<span class="lighted"> <strong> ${((data.length * 160) / 60).toFixed(2)} </strong> </span>
			</div>
			<div class="cell">
				<button
					class="reset"
					on:click={() => {
						showPopup = true;
						playSfx();
					}}><i class="gi-delete" /> Reset</button
				>
			</div>
		</div>

		<div class="table" bind:this={table}>
			<div style="min-width: max-content;">
				<div class="row head">
					<div class="cell cell0">Pity</div>
					<div class="cell cell1">Item Type</div>
					<div class="cell cell2">Item Name</div>
					<div class="cell cell3">Time Received</div>
					<div class="cell cell4">Banner</div>
				</div>

				<div class="body">
					{#await readData()}
						<div class="row" style="justify-content: center">
							<div class="cell">Waiting ...</div>
						</div>
					{:then ls}
						{#if data.length < 1}
							<div class="row" style="justify-content: center">
								<div class="cell">No data available .</div>
							</div>
						{:else}
							{#each data as { name, type, rarity, time, pity, bannerName }, i}
								{#if i > (activepage - 1) * itemPerPage - 1 && i < itemPerPage * activepage}
									<div class="row">
										<div class="cell cell0 star{rarity}">{pity}</div>
										<div class="cell cell1">{type}</div>
										<div class="cell cell2 star{rarity}">
											{getName(name)}
											{#if rarity > 3} ( {rarity} <i class="gi-star" /> ) {/if}
										</div>
										<div class="cell cell3">{time}</div>
										<div class="cell cell4">
											{#if bannerName}
												{#if ['events', 'weapons'].includes(banner)}
													<a href="/" on:click|preventDefault={() => search(bannerName)}>
														{getName(bannerName)}
													</a>
												{:else}
													{getName(bannerName)}
												{/if}
											{:else}
												Untrack
											{/if}
										</div>
									</div>
								{/if}
							{/each}
						{/if}
					{/await}
				</div>
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
		margin: 5px;
	}

	.cell a {
		color: #dda04f;
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
		position: sticky;
		top: 0;
		left: 0;
		z-index: +10;
	}

	.gi-reply {
		color: #dbd7d3;
		font-size: 2.2rem;
		line-height: 0;
		padding: 0.3rem 1rem;
		display: inline-block;
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
		z-index: +1;
		top: 130%;
		left: 50%;
		transform: translateX(-50%);
	}

	p {
		margin: 20px 0;
	}

	.table {
		width: 100%;
		height: 21.5rem;
	}
	.row {
		display: flex;
		justify-content: stretch;
		align-items: center;
		width: 100%;
		border: 0.2px solid #b5b2ae;
		height: 3rem;
	}
	.row.head {
		background-color: #dbd7d3;
		font-weight: bold;
	}
	.body .row {
		border-top: 0;
	}

	.cell0 {
		width: calc(1 / 12 * 100%);
		border-right: 0.2px solid #b5b2ae;
	}
	.cell1 {
		min-width: 80px;
		width: calc(2 / 12 * 100%);
		border-right: 0.2px solid #b5b2ae;
	}
	.cell2 {
		width: calc(4 / 12 * 100%);
		border-right: 0.2px solid #b5b2ae;
		min-width: 15rem;
	}
	.cell3 {
		width: calc(2.5 / 12 * 100%);
		border-right: 0.2px solid #b5b2ae;
		min-width: 12rem;
	}
	.cell4 {
		width: calc(2.5 / 12 * 100%);
		min-width: 12rem;
	}
	.cell {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0.5rem;
		height: 100%;
		text-align: center;
		text-transform: capitalize;
		line-height: 1rem;
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
