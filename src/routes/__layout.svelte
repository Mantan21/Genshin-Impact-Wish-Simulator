<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import MobileDetect from 'mobile-detect';
	import Loader from '$lib/utility/Loader.svelte';
	import {
		isLoaded,
		viewportHeight,
		viewportWidth,
		isMobile,
		mobileMode,
		primogem,
		genesis,
		stardust,
		starglitter,
		intertwined,
		acquaint
	} from '$lib/store/stores';
	import { myFunds } from '$lib/store/localstore';
	import '../app.css';

	const { title, description, keywords, protocol } = {
		title: 'Genshin Impact Wish Simulator',
		description: 'W',
		keywords: '',
		protocol: 'https'
	};

	$: if ($isLoaded) {
		window.addEventListener('orientationchange', () => {
			const { angle } = screen.orientation;
			if ($isMobile) mobileMode.set(angle === 90 || angle === 270);
		});
	}

	const setBudget = () => {
		const localGenesis = myFunds.get('genesis');
		if (localGenesis !== null) genesis.set(localGenesis);

		const localPrimo = myFunds.get('primogem');
		if (localPrimo === null) myFunds.set('primogem', $primogem);
		else primogem.set(localPrimo);

		const localStardust = myFunds.get('stardust');
		if (localStardust !== null) stardust.set(localStardust);

		const localStarglitter = myFunds.get('starglitter');
		if (localStarglitter !== null) starglitter.set(localStarglitter);

		const localIntertwined = myFunds.get('intertwined');
		if (localIntertwined !== null) intertwined.set(localIntertwined);

		const localAcquaint = myFunds.get('acquaint');
		if (localAcquaint !== null) acquaint.set(localAcquaint);
	};

	onMount(() => {
		isLoaded.set(true);
		const md = new MobileDetect(navigator.userAgent);
		isMobile.set(!!md.mobile());

		const { angle } = screen.orientation;
		mobileMode.set(angle === 90 || angle === 270);

		setBudget();

		viewportWidth.set(window.innerWidth);
		viewportHeight.set(window.innerHeight);
		window.addEventListener('resize', () => {
			viewportWidth.set(window.innerWidth);
			viewportHeight.set(window.innerHeight);
		});
	});
</script>

<svelte:head>
	<meta name="title" content={title} />
	<meta property="og:title" content={title} />
	<meta property="profile:username" content="Mantan" />
	<meta property="og:type" content="profile" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="{protocol}://{$page.host}" />
	<meta property="twitter:title" content={title} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English, Indonesian" />
	<meta name="revisit-after" content="15 days" />
	<meta name="author" content="Mantan" />

	<meta name="keywords" content={keywords} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{protocol}://{$page.host}" />
	<meta property="og:image" content="{protocol}://{$page.host}/assets/images/meta-picture.webp" />

	<meta property="twitter:description" content={description} />
	<meta
		name="twitter:image:src"
		content="{protocol}://{$page.host}/assets/images/meta-picture.webp"
	/>
	<meta
		property="twitter:image"
		content="{protocol}://{$page.host}/assets/images/meta-picture.webp"
	/>

	<meta property="al:web:url" content="{protocol}://{$page.host}" />
	<link rel="fluid-icon" href="{protocol}://{$page.host}/assets/images/meta-picture.webp" {title} />
</svelte:head>

<Loader />

<audio src="/assets/sfx/button-click.ogg" type="audio/ogg" id="button-sfx" />
<main class:mobile={$mobileMode}>
	<slot />

	<div class="uid">UID: wishSimulator</div>
</main>

<style>
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
		bottom: 5px;
		right: 5px;
		z-index: 998;
		color: #fff;
		text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
		font-family: Roboto, sans-serif;
	}
</style>
