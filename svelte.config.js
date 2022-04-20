// import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { config as envConfig } from 'dotenv';

// Read Environtement Variable
envConfig();
const { NODE_ENV, STATICALLY, GITHUB_USER, GITHUB_REPO, GITHUB_BRANCH } = process.env;

const cdn_on = NODE_ENV === 'production' && STATICALLY === 'true';
const cdn_url = `https://cdn.statically.io/gh/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/static/assets/`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel()
	},
	preprocess: cdn_on
		? preprocess({
				replace: [[new RegExp('/assets/', 'gi'), `${cdn_url}`]]
		  })
		: null
};

export default config;
