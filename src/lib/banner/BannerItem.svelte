<script>
	import { fly } from 'svelte/transition';
	import { bannerActive, viewportHeight, viewportWidth } from '$lib/store/stores';
	import setup from '$lib/setup/wish-setup.json';

	const { version, bannerNumber } = setup;

	$: style =
		$viewportHeight > 800 ||
		$viewportHeight > $viewportWidth ||
		$viewportHeight / $viewportWidth > 0.5
			? 'bottom: unset; top: 50%; transform: translate(-50%, -50%);'
			: '';
</script>

<div class="banner" {style}>
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

	:global(.mobile) .banner {
		padding: 0;
		width: 88%;
		max-width: 155vh;
		margin-bottom: -10px;
	}
</style>
