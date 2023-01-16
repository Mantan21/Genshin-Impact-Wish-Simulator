<script>
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { APP_TITLE } from '$lib/env';
	import weapons from '$lib/data/weapons.json';
	import characters from '$lib/data/characters.json';
	import { assets } from '$lib/store/stores';
	import { outfits as outfitDB } from '$lib/data/outfits.json';
	import WishListResult from '$lib/components/wish/WishListResult.svelte';

	let title = 'No Name';
	let metaTitle = APP_TITLE;
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
			let [name, rarity, type, isNew, fateType, stelaFortuna, outfit] = v.split('/');
			outfit = ['undefined', 'NaN'].includes(outfit) ? null : outfit;
			stelaFortuna = stelaFortuna === '1';
			rarity = parseInt(rarity, 10);
			isNew = !(isNew === '0');
			let fateQty = getMilestoneQty(rarity, stelaFortuna);
			fateType = fateType !== 'undefined' ? fateType : false;

			const items = type === 'weapon' ? weapons : characters;
			const { weaponType, wishBoxPosition, vision } = items.data
				.filter((d) => d.rarity === rarity)
				.find((d) => d.name === name);
			const outfitOffset = outfitDB.find(({ name }) => name === outfit)?.wishBoxPosition || null;

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
				fateQty,
				outfit,
				outfitOffset
			});
		});

		return list;
	};

	const getTitle = () => {
		const standard = ['qiqi', 'keqing', 'diluc', 'mona', 'jean'];
		const get5Star = wishlist.filter(({ rarity }) => rarity === 5);
		const featured5StarChar = wishlist.filter(({ rarity, name, type }) => {
			const check = rarity === 5 && !standard.includes(name) && type === 'character';
			if (check) title = $t(`${name}.name`);
			return check;
		});

		if (featured5StarChar.length > 1) {
			metaTitle = `Wow, I just got ${title} plus its Constelation only in 10 pull, Genshin Impact.`;
			return;
		}

		if (get5Star.length === 2) {
			title = get5Star.map(({ name }) => $t(name)).join(' and ');
			metaTitle = `Wow, I just got ${title} when pulling on Wish Simulator for Genshin Impact`;
			return;
		}

		if (get5Star.length > 2) {
			title = get5Star.map(({ name }) => $t(name)).join(', ');
			metaTitle = `Wow, I just got ${title} when pulling on Wish Simulator for Genshin Impact`;
			return;
		}

		const get4Star = wishlist.filter(({ rarity, name, type }, i) => {
			const check = rarity === 4;
			if (i === 0) title = type === 'weapon' ? $t(name) : $t(`${name}.name`);
			return check;
		});

		if (get4Star.length > 1) {
			metaTitle = `Cool, I just got multiple 4star items when pulling on Wish Simulator for Genshin Impact`;
			return;
		}

		metaTitle = `Yeay, I just got ${title} Genshin Impact.`;
		return;
	};

	const resolveData = () => {
		try {
			const url = new URL(window.location.href);
			const searchParams = new URLSearchParams(url.search);
			const encoded = searchParams.get('a');
			if (encoded) {
				let decoded = atob(encoded);
				wishlist = getList(decoded);
				getTitle();
				return;
			}
			throw new Error('No data to show');
		} catch (e) {
			isError = true;
			window.location.replace('/');
		}
	};

	onMount(resolveData);
</script>

<svelte:head>
	<title>
		{$t(`wish.result.title`, { values: { item: title } })} | {$t('title', {
			default: APP_TITLE
		})}
	</title>

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
	<div class="wish-result" style="background-image: url('{$assets['splash-background.webp']}');">
		<WishListResult preview list={wishlist} />
	</div>
{/if}

<style>
	.wish-result {
		width: 100vw;
		height: 100vh;
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
