<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { outfits } from '$lib/data/outfits.json';
	import { getName } from '$lib/helpers/nameText';
	import { localOutfits } from '$lib/store/localstore';
	import { assets, patchVersion } from '$lib/store/stores';

	// Components
	import Icon from '../utility/Icon.svelte';
	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';

	export let recentlyBuyIndex = -1;

	const purchasableOutfit = outfits.filter(({ version }) => version <= parseFloat($patchVersion));
	const outfitsData = [...purchasableOutfit].reverse().map((outfit) => {
		outfit.isOwned = localOutfits.check(outfit.name);
		const promo = outfit.promoPrice && outfit.promoPrice !== outfit.price;
		outfit.isPromo = $patchVersion === `${outfit.version}` && promo;

		return outfit;
	});

	const selectItem = getContext('selectItem');
	const recentlyBuy = (index) => {
		if (index < 0) return;
		outfitsData[index].isOwned = true;
	};
	$: recentlyBuy(recentlyBuyIndex);
</script>

<ColumnParent>
	{#each outfitsData as { name, price, promoPrice, isPromo, isOwned, rarity }, i}
		<Column style="padding: .3rem">
			<button
				class:discount={isPromo}
				on:click={() => selectItem(outfitsData, i)}
				in:fade={{ duration: 300, delay: Math.sqrt(i * 5000) }}
			>
				<div class="content">
					{#if isPromo}
						<div class="discount-percentage">-20%</div>
					{/if}

					<div
						class="thumbnail"
						style="background-image: url('{$assets[`${rarity}star-bg.webp`]}');"
					>
						<picture class="star{rarity}">
							<img src={$assets[`thumbnail/${name}.webp`]} alt={getName(name)} />
						</picture>
						<caption>
							<span class="name">{$t(`outfit.item.${name}.name`)}</span>
							{#if isOwned}
								<span class="owned">{$t('outfit.owned')}</span>
							{:else}
								<span class="desc">{$t('shop.purchaseUpto')}</span>
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
	}
	picture.star4::after {
		background-image: linear-gradient(to top, rgba(174, 148, 211, 0.8) 40%, rgba(174, 148, 211, 0));
	}
	picture.star5::after {
		background-image: linear-gradient(to top, rgba(224, 180, 102, 0.8) 40%, rgba(224, 180, 102, 0));
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
