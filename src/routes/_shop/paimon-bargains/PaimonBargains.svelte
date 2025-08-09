<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { assets } from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { owneditem } from '$lib/helpers/dataAPI/api-localstore';
	import { getDetails } from '$lib/helpers/gacha/itemdrop-base';
	import { paimonBargainCharacters } from '$lib/data/paimon-bargain-characters.json';

	import Icon from '$lib/components/Icon.svelte';
	import ShopGroup from '../_shop-group.svelte';
	import ShopGroupItem from '../_shop-group-item.svelte';
	import NavlinkTop from '../_navlink-top.svelte';
	import NavlinkTopButton from '../_navlink-top-button.svelte';
	import CharacterItem from './_character-item.svelte';

	let activeCurrency = 'starglitter';

	const pricelist = {
		starglitter: { price: 5, rarity: 5 },
		stardust: { price: 125, rarity: 4 },
		primogem: { price: 160, rarity: 5 }
	};

	const openExchangeModal = getContext('openExchangeModal');
	const selectItem = (itemToExchange) => {
		playSfx();
		const currency = activeCurrency;
		const { price, rarity } = pricelist[activeCurrency];
		const data = { itemToExchange, price, rarity, currency };
		openExchangeModal(data);
	};

	const selectCharacterItem = (selectedCharacter) => {
		playSfx();
		const currency = 'starglitter';
		const itemToExchange = selectedCharacter.name;
		const price = selectedCharacter.price;
		const rarity = selectedCharacter.rarity;
		const data = {
			isOwned: isCharMax(itemToExchange),
			itemToExchange,
			price,
			rarity,
			currency,
			isCharacter: true
		};
		openExchangeModal(data);
	};

	const handlePaimonClick = ({ detail }) => {
		if (activeCurrency === detail.selected) return;
		activeCurrency = detail.selected;
		playSfx('shopsubnav');
	};

	const isCharMax = (name) => {
		const { itemID } = getDetails(name) || {};
		const { qty } = owneditem.get(itemID);
		const isMax = qty >= 7;
		return isMax;
	};
</script>

<NavlinkTop>
	{#each ['starglitter', 'stardust', 'primogem'] as val}
		<NavlinkTopButton on:click={handlePaimonClick} name={val} active={activeCurrency === val}>
			{$t(`shop.exchange.${val}`)}
		</NavlinkTopButton>
	{/each}
</NavlinkTop>

<ShopGroup>
	{#each ['intertwined', 'acquaint'] as fate, i}
		<ShopGroupItem>
			<button
				on:click={() => selectItem(fate)}
				in:fade={{ duration: 300, delay: Math.sqrt(i * 5000) }}
			>
				<div class="content">
					<div class="picture" style="background-image: url('{$assets['5star-bg.webp']}')">
						<Icon type={fate} width="60%" />
						<span> {$t(`shop.item.${fate}`)} </span>
					</div>
					<div class="price">
						{#each Object.keys(pricelist) as key}
							{#if activeCurrency === key}
								<Icon type={key} width="15%" />
								<span style="margin-left: 5px">{pricelist[key].price}</span>
							{/if}
						{/each}
					</div>
				</div>
			</button>
		</ShopGroupItem>
	{/each}
	{#if activeCurrency === 'starglitter'}
		{#each paimonBargainCharacters as character, i}
			<ShopGroupItem>
				<button
					in:fade={{ duration: 300, delay: Math.sqrt((i + 2) * 5000) }}
					on:click={() => selectCharacterItem(character)}
				>
					<div class="content">
						<div class="picture" style="background-image: url('{$assets['4star-bg.webp']}')">
							<CharacterItem name={character.name} />
							{#if isCharMax(character.name)}
								<span class="unpurchasable">
									{$t('shop.maxCharacter')}
								</span>
							{:else}
								<span> {$t(`${character.name}.name`)}</span>
							{/if}
						</div>
						<div class="price">
							<Icon type="starglitter" width="15%" />
							<span style="margin-left: 5px">{character.price}</span>
						</div>
					</div>
				</button>
			</ShopGroupItem>
		{/each}
	{/if}
</ShopGroup>

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

	.content .picture {
		padding-top: 5%;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: -10%;
		align-items: center;
		position: relative;
		background-size: cover;
		border-bottom-right-radius: 1.4rem;
		overflow: hidden;
	}
	.content .picture span {
		position: absolute;
		font-size: calc(var(--column-width) * 0.065);
		margin-bottom: 3%;
		padding: 0 2%;
		bottom: 0;
		left: 0;
		width: 100%;
		color: #fff;
		-webkit-text-stroke: 0.2px black;
	}
	.price {
		width: 100%;
		height: 20%;
		color: #fff;
		-webkit-text-stroke: 0.02rem black;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.unpurchasable {
		background-color: #ea6864;
		padding-top: 0.2rem;
		margin-bottom: 0 !important;
		display: block;
		width: 100%;
	}
</style>
