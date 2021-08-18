<script>
	import { fly } from 'svelte/transition';
	import { bannerActive, viewportHeight, viewportWidth } from '$lib/stores';
	import setup from '$lib/setup/wish-setup.json';

	const { version, bannerNumber } = setup;

	$: style =
		$viewportHeight > $viewportWidth ? 'width: 80vw; height: auto' : 'height: 75vh; width: auto';
</script>

<div class="banner" style="width:80%">
	{#if $bannerActive === 'beginner'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="./assets/images/banner/beginner.webp" alt="Beginner Banner" />
		</div>
	{:else if $bannerActive === 'limited'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img
				src="./assets/images/banner/{version}/limited-{bannerNumber}.webp"
				alt="Limited Banner"
			/>
		</div>
	{:else if $bannerActive === 'weapon'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="./assets/images/banner/{version}/weapon-{bannerNumber}.webp" alt="Weapon Banner" />
		</div>
	{:else if $bannerActive === 'standard'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="./assets/images/banner/standard.webp" alt="Standard Banner" />
		</div>
	{/if}
</div>

<style>
	.banner {
		padding: 30px 0;
		dipslay: block;
		width: 80%;
		max-width: 850px;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	img {
		max-height: 100%;
		max-width: 100%;
	}
</style>
