<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';

	import ExchangeModal from './ExchangeModal.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';
	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';
	import TopNav from './parts/_top-nav-parent.svelte';
	import TopNavItem from './parts/_top-nav-item.svelte';
	import { assets } from '$lib/store/stores';

	let activeFateShop = 'starglitter';
	let showExchangeModal = false;
	let itemToBuy;

	const openExchangeModal = (fate) => {
		showExchangeModal = true;
		itemToBuy = fate;
		playSfx();
	};

	const handleCloseModal = () => {
		showExchangeModal = false;
	};

	const handlePaimonClick = ({ detail }) => {
		if (activeFateShop === detail.selected) return;
		activeFateShop = detail.selected;
		playSfx('shopsubnav');
	};

	const handleObtained = getContext('handleObtained');
	const handleConfirmModal = (e) => {
		showExchangeModal = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		const { value, itemToBuy } = item;
		handleObtained(itemToBuy, value);
	};
</script>

<!-- Fates Modal -->
<ExchangeModal
	show={showExchangeModal}
	fundType={activeFateShop}
	itemRarity={5}
	{itemToBuy}
	on:cancel={handleCloseModal}
	on:confirm={handleConfirmModal}
/>
<!-- Fates Modal End -->

<TopNav>
	{#each ['starglitter', 'stardust', 'primogem'] as val}
		<TopNavItem on:click={handlePaimonClick} name={val} active={activeFateShop === val}>
			{$t(`shop.exchange.${val}`)}
		</TopNavItem>
	{/each}
</TopNav>

<ColumnParent>
	{#each ['intertwined', 'acquaint'] as fate, i}
		<Column>
			<button
				on:click={() => openExchangeModal(fate)}
				in:fade={{ duration: 300, delay: Math.sqrt(i * 5000) }}
			>
				<div class="content">
					<picture style="background-image: url('{$assets['5star-bg.webp']}')">
						<Icon type={fate} width="60%" />
						<span> {$t(`shop.item.${fate}`)} </span>
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
