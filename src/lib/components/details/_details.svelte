<script>
	import { assets } from '$lib/store/stores';
	import { getContext } from 'svelte';
	import Description from './_parts/description.svelte';
	import List from './_parts/list.svelte';
	import PromotionalV2 from './_parts/promotional-v2.svelte';
	import Promotional from './_parts/promotional.svelte';
	import Title from './_parts/title.svelte';

	export let tplVersion = 'v1';
	export let data;
	export let drops;

	const { banner, bannerTitle, featured, items } = data;
	const { drop3star, drop4star, drop5star } = drops;

	let contentWidth;
	const noPromo = ['standard', 'beginner'].includes(banner);
	let activeContent = noPromo ? 2 : 1;

	const select = (selected) => {
		activeContent = selected;
	};

	const close = getContext('close-detail');
	const setTpl = getContext('detail-tpl');
</script>

{#if tplVersion === 'v2'}
	<div class="content-container">
		<button class="old" on:click={() => setTpl('v1')}>Older Layout</button>
		<div
			class="book"
			bind:clientWidth={contentWidth}
			style="--content-width:{contentWidth}px; background-image:url({$assets['book.webp']})"
		>
			<button class="tutup" on:click={close} />
			<div class="book-content">
				<Title {banner} {bannerTitle} vision={featured[0]?.vision} {tplVersion} />
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
						<Description
							bannerType={banner}
							data={items}
							bannerName={bannerTitle}
							tplVersion="v2"
						/>
					{:else if activeContent === 3}
						<List {drop5star} {drop4star} {drop3star} tplVersion="v2" />
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<Title {banner} {bannerTitle} vision={featured[0]?.vision} />

	<Promotional data={{ featured, items, banner, bannerTitle }} />
	<Description bannerType={banner} data={items} bannerName={bannerTitle} />
	<br />
	<List {drop5star} {drop4star} {drop3star} />
{/if}

<style>
	.content-container {
		min-width: 90%;
		height: 50vh;
		position: relative;
	}

	.tutup {
		width: calc(0.035 * var(--content-width));
		aspect-ratio: 1/1;
		position: absolute;
		top: 6%;
		right: 2%;
	}

	.old {
		position: absolute;
		bottom: 0%;
		left: 50%;
		transform: translateX(-50%) translateY(200%);
		text-decoration: underline;
		transition: all 0.2s;
	}
	.old:hover {
		color: goldenrod;
	}

	.book {
		position: relative;
		display: block;
		margin: auto;
		height: 50vh;
		max-height: 900px;
		aspect-ratio: 487/257;
		overflow: hidden;
		background-size: cover;
		padding: calc(0.015 * var(--content-width)) calc(0.09 * var(--content-width))
			calc(0.15 * var(--content-width));
	}

	@media screen and (min-width: 700px) {
		.content-container,
		.book {
			height: unset !important;
			width: 95%;
		}
	}

	:global(.mobile) .content-container,
	:global(.mobile) .book {
		height: 80vh !important;
		width: auto;
	}

	.book-content {
		width: 100%;
		height: 100%;
	}

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
