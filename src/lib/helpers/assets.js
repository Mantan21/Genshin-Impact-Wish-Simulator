const imageModules = import.meta.glob(['@images/**/*'], {
	query: { as: 'picture' },
	import: 'default',
	eager: true
});

const cdnURL = ''; //!dev ? 'https://cdn.wishsimulator.app' : '';
// const cdn_url = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}/static`;

export const itemList = () => {
	const pathList = {};
	Object.keys(imageModules).map((key) => {
		const [keyName] = key.split('/').reverse();
		const [keyNoExt] = keyName.split('.');

		const { img = {} } = imageModules[key];
		const { src = '' } = img;

		if (key.match(/face\//)) {
			pathList[`face/${keyNoExt}`] = cdnURL + src;
		} else if (key.match(/splash-art/)) {
			pathList[`splash-art/${keyNoExt}`] = cdnURL + src;
		} else if (key.match(/banner-button/)) {
			pathList[`button/${keyNoExt}`] = cdnURL + src;
		} else if (key.match(/thumbnail/)) {
			pathList[`thumbnail/${keyNoExt}`] = cdnURL + src;
		} else if (key.match(/blank/)) {
			pathList[`blank/${keyNoExt}`] = cdnURL + src;
		} else if (key.match(/(banner|weapons)/)) {
			pathList[keyNoExt] = cdnURL + src;
		} else if (key.match(/weapons/)) {
			pathList[keyNoExt];
		} else {
			pathList[keyName] = cdnURL + src;
		}
	});
	return pathList;
};

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
			'wish-background.webp'
		]
	},
	{
		dir: 'utility',
		paths: [
			'3star-bg.webp',
			'4star-bg.webp',
			'5star-bg.webp',
			'5star-special.webp',
			'acquaint-fate.webp',
			'bg-bonus.webp',
			'book.webp',
			'book-select-bg.webp',
			'brand.png',
			'button.webp',
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
			'intertwined-fate.webp',
			'modal-bg-icon.png',
			'payment-childe.webp',
			'payment-tears.webp',
			'payment-wakaranai.webp',
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
		paths: ['outfit-background.webp', 'splash-background.webp']
	},
	{
		dir: 'utility',
		paths: [
			'bg-bow.webp',
			'bg-catalyst.webp',
			'bg-claymore.webp',
			'bg-polearm.webp',
			'bg-sword.webp',
			'face-placeholder.webp',
			'genshin-logo-cn.webp',
			'genshin-logo.webp',
			'masterless-stardust.webp',
			'masterless-starglitter.webp',
			'resultcard-bg.webp',
			'stella-fortuna-4star.webp',
			'stella-fortuna-5star.webp'
		]
	}
];

const bgList = () => {
	const paths = [];
	for (let i = 0; i < 10; i++) {
		paths.push(`bg${i + 1}.webp`);
	}
	return { dir: 'background', paths };
};

export const listingAssets = (param) => {
	const arr = [];
	const globList = itemList();
	const allImg = [bgList(), ...previewImages, ...images];
	const imgs = param === 'preview' ? previewImages : allImg;

	imgs.forEach(({ paths }) => {
		paths.forEach((path) => {
			const pathdir = globList[path];
			const item = { path: pathdir, asset: path };
			arr.push(item);
		});
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

export const base64ToBlob = (image) => {
	const [dataType, base64Data] = image.split(';base64,');
	const [, contentType] = dataType.split(':');
	const byteCharacters = atob(base64Data);
	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type: contentType });
};

export const imageCDN = (imgs, width = 0) => {
	const cdnURL = 'https://imagecdn.app/v2/image/';
	if (typeof imgs === 'string') {
		const w = width && !isNaN(width) ? `&width=${width}` : '';
		return cdnURL + imgs + '?format=webp' + w;
	}

	Object.keys(imgs).forEach((key) => {
		const width = key === 'faceURL' ? '&width=226' : '';
		imgs[key] = cdnURL + imgs[key] + '?format=webp' + width;
	});
	return imgs;
};

