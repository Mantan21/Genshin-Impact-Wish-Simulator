<script>
	import { onMount } from 'svelte';
	import Loader from '$lib/utility/Loader.svelte';
	import { isLoaded, viewportHeight, viewportWidth } from '$lib/stores';
	import '../app.css';

	onMount(() => {
		isLoaded.set(true);

		viewportWidth.set(window.innerWidth);
		viewportHeight.set(window.innerHeight);
		window.addEventListener('resize', () => {
			viewportWidth.set(window.innerWidth);
			viewportHeight.set(window.innerHeight);
		});
	});
</script>

<Loader />

<main>
	<slot />
</main>

<style>
	main {
		display: block;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}
</style>
