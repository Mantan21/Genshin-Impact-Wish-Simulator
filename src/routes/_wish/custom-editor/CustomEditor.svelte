<script>
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/app-stores';
	import { fly } from 'svelte/transition';
	import CardEditor from './_card-editor.svelte';

	$: landscape = $viewportWidth / 2.1 > $viewportHeight;
	$: tabletBannerStyle = landscape ? 'width: 90vh' : '';

	$: mobileBannerStyle = $mobileMode
		? `max-width: ${(150 / 100) * $viewportHeight}px;`
		: tabletBannerStyle;

	$: style =
		$viewportHeight > 800 ||
		$viewportHeight > $viewportWidth ||
		$viewportHeight / $viewportWidth > 0.5
			? 'align-items:center;'
			: '';
</script>

<div class="banner-container" {style}>
	<div class="banner-item" style={mobileBannerStyle} in:fly={{ x: 25, duration: 580 }}>
		<CardEditor />
	</div>
</div>

<style>
	.banner-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.mobile) .banner-container {
		align-items: flex-end;
		padding: 0;
	}

	.banner-item {
		max-width: 900px;
		width: 80%;
		max-height: 75vh;
		aspect-ratio: 1080/533;
	}
</style>
