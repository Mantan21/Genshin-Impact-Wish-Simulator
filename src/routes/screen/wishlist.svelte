<script>
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { APP_TITLE, HOST } from '$lib/env';
	import weapons from '$lib/data/weapons.json';
	import characters from '$lib/data/characters.json';
	import WishListResult from '$lib/components/utility/wishresult/WishListResult.svelte';
	import { getName } from '$lib/functions/nameText';
	import Error from '../__error.svelte';

	let title = 'No Name';
	let isError;
	let wishlist = [];

	const getList = (decoded) => {
		let list = [];
		const arr = decoded.split('|');

		arr.forEach((v, i) => {
			let [name, rarity, type, isNew, fateType, stelaFortuna] = v.split('/');
			let fateQty = rarity > 3 ? 10 : 15;
			isNew = !(isNew === '0');
			stelaFortuna = stelaFortuna === '1';
			rarity = parseInt(rarity, 10);
			fateType = fateType !== 'undefined' ? fateType : false;
			if (i === 0) title = getName(name);

			const items = type === 'weapon' ? weapons : characters;
			const { weaponType, wishBoxPosition, vision } = items.data
				.find((d) => d.rarity === rarity)
				.list.find((d) => d.name === name);

			list.push({
				type,
				weaponType,
				vision,
				wishBoxPosition,
				name,
				rarity,
				isNew,
				stelaFortuna,
				fateType,
				fateQty
			});
		});

		return list;
	};

	const encoded = $page.query.get('a');
	const resolveData = () => {
		try {
			if (encoded) {
				let decoded = browser ? atob(encoded) : Buffer.from(encoded, 'base64').toString('utf8');
				wishlist = getList(decoded);
				return;
			}
			throw new Error('No data to show');
		} catch (e) {
			isError = true;
			if (browser) window.location.replace('/');
		}
	};

	resolveData();
</script>

<svelte:head>
	<title>Wish Result for {title} et al | {APP_TITLE}</title>

	<meta name="title" content="Yeay, I just got {title} Genshin Impact" />
	<meta property="og:title" content="Yeay, I just got {title} Genshin Impact" />
	<meta property="twitter:title" content="Yeay, I just got {title} Genshin Impact" />

	<meta
		name="twitter:image:src"
		content="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/wishlist/?a={encoded}"
	/>
	<meta
		property="twitter:image"
		content="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/wishlist/?a={encoded}"
	/>
	<meta
		property="og:image"
		content="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/wishlist/?a={encoded}"
	/>
	<link
		rel="fluid-icon"
		href="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/wishlist/?a={encoded}"
		title={APP_TITLE}
	/>
</svelte:head>

{#if isError}
	<div class="error">
		<h1>You're going to unresolved page, redirecting to index ...</h1>
	</div>
{:else}
	<div class="wish-result">
		<WishListResult preview previewlist={wishlist} />
	</div>
{/if}

<style>
	.wish-result {
		width: 100vw;
		height: 100vh;
		background-image: url('/assets/images/background/splash-background.webp');
		background-size: cover;
	}

	.error {
		width: 100vw;
		height: 100vh;
		display: flex;
		background-color: #fff;
		justify-content: center;
		align-items: center;
	}
</style>
