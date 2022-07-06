<script>
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import { APP_TITLE } from '$lib/env';

	// Components
	import Obtained from '$lib/components/utility/Obtained.svelte';
	import ShopNavbar from './ShopNavbar.svelte';
	import ShopHeader from './ShopHeader.svelte';
	import PaymentPopup from './PaymentPopup.svelte';
	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import Donate from './Donate.svelte';
	import PaimonBargains from './PaimonBargains.svelte';
	import CharacterOutfits from './CharacterOutfits.svelte';
	import Recomended from './Recomended.svelte';

	const random = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	let activeShop = 'genesis';

	let showNavbar = true;
	let showNavbarButton = false;

	let activeGenesisIndexforPopup; // undefined
	let showPaymentPopup = false; //false

	let showObtained = false;
	let obtainedItems = {};

	const selectShop = (e) => {
		const { selected } = e.detail;
		activeShop = selected;
		playSfx();
		if ($viewportWidth < 500) showNavbar = false;
	};

	$: if (!$mobileMode) {
		if ($viewportWidth < 745) {
			showNavbar = false;
			showNavbarButton = true;
		} else {
			showNavbar = true;
			showNavbarButton = false;
		}
	} else {
		showNavbar = true;
		showNavbarButton = false;
	}

	const genesisList = [
		{ qty: 60, price: 0.99 },
		{ qty: 300, price: 4.99 },
		{ qty: 980, price: 14.99 },
		{ qty: 1980, price: 29.99 },
		{ qty: 3280, price: 49.99 },
		{ qty: 6480, price: 99.99 }
	];

	const selectGenesis = (i) => {
		activeGenesisIndexforPopup = i;
		showPaymentPopup = true;
		playSfx('exchange');
	};
	const handleClosePopup = () => {
		showPaymentPopup = false;
	};

	const handleObtained = (itemToBuy, value) => {
		obtainedItems[itemToBuy] = value;
		showObtained = true;
	};
	setContext('handleObtained', handleObtained);

	const handleConfirmPopup = (e) => {
		showPaymentPopup = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		handleObtained(item.itemToBuy, item.value);
	};

	const handleCloseObtained = () => {
		showObtained = false;
		obtainedItems = {};
		playSfx('close');
	};
</script>

<svelte:head>
	{#if activeShop === 'genesis'}
		<title>Buy Genesis Crystal | {APP_TITLE}</title>
	{:else if activeShop === 'recomended'}
		<title>Recomended Item | {APP_TITLE}</title>
	{:else if activeShop === 'outfits'}
		<title>Character Outfits | {APP_TITLE}</title>
	{:else if activeShop === 'donate'}
		<title>Donate | {APP_TITLE}</title>
	{:else}
		<title>Paimon's Bargains | {APP_TITLE}</title>
	{/if}
</svelte:head>

<!-- Obtained Items -->
{#if showObtained}
	<Obtained items={obtainedItems} on:close={handleCloseObtained} />
{/if}
<!-- Obtained Items End -->

<!-- Genesisn Pop up -->
{#if showPaymentPopup}
	<PaymentPopup
		show={showPaymentPopup}
		price={genesisList[activeGenesisIndexforPopup].price}
		qty={genesisList[activeGenesisIndexforPopup].qty}
		on:confirm={handleConfirmPopup}
		on:cancel={handleClosePopup}
	/>
{/if}
<!-- Genesis Pop Up End -->

<section style="height: {$viewportHeight}px">
	<img class="bg" src="/assets/images/background/bg{random(1, 16)}.webp" alt="background" />
	<div class="container">
		<ShopNavbar
			show={showNavbar}
			on:select={selectShop}
			on:close={() => {
				showNavbar = false;
				playSfx();
			}}
		/>
		<div class="items-container">
			<ShopHeader
				{activeShop}
				{showNavbar}
				{showNavbarButton}
				on:showNavbar={({ detail }) => {
					showNavbar = detail.showNavbar;
					playSfx();
				}}
			/>

			<div class="item-body" in:fade={{ duration: 300 }}>
				{#if activeShop === 'genesis'}
					<ColumnParent name="genesis">
						{#each genesisList as { qty }, i}
							<Column style="padding:0">
								<button class="content" on:click={() => selectGenesis(i)}>
									<img src="/assets/images/utility/genesis-{qty}.webp" alt="genesis {qty}" />
								</button>
							</Column>
						{/each}
					</ColumnParent>

					<!-- Recomended Item -->
				{:else if activeShop === 'recomended'}
					<Recomended />

					<!-- Characters Outfits -->
				{:else if activeShop === 'outfits'}
					<CharacterOutfits />

					<!-- Donate -->
				{:else if activeShop === 'donate'}
					<Donate />

					<!-- PAIMON BARGAINS -->
				{:else if activeShop === 'paimon-bargains'}
					<PaimonBargains />
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		width: 100vw;
		display: block;
		position: relative;
		font-size: 1rem;
		/* background: linear-gradient(135deg, rgb(112, 31, 164), transparent 45%),
			linear-gradient(225deg, rgb(223, 220, 116), transparent 60%),
			linear-gradient(315deg, rgb(242, 79, 202), rgb(80, 148, 215) 25%, rgb(175, 28, 181));
		background-size: cover; */
		background-color: var(--text-color);
	}
	:global(.mobile) section {
		font-size: 0.8rem;
	}
	.bg {
		width: 100vw;
		height: 100%;
		object-fit: cover;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(1.1);
		filter: blur(10px);
		-webkit-filter: blur(10px);
		z-index: +1;
	}

	section::after {
		position: absolute;
		content: '';
		display: block;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		z-index: -1;
	}

	.container {
		display: flex;
		padding: 0 3%;
		position: relative;
		z-index: +2;
		width: 100%;
		height: 100%;
	}
	:global(.mobile) .container {
		padding: 0 2%;
	}

	.items-container {
		width: 100%;
	}

	button {
		transition: all 0.2s;
		transform: scale(1);
	}
	button:not(.nav-link-item):active {
		transform: scale(0.95);
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		border-radius: 0.5rem;
		overflow: hidden;
		text-align: center;
	}

	.content,
	.content img {
		width: 100%;
		transition: all 0.2s;
	}
	.genesis button:hover img {
		filter: drop-shadow(0 0 5px #d2c69c);
	}
</style>
