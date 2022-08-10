import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import image from 'svelte-image';
import { config as envConfig } from 'dotenv';

// Read Environtement Variable
envConfig();
const { NODE_ENV, USE_CDN, GITHUB_USER, GITHUB_REPO } = process.env;

const cdn_on = NODE_ENV === 'production' && USE_CDN === 'true';
const cdn_url = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}/static/images/`;

const imagePreprocess = () => {
	return image({
		processFolders: [
			'images/banner/standard',
			'images/banner/beginner',
			'images/banner/character-events',
			'images/banner/weapons'
		],
		processFoldersRecursively: true,
		processFoldersSizes: true,
		processFoldersExtensions: ['webp'],
		outputDir: './g',
		publicDir: './static/',
		placeholder: 'blur',
		sizes: [400, 800],
		breakpoints: [375, 768],
		webp: true,
		webpOptions: {
			quality: 75,
			lossless: false,
			force: true
		}
		// trace: {
		// 	background: '#fff',
		// 	color: '#002fa7',
		// 	threshold: 120
		// }
	});
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		prerender: { default: true },
		appDir: 'internal',
		adapter: adapter()
	},
	preprocess: cdn_on
		? [
				imagePreprocess(),
				preprocess({
					postcss: true,
					replace: [
						[new RegExp('/g{', 'g'), '{'],
						[new RegExp('-800', 'g'), ''],
						[new RegExp('-400', 'g'), ''],
						[new RegExp('/images/', 'g'), `${cdn_url}`]
					]
				})
		  ]
		: imagePreprocess()
};

export default config;
