<script context="module">
	export const prerender = true;
</script>

<script>
	import { getContext, onMount, setContext } from 'svelte';
	import playSfx from '$lib/helpers/audio';
	import {
		pageActive,
		bannerList,
		backsound,
		patchVersion,
		bannerPhase,
		showBeginner,
		isFatepointSystem,
		muted,
		bannerActive
	} from '$lib/store/stores';
	import { localWelkin } from '$lib/store/localstore';
	import { beginner } from '$lib/data/banners/beginner.json';

	// Components
	import Disclaimer from '$lib/components/utility/Disclaimer.svelte';
	import MainBanner from '$lib/components/banner/MainBanner.svelte';

	let PrevBanner;
	let DetailsSection;
	let ShopSection;
	let InventorySection;
	let HistorySection;
	let Obtained;
	let WelkinCheckin;
	let setBannerVersionAndPhase;

	const importChunks = async () => {
		// Splitting Chunks
		PrevBanner = (await import('../lib/components/banner/PreviousBannerList.svelte')).default;
		DetailsSection = (await import('../lib/components/details/Details.svelte')).default;
		HistorySection = (await import('../lib/components/history/MainHistory.svelte')).default;
		InventorySection = (await import('../lib/components/inventory/MainInventory.svelte')).default;
		ShopSection = (await import('../lib/components/shop/MainShop.svelte')).default;
		Obtained = (await import('../lib/components/utility/Obtained.svelte')).default;
		WelkinCheckin = (await import('../lib/components/utility/WelkinCheckin.svelte')).default;
	};

	const importHelper = async () => {
		({ setBannerVersionAndPhase } = await import('../lib/helpers/importLocalData'));
	};

	let isMount = false;
	$: audioActive = $backsound && $pageActive === 'index' && !$muted;
	$: if (audioActive) playSfx('wishBacksound');
	else if (isMount) playSfx('wishBacksound', { paused: true });

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

	const loaded = getContext('loaded');
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
		loaded();
		return;
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
		await importHelper();
		importChunks();
		isMount = true;
		setBannerVersionAndPhase();
		window.addEventListener('blur', () => playSfx('wishBacksound', { paused: isMount }));
		window.addEventListener('focus', () => {
			if (audioActive) return playSfx('wishBacksound');
			else return;
		});

		window.addEventListener('popstate', (e) => {
			if (e.state.page) return;
			if ($pageActive === 'index') return;
			pageActive.set('index');
		});
	});

	let showObtained = false;
	let obtainedItems = {};

	const handleObtained = (itemToBuy, value = 0) => {
		if (Array.isArray(itemToBuy)) {
			itemToBuy.forEach(({ item, value }) => {
				obtainedItems[item] = value;
			});
			showObtained = true;
			return;
		}
		obtainedItems[itemToBuy] = value;
		showObtained = true;
	};
	setContext('handleObtained', handleObtained);

	const handleCloseObtained = () => {
		showObtained = false;
		obtainedItems = {};
		playSfx('close');
		if ($pageActive === 'index') backsound.set(true);
	};

	let welkinCheckin = false;
	let showDisclaimer = true;
	const closeDisclaimer = () => {
		bannerActive.set(0);
		showDisclaimer = false;

		const { remaining, diff, latestCheckIn } = localWelkin.getData();
		welkinCheckin = remaining > 0 && remaining - diff >= 0 && diff > 0;
		if (latestCheckIn) localWelkin.checkin();
		if (!welkinCheckin) return backsound.set(true);
	};
	setContext('closeDisclaimer', closeDisclaimer);

	const closeWelkin = () => (welkinCheckin = false);
	setContext('closeWelkin', closeWelkin);
</script>

<video muted loop autoplay poster="/images/background/wish-background.webp">
	<source src="/assets/videos/bg.webm" type="video/webm" />
	<track kind="captions" />
</video>
<div class="overlay" />

<!-- Obtained Items -->
{#if showObtained}
	<svelte:component this={Obtained} items={obtainedItems} on:close={handleCloseObtained} />
{/if}
<!-- Obtained Items End -->

<svelte:component this={Disclaimer} show={showDisclaimer} />
<svelte:component this={WelkinCheckin} show={welkinCheckin} />

{#if $pageActive === 'index'}
	<MainBanner />
{/if}

{#if $pageActive === 'previous-banner'}
	<svelte:component this={PrevBanner} />
{/if}

{#if $pageActive === 'details'}
	<svelte:component this={DetailsSection} />
{/if}

{#if $pageActive === 'history'}
	<svelte:component this={HistorySection} />
{/if}

{#if $pageActive === 'inventory'}
	<svelte:component this={InventorySection} />
{/if}

{#if $pageActive === 'shop'}
	<svelte:component this={ShopSection} />
{/if}

<style>
	video {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 110%;
		height: 105%;
		object-fit: cover;
		object-position: 20%;
	}

	.overlay {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: block;
		width: 120%;
		height: 120%;
		background-color: rgba(0, 0, 0, 0.08);
		box-shadow: 0 0 50vh rgba(0, 0, 0, 0.9) inset;
	}

	:global(.mobile) .overlay {
		width: 140%;
		height: 140%;
	}

	@media screen and (max-width: 645px) {
		.overlay {
			width: 150%;
		}
	}

	@media screen and (max-width: 400px) {
		.overlay {
			width: 150%;
			height: 130%;
		}
	}
</style>
