<script>
	import Icon from '$lib/components/utility/Icon.svelte';
	import playSfx from '$lib/functions/audio';
	import { getContext } from 'svelte';
	import ExchangePopup from './ExchangePopup.svelte';
	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import TopNav from './parts/_top-nav-parent.svelte';
	import TopNavItem from './parts/_top-nav-item.svelte';

	let activeFateShop = 'starglitter';
	let showExchangePopup = false;
	let itemToBuy;

	const openExchangePopup = (fate) => {
		showExchangePopup = true;
		itemToBuy = fate;
		playSfx();
	};

	const handleClosePopup = () => {
		showExchangePopup = false;
	};

	const handlePaimonClick = ({ detail }) => {
		activeFateShop = detail.selected;
		playSfx('exchange');
	};

	const handleObtained = getContext('handleObtained');
	const handleConfirmPopup = (e) => {
		showExchangePopup = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		const { value, itemToBuy } = item;
		handleObtained(itemToBuy, value);
	};
</script>

<!-- Fates Popup -->
<ExchangePopup
	show={showExchangePopup}
	fundType={activeFateShop}
	itemRarity={5}
	{itemToBuy}
	on:cancel={handleClosePopup}
	on:confirm={handleConfirmPopup}
/>
<!-- Fates Popup End -->

<TopNav>
	<TopNavItem
		on:click={(e) => handlePaimonClick(e)}
		name="starglitter"
		active={activeFateShop === 'starglitter'}
	>
		Starglitter Exchange
	</TopNavItem>

	<TopNavItem
		name="stardust"
		active={activeFateShop === 'stardust'}
		on:click={(e) => handlePaimonClick(e)}
	>
		Stardust Exchange
	</TopNavItem>
	<TopNavItem
		name="primogem"
		active={activeFateShop === 'primogem'}
		on:click={(e) => handlePaimonClick(e)}
	>
		Exchange with Primogem
	</TopNavItem>
</TopNav>

<ColumnParent>
	{#each ['intertwined', 'acquaint'] as fate, i}
		<Column>
			<button on:click={() => openExchangePopup(fate)}>
				<div class="content">
					<picture>
						<Icon type={fate} width="60%" />
						<span> {fate} Fate </span>
					</picture>
					<div class="price">
						{#if activeFateShop === 'starglitter'}
							<Icon type="starglitter" width="15%" />
							<span style="margin-left: 5px">5</span>
						{/if}
						{#if activeFateShop === 'stardust'}
							<Icon type="stardust" width="15%" />
							<span style="margin-left: 5px">125</span>
						{/if}
						{#if activeFateShop === 'primogem'}
							<Icon type="primogem" width="15%" />
							<span style="margin-left: 5px">160</span>
						{/if}
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

	.content picture {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: -10%;
		align-items: center;
		position: relative;
		background-image: url('/assets/images/utility/5star-bg.webp');
		background-size: cover;
		border-bottom-right-radius: 1.4rem;
		overflow: hidden;
	}
	.content picture span {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		color: #fff;
		transform: scale(0.9);
		-webkit-text-stroke: 0.2px black;
		text-transform: capitalize;
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
</style>
