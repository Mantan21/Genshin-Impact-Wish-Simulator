<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { pageActive, bannerPhase, patchVersion } from '$lib/store/stores';
	import { updateSite } from '$lib/export-import/import';
	import { localBannerVersion } from '$lib/store/localstore';
	import setup from '$lib/setup/wish-setup.json';

	// Components
	import MainBanner from '$lib/banner/MainBanner.svelte';
	import PreviousBannerList from '$lib/banner/PreviousBannerList.svelte';
	import History from '$lib/history/MainHistory.svelte';
	import Inventory from '$lib/inventory/MainInventory.svelte';
	import Shop from '$lib/shop/MainShop.svelte';

	const setBannerPhase = () => {
		const localstoreVersion = localStorage.getItem('storageVersion');
		if (localstoreVersion) updateSite(localstoreVersion);

		const { storageVersion } = setup;
		if (localstoreVersion !== storageVersion) {
			localBannerVersion.clear();
			localStorage.setItem('storageVersion', storageVersion);
		}

		const localVersion = localBannerVersion.get();
		if (!localVersion) return;
		const [patch, version] = localVersion.split('-');
		bannerPhase.set(parseInt(version));
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
