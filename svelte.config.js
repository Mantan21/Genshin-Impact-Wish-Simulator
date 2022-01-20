import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/**
 * If You wan to reduce the site bandwidth usage, you can use Statically CDN to serving some assets from your github repository
 */

// Statically Configuration
const statically = false; // set true to use CDN
const githubUser = '';
const githubRepo = '';
const githubBranch = '';

const cdn_on = process.env.NODE_ENV !== 'development' && statically;
const cdn = cdn_on
	? `https://cdn.statically.io/gh/${githubUser}/${githubRepo}/${githubBranch}/`
	: '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		target: '#svelte'
	},
	preprocess: preprocess({
		replace: [[new RegExp('/assets/', 'gi'), `${cdn}static/assets/`]]
	})
};

export default config;
