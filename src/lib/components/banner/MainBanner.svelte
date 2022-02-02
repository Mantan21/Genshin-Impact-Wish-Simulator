<script>
	import { showWish } from '$lib/store/stores';
	import { APP_TITLE } from '$lib/env';
	import Header from './parts/Header.svelte';
	import Footer from './parts/Footer.svelte';
	import Meteor from './parts/Meteor.svelte';
	import BannerItem from './BannerItem.svelte';
	import WishResult from './WishResult.svelte';

	let showMeteor = false;
	const rollHandle = (e) => {
		const { qty, banner } = e.detail;
		if (qty === 1) return singleRoll(banner);
		return multiRoll(banner);
	};

	const singleRoll = () => {
		console.log('single');
	};
	const multiRoll = () => {
		console.log('multi');
	};
</script>

<svelte:head>
	<title>{APP_TITLE}</title>
</svelte:head>

{#if $showWish}
	<WishResult />
{/if}

<section>
	<div class="col top">
		<Header />
	</div>

	<Meteor show={showMeteor} />
	<div class="col banner">
		<div class="item">
			<BannerItem />
		</div>
		<div class="col button">
			<Footer on:roll={rollHandle} />
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
