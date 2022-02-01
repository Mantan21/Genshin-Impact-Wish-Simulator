<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { pageActive, bannerPhase, patchVersion } from '$lib/store/stores';
	import { updateSite } from '$lib/export-import/import';
	import { localBannerVersion } from '$lib/store/localstore';
	import { storageVersion } from '$lib/setup/wish-setup.json';

	// Components
	import MainBanner from '$lib/components/banner/MainBanner.svelte';
	import PreviousBannerList from '$lib/components/banner/PreviousBannerList.svelte';
	import History from '$lib/components/history/MainHistory.svelte';
	import Inventory from '$lib/components/inventory/MainInventory.svelte';
	import Shop from '$lib/components/shop/MainShop.svelte';

	const setBannerPhase = () => {
		const localstoreVersion = localStorage.getItem('storageVersion');
		if (localstoreVersion) updateSite(localstoreVersion);

		if (localstoreVersion !== storageVersion) {
			localBannerVersion.clear();
			localStorage.setItem('storageVersion', storageVersion);
		}

		const localVersion = localBannerVersion.get();
		if (!localVersion) return;
		const [patch, phase] = localVersion.split('-');
		bannerPhase.set(parseInt(phase));
		patchVersion.set(patch);
	};

	onMount(setBannerPhase);
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
