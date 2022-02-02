<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { pageActive, backsound } from '$lib/store/stores';
	import { setBannerVersionAndPhase } from '$lib/functions/importLocalData';

	// Components
	import MainBanner from '$lib/components/banner/MainBanner.svelte';
	import PreviousBannerList from '$lib/components/banner/PreviousBannerList.svelte';
	import History from '$lib/components/history/MainHistory.svelte';
	import Inventory from '$lib/components/inventory/MainInventory.svelte';
	import Shop from '$lib/components/shop/MainShop.svelte';
	import playSfx from '$lib/functions/audio';

	let isMount = false;
	$: audioActive = $backsound && $pageActive === 'index';
	$: if (audioActive) playSfx('wishBacksound');
	else if (isMount) playSfx('wishBacksound', true);

	onMount(async () => {
		isMount = true;
		setBannerVersionAndPhase();
		window.addEventListener('blur', () => playSfx('wishBacksound', true));
		window.addEventListener('focus', () => {
			if (audioActive) playSfx('wishBacksound');
		});
	});
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
