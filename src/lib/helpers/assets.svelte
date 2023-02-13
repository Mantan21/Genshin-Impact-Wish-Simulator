<script context="module">
	import { outfits } from '$lib/data/outfits.json';
	import { data as charDB } from '$lib/data/characters.json';
	import { data as weaponsDB } from '$lib/data/weapons.json';
	import { allPatch } from '$lib/data/wish-setup.json';

	const images = [
		{
			dir: 'background',
			paths: [
				'constellation.webp',
				'detailbg.webp',
				'element-anemo-bg.webp',
				'element-cryo-bg.webp',
				'element-dendro-bg.webp',
				'element-electro-bg.webp',
				'element-geo-bg.webp',
				'element-hydro-bg.webp',
				'element-pyro-bg.webp',
				'outfit-background.webp',
				'splash-background.webp',
				'wish-background.webp'
			]
		},
		{
			dir: 'utility',
			paths: [
				'3star-bg.webp',
				'4star-bg.webp',
				'5star-bg.webp',
				'acquaint-fate.webp',
				'book.webp',
				'book-select-bg.webp',
				'bow-white.svg',
				'brand.png',
				'button.webp',
				'donate-bnb.png',
				'donate-btc.png',
				'donate-dana.png',
				'donate-ethereum.png',
				'donate-gopay.png',
				'donate-kofi.png',
				'donate-linkaja.png',
				'donate-ovo.png',
				'donate-saweria.webp',
				'donate-shopeepay.png',
				'donate-solana.png',
				'fatepointbook-half.webp',
				'fatepointbook.webp',
				'genesis-60.webp',
				'genesis-300.webp',
				'genesis-980.webp',
				'genesis-1980.webp',
				'genesis-3280.webp',
				'genesis-6480.webp',
				'genesis-bg.webp',
				'genesis.webp',
				'history-select-bg.webp',
				'imbroke.webp',
				'menu-active.png',
				'modal-bg-icon.png',
				'paypal.png',
				'primogem.webp',
				'shop-nav-bg.webp',
				'welkin-card.webp',
				'welkin-moon-girl.webp',
				'welkin.webp'
			]
		}
	];

	const previewImages = [
		{
			dir: 'background',
			paths: ['splash-background.webp']
		},
		{
			dir: 'utility',
			paths: [
				'bg-bow.webp',
				'bg-catalyst.webp',
				'bg-claymore.webp',
				'bg-polearm.webp',
				'bg-sword.webp',
				'bg-bonus.webp',
				'bow-white.svg',
				'catalyst-white.svg',
				'claymore-white.svg',
				'genshin-logo-cn.webp',
				'genshin-logo.webp',
				'icon-anemo.svg',
				'icon-cryo.svg',
				'icon-dendro.svg',
				'icon-electro.svg',
				'icon-geo.svg',
				'icon-hydro.svg',
				'icon-pyro.svg',
				'intertwined-fate.webp',
				'masterless-stardust.webp',
				'masterless-starglitter.webp',
				'polearm-white.svg',
				'resultcard-bg.svg',
				'stella-fortuna-4star.webp',
				'stella-fortuna-5star.webp',
				'sword-white.svg'
			]
		}
	];

	const videos = [
		'3star-single.mp4',
		'4star-single.mp4',
		'4star.mp4',
		'5star-single.mp4',
		'5star.mp4'
	];

	const bgList = () => {
		const paths = [];
		for (let i = 0; i < 25; i++) {
			paths.push(`bg${i + 1}.webp`);
		}
		return { dir: 'background', paths };
	};

	const outfitShopList = () => {
		const paths = outfits
			.filter(({ version }) => !!version)
			.map(({ name }) => `thumbnail/${name}.webp`);
		return { dir: 'characters/outfit', paths };
	};

	export const getItemlist = async () => {
		const pathList = {};
		outfits.forEach(({ name }) => {
			pathList[`face/${name}`] = `/images/characters/outfit/face/${name}.webp`;
			pathList[`splash-art/${name}`] = `/images/characters/outfit/splash-art/${name}.webp`;
		});

		charDB.forEach(({ name, rarity }) => {
			pathList[`face/${name}`] = `/images/characters/face/${name}.webp`;
			pathList[`splash-art/${name}`] = `/images/characters/splash-art/${rarity}star/${name}.webp`;
		});

		weaponsDB.forEach(({ name, weaponType, rarity }) => {
			pathList[name] = `/images/weapons/${weaponType}/${rarity}star/${name}.webp`;
		});

		for await (const patch of allPatch) {
			const json = await import(`$lib/data/banners/events/${patch.toFixed(1)}.json`);
			const { data } = json.default;
			data.forEach(({ banners }) => {
				pathList[banners.weapons.name] = `/images/banner/weapons/${banners.weapons.name}.webp`;
				const event = banners.events.item;
				if (Array.isArray(event)) {
					event.forEach(({ name }) => {
						pathList[name] = `/images/banner/character-events/${name}.webp`;
					});
				} else {
					pathList[event.name] = `/images/banner/character-events/${event.name}.webp`;
				}
			});
		}

		pathList['wanderlust-invocation-1'] = '/images/banner/standard/wanderlust-invocation-1.webp';
		pathList['wanderlust-invocation-2'] = '/images/banner/standard/wanderlust-invocation-2.webp';
		pathList['beginner'] = '/images/banner/beginner/beginner.webp';
		return pathList;
	};

	export const listingAssets = (param) => {
		const arr = [];
		const allImg = [bgList(), outfitShopList(), ...previewImages, ...images];
		const img = param === 'preview' ? previewImages : allImg;

		img.forEach(({ dir, paths }) => {
			paths.forEach((path) => {
				const pathdir = `/images/${dir}/${path}`;
				const item = { path: pathdir, asset: path };
				arr.push(item);
			});
		});
		if (param === 'preview') return arr;

		videos.forEach((v) => {
			const pathdir = `/videos/${v}`;
			const item = { path: pathdir, asset: v };
			arr.push(item);
		});

		return arr;
	};

	export const blobAssets = async (path) => {
		try {
			const data = await fetch(path);
			const responseType = data.headers.get('Content-Type');
			if (responseType === 'text/html') throw new Error('Failed to load Assets');
			const blob = await data.blob();
			const DOMURL = window.URL || window.webkitURL;
			const url = DOMURL.createObjectURL(blob);
			return url;
		} catch (e) {
			console.error(e);
			return 'error';
		}
	};
</script>
