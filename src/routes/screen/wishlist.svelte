<script>
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { APP_TITLE } from '$lib/env';
	import weapons from '$lib/data/weapons.json';
	import characters from '$lib/data/characters.json';
	import { getName } from '$lib/functions/nameText';
	import WishListResult from '$lib/components/banner/parts/WishListResult.svelte';

	let title = 'No Name';
	let metaTitle = '';
	let isError;
	let wishlist = [];

	const getMilestoneQty = (rarity, stelaFortuna) => {
		let stdqty = rarity === 4 ? 2 : 10;
		let fullqty = rarity === 4 ? 5 : 25;
		return stelaFortuna ? stdqty : fullqty;
	};

	const getList = (decoded) => {
		let list = [];
		const arr = decoded.split('|');

		arr.forEach((v) => {
			let [name, rarity, type, isNew, fateType, stelaFortuna] = v.split('/');
			stelaFortuna = stelaFortuna === '1';
			rarity = parseInt(rarity, 10);
			isNew = !(isNew === '0');
			let fateQty = getMilestoneQty(rarity, stelaFortuna);
			fateType = fateType !== 'undefined' ? fateType : false;

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

	const getTitle = () => {
		const standard = ['qiqi', 'keqing', 'diluc', 'mona', 'jean'];
		const get5Star = wishlist.filter(({ rarity }) => rarity === 5);
		const featured5StarChar = wishlist.filter(({ rarity, name, type }) => {
			const check = rarity === 5 && !standard.includes(name) && type === 'character';
			if (check) title = getName(name);
			return check;
		});

		if (featured5StarChar.length > 1) {
			metaTitle = `Wow, I just got ${title} plus its Constelation only in 10 pull, Genshin Impact.`;
			return;
		}

		if (get5Star.length === 2) {
			title = get5Star.map(({ name }) => getName(name)).join(' and ');
			metaTitle = `Wow, I just got ${title} when pulling on Wish Simulator for Genshin Impact`;
			return;
		}

		if (get5Star.length > 2) {
			title = get5Star.map(({ name }) => getName(name)).join(', ');
			metaTitle = `Wow, I just got ${title} when pulling on Wish Simulator for Genshin Impact`;
			return;
		}

		const get4Star = wishlist.filter(({ rarity, name }, i) => {
			const check = rarity === 4;
			if (i === 0) title = getName(name);
			return check;
		});

		if (get4Star.length > 1) {
			metaTitle = `Cool, I just got multiple 4star items when pulling on Wish Simulator for Genshin Impact`;
			return;
		}

		metaTitle = `Yeay, I just got ${title} Genshin Impact.`;
		return;
	};

	const encoded = $page.query.get('a');
	const resolveData = () => {
		try {
			if (encoded) {
				let decoded = browser ? atob(encoded) : Buffer.from(encoded, 'base64').toString('utf8');
				wishlist = getList(decoded);
				getTitle();
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

	<meta name="title" content={metaTitle} />
	<meta property="og:title" content={metaTitle} />
	<meta property="twitter:title" content={metaTitle} />

	<!-- <meta
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
	/> -->
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
