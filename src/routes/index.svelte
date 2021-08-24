<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { showWish, backsound } from '$lib/store/stores';
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import BannerItem from '$lib/banner/BannerItem.svelte';
	import WishResult from '$lib/banner/WishResult.svelte';

	let audio;
	onMount(() => backsound.set(true));
	$: if ($backsound !== 'notLoaded') {
		if ($backsound) audio.play();
		else audio.pause();
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if $showWish}
	<WishResult />
{/if}

<audio src="./assets/sfx/wish-backsound.ogg" bind:this={audio} id="backsound" loop />
<audio src="./assets/sfx/button-click.ogg" type="audio/ogg" id="button-sfx" />
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
	}
</style>
