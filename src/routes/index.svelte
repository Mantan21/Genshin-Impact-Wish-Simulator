<script context="module">
	export const prerender = true;
</script>

<script>
	import { pageActive } from '$lib/store/stores';

	// Components
	import MainBanner from '$lib/banner/MainBanner.svelte';
	import PreviousBannerList from '$lib/banner/PreviousBannerList.svelte';
	import History from '$lib/history/MainHistory.svelte';
	import Inventory from '$lib/inventory/MainInventory.svelte';
	import Shop from '$lib/shop/MainShop.svelte';
</script>

{#if $pageActive === 'index'}
	<MainBanner />
{/if}

{#if $pageActive === 'previous-banner'}
	<PreviousBannerList />
{/if}

{#if $pageActive === 'history'}
	<History />
{/if}

{#if $pageActive === 'inventory'}
	<Inventory />
{/if}

{#if $pageActive === 'shop'}
	<Shop />
{/if}
