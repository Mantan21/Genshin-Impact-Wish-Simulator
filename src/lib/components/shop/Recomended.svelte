<script>
	import { getContext, setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { fade, fly } from 'svelte/transition';

	import { outfits } from '$lib/data/outfits.json';
	import { assets, genesis, patchVersion, priceList, primogem } from '$lib/store/stores';
	import { localBalance, localOutfits, localWelkin } from '$lib/store/localstore';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import positionToStyle from '$lib/helpers/cssPosition';
	import { getName } from '$lib/helpers/nameText';

	import TopNavParent from './parts/_top-nav-parent.svelte';
	import TopNavItem from './parts/_top-nav-item.svelte';
	import Icon from '../utility/Icon.svelte';
	import ButtonModal from '../utility/ButtonModal.svelte';
	import WelkinModal from './WelkinModal.svelte';
	import ColumnParent from './parts/_column-parent.svelte';

	export let recentlyBuyIndex = -1;

	const outfitsForThisVersion = outfits.find(({ version, price, promoPrice }) => {
		return $patchVersion === `${version}` && promoPrice && promoPrice !== price;
	});
	const { name, price, promoPrice, cardBoxPosition } = outfitsForThisVersion || {};
	$: isOwned = localOutfits.check(name) || recentlyBuyIndex > -1;

	const outfitsPromo = !!outfitsForThisVersion;
	let activeItem = outfitsPromo ? 'outfit' : 'welkin';
	let contentWidth;

	const handleRecomendClick = ({ detail }) => {
		if (activeItem === detail.selected) return;
		playSfx('shopsubnav');
		activeItem = detail.selected;
	};

	const selectItem = getContext('selectItem');
	const showObtained = getContext('handleObtained');

	const { remaining } = localWelkin.getData();
	let dayRemaining = remaining || 0;
	let showWelkinModal = false;

	$: welkinPrice = $priceList.welkin;

	const buyWelkin = () => {
		showWelkinModal = false;
		genesis.update((n) => {
			const newQty = n + 32000;
			localBalance.set('genesis', newQty);
			return newQty;
		});
		primogem.update((n) => {
			const newQty = n + 8000;
			localBalance.set('primogem', newQty);
			return newQty;
		});
		showObtained('genesis', 32000);
		localWelkin.checkin('welkin');
		dayRemaining = localWelkin.getData().remaining;
	};

	const cancelBuy = () => (showWelkinModal = false);
	setContext('buyWelkin', buyWelkin);
	setContext('cancelBuy', cancelBuy);
</script>

<TopNavParent>
	{#if outfitsPromo}
		<TopNavItem name="outfit" active={activeItem === 'outfit'} on:click={handleRecomendClick}>
			{$t('outfit.heading')}
		</TopNavItem>
	{/if}

	<TopNavItem on:click={handleRecomendClick} name="welkin" active={activeItem === 'welkin'}>
		{$t('shop.recomended.welkin')}
	</TopNavItem>
</TopNavParent>

<WelkinModal show={showWelkinModal} />

<ColumnParent>
	<div
		class="content-item"
		bind:clientHeight={contentWidth}
		style="--content-width: {contentWidth}px"
	>
		{#if activeItem === 'outfit'}
			<div class="card outfit" in:fade={{ duration: 400 }}>
				<img
					class="outfit-art"
					src={$assets[`splash-art/${name}`]}
					alt={getName(name)}
					style={positionToStyle(cardBoxPosition)}
				/>

				<div class="remaining card-stroke">{$t('shop.limitedOffer')}</div>
				<div class="details">
					<div class="name stroke">{$t(`outfit.item.${name}.name`)}</div>
					<div class="price">
						<Icon type="genesis" style="margin-right:-1%; width: 10%" />
						<span class="dicount stroke"> {promoPrice} </span>

						<del class="real-price"> {price} </del>
					</div>
				</div>

				<div class="frame">
					<div class="description">
						<div class="title">{$t('shop.recomended.newOutfit')}</div>
						<span class="name">{$t(`outfit.item.${name}.name`)}</span>
						<p class="card-stroke">
							{$t(`outfit.item.${name}.description`)}
						</p>
					</div>
					<div class="purchase-button">
						{#if isOwned}
							<span class="owned">{$t('outfit.owned')}</span>
						{:else}
							<ButtonModal
								text={$t('shop.purchaseButton')}
								type="confirm"
								on:click={() => selectItem(outfitsForThisVersion)}
							/>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div class="card welkin" in:fade={{ duration: 400 }}>
				<img src={$assets['welkin-card.webp']} alt="Welkin of the Blessing Moon" />
				<div class="welkin-item">
					<img src={$assets['welkin.webp']} alt="Welkin Item" in:fly={{ y: -50, duration: 400 }} />
				</div>

				<h1>{$t('shop.recomended.welkin')}</h1>
				{#if dayRemaining > 0}
					<div class="remaining">
						{@html $t('shop.recomended.dayRemaining', {
							values: { days: `<strong>${dayRemaining}</strong>` }
						})}
						<span>({$t('shop.recomended.alreadyClaimed')})</span>
					</div>
				{/if}

				<h2 class="price">{welkinPrice}</h2>
				<div class="note">{$t('shop.welkinNote')}</div>

				<div class="frame">
					<div class="parent-amount">
						<span>{$t('shop.recomended.instantlyGet')}</span>
						<span class="amount">
							32000
							<Icon type="genesis" style="margin-bottom:-5%; width: 20%" />
						</span>
					</div>
					<div class="parent-amount">
						<span>{$t('shop.recomended.dailyGift')}</span>
						<span class="amount">
							8000
							<Icon type="primogem" style="margin-bottom:-5%; width: 20%" />
						</span>
					</div>

					<!-- Button -->
					<div class="purchase-button">
						<div class="caption card-stroke">
							{@html $t('shop.recomended.obtainTotal', {
								values: {
									totalGenesis: '<strong>32000</strong>',
									totalPrimo: '<strong> 240000</strong>'
								}
							})}
						</div>
						<ButtonModal
							text={$t('shop.purchaseButton')}
							type="confirm"
							on:click={() => {
								showWelkinModal = true;
								playSfx();
							}}
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</ColumnParent>

<style>
	.content-item,
	.card,
	img {
		display: block;
		width: 100%;
	}

	:global(.mobile) .content-item,
	:global(.mobile) .card {
		max-width: 100%;
		width: fit-content;
		height: 75vh;
		max-height: 40vw;
	}

	.card {
		position: relative;
		background-color: #f7f3eb;
		max-width: 55rem;
		max-height: 75vh;
		aspect-ratio: 1000/561;
		border-radius: 1rem;
		overflow: hidden;
		font-size: calc(0.035 * var(--content-width));
	}

	.welkin-item {
		position: absolute;
		top: 8%;
		left: 8%;
		width: 47.5%;
		animation: welkinItem 2s infinite alternate ease-in-out;
	}

	@keyframes welkinItem {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-3%);
		}
	}

	.welkin h1 {
		position: absolute;
		right: 2%;
		top: 7.5%;
		color: #4c505e;
		font-size: calc(0.065 * var(--content-width));
	}

	.welkin h2 {
		position: absolute;
		left: 2%;
		bottom: 8%;
		font-size: calc(0.115 * var(--content-width));
		color: #fff;
	}

	.note {
		position: absolute;
		left: 6%;
		bottom: 3.7%;
		color: #fff;
		font-size: calc(0.026 * var(--content-width));
	}

	.remaining {
		width: 35%;
		position: absolute;
		top: 2%;
		left: 2%;
		color: #b3c4e3;
		font-size: calc(0.03 * var(--content-width));
	}
	.remaining span {
		color: #ffc107;
	}

	.frame {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-top: 10%;
		z-index: +3;
		padding-right: calc(0.05 * var(--content-width));
	}

	.parent-amount {
		margin: 2% 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.parent-amount span {
		display: block;
		text-align: right;
	}
	.parent-amount span:not(.amount),
	.purchase-button {
		color: #787b84;
	}
	.amount {
		padding: 5% 8%;
		background-color: #8e9cc0;
		color: #fff;
		border-radius: 2rem;
		margin-top: 5%;
		border: 0.1rem solid #fff;
		outline: 0.135rem solid #8e9cc0;
		width: calc(0.3 * var(--content-width));
	}

	.purchase-button {
		width: 48%;
		text-align: right;
		margin-top: auto;
		margin-bottom: 2.5%;
	}
	.purchase-button .caption {
		font-size: calc(0.029 * var(--content-width));
	}
	.card-stroke {
		line-height: 150%;
		margin-bottom: 5%;
	}

	.owned {
		color: #de2f22;
	}

	/* Outfits */
	img.outfit-art {
		position: absolute;
		top: -16.5%;
		left: -31%;
		width: 130%;
	}

	.outfit {
		position: relative;
	}
	.outfit::after {
		width: 100%;
		height: 100%;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		background-image: linear-gradient(
			65deg,
			rgba(247, 243, 235, 0) 40%,
			rgba(247, 243, 235, 0.8) 70%
		);
		background-size: cover;
		z-index: +2;
	}

	.outfit .frame {
		padding-top: 2%;
	}
	.outfit .remaining {
		color: #7fb6d5;
	}

	.description {
		width: 50%;
		text-align: right;
		color: #787b84;
		text-shadow: 0 0 1rem #f7f3eb;
	}

	.description p {
		line-height: 130%;
		font-size: calc(0.04 * var(--content-width));
		max-height: calc(0.52 * var(--content-width));
		overflow-y: auto;
	}

	.title {
		display: block;
		margin-left: auto;
		width: 80%;
		color: #3c4b5e;
		font-size: calc(0.07 * var(--content-width));
		line-height: 120%;
	}
	span.name {
		color: #3c4b5e;
		font-weight: bold;
		display: block;
		margin: 5% 0;
	}

	.details {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		padding-bottom: 5%;
		padding-left: 3%;
	}
	.details .name {
		font-size: calc(0.08 * var(--content-width));
		width: 50%;
		line-height: 120%;
		margin-top: auto;
		color: #fff;
		filter: drop-shadow(0 0 25px #787b84);
	}

	.price {
		position: relative;
		color: #fff;
		margin-top: 5%;
		filter: drop-shadow(0 0 25px #787b84);
	}
	.dicount {
		font-size: calc(0.11 * var(--content-width));
	}

	.stroke {
		/* prettier-ignore */
		text-shadow:
    -0.025rem -0.025rem 0 #3c4b5e,
     0   		 -0.025rem 0 #3c4b5e,
     0.025rem -0.025rem 0 #3c4b5e,
     0.025rem  0 		  0 #3c4b5e,
     0.025rem  0.025rem 0 #3c4b5e,
     0    		0.025rem 0 #3c4b5e,
    -0.025rem  0.025rem 0 #3c4b5e,
    -0.025rem  0		    0 #3c4b5e;
	}

	.real-price {
		position: absolute;
		left: 52%;
		bottom: 0;
		transform: translateY(-50%);
		color: #fff;
		background-color: #88ba59;
		padding: 0.1rem 1rem 0.1rem 0.7rem;
		border-bottom-left-radius: 1rem;
		border-top-left-radius: 1rem;
		border-bottom-right-radius: 2rem;
	}
</style>
