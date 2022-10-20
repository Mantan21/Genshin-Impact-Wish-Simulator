import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			outDir: '.vercel/output/static',
			filename: 'sw.js',
			registerType: 'prompt'
		})
	],
	build: {
		chunkSizeWarningLimit: 350,
		target: ['es2020']
	}
};

export default config;
