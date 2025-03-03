<script>
	import { t, json, locale } from 'svelte-i18n';
	import { preloadVersion, activeVersion, customData, isCustomBanner } from '$lib/store/app-stores';
	import { highlightBannerName } from '$lib/helpers/nameText';
	import { regionElement } from '$lib/helpers/gacha/itemdrop-base';
	import updates from '$lib/data/updates.json';

	export let tplVersion = 'v1';
	export let bannerType;
	export let bannerName = '';
	export let rateup;
	export let weapons;
	export let character;
	export let drop5star = [];
	export let region = null;

	$: isSpecial = $locale.toLocaleLowerCase().match(/ja|cn/);

</script>


<style>
	p :global(span):not([class*='-flat']) {
		color: #cf5e47;
	}

	p :global(span.invocation) {
		color: #ef7c1aff;
	}

	p :global(span.starglitter) {
		color: #c37b4d;
	}
	p :global(span.stardust) {
		color: #a256e1;
	}
	p :global(span.wish) {
		color: #debd6c;
	}
	p :global(span.electro-flat) {
		color: #ca82fc;
	}
	p :global(span.std-flat) {
		color: #757acdff;
	}

	p :global(span .weapon) {
		color: #bd6932;
	}

	p {
		font-size: 150%;
		line-height: 170%;
		margin: 1rem 0;
	}

	.v2 p {
		font-size: calc(0.017 * var(--content-width));
	}

	h2 {
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
		display: flex;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		color: #fff;
		background-color: #a28052;
		vertical-align: middle;
	}

	.v2 h3 {
		background-color: #6f778a;
		font-size: calc(0.015 * var(--content-width));
	}
</style>
