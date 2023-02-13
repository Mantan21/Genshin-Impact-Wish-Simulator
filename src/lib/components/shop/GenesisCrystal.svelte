<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { genesisBonus } from '$lib/data/pricelist.json';

	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import PaymentModal from './PaymentModal.svelte';
	import { assets, patchVersion, priceList } from '$lib/store/stores';
	import { localConfig } from '$lib/store/localstore';
	import Icon from '../utility/Icon.svelte';

	let priceToBuy; // undefined
	let qtyToBuy;
	let doubleBonus;
	let bonusAmount;
	let showPaymentModal = false; //false
	const localset = () => localConfig.get('topupBonus') || {};
	let enableFirstBonus = !localset()?.disabled;

	const toggleHandle = (e) => {
		playSfx();
		const setting = localset();
		setting.disabled = !e.target.checked;
		localConfig.set('topupBonus', setting);
	};

	const { versionReset, topupBonus } = genesisBonus;
	const localTopup = localset();
	const filterVersion = (arr) => {
		return arr.filter((v) => v <= parseFloat($patchVersion)).sort((a, b) => b - a)[0] || 0;
	};
	const defaultVersionBase = filterVersion(versionReset);
	const localVersionBase = filterVersion(Object.keys(localTopup));
	const versionBase = defaultVersionBase > localVersionBase ? defaultVersionBase : localVersionBase;

	const genesisList = [];
	const genesis = $priceList.genesis;
	Object.keys(genesis).forEach((key) => {
		const list = Array.isArray(localTopup[versionBase]) ? localTopup[versionBase] : [];
		const doubleBonus = !list.includes(parseFloat(key));
		const item = { qty: parseInt(key), price: genesis[key], doubleBonus };
		genesisList.push(item);
	});

	const handleCloseModal = () => {
		showPaymentModal = false;
	};

	const selectGenesis = (i) => {
		priceToBuy = genesisList[i].price;
		qtyToBuy = genesisList[i].qty;
		doubleBonus = genesisList[i].doubleBonus;
		bonusAmount = doubleBonus && enableFirstBonus ? qtyToBuy : topupBonus[qtyToBuy] || 0;
		showPaymentModal = true;
		playSfx('exchange');
	};

	const handleObtained = getContext('handleObtained');
	const handleConfirmModal = (e) => {
		showPaymentModal = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		if (doubleBonus && enableFirstBonus) {
			localTopup[versionBase] = localTopup[versionBase] || [];
			if (!localTopup[versionBase].includes(qtyToBuy)) localTopup[versionBase].push(qtyToBuy);
			localConfig.set('topupBonus', localTopup);
			const i = genesisList.findIndex(({ qty }) => qty === qtyToBuy);
			genesisList[i].doubleBonus = false;
		}
		handleObtained(item.itemToBuy, item.value);
	};
</script>

