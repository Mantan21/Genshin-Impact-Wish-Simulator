<script>
	import { getContext } from 'svelte';

	export let src = '';
	export let alt = '';
	export let wrapperClass;

	// const splitSrc = src.split('.');
	// const source = splitSrc.slice(0, -1).join('.');

	let imageError = false;
	const handleImageError = getContext('imageError');
	const errorHandle = () => {
		imageError = true;
		handleImageError(imageError);
	};
</script>

<div
	class:image-error={imageError}
	class="wrapper {wrapperClass}"
	style="min-height: 100px; width: 100%;"
>
	{#if !imageError}
		<div style="position: relative; width: 100%;">
			<div style="position: relative; overflow: hidden;">
				<picture>
					<img {src} {alt} on:error={errorHandle} />
				</picture>
			</div>
		</div>
	{/if}
</div>

<style>
	picture,
	img {
		width: 100%;
		display: block;
	}

	.image-error {
		background-image: linear-gradient(to top, #eee8e3 50%, #f7f5f4);
	}
</style>
