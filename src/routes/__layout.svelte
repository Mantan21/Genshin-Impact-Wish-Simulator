<script>
	import { onMount } from 'svelte';
	import MobileDetect from 'mobile-detect';
	import Loader from '$lib/utility/Loader.svelte';
	import { isLoaded, viewportHeight, viewportWidth, isMobile, mobileMode } from '$lib/store/stores';
	import '../app.css';

	$: if ($isLoaded) {
		window.addEventListener('orientationchange', () => {
			const { angle } = screen.orientation;
			if ($isMobile) mobileMode.set(angle === 90 || angle === 270);
		});
	}

	onMount(() => {
		isLoaded.set(true);
		const md = new MobileDetect(navigator.userAgent);
		isMobile.set(!!md.mobile());

		const { angle } = screen.orientation;
		mobileMode.set(angle === 90 || angle === 270);

		viewportWidth.set(window.innerWidth);
		viewportHeight.set(window.innerHeight);
		window.addEventListener('resize', () => {
			viewportWidth.set(window.innerWidth);
			viewportHeight.set(window.innerHeight);
		});
	});
</script>

<Loader />

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
