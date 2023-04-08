<script>
	// Packagae
	import { registerSW } from 'virtual:pwa-register';
	import { isLoading, locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { onMount, setContext } from 'svelte';
	import {
		viewportHeight,
		viewportWidth,
		isMobile,
		mobileMode,
		isAcquaintUsed,
		bannerActive,
		bannerList,
		assets,
		isPWA
	} from '$lib/store/stores';
	import { HOST, DESCRIPTION, KEYWORDS, APP_TITLE } from '$lib/env';
	import { mountLocale } from '$lib/helpers/i18n';
	import { importLocalBalance } from '$lib/helpers/importLocalData';
	import { mobileDetect } from '$lib/helpers/mobileDetect';
	import { userCurrencies } from '$lib/helpers/currencies';
	import { wakeLock } from '$lib/helpers/wakeLock';
	import metaPicture from '../../screenshot/meta-picture.jpg';
	import '../app.css';
	import Loader from '$lib/components/utility/Loader.svelte';
	import Iklan from '$lib/components/utility/Iklan.svelte';
	import { IDBUpdater } from '$lib/helpers/IDBUpdater';

	let innerHeight;
	let innerWidth;
	let isBannerLoaded = false;
	let isloaded = false;
	let showAd = false;

	$: lc = $locale?.toLowerCase() || '';
	$: isYuanshen = lc.includes('cn') || lc.includes('ja');
	$: font = isYuanshen || lc.includes('th') ? lc.split('-')[0] : 'global';

	$: viewportWidth.set(innerWidth);
	$: viewportHeight.set(innerHeight);
	$: path = $page.url.pathname.split('/');
	$: directLoad = path[1] !== '';
	$: preview = path[1] === 'screen';

	$: if ($bannerList.length > 0) {
		const { type } = $bannerList[$bannerActive];
		isAcquaintUsed.set(type === 'standard' || type === 'beginner');
	}

	const setMobileMode = () => {
		if ($isPWA) return mobileMode.set(true);
		const angle = screen.orientation?.angle || 0;
		const rotate = angle === 90 || angle === 270;
		mobileMode.set(rotate);
	};

	setContext('bannerLoaded', () => (isBannerLoaded = true));
	setContext('loaded', () => (isloaded = true));
	setContext('showAd', (show) => (showAd = show));

	const validPaths = ['adkey', 'install', 'privacy-policy', 'screen'];
	$: isPathValid = validPaths.includes(path[1].toLowerCase());

	mountLocale();
	onMount(() => {
		const isCDNHost = $page.url.host.includes('cdn.');
		if (isCDNHost) return window.location.replace('https://wishsimulator.app/');
		if (path[1] && !isPathValid) return window.location.replace('/');

		const url = new URL(window.location.href);
		const searchParams = new URLSearchParams(url.search);
		isPWA.set(searchParams.get('pwa') === 'true' || !!searchParams.get('pwasc'));

		registerSW();
		wakeLock();

		IDBUpdater();
		importLocalBalance();
		userCurrencies.init();

		isMobile.set(mobileDetect() || innerWidth < 601);
		if ($isMobile) setMobileMode();

		window.addEventListener('orientationchange', () => {
			if ($isMobile) setMobileMode();
		});

		// prevent Righ click (hold on android) on production mode
		if (!dev) document.addEventListener('contextmenu', (e) => e.preventDefault());
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<svelte:head>
	<meta name="description" content={DESCRIPTION} />
	<meta name="keywords" content={KEYWORDS} />
	<meta property="al:web:url" content={HOST} />
	<link rel="fluid-icon" href="{HOST}{metaPicture}" title={APP_TITLE} />

	<meta property="og:url" content={HOST} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={APP_TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content="{HOST}{metaPicture}" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={HOST.replace('https://', '').replace('http://', '')} />
	<meta property="twitter:url" content={HOST} />
	<meta name="twitter:title" content={APP_TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{HOST}{metaPicture}" />

	{#if path[1] && !isPathValid}
		<link rel="canonical" href={HOST} />
	{/if}

	<link
		rel="preload"
		href="/fonts/optimized_global_web.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>
	<link
		rel="preload"
		href="/fonts/optimized_th_web.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>
	<link
		rel="preload"
		href="/fonts/optimized_jp_web.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>
	<link
		rel="preload"
		href="/fonts/optimized_zh_web.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>

	{#if !dev}
		<link rel="manifest" href="/appmanifest.json" />
	{/if}

	{#if isloaded && showAd}
		<Iklan head />
	{/if}
</svelte:head>

<Loader {isBannerLoaded} {directLoad} />

<main
	class:mobile={$mobileMode}
	class:preview
	class={$locale}
	style="height: {$viewportHeight ? `${$viewportHeight}px` : '100vh'};
		--genshin-font: var(--gi-{font}-font)"
>
	{#if !$isLoading && isloaded}
		<slot />
	{/if}
	<a
		href="/"
		on:click|preventDefault={() => window.location.replace('/')}
		class="uid"
		title="Try Your Luck by this Simulator"
	>
		WishSimulator.App
	</a>

	<img
		src={$assets[`genshin-logo${isYuanshen ? '-cn' : ''}.webp`]}
		alt="genshin logo"
		class="logo"
		class:yuanshen={isYuanshen}
	/>
</main>

<style global>
	@import '../../node_modules/overlayscrollbars/css/OverlayScrollbars.css';

	@font-face {
		font-family: 'GI_Global_Web';
		src: url('/fonts/optimized_global_web.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	@font-face {
		font-family: 'GI_JA_Web';
		src: url('/fonts/optimized_jp_web.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	@font-face {
		font-family: 'GI_TH_Web';
		src: url('/fonts/optimized_th_web.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	@font-face {
		font-family: 'GI_ZH_Web';
		src: url('/fonts/optimized_zh_web.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	:global(.os-theme-light > .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle) {
		background-color: #d2c69c;
		opacity: 0.5;
	}
	:global(.os-theme-light > .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle:hover),
	:global(.os-theme-light > .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle:active) {
		background-color: #d2c69c;
		opacity: 1;
	}

	:global(.os-theme-light > .os-scrollbar-vertical) {
		width: 8px;
	}
	:global(.os-theme-light > .os-scrollbar-horizontal) {
		height: 8px;
	}

	main {
		display: block;
		width: 100%;
		overflow: hidden;
		font-family: var(--genshin-font);
	}

	:global(audio) {
		visibility: hidden;
	}

	.uid {
		display: block;
		position: fixed;
		bottom: 0px;
		right: 2em;
		z-index: 9999;
		color: #fff;
		text-shadow: 0 0 1.5px rgba(0, 0, 0, 0.7);
		font-family: Roboto, sans-serif;
		pointer-events: none;
	}

	.mobile .uid {
		right: 5%;
	}

	.preview .uid {
		pointer-events: unset;
		right: unset;
		left: 1rem;
		bottom: 1rem;
	}
	.logo {
		display: none;
	}
	.preview .logo {
		display: block;
		width: 30vh;
		max-width: 30%;
		position: fixed;
		bottom: 0px;
		right: 2em;
	}

	.preview .logo.yuanshen {
		max-height: 20vh;
		width: 20vh;
	}
</style>
