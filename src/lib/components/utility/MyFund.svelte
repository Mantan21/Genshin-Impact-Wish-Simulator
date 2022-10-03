<script>
	import { getContext } from 'svelte';
	import Icon from './Icon.svelte';
	import ExchangeModal from '$lib/components/shop/ExchangeModal.svelte';
	import playSfx from '$lib/helpers/audio';

	export let type = 'primogem';
	export let increament = true;
	const isExchangable = type === 'primogem' && increament;

	let showExchangeModal = false;
	const handleObtained = getContext('handleObtained');

	const handleModal = () => {
		if (type !== 'primogem') return;
		if (!showExchangeModal) playSfx('modal');
		showExchangeModal = !showExchangeModal;
	};

	const handleConfirmExchange = (e) => {
		showExchangeModal = false;
		const { item } = e.detail;
		handleObtained(item.itemToBuy, item.value);
	};
</script>

<!-- Exchange -->
{#if isExchangable}
	<ExchangeModal
		fundType="genesis"
		itemToBuy="primogem"
		show={showExchangeModal}
		on:cancel={handleModal}
		on:confirm={handleConfirmExchange}
	/>
{/if}
<!-- Exchange -->

<button class={type} class:increament={isExchangable} on:click={handleModal}>
	<Icon
		{type}
		height="80%"
		width="auto"
		style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
	/>
	<slot />
	{#if isExchangable}
		<span> <i class="gi-plus" /> </span>
	{/if}
</button>

<style>
	.primogem span {
		width: 1.2rem;
		height: 1.2rem;
		color: #000;
		background-color: #fff;
		border-radius: 100%;
		position: absolute;
		right: 3px;
		top: 50%;
		font-size: 0.8rem;
		transform: translateY(-50%);
	}

	.primogem.increament {
		padding-right: 2rem !important;
	}

	button {
		display: inline-block;
		height: 25px;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		position: relative;
		margin: 0 8px;
		padding: 0 1rem 0 1.85rem;
		border: 1px solid #656565;
	}

	@media screen and (max-width: 900px) {
		button {
			height: 20px;
			margin: 0 3px;
		}
	}

	@media screen and (max-width: 400px) {
		.primogem {
			margin-bottom: 2px;
		}

		.gi-plus {
			right: 2px;
			transform: translateY(-50%) scale(0.9);
		}
	}
</style>
