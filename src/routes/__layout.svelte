<script>
	// Packagae
	import { isLoading, locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { dev } from '$app/env';
	import { onMount, setContext } from 'svelte';
	import {
		viewportHeight,
		viewportWidth,
		isMobile,
		mobileMode,
		isAcquaintUsed,
		bannerActive,
		bannerList
	} from '$lib/store/stores';
	import { HOST, DESCRIPTION, KEYWORDS, APP_TITLE } from '$lib/env';
	import { mountLocale } from '$lib/helpers/i18n';
	import { importLocalBalance } from '$lib/helpers/importLocalData';
	import { mobileDetect } from '$lib/helpers/mobileDetect';
	import { userCurrencies } from '$lib/helpers/currencies';
	import '../app.css';
	import Loader from '$lib/components/utility/Loader.svelte';
	import Iklan from '$lib/components/utility/Iklan.svelte';

	let innerHeight;
	let innerWidth;
	let isLoaded = false;

	$: isCN = $locale?.toLowerCase().includes('cn');
	$: viewportWidth.set(innerWidth);
	$: viewportHeight.set(innerHeight);
	$: preview = $page.url.pathname.split('/')[1] === 'screen';

	$: if ($bannerList.length > 0) {
		const { type } = $bannerList[$bannerActive];
		isAcquaintUsed.set(type === 'standard' || type === 'beginner');
	}

	const setMobileMode = () => {
		const { angle } = screen.orientation;
		const rotate = angle === 90 || angle === 270;
		mobileMode.set(rotate);
	};

	const loaded = () => (isLoaded = true);
	setContext('loaded', loaded);

	mountLocale();
	onMount(() => {
		importLocalBalance();
		userCurrencies.init();

		isMobile.set(mobileDetect());
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
	<link rel="fluid-icon" href="{HOST}/screenshot/meta-picture.jpg" title={APP_TITLE} />

	<meta property="og:url" content={HOST} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={APP_TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content="{HOST}/screenshot/meta-picture.jpg" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={HOST.replace('https://', '').replace('http://', '')} />
	<meta property="twitter:url" content={HOST} />
	<meta name="twitter:title" content={APP_TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{HOST}/screenshot/meta-picture.jpg" />

	<Iklan head />
</svelte:head>

{#if !preview}
	<Loader {isLoaded} />
{/if}

<main
	class:mobile={$mobileMode}
	class:preview
	style="height: {$viewportHeight ? `${$viewportHeight}px` : '100vh'}"
>
	{#if !$isLoading}
		<slot />
	{/if}
	<a href="/" class="uid" title="Try Your Luck by this Simulator"> WishSimulator.App </a>

	<img
		src="/images/utility/genshin-logo{isCN ? '-cn' : ''}.webp"
		alt="genshin logo"
		class="logo"
		class:cn={isCN}
	/>
</main>

<style>
	@import '../../node_modules/overlayscrollbars/css/OverlayScrollbars.css';

	:global(.os-theme-light > .os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle) {
		background-color: #d2c69c;
		opacity: 0.7;
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
	}

	:global(audio) {
		visibility: hidden;
	}

	.uid {
		display: block;
		position: fixed;
		bottom: 0px;
		right: 5px;
		z-index: 9999;
		color: #fff;
		text-shadow: 0 0 1.5px rgba(0, 0, 0, 0.7);
		font-family: Roboto, sans-serif;
		pointer-events: none;
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
		right: 5px;
	}

	.preview .logo.cn {
		max-height: 20vh;
		width: 20vh;
	}
</style>
