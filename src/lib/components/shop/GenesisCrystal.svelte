<script>
	import { getContext } from 'svelte';
	import playSfx from '$lib/functions/audio';

	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import PaymentPopup from './PaymentPopup.svelte';

	let activeGenesisIndexforPopup; // undefined
	let showPaymentPopup = false; //false

	const genesisList = [
		{ qty: 60, price: 0.99 },
		{ qty: 300, price: 4.99 },
		{ qty: 980, price: 14.99 },
		{ qty: 1980, price: 29.99 },
		{ qty: 3280, price: 49.99 },
		{ qty: 6480, price: 99.99 }
	];

	const handleClosePopup = () => {
		showPaymentPopup = false;
	};

	const selectGenesis = (i) => {
		activeGenesisIndexforPopup = i;
		showPaymentPopup = true;
		playSfx('exchange');
	};

	const handleObtained = getContext('handleObtained');
	const handleConfirmPopup = (e) => {
		showPaymentPopup = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		handleObtained(item.itemToBuy, item.value);
	};
</script>

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

<ColumnParent name="genesis">
	{#each genesisList as { qty }, i}
		<Column style="padding:0">
			<button class="content" on:click={() => selectGenesis(i)}>
				<img src="/images/utility/genesis-{qty}.webp" alt="genesis {qty}" />
			</button>
		</Column>
	{/each}
</ColumnParent>

<style>
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
