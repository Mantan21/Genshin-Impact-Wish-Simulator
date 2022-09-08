<script>
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { APP_TITLE } from '$lib/env';
	import { mobileMode, viewportHeight, viewportWidth, genesis } from '$lib/store/stores';
	import { localBalance, localOutfits } from '$lib/store/localstore';
	import playSfx from '$lib/helpers/audio';
	import HistoryIDB from '$lib/store/historyIdb';

	// Components
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import WishResult from '$lib/components/wish/WishResult.svelte';
	import ExchangePopup from './ExchangePopup.svelte';
	import ShopHeader from './ShopHeader.svelte';
	import ShopNavbar from './ShopNavbar.svelte';
	import CharacterOutfits from './CharacterOutfits.svelte';
	import PaimonBargains from './PaimonBargains.svelte';
	import Recomended from './Recomended.svelte';
	import GenesisCrystal from './GenesisCrystal.svelte';
	import Donate from './Donate.svelte';

	const random = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	$: title = $t('title', { default: APP_TITLE });
	let activeShop = 'genesis';
	let showNavbar = true;
	let showNavbarButton = false;

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

	const showNavbarHandle = ({ detail }) => {
		showNavbar = detail.showNavbar;
		playSfx();
	};

	// Purchase Outifts
	let showExchangePopup = false;
	let showPopupAlert = false;
	let isOutfitOwned = false;
	let outfitToBuy = '';
	let outfitPrice = 0;
	let outfitRarity = 0;
	let outfitsData = [];
	let recentlyBuyIndex;

	$: itemData = [{ rarity: outfitRarity, outfitName: outfitToBuy }];
	let showObtainedOutfit = false;

	const forcePurchase = () => {
		showExchangePopup = true;
		showPopupAlert = false;
	};

	const buy = (item) => {
		const index = outfitsData.findIndex(({ name }) => item === name);
		recentlyBuyIndex = index;
	};

	const confirmBuy = () => {
		genesis.update((v) => {
			const newVal = v - outfitPrice;
			localBalance.set('genesis', newVal);
			return newVal;
		});
		localOutfits.set(outfitToBuy);
		buy(outfitToBuy);
		showObtainedOutfit = true;
		handleClosePopup();
	};

	const handleClosePopup = () => {
		showExchangePopup = false;
	};

	const checkCharacter = async (charName) => {
		const dt = await HistoryIDB.getByName(charName);
		return dt.length > 0;
	};

	const selectItem = async (data, i = -1) => {
		playSfx();
		if ((Array.isArray(data) && !data[i]) || !data) return;
		const item = Array.isArray(data) ? data[i] : data;
		outfitsData = Array.isArray(data) ? data : [data];
		// prettier-ignore
		const {
			name,
			price,
			promoPrice,
			isPromo,
			rarity,
			isOwned,
			characterName
		} = item;

		const isOwnedChar = await checkCharacter(characterName);
		showPopupAlert = !isOwnedChar && !isOwned;
		showExchangePopup = isOwnedChar || isOwned;
		outfitToBuy = name;
		outfitPrice = isPromo ? promoPrice : price;
		outfitRarity = rarity;
		isOutfitOwned = isOwned;
	};
	setContext('selectItem', selectItem);
</script>

<svelte:head>
	{#if activeShop === 'genesis'}
		<title>{$t('shop.buyGenesisHeading')} | {title}</title>
	{:else if activeShop === 'recomended'}
		<title>{$t('shop.recomendedHeading')} | {title}</title>
	{:else if activeShop === 'outfits'}
		<title>{$t('outfit.heading')} | {title}</title>
	{:else if activeShop === 'donate'}
		<title>Donate | {title}</title>
	{:else}
		<title>{$t('shop.paimonHeading')} | {title}</title>
	{/if}
</svelte:head>

<!-- ObtainedOutfit -->
{#if showObtainedOutfit}
	<WishResult
		list={itemData}
		on:wishEnd={() => (showObtainedOutfit = false)}
		fromShop
		outfitName={outfitToBuy}
	/>
{/if}

<PopUp
	show={showPopupAlert}
	title={$t('shop.purchaseConfirm')}
	on:cancel={() => (showPopupAlert = false)}
	on:confirm={forcePurchase}
>
	<div
		class="confirmation"
		style="display: flex; justify-content:center; align-items:center; height:100%; width:100%"
	>
		<p>
			{$t('outfit.purchasePrompt')} <br />
			{$t('outfit.promptInfo')}
		</p>
	</div>
</PopUp>

<ExchangePopup
	outfit
	show={showExchangePopup}
	itemToBuy={outfitToBuy}
	itemRarity={outfitRarity}
	price={outfitPrice}
	on:cancel={handleClosePopup}
	on:confirm={confirmBuy}
	{isOutfitOwned}
/>
<!-- ObtainedOutfit -->

<section style="height: {$viewportHeight}px">
	<img class="bg" src="/images/background/bg{random(1, 16)}.webp" alt="background" />
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
			<ShopHeader {activeShop} {showNavbar} {showNavbarButton} on:showNavbar={showNavbarHandle} />

			<div class="item-body" in:fade={{ duration: 300 }}>
				{#if activeShop === 'genesis'}
					<GenesisCrystal />

					<!-- Recomended Item -->
				{:else if activeShop === 'recomended'}
					<Recomended {recentlyBuyIndex} />

					<!-- Characters Outfits -->
				{:else if activeShop === 'outfits'}
					<CharacterOutfits {recentlyBuyIndex} />

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

	.item-body {
		height: 100%;
		overflow-y: auto;
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
</style>
