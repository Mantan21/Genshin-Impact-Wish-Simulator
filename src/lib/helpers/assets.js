const images = [
	{
		dir: 'background',
		paths: [
			'bg1.webp',
			'bg2.webp',
			'bg3.webp',
			'bg4.webp',
			'bg5.webp',
			'bg6.webp',
			'bg7.webp',
			'bg8.webp',
			'bg9.webp',
			'bg10.webp',
			'bg11.webp',
			'bg12.webp',
			'bg13.webp',
			'bg14.webp',
			'bg15.webp',
			'bg16.webp',
			'constellation.webp',
			'detailbg.webp',
			'element-anemo-bg.webp',
			'element-cryo-bg.webp',
			'element-dendro-bg.webp',
			'element-electro-bg.webp',
			'element-geo-bg.webp',
			'element-hydro-bg.webp',
			'element-pyro-bg.webp',
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
			'arrow-up.png',
			'book.webp',
			'book-select-bg.webp',
			'book-select-btn.webp',
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
			'menu-active.png',
			'paypal.png',
			'primogem.webp',
			'shop-nav-bg.webp',
			'sociabuzz.png',
			'splatter-3star.svg',
			'splatter-4star.svg',
			'splatter-5star.svg',
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
			'bow-white.svg',
			'catalyst-white.svg',
			'claymore-white.svg',
			'corner.webp',
			'cursor.png',
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

const listingAssets = (param) => {
	const arr = [];
	const allImg = [bgList(), ...previewImages, ...images];
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

export const rawAssets = listingAssets();
export const rawPreviewAssets = listingAssets('preview');

export const blobAssets = async (path) => {
	try {
		const data = await fetch(path);
		const responseType = data.headers.get('Content-Type');
		if (responseType === 'text/html') throw new Error('Failed to load Assets');
		const blob = await data.blob();
		const url = URL.createObjectURL(blob);
		return url;
	} catch (e) {
		console.error(e);
		return 'error';
	}
};
