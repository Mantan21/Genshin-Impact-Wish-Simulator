<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import {
		pageActive,
		bannerList,
		backsound,
		patchVersion,
		bannerPhase,
		showBeginner,
		isFatepointSystem,
		isLoaded
	} from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import { APP_TITLE } from '$lib/env';
	import { setBannerVersionAndPhase } from '$lib/functions/importLocalData';
	import { beginner } from '$lib/data/banners/beginner.json';

	// Components
	import MainBanner from '$lib/components/banner/MainBanner.svelte';
	import PreviousBannerList from '$lib/components/banner/PreviousBannerList.svelte';
	import History from '$lib/components/history/MainHistory.svelte';
	import Inventory from '$lib/components/inventory/MainInventory.svelte';
	import Shop from '$lib/components/shop/MainShop.svelte';
	import Loader from '$lib/components/utility/Loader.svelte';

	let isMount = false;
	$: audioActive = $backsound && $pageActive === 'index';
	$: if (audioActive) playSfx('wishBacksound');
	else if (isMount) playSfx('wishBacksound', true);

	const beginnerBanner = beginner;
	let eventBanner;
	let weaponBanner;
	let standardBanner;
	let list = [];

	const showBeginnerCheck = (showBeginner) => {
		if ($bannerList.length < 2) return;
		if (!showBeginner) {
			return bannerList.update((bn) => {
				return bn.filter(({ type }) => type !== 'beginner');
			});
		}
		return bannerList.update((bn) => {
			bn.unshift({ type: 'beginner', character: beginnerBanner });
			return bn;
		});
	};

	const updateBannerListToShow = (showBeginner) => {
		list = showBeginner ? [{ type: 'beginner', character: beginnerBanner }] : [];
		if (Array.isArray(eventBanner)) {
			eventBanner.forEach((bn) => list.push({ type: 'events', character: bn }));
		} else list.push({ type: 'events', character: eventBanner });
		list.push({ type: 'weapons', weapons: weaponBanner });
		list.push({ type: 'standard', character: standardBanner });
		bannerList.set(list);
		isFatepointSystem.set(!!weaponBanner.fatepointsystem);
		pageActive.set('index');
		return isLoaded.set(true); // remove progress loader
	};

	const switchBanner = async (patch, bannerPhase) => {
		try {
			if (!patch) return;
			const { data } = await import(`../lib/data/banners/events/${patch}.json`);
			const { banners } = data.find(({ phase }) => phase === bannerPhase);
			const { events, weapons, standardVersion } = banners;
			const { standard } = await import(`../lib/data/banners/standard/${standardVersion}.json`);
			eventBanner = events.item;
			weaponBanner = weapons;
			standardBanner = standard.featured;
			return updateBannerListToShow($showBeginner);
		} catch (e) {
			console.error(`Can't Switch banner because it unavailable !`, e);
		}
	};

	$: switchBanner($patchVersion, $bannerPhase);
	$: showBeginnerCheck($showBeginner);

	onMount(async () => {
		isMount = true;
		setBannerVersionAndPhase();
		window.addEventListener('blur', () => playSfx('wishBacksound', true));
		window.addEventListener('focus', () => {
			if (audioActive) playSfx('wishBacksound');
		});

		window.addEventListener('popstate', (e) => {
			if (e.state.page !== 'index') return;
			pageActive.set('index');
		});
	});
</script>

<svelte:head>
	<meta name="title" content={APP_TITLE} />
	<meta property="og:title" content={APP_TITLE} />
	<meta property="twitter:title" content={APP_TITLE} />
	<meta property="og:image" content="/assets/images/meta-picture.jpg" />
	<meta name="twitter:image:src" content="/assets/images/meta-picture.jpg" />
	<meta property="twitter:image" content="/assets/images/meta-picture.jpg" />
	<link rel="fluid-icon" href="/assets/images/meta-picture.jpg" title={APP_TITLE} />
</svelte:head>

<Loader />

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