<!-- Genesisn Pop up -->
{#if showPaymentModal}
	<PaymentModal
		show={showPaymentModal}
		price={priceToBuy}
		qty={qtyToBuy}
		bonus={bonusAmount}
		on:confirm={handleConfirmModal}
		on:cancel={handleCloseModal}
	/>
{/if}
<!-- Genesis Pop Up End -->

<ColumnParent>
	{#each genesisList as { qty, price, doubleBonus }, i}
		<Column style="padding:0">
			<button
				on:click={() => selectGenesis(i)}
				in:fade={{ duration: 300, delay: Math.sqrt(i * 5000) }}
			>
				{#if doubleBonus && enableFirstBonus}
					<div class="bonus firstBonus" style="background-image: url({$assets['bg-bonus.webp']})">
						<div class="wrap">
							<Icon type="genesis" style="position: absolute; top:-50%;" width="35%" />
							<span>{$t('shop.bonus')}!</span>
							<span class="amount">+{qty}</span>
						</div>
					</div>
				{:else if qty !== 60}
					<div class="topup-bonus bonus">
						<div class="wrap">
							<span>{$t('shop.bonus')}</span>
							<Icon type="genesis" />
							<span>{topupBonus[qty]}</span>
						</div>
					</div>
				{/if}

				<div class="content" style="background-image: url({$assets['genesis-bg.webp']})">
					<div class="picture">
						<picture>
							<img src={$assets[`genesis-${qty}.webp`]} alt="Genesis Crystal {qty}" />
						</picture>
					</div>
					<div class="caption">
						<div class="name">{qty} {$t('shop.item.genesis')}</div>
						<div class="price">{price}</div>
					</div>
				</div>
			</button>
		</Column>
	{/each}
</ColumnParent>
<div class="toggle">
	<input
		type="checkbox"
		name="showAll"
		id="showAll"
		bind:checked={enableFirstBonus}
		on:change={toggleHandle}
	/>
	<label for="showAll">
		<i>✔</i>
		{$t('shop.initialBonus')}
	</label>
</div>

<style>
	button {
		transition: all 0.2s;
		transform: scale(1);
		width: 100%;
		height: 100%;
		display: block;
		position: relative;
	}
	button:not(.nav-link-item):active {
		transform: scale(0.95);
	}

	.firstBonus {
		left: -5%;
		top: -5%;
		width: 35%;
		aspect-ratio: 1/1;
		background-size: cover;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.bonus {
		color: #fff6d2;
		text-shadow: 0.05em 0.05em 0.2em rgba(0, 0, 0, 0.5);
		font-size: 80%;
		filter: drop-shadow(0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.5));
		position: absolute;
		z-index: +1;
	}

	.wrap {
		width: 100%;
		position: relative;
		display: flex;
	}

	.firstBonus .wrap {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.firstBonus .amount {
		color: #fefdf2;
		font-size: initial;
	}

	:global(.mobile) .amount {
		font-size: 140%;
	}

	.topup-bonus {
		background-color: #fb9095;
		top: 0;
		left: -3%;
		padding: 0.15rem 1rem 0.15rem 0.7rem;
		border-bottom-left-radius: 1rem;
		border-top-left-radius: 1rem;
		border-bottom-right-radius: 2rem;
	}
	:global(.mobile) .topup-bonus {
		padding: 0 10% 0 8%;
	}
	.topup-bonus .wrap {
		align-items: center;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		text-align: center;
		background-size: cover;
		background-position: center center;
		transition: all 0.2s;
		position: relative;
	}

	.content:hover {
		filter: drop-shadow(-0.3rem 0.2rem #eac343) drop-shadow(0.3rem 0.2rem #eac343)
			drop-shadow(-0rem -0.3rem #eac343);
	}

	picture {
		display: block;
		margin-top: -10%;
	}
	.picture {
		display: block;
		width: 100%;
		height: 70%;
		overflow-y: hidden;
		margin-top: 5%;
	}

	img {
		width: 90%;
	}

	.caption {
		position: absolute;
		bottom: 5%;
		display: block;
		width: 95%;
	}

	.name {
		width: 100%;
		padding: 15% 4.5% 2%;
		display: block;
		font-size: calc(8.5 / 100 * var(--column-width));
		background-image: linear-gradient(to top, rgba(241, 239, 222, 1) 55%, rgba(241, 239, 222, 0));
	}

	.price {
		display: block;
		height: calc(16 / 100 * var(--column-width));
		line-height: calc(16 / 100 * var(--column-width));
		font-size: calc(9 / 100 * var(--column-width));
	}

	.toggle {
		margin: 1%;
		color: var(--tertiary-color);
		text-transform: capitalize;
	}
	label {
		cursor: inherit;
	}
	.toggle input + label i {
		color: white;
		display: inline-block;
		padding: 0.1rem 0.2rem 0.1rem 0.1rem;
		line-height: 1rem;
		background-color: #fff;
		border: 1px solid transparent;
		transition: all 0.2s;
	}
	.toggle input:checked + label i {
		background-color: #06bbff;
	}

	.toggle:hover input + label i {
		border: 1px solid #06bbff;
		box-shadow: rgba(106, 168, 230, 0.6) 0px 0px 7px 5px;
	}

	.toggle input {
		display: none;
	}
</style>
