<script>
	import { outfitsPromo } from '$lib/setup/wish-setup.json';
	import { outfits } from '$lib/data/outfits.json';
	import playSfx from '$lib/functions/audio';
	import { getName } from '$lib/functions/nameText';
	import { localBalance, localOutfits } from '$lib/store/localstore';
	import { genesis } from '$lib/store/stores';

	// Components
	import WishResult from '../banner/parts/WishResult.svelte';
	import Icon from '../utility/Icon.svelte';
	import ExchangePopup from './ExchangePopup.svelte';
	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import PopUp from '../utility/PopUp.svelte';
	import HistoryIDB from '$lib/store/historyIdb';

	const outfitsData = outfits.map((outfit) => {
		outfit.isOwned = localOutfits.check(outfit.name);
		outfit.isPromo = outfit.name === outfitsPromo;
		return outfit;
	});

	let showExchangePopup = false;
	let outfitToBuy = '';
	let outfitPrice = 0;
	let outfitRarity = 0;
	let outfitDescription = '';
	let isOutfitOwned = false;

	let showPopupAlert = false;
	const checkCharacter = async (charName) => {
		const dt = await HistoryIDB.getByName(charName);
		return dt.length > 0;
	};

	const selectItem = async (item) => {
		playSfx('exchange');
		const { name, price, promoPrice, isPromo, rarity, description, isOwned, characterName } = item;

		const isOwnedChar = await checkCharacter(characterName);
		showPopupAlert = !isOwnedChar && !isOwned;
		showExchangePopup = isOwnedChar || isOwned;
		outfitToBuy = name;
		outfitPrice = isPromo ? promoPrice : price;
		outfitRarity = rarity;
		outfitDescription = description;
		isOutfitOwned = isOwned;
	};

	const forcePurchase = () => {
		showExchangePopup = true;
		showPopupAlert = false;
	};

	$: itemData = [{ rarity: outfitRarity, outfitName: outfitToBuy }];
	let showObtained = false;

	const buy = (item) => {
		const index = outfitsData.findIndex(({ name }) => item === name);
		outfitsData[index].isOwned = true;
	};

	const confirmBuy = () => {
		genesis.update((v) => {
			const newVal = v - outfitPrice;
			localBalance.set('genesis', newVal);
			return newVal;
		});
		localOutfits.set(outfitToBuy);
		buy(outfitToBuy);
		showObtained = true;
		handleClosePopup();
	};

	const handleClosePopup = () => {
		showExchangePopup = false;
	};
</script>

<!-- Fates Popup -->
<ExchangePopup
	outfit
	show={showExchangePopup}
	itemToBuy={outfitToBuy}
	description={outfitDescription}
	rarity={outfitRarity}
	price={outfitPrice}
	on:cancel={handleClosePopup}
	on:confirm={confirmBuy}
	{isOutfitOwned}
/>
<!-- Fates Popup End -->

<PopUp
	show={showPopupAlert}
	title="Purchase Confirmation"
	on:cancel={() => (showPopupAlert = false)}
	on:confirm={forcePurchase}
>
	<div
		class="confirmation"
		style="display: flex; justify-content:center; align-items:center; height:100%; width:100%"
	>
		<p>
			You don't have a character for this costume yet, are you sure you want to purchase this
			costume? <br /> You can still use this costume after getting the right character
		</p>
	</div>
</PopUp>

{#if showObtained}
	<WishResult
		list={itemData}
		on:wishEnd={() => (showObtained = false)}
		fromShop
		outfitName={outfitToBuy}
	/>
{/if}

<ColumnParent>
	{#each outfitsData as { name, price, promoPrice, isPromo, isOwned, rarity }, i}
		<Column style="padding: .3rem">
			<button class:discount={isPromo} on:click={() => selectItem({ ...outfitsData[i] })}>
				<div class="content">
					{#if isPromo}
						<div class="discount-percentage">20%</div>
					{/if}

					<div
						class="thumbnail"
						style="background-image: url('/assets/images/utility/{rarity}star-bg.webp');"
					>
						<picture>
							<img
								src="/assets/images/characters/outfit/thumbnail/{name}.webp"
								alt={getName(name)}
							/>
						</picture>
						<caption>
							<span class="name">{getName(name)}</span>
							{#if isOwned}
								<span class="owned">Already Owned</span>
							{:else}
								<span class="desc">Purchase Up to 1</span>
							{/if}
						</caption>
					</div>
					<div class="price">
						<Icon type="genesis" width="15%" />
						{#if isPromo}
							<del class="real-price">{price}</del>
						{/if}
						<span style="margin-left: 5px">{isPromo ? promoPrice : price}</span>
					</div>
				</div>
			</button>
		</Column>
	{/each}
</ColumnParent>

<style>
	button {
		width: 100%;
		height: 100%;
		transition: all 0.2s;
		position: relative;
	}
	button::after {
		content: '';
		position: absolute;
		z-index: -1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border-radius: 0.8rem;
		border: 0.3rem solid #eac343;
		opacity: 0;
		transition: opacity 0.15s;
	}
	button:hover::after {
		opacity: 1;
	}
	button:active {
		transform: scale(0.95);
	}

	.discount-percentage {
		color: #fff;
		background-color: #88ba59;
		position: absolute;
		top: -0.4rem;
		left: -0.4rem;
		z-index: +1;
		padding: 0.2rem 0.7rem;
		font-size: 0.8rem;
		border-bottom-left-radius: 1rem;
		border-top-left-radius: 1rem;
		border-bottom-right-radius: 2rem;
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
		background-color: #596982;
	}
	.thumbnail {
		height: 100%;
		width: 100%;
		position: relative;
		background-size: cover;
	}

	picture::after {
		width: 100%;
		height: 50%;
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		background-image: linear-gradient(to top, rgba(174, 148, 211, 0.8) 40%, rgba(174, 148, 211, 0));
	}

	picture {
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
	}
	img {
		width: 58%;
		height: auto;
	}

	caption {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 100%;
		transform: translateX(-50%);
		z-index: +2;
	}
	caption span {
		display: block;
	}

	.name {
		color: #fdf5f5;
		font-size: 1.1rem;
		line-height: 1.2rem;
		-webkit-text-stroke: 0.02rem #675c31;
		text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.6);
	}

	@media screen and (max-width: 400px) {
		.name {
			font-size: 1.3rem;
		}
	}

	.desc,
	.owned {
		color: #e8dfbb;
		font-size: 0.8em;
		padding-bottom: 0.2rem;
	}

	.owned {
		background-color: #e86b69;
		padding-top: 0.2rem;
	}

	.price {
		width: 100%;
		height: 20%;
		color: #fff;
		-webkit-text-stroke: 0.02rem black;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.discount .price {
		background-color: #88ba59;
	}

	.real-price {
		color: #66892b;
		font-size: 0.7rem;
		position: absolute;
		top: 0.1rem;
		right: 0.5rem;
	}
</style>
