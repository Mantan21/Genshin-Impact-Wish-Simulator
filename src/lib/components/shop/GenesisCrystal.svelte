<script>
	import { getContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import playSfx from '$lib/helpers/audio';

	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import PaymentModal from './PaymentModal.svelte';
	import { assets, priceList } from '$lib/store/stores';

	let activeGenesisIndexforModal; // undefined
	let showPaymentModal = false; //false

	const genesisList = [];
	$: genesis = $priceList.genesis;
	$: Object.keys(genesis).forEach((key) => {
		const item = { qty: parseInt(key), price: genesis[key] };
		genesisList.push(item);
	});

	const handleCloseModal = () => {
		showPaymentModal = false;
	};

	const selectGenesis = (i) => {
		activeGenesisIndexforModal = i;
		showPaymentModal = true;
		playSfx('exchange');
	};

	const handleObtained = getContext('handleObtained');
	const handleConfirmModal = (e) => {
		showPaymentModal = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		handleObtained(item.itemToBuy, item.value);
	};
</script>

<!-- Genesisn Pop up -->
{#if showPaymentModal}
	<PaymentModal
		show={showPaymentModal}
		price={genesisList[activeGenesisIndexforModal].price}
		qty={genesisList[activeGenesisIndexforModal].qty}
		on:confirm={handleConfirmModal}
		on:cancel={handleCloseModal}
	/>
{/if}
<!-- Genesis Pop Up End -->

<ColumnParent>
	{#each genesisList as { qty, price }, i}
		<Column style="padding:0">
			<button on:click={() => selectGenesis(i)}>
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

<style>
	button {
		transition: all 0.2s;
		transform: scale(1);
		width: 100%;
		height: 100%;
		display: block;
	}
	button:not(.nav-link-item):active {
		transform: scale(0.95);
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
</style>
