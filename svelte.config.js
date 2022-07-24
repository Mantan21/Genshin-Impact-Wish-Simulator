import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import image from 'svelte-image';
import { config as envConfig } from 'dotenv';

// Read Environtement Variable
envConfig();
const { NODE_ENV, USE_CDN, GITHUB_USER, GITHUB_REPO } = process.env;

const cdn_on = NODE_ENV === 'production' && USE_CDN === 'true';
const cdn_url = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}/static/assets/`;

const imagePreprocess = () => image({});
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel()
	},
	preprocess: cdn_on
		? [
				imagePreprocess(),
				preprocess({
					replace: [[new RegExp('/assets/', 'gi'), `${cdn_url}`]]
				})
		  ]
		: imagePreprocess()
};

export default config;
