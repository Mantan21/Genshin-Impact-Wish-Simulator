<script>
	import { getContext } from 'svelte';
	import { assets } from '$lib/store/app-stores';
	import BannerArt from '../../_custom-banner/BannerEditor/BannerArt.svelte';

	export let src = '';
	export let alt = '';
	export let wrapperClass = '';
	export let isError = false;

	export let custom = false;
	export let vision = '';
	export let artPosition = {};
	export let rateup = [];

	const imageError = getContext('imageError');
</script>

<div
	class:image-error={isError}
	class="wrapper {wrapperClass}"
	style="min-height: 100px; width: 100%;"
>
	{#if !isError}
		{#if custom}
			<img
				src={$assets[`blank/character-${vision}`]}
				alt="background banner"
				crossorigin="anonymous"
				class="art-bg"
			/>
			{#key artPosition}
				<BannerArt artURL={src} bannerPosition={artPosition?.banner} {rateup} />
			{/key}
		{:else}
			<picture style="position: relative; width: 100%; overflow: hidden">
				<img {src} {alt} on:error={imageError} crossorigin="anonymous" />
			</picture>
		{/if}
	{/if}
</div>

<style>
	picture,
	img {
		width: 100%;
		display: block;
	}
	.art-bg {
		aspect-ratio: 1080/533;
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.image-error {
		background-image: linear-gradient(to top, #eee8e3 50%, #f7f5f4);
	}
</style>
