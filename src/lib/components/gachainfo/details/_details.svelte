<script>
	import { assets } from '$lib/store/stores';
	import Description from './_description.svelte';
	import List from './_list.svelte';
	import PromotionalV2 from './_promotional-v2.svelte';
	import Promotional from './_promotional.svelte';
	import Title from '../_parts/title.svelte';

	export let tplVersion = 'v1';
	export let data;
	export let drops;

	const { banner, bannerTitle, featured, items } = data;
	const { drop3star, drop4star, drop5star } = drops;

	const noPromo = ['standard', 'beginner'].includes(banner);
	let activeContent = noPromo ? 2 : 1;

	const select = (selected) => {
		activeContent = selected;
	};
</script>

<Title {banner} {bannerTitle} vision={featured[0]?.vision} {tplVersion} />

{#if tplVersion === 'v2'}
	<nav style="background-image: url({$assets['book-select-bg.webp']});">
		{#if !noPromo}
			<div class="nav-item" class:active={activeContent === 1}>
				<button on:click={() => select(1)}> Promotional Items </button>
			</div>
		{/if}
		<div class="nav-item" class:active={activeContent === 2}>
			<button on:click={() => select(2)}> Details </button>
		</div>
		<div class="nav-item" class:active={activeContent === 3}>
			<button on:click={() => select(3)}> List of Items </button>
		</div>
	</nav>
	<div class="content">
		{#if activeContent === 1}
			<PromotionalV2 data={{ featured, items, banner, bannerTitle }} />
		{:else if activeContent === 2}
			<Description bannerType={banner} data={items} bannerName={bannerTitle} tplVersion="v2" />
		{:else if activeContent === 3}
			<List {drop5star} {drop4star} {drop3star} tplVersion="v2" />
		{/if}
	</div>
{:else}
	<Promotional data={{ featured, items, banner, bannerTitle }} />
	<Description bannerType={banner} data={items} bannerName={bannerTitle} />
	<br />
	<List {drop5star} {drop4star} {drop3star} />
{/if}

<style>
	nav {
		width: 100%;
		line-height: 0;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		background-size: cover;
		background-position: center center;
	}

	.nav-item {
		width: 33.33333%;
		padding: 0;
		display: flex;
		justify-content: center;
	}
	.nav-item button {
		font-size: calc(0.017 * var(--content-width));
		width: 100%;
		aspect-ratio: 557/86;
		opacity: 0.8;
		background-size: contain;
		background-position: center center;
		background-repeat: no-repeat;
		transition: all 0.2s;
	}

	.nav-item.active button,
	.nav-item button:hover {
		background-image: url('/images/utility/book-select-btn.webp');
		color: #fff;
	}

	.nav-item.active button {
		opacity: 1;
	}

	.content {
		height: 100%;
		overflow-y: auto;
	}
</style>
