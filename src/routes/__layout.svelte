<script>
	// Packagae
	import { page } from '$app/stores';
	import { dev } from '$app/env';
	import { onMount } from 'svelte';
	import MobileDetect from 'mobile-detect';

	import Loader from '$lib/components/utility/Loader.svelte';
	import Disclaimer from '$lib/components/utility/Disclaimer.svelte';
	import {
		isLoaded,
		viewportHeight,
		viewportWidth,
		isMobile,
		mobileMode,
		isAcquaintUsed,
		bannerActive,
		bannerList
	} from '$lib/store/stores';
	import { HOST, APP_TITLE, DESCRIPTION, KEYWORDS } from '$lib/env';
	import { importLocalBalance } from '$lib/functions/importLocalData';
	import '../app.css';

	let preview = $page.path.split('/')[1] === 'screen';

	$: if ($bannerList.length > 0) {
		const { type } = $bannerList[$bannerActive];
		isAcquaintUsed.set(type === 'standard' || type === 'beginner');
	}

	onMount(() => {
		const t = setTimeout(
			() => {
				isLoaded.set(true);
				clearTimeout(t);
			},
			preview ? 10 : 2000
		);

		const md = new MobileDetect(navigator.userAgent);
		isMobile.set(!!md.mobile());

		const { angle } = screen.orientation;
		mobileMode.set(angle === 90 || angle === 270);
		window.addEventListener('orientationchange', () => {
			const { angle } = screen.orientation;
			if ($isMobile) mobileMode.set(angle === 90 || angle === 270);
		});

		importLocalBalance();

		viewportWidth.set(window.innerWidth);
		viewportHeight.set(window.innerHeight);
		window.addEventListener('resize', () => {
			viewportWidth.set(window.innerWidth);
			viewportHeight.set(window.innerHeight);
		});

		// prevent Righ click (hold on android) on production mode
		if (!dev) document.addEventListener('contextmenu', (e) => e.preventDefault());
	});
</script>

<svelte:head>
	<meta name="title" content={APP_TITLE} />
	<meta property="og:title" content={APP_TITLE} />
	<meta property="twitter:url" content={HOST} />
	<meta property="twitter:title" content={APP_TITLE} />

	<meta name="keywords" content={KEYWORDS} />
	<meta name="description" content={DESCRIPTION} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={HOST} />
	<meta property="og:image" content="/assets/images/meta-picture.jpg" />

	<meta property="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image:src" content="/assets/images/meta-picture.jpg" />
	<meta property="twitter:image" content="/assets/images/meta-picture.jpg" />

	<meta property="al:web:url" content={HOST} />
	<link rel="fluid-icon" href="/assets/images/meta-picture.jpg" title={APP_TITLE} />
</svelte:head>

<Loader />
{#if !preview}
	<Disclaimer />
{/if}

<main class:mobile={$mobileMode} class:preview>
	<slot />

	<a href="/" class="uid" class:preview> WishSimulator.vercel.app </a>

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
		height: 100vh;
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
		z-index: 998;
		color: #fff;
		text-shadow: 0 0 1.5px rgba(0, 0, 0, 0.7);
		font-family: Roboto, sans-serif;
	}
	.uid:not(.preview) {
		pointer-events: none;
	}

	.preview .uid {
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
