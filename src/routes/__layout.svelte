<!-- <script>
	import Limit from '$lib/components/utility/Limit.svelte';
</script>

<Limit /> -->
<script>
	// Packagae
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
	import { HOST, DESCRIPTION, KEYWORDS } from '$lib/env';
	import { importLocalBalance } from '$lib/functions/importLocalData';
	import { mobileDetect } from '$lib/functions/mobileDetect';
	import '../app.css';
	import Loader from '$lib/components/utility/Loader.svelte';

	let isLoaded = false;
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

	onMount(() => {
		importLocalBalance();

		isMobile.set(mobileDetect());
		if ($isMobile) setMobileMode();

		window.addEventListener('orientationchange', () => {
			if ($isMobile) setMobileMode();
		});

		viewportWidth.set(window.innerWidth);
		viewportHeight.set(window.innerHeight);
		window.addEventListener('resize', () => {
			viewportWidth.set(window.innerWidth);
			viewportHeight.set(window.innerHeight);
			if ($isMobile) setMobileMode();
		});

		// prevent Righ click (hold on android) on production mode
		if (!dev) document.addEventListener('contextmenu', (e) => e.preventDefault());
	});
</script>

<svelte:head>
	<meta property="twitter:url" content={HOST} />
	<meta name="keywords" content={KEYWORDS} />
	<meta name="description" content={DESCRIPTION} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={HOST} />
	<meta property="twitter:description" content={DESCRIPTION} />
	<meta property="al:web:url" content={HOST} />
</svelte:head>

{#if !preview}
	<Loader {isLoaded} />
{/if}

<main
	class:mobile={$mobileMode}
	class:preview
	style="height: {$viewportHeight ? `${$viewportHeight}px` : '100vh'}"
>
	<slot />
	<a href="/" class="uid" title="Try Your Luck by this Simulator"> WishSimulator.App </a>

	<img src="/assets/images/utility/genshin-logo.webp" alt="genshin logo" class="logo" />
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
</style>
