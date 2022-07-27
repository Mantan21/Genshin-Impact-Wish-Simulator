<script>
	import { createEventDispatcher } from 'svelte';
	import { t } from 'svelte-i18n';
	import { localBalance } from '$lib/store/localstore';
	import { genesis, primogem } from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';

	import PopUp from '$lib/components/utility/PopUp.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';

	export let show;
	export let qty;
	export let price;

	let autoConvert = false;

	const dispatch = createEventDispatcher();
	const handleClose = () => {
		dispatch('cancel');
		playSfx('close');
	};

	const convertToPrimogem = () => {
		const afterBuy = $primogem + qty;
		primogem.set(afterBuy);
		localBalance.set('primogem', afterBuy);
		dispatch('confirm', { status: 'ok', item: { itemToBuy: 'primogem', value: qty } });
	};

	const genesisBuy = () => {
		playSfx();
		if (autoConvert) return convertToPrimogem();
		const afterBuy = $genesis + qty;
		genesis.set(afterBuy);
		localBalance.set('genesis', afterBuy);
		dispatch('confirm', { status: 'ok', item: { itemToBuy: 'genesis', value: qty } });
	};
</script>

<PopUp {show} confirm={false} sfx={false}>
	<div class="genesis-popup">
		<div class="header">
			<button class="back" on:click={handleClose}>
				<i class="gi-angle-left" />
			</button>
			<div class="title">{$t('shop.pay')}</div>
		</div>

		<div class="body">
			<div class="detail">
				<picture>
					<span class="product-text">{$t('shop.product')}</span>
					<Icon type="genesis" width="50%" />
					<span class="product-name">{$t('shop.item.genesis')} x{qty}</span>
				</picture>
				<div class="price">{price}</div>
			</div>

			<div class="payment-type">
				<span>{$t('shop.selectPayment')}</span>
				<div class="list">
					<div class="item">{$t('shop.unrealWallet')}</div>
				</div>
			</div>
			<div class="auto-convert">
				<input
					type="checkbox"
					bind:checked={autoConvert}
					style="margin-right: .4rem"
					id="convert"
				/>
				<label for="convert">{$t('shop.convertPrimo')} </label>
			</div>
			<div class="button">
				<button on:click={genesisBuy}>{$t('shop.proceedPayment')}</button>
			</div>
		</div>
	</div>
</PopUp>

<style>
	.genesis-popup {
		display: block;
		width: 100%;
		height: 100%;
	}

	.header {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 0.4rem;
	}

	button.back {
		font-size: 2rem;
		padding: 0.4rem;
		line-height: 1rem;
	}

	.title {
		width: 100%;
		padding: 0.4rem;
		font-size: 1.5rem;
		line-height: 1rem;
	}

	.body {
		display: flex;
		width: center;
		width: 100%;
		flex-direction: column;
	}

	.detail {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	picture {
		width: 40%;
		display: block;
		position: relative;
		text-align: center;
	}
	:global(.mobile) picture {
		width: 25vh;
	}
	picture span {
		position: absolute;
		left: 0;
		width: 100%;
		display: block;
		font-size: 0.8rem;
	}
	span.product-text {
		top: 0;
	}

	span.product-name {
		bottom: 0;
	}
	:global(.mobile) span.product-text {
		width: fit-content;
		left: 22vh;
		top: 25%;
		font-size: 0.9rem;
	}
	:global(.mobile) span.product-name {
		width: max-content;
		left: 22vh;
		font-size: 0.9rem;
		bottom: 25%;
	}

	.price {
		width: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.8rem;
		margin-right: 0.2rem;
		color: #de2f22;
	}
	.payment-type {
		text-align: left;
		width: 100%;
		padding: 1rem 1.4rem;
		font-size: 1.1rem;
	}
	:global(.mobile) .payment-type {
		font-size: 1rem;
	}

	.list {
		display: flex;
		width: 100%;
	}

	.item {
		margin-top: 0.5rem;
		padding: 0.5rem;
		text-align: center;
		width: 50%;
		font-size: 0.95rem;
		background-color: #d2c69c;
		border: 1px solid rgb(206, 160, 100);
	}

	:global(.mobile) .item {
		padding: 0.3rem;
	}

	.auto-convert {
		font-size: 0.97rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.button button {
		background-color: #353533;
		color: #ffc107;
		margin: 1rem;
		padding: 1rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
