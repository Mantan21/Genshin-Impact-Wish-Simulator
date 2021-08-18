<script context="module">
	export const prerender = true;
</script>

<script>
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import BannerItem from '$lib/banner/BannerItem.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

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
</style>
