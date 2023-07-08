<script>
	import { dev } from '$app/environment';
	import { getContext, onMount } from 'svelte';
	import { isMobile } from '$lib/store/app-stores';
	import { randomLetter } from '$lib/helpers/nameText';

	export let type = '';
	export let head = false;

	const showAd = getContext('showAd');

	// onMount(() => {
	// 	if (type !== 'banner') return;
	// 	(window.adsbygoogle = window.adsbygoogle || []).push({});
	// 	return;
	// });
	const kadamAdId = randomLetter(6);

	onMount(() => {
		if (!$showAd) return;
		if (head) {
			window.k_init = window.k_init || [];
		}

		if (type === 'banner') {
			const obj = {
				id: `${kadamAdId}342003`,
				type: 'bn',
				domain: 'hdbkome.com',
				refresh: false,
				next: 0
			};
			window.k_init.push(obj);
		}

		if (type === 'pop') {
			const obj = {
				id: `${kadamAdId}342006`,
				type: 'cu',
				domain: 'hdbkell.com',
				next: 1,
				rerun: true,
				newtab: 1
			};
			window.k_init.push(obj);
		}
	});
</script>

{#if $showAd}
	{#if type === 'banner'}
		<!-- <ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-1874822310102113"
		data-ad-slot="6827309798"
		data-ad-format="auto"
		data-full-width-responsive="true"
	/> -->
		<div class="{kadamAdId}342003" />
	{/if}

	{#if type === 'pop'}
		<div class="{kadamAdId}342006" />
	{/if}

	{#if head && !dev}
		<!-- <script src="https://adncdnend.azureedge.net/adnimation/agustinusyohannes.js"></script> -->

		<!-- Banner -->
		<script
			src="https://hdbkome.com/08rk18tq.js"
			charset="utf-8"
			async
			data-cfasync="false"></script>
		<!-- Banner -->

		<!-- Autotag -->
		<script
			data-cfasync="false"
			type="text/javascript"
			data-adel="atag"
			src="//acacdn.com/script/atg.js"
			czid="v1xd6wvvpe"></script>
		<!-- Autotag -->
		{#if !$isMobile}
			<!-- PopAds -->
			<script
				type="text/javascript"
				src="//pl17416355.profitablecpmgate.com/3e/70/98/3e7098724a8a6321d737e1bd39d9ffed.js"></script>
			<!-- <script
				src="https://hdbkell.com/xsoi4.js"
				charset="utf-8"
				async
				data-cfasync="false"></script> -->
			<!-- PopAds -->
			<!-- In-Push Page -->
			<script
				type="text/javascript"
				src="//pl17419889.profitablecpmgate.com/fb/35/45/fb3545e433a3f40f53c83f80f24037ec.js"></script>
			<!-- In-Push Page -->
		{/if}
	{/if}
{/if}
