<script context="module">
	export const prerender = true;
</script>

<script>
	import { getContext, onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { CHATROOM } from '$lib/env';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import {
		pageActive,
		bannerList,
		backsound,
		patchVersion,
		bannerPhase,
		showBeginner,
		isFatepointSystem,
		muted,
		bannerActive,
		assets
	} from '$lib/store/stores';
	import { localConfig, localWelkin } from '$lib/store/localstore';
	import { beginner } from '$lib/data/banners/beginner.json';

	// Components
	import Disclaimer from '$lib/components/utility/Disclaimer.svelte';
	import MainWish from '$lib/components/wish/MainWish.svelte';
	import Toast from '$lib/components/utility/Toast.svelte';

	let PrevBanner;
	let GachaInfo;
	let ShopSection;
	let InventorySection;
	let Obtained;
	let WelkinCheckin;
	let setBannerVersionAndPhase;
	let Chats;

	const importChunks = async () => {
		// Splitting Chunks
		PrevBanner = (await import('$lib/components/bannerlist/MainBannerList.svelte')).default;
		GachaInfo = (await import('$lib/components/gachainfo/GachaInfo.svelte')).default;
		InventorySection = (await import('$lib/components/inventory/MainInventory.svelte')).default;
		ShopSection = (await import('$lib/components/shop/MainShop.svelte')).default;
		Obtained = (await import('$lib/components/utility/Obtained.svelte')).default;
		WelkinCheckin = (await import('$lib/components/utility/WelkinCheckin.svelte')).default;

		if (!CHATROOM) return;
		Chats = (await import('$lib/components/chat/MainChat.svelte')).default;
	};

	const importHelper = async () => {
		({ setBannerVersionAndPhase } = await import('$lib/helpers/importLocalData'));
	};

	let isMount = false;
	let isAnimatedBG = false;
	$: audioActive = $backsound && $pageActive === 'index' && !$muted;
	$: if (audioActive) playSfx('wishBacksound');
	else if (isMount) playSfx('wishBacksound', { paused: true });

	const animateBG = () => {
		isAnimatedBG = localConfig.get('animatedBG');
	};
	setContext('animateBG', animateBG);

	let showToast = false;
	const beginnerBanner = beginner.featured;
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

	const loaded = getContext('bannerLoaded');
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
			const { data } = await import(`$lib/data/banners/events/${patch}.json`);
			const { banners } = data.find(({ phase }) => phase === bannerPhase);
			const { events, weapons, standardVersion } = banners;
			const { standard } = await import(`$lib/data/banners/standard/${standardVersion}.json`);
			eventBanner = events.item;
			weaponBanner = weapons;
			standardBanner = standard.featured;
			return updateBannerListToShow($showBeginner);
		} catch (e) {
			showToast = true;
			console.error(`Can't Switch banner because it unavailable !`, e);
		}
	};

	$: switchBanner($patchVersion, $bannerPhase);
	$: showBeginnerCheck($showBeginner);

	onMount(async () => {
		await importHelper();
		animateBG();
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

	// Milestone Bonus screen
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

	// Announcement - Notice - Disclaimer
	const closeDisclaimer = () => {
		bannerActive.set(0);
		showDisclaimer = false;

		const { remaining, diff, latestCheckIn } = localWelkin.getData();
		welkinCheckin = remaining > 0 && remaining - diff >= 0 && diff > 0;
		if (latestCheckIn) localWelkin.checkin();
		if (!welkinCheckin) return backsound.set(true);
	};
	setContext('closeDisclaimer', closeDisclaimer);

	// Welkin
	const closeWelkin = () => (welkinCheckin = false);
	setContext('closeWelkin', closeWelkin);

	// Animated Background
	let hideBG = false;
	const bgToggle = (val) => {
		hideBG = val;
	};
	setContext('bgToggle', bgToggle);

	// ChatRoom
	let chatLoaded = false; // initial load
	let showChat = false; // toggle hide-show
	const chatToggle = () => {
		chatLoaded = true;
		showChat = !showChat;
		playSfx(!showChat ? 'click' : 'close');
	};
	setContext('chatToggle', chatToggle);
</script>

{#if showToast}
	<Toast autoclose on:close={() => (showToast = false)}>
		{@html $t('wish.loadFailed')}
	</Toast>
{/if}

<!-- Obtained Items -->
{#if showObtained}
	<svelte:component this={Obtained} items={obtainedItems} on:close={handleCloseObtained} />
{/if}
<!-- Obtained Items End -->

{#if CHATROOM && chatLoaded}
	<svelte:component this={Chats} show={showChat} />
{/if}
<svelte:component this={Disclaimer} show={showDisclaimer} />
<svelte:component this={WelkinCheckin} show={welkinCheckin} />

{#if isAnimatedBG}
	<video
		transition:fade|local={{ duration: 2000 }}
		muted
		loop
		autoplay
		poster={$assets['wish-background.webp']}
		class:hide={$pageActive !== 'index' || hideBG}
	>
		<source src="/videos/bg.webm" type="video/webm" />
		<track kind="captions" />
	</video>
{/if}

{#if $pageActive === 'index'}
	<MainWish />
{/if}

{#if $pageActive === 'previous-banner'}
	<svelte:component this={PrevBanner} />
{/if}

{#if $pageActive === 'details'}
	<svelte:component this={GachaInfo} page="details" />
{/if}

{#if $pageActive === 'history'}
	<svelte:component this={GachaInfo} page="history" />
{/if}

{#if $pageActive === 'inventory'}
	<svelte:component this={InventorySection} />
{/if}

{#if $pageActive === 'shop'}
	<svelte:component this={ShopSection} />
{/if}

<style>
	video {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 20%;
	}

	.hide {
		visibility: hidden;
	}
</style>
