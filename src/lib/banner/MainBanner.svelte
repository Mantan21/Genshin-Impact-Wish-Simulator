<script>
	import { onMount } from 'svelte';
	import { showWish, backsound } from '$lib/store/stores';
	import { APP_TITLE } from '$lib/env';
	import Header from '$lib/banner/Header.svelte';
	import Footer from '$lib/banner/Footer.svelte';
	import BannerItem from '$lib/banner/BannerItem.svelte';
	import WishResult from '$lib/banner/WishResult.svelte';

	let audio;
	$: if ($backsound) {
		if (audio) audio.play();
	} else {
		if (audio) audio.pause();
	}

	onMount(() => {
		window.addEventListener('blur', () => {
			if (audio) audio.pause();
		});
		window.addEventListener('focus', () => {
			if ($backsound && audio) audio.play();
		});
	});
</script>

<svelte:head>
	<title>{APP_TITLE}</title>
</svelte:head>

{#if $showWish}
	<WishResult />
{/if}

<audio src="/assets/sfx/wish-backsound.ogg" bind:this={audio} id="backsound" loop />
<section>
	<div class="col top">
		<Header />
	</div>

	<div class="col banner">
		<div class="item">
			<BannerItem />
		</div>
		<div class="col button">
			<Footer />
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		overflow: hidden;
		background-image: url('/assets/images/background/wish-background.webp');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}

	.top,
	.banner,
	.button,
	.item {
		display: block;
		width: 100%;
	}

	.top {
		min-height: 70px;
	}
	.banner,
	.item {
		height: 100%;
	}
	.item {
		position: relative;
	}
	.banner {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.button {
		height: 120px;
	}

	/* Mobile */
	:global(.mobile) section {
		flex-direction: row;
	}
	:global(.mobile) .top {
		height: 100%;
		width: min-content;
	}
	:global(.mobile) .banner {
		width: 120%;
		margin-left: -20px;
	}
	:global(.mobile) .button {
		height: 50px;
		margin-bottom: 0.2rem;
	}
</style>
