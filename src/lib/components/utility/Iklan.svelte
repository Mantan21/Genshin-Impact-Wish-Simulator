<script>
	import { dev } from '$app/environment';
	import { isMobile } from '$lib/store/stores';

	export let type = '';
	export let head = false;

	// onMount(() => {
	// 	if (type !== 'banner') return;
	// 	(window.adsbygoogle = window.adsbygoogle || []).push({});
	// 	return;
	// });
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
	{:else if window.location.href.includes('archon')}
		<!-- PopAds -->
		<script
			type="text/javascript"
			src="//pl18093985.highperformancecpmgate.com/13/89/0b/13890b0e6b21eeaba5b7b7c6b418a07d.js"></script>
		<!-- End PopAds -->
		<!-- Socialbar -->
		<script
			type="text/javascript"
			src="//pl18094041.highperformancecpmgate.com/7b/81/e9/7b81e914bf27791f4b7aa4ec7b0b352b.js"></script>
		<!-- End Socialbar -->
	{:else}
		<!-- PopAds -->
		<script
			type="text/javascript"
			src="//pl17416355.profitablecpmgate.com/3e/70/98/3e7098724a8a6321d737e1bd39d9ffed.js"></script>
		<!-- PopAds -->
		<!-- In-Push Page -->
		<script
			type="text/javascript"
			src="//pl17419889.profitablecpmgate.com/fb/35/45/fb3545e433a3f40f53c83f80f24037ec.js"></script>
		<!-- In-Push Page -->
	{/if}
{/if}
