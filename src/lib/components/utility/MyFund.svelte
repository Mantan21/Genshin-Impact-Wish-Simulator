<script>
	import Icon from './Icon.svelte';
	import ExchangePopup from '$lib/components/shop/ExchangePopup.svelte';
	import Obtained from './Obtained.svelte';
	import playSfx from '$lib/helpers/audio';

	export let type = 'primogem';

	let showExchangePopup = false;
	let showObtained = false;
	let obtainedItem = {};

	const handlePopup = () => {
		if (type !== 'primogem') return;
		if (!showExchangePopup) playSfx('popup');
		showExchangePopup = !showExchangePopup;
	};

	const handleConfirmExchange = (e) => {
		showExchangePopup = false;
		const { item } = e.detail;
		obtainedItem[item.itemToBuy] = item.value;
		showObtained = true;
	};

	const closeObtained = () => {
		showObtained = false;
		playSfx('close');
	};
</script>

<!-- Obtain -->
{#if showObtained}
	<Obtained items={obtainedItem} on:close={closeObtained} />
{/if}
<!-- Obtain end -->

<!-- Exchange -->
<ExchangePopup
	fundType="genesis"
	itemToBuy="primogem"
	show={showExchangePopup}
	on:cancel={handlePopup}
	on:confirm={handleConfirmExchange}
/>
<!-- Exchange -->

<button class={type} on:click={handlePopup}>
	<Icon
		{type}
		height="80%"
		width="auto"
		style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
	/>
	<slot />
	{#if type === 'primogem'}
		<span>
			<i class="gi-plus" />
		</span>
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

	.primogem {
		padding-right: 30px !important;
	}

	button {
		display: inline-block;
		max-width: 112px;
		height: 25px;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		position: relative;
		margin: 0 8px;
		padding: 0 15px 0 30px;
	}

	@media screen and (max-width: 900px) {
		button {
			height: 20px;
			margin: 0 3px;
		}
	}

	@media screen and (max-width: 400px) {
		button {
			max-width: 80px;
		}
		.primogem {
			margin-bottom: 2px;
			padding: 0 30px;
		}

		.gi-plus {
			right: 2px;
			transform: translateY(-50%) scale(0.9);
		}
	}
</style>
