<script>
	import { dev } from '$app/env';
	import { onMount } from 'svelte';
	import { isMobile } from '$lib/store/stores';

	export let type = '';
	export let head = false;

	// onMount(() => {
	// 	if (type !== 'banner') return;
	// 	(window.adsbygoogle = window.adsbygoogle || []).push({});
	// 	return;
	// });

	onMount(() => {
		if (!head) return;
		window.infolinks_pid = 3377875;
		window.infolinks_wsid = 0;
	});
</script>

{#if type === 'banner'}
	<!-- <ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-1874822310102113"
		data-ad-slot="6827309798"
		data-ad-format="auto"
		data-full-width-responsive="true"
	/> -->
{/if}

{#if head && !dev}
	{#if $isMobile}
		<!-- Autotag -->
		<script
			data-cfasync="false"
			type="text/javascript"
			data-adel="atag"
			src="//acacdn.com/script/atg.js"
			czid="v1xd6wvvpe"></script>
		<!-- Autotag -->
	{:else}
		<!-- PopAds -->
		<script
			type="text/javascript"
			src="//pl17416355.profitablecpmgate.com/3e/70/98/3e7098724a8a6321d737e1bd39d9ffed.js"></script>
		<script
			async
			src="https://ajfnee.com/p/waWQiOjExMzgyNzUsInNpZCI6MTE2NjUzNSwid2lkIjozODk5ODcsInNyYyI6Mn0=eyJ.js"></script>
		<!-- PopAds -->
		<!-- In-Push Page -->
		<script
			type="text/javascript"
			src="//pl17419889.profitablecpmgate.com/fb/35/45/fb3545e433a3f40f53c83f80f24037ec.js"></script>
		<!-- In-Push Page -->
	{/if}

	<!-- Inpage Push -->
	<script
		async
		src="https://zatnoh.com/pw/waWQiOjExMzgyNzUsInNpZCI6MTE2NjUzNSwid2lkIjozODk5ODEsInNyYyI6Mn0=eyJ.js"></script>
	<!-- Inpage Push -->
{/if}
