<script>
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { genesis, pageActive, primogem, stardust, starglitter } from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import browserState from '$lib/functions/browserState';
	import MyFund from '$lib/components/utility/MyFund.svelte';

	export let showNavbar = true;
	export let showNavbarButton = true;
	export let activeShop = 'genesis';

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		showNavbar = !showNavbar;
		dispatch('showNavbar', { showNavbar });
	};

	const handleClose = () => {
		browserState.back();
		playSfx('close');
		pageActive.set('index');
	};
</script>

<div class="item-header" in:fly={{ y: -20 }}>
	<div class="info" style="display: flex; align-items: center">
		{#if showNavbarButton}
			<button class="toggle" on:click={handleClick}>
				<span />
			</button>
		{/if}
		<span> All Items below will never resfreshes </span>
	</div>
	<div class="fates">
		{#if activeShop === 'genesis'}
			<MyFund type="primogem">
				{$primogem}
			</MyFund>
			<MyFund type="genesis">
				{$genesis}
			</MyFund>
		{:else if activeShop === 'paimon-bargains'}
			<MyFund type="stardust">
				{$stardust}
			</MyFund>
			<MyFund type="starglitter">
				{$starglitter}
			</MyFund>
			<MyFund type="primogem">
				{$primogem}
			</MyFund>
		{/if}

		<button class="close" on:click={handleClose}>
			<i class="gi-close" />
		</button>
	</div>
</div>

<style>
	.toggle {
		display: inline-block;
		width: 40px;
		height: 40px;
		border: 1px solid #d2c69c;
		margin-right: 5px;
		position: relative;
	}

	.toggle span {
		display: block;
		width: 60%;
		height: 2px;
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		background-color: #d2c69c;
	}
	.toggle span::after,
	.toggle span::before {
		display: block;
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		content: '';
		background-color: #d2c69c;
	}
	.toggle span::before {
		top: -300%;
	}
	.toggle span::after {
		bottom: -300%;
	}

	.item-header {
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #d2c69c;
		position: relative;
	}
	:global(.mobile) .item-header {
		height: 40px;
	}

	.fates {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.fates .close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0rem;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		border-radius: 100%;
		text-decoration: none;
	}
	:global(.mobile) .fates .close {
		width: 2rem;
		height: 2rem;
	}

	@media screen and (max-width: 890px) {
		.close {
			width: 30px;
			height: 30px;
			margin: 3px;
		}
	}
	@media screen and (max-width: 500px) {
		.item-header {
			flex-direction: column;
			justify-content: center;
		}
		.info {
			width: 100%;
		}
		.fates .close {
			width: 2.5rem;
			height: 2.5rem;
			position: absolute;
			top: 20%;
			right: 0;
		}
	}
</style>
