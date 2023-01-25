<script>
	import { browser } from '$app/environment';
	import { t } from 'svelte-i18n';
	import { pity4star, pity5star } from '$lib/store/localstore';
	import { userCurrencies } from '$lib/helpers/currencies';

	export let banner = '';
	export let v2 = false;
	export let dataLength = 0;

	let pity4, pity5, totalSpend;
	$: {
		if (browser) {
			pity5 = pity5star.get(banner);
			pity4 = pity4star.get(banner);
		}
		totalSpend = userCurrencies.getTotalSpend(dataLength);
	}
</script>

{#if v2}
	<div class="cell">
		{$t('history.currentPity')} &nbsp; <strong class="star5"> {pity5} </strong> &nbsp; - &nbsp;
		<strong class="star4"> {pity4} </strong>
		<br />
		{$t('history.totalPull')} <span class="lighted"> <strong> {dataLength} </strong> </span>
	</div>
	<div class="cell">
		{$t('history.totalSpend')}
		<strong><span class="lighted"> {dataLength * 160}</span> {$t('shop.item.primogem')}</strong>
		<br />
		Est. <span class="lighted"> <strong> {totalSpend} </strong> </span>
	</div>
{:else}
	{$t('history.currentPity')} &nbsp; <strong class="star5"> {pity5} </strong> &nbsp; - &nbsp;
	<strong class="star4"> {pity4} </strong>
	<br />
	{$t('history.totalPull')} <span class="lighted"> <strong> {dataLength} </strong> </span>
	<br />
	{$t('history.totalSpend')}
	<strong><span class="lighted"> {dataLength * 160}</span> {$t('shop.item.primogem')}</strong>
	~
	<span class="lighted"> <strong> {totalSpend} </strong> </span>
{/if}

<style>
	.star4,
	.lighted {
		color: #a256e1;
	}
	.star5 {
		color: #bd6932;
	}

	.cell {
		width: 33.33333333333%;
		font-size: calc(0.014 * var(--content-width));
	}
</style>
