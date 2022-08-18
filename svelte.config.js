import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { config as envConfig } from 'dotenv';

// Read Environtement Variable
envConfig();
const { NODE_ENV, USE_CDN, GITHUB_USER, GITHUB_REPO } = process.env;

const cdn_on = NODE_ENV === 'production' && USE_CDN === 'true';
const cdn_url = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}/static`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		prerender: { default: true },
		appDir: 'internal',
		adapter: adapter()
	},
	preprocess: cdn_on
		? preprocess({
				postcss: true,
				replace: [[/\/(videos|images)\//g, `${cdn_url}/$1/`]]
		  })
		: preprocess({ postcss: true })
};

export default config;
