<script>
	import { dev } from '$app/env';
	import { onMount } from 'svelte';
	import { isMobile } from '$lib/store/stores';

	export let type = '';
	export let head = false;

	onMount(() => {
		if (type !== 'banner') return;
		(window.adsbygoogle = window.adsbygoogle || []).push({});
		return;
	});
</script>

{#if type === 'banner'}
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-1874822310102113"
		data-ad-slot="6827309798"
		data-ad-format="auto"
		data-full-width-responsive="true"
	/>
{/if}

<!-- <script
		data-cfasync="false"
		type="text/javascript"
		data-adel="atag"
		src="//acacdn.com/script/atg.js"
		czid="v1xd6wvvpe"></script> -->

{#if head && !dev}
	{#if $isMobile}
		<!-- BEGIN ADREACTOR CODE -->
		<script data-cfasync="false">
			var _avp = _avp || [];
			(function () {
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.async = true;
				s.src = window.location.protocol + '//adserver.adreactor.com/js/libcode3.js';
				var x = document.getElementsByTagName('script')[0];
				x.parentNode.insertBefore(s, x);
			})();
		</script>
		<!-- END ADREACTOR CODE -->
	{:else}
		<!-- PopAds -->
		<script
			type="text/javascript"
			src="//pl17416355.profitablecpmgate.com/3e/70/98/3e7098724a8a6321d737e1bd39d9ffed.js"></script>
		<!-- PopAds -->
	{/if}
	<!-- In-Push Page -->
	<script
		type="text/javascript"
		src="//pl17419889.profitablecpmgate.com/fb/35/45/fb3545e433a3f40f53c83f80f24037ec.js"></script>
	<!-- In-Push Page -->
{/if}

{#if $isMobile && !type && !head}
	<!-- BEGIN ADREACTOR CODE -->
	<script>
		if (!document.cookie || document.cookie.indexOf('AVPWCAP=') == -1) {
			_avp.push({ alias: '/', type: 'window', zid: 35, pid: 11410 });
		}
	</script>
	<!-- END ADREACTOR CODE -->
{/if}
