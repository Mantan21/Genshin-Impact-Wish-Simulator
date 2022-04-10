<script>
	import { isMobile } from '$lib/store/stores';

	export let type = '';

	const rand = (array) => array[Math.floor(Math.random() * array.length)];
	const ad = rand([1, 2]);
</script>

<svelte:head>
	{#if type === 'banner'}
		{#if ad === 1}
			<amp-ad
				width="100vw"
				height="320"
				type="adsense"
				data-ad-client="ca-pub-1874822310102113"
				data-ad-slot="6827309798"
				data-auto-format="rspv"
				data-full-width=""
			>
				<div overflow="" />
			</amp-ad>
		{:else}
			<script
				data-cfasync="false"
				type="text/javascript"
				src="//onclickprediction.com/a/display.php?r=5729138"></script>
		{/if}
	{:else}
		{#if !$isMobile}
			<script
				data-cfasync="false"
				type="text/javascript"
				data-adel="atag"
				src="//acacdn.com/script/atg.js"
				czid="v1xd6wvvpe"></script>
		{:else}
			<script
				data-cfasync="false"
				src="//achcdn.com/script/ippg.js"
				data-adel="inpage"
				zid="5729134"
				rr="0"
				mads="2"></script>
		{/if}

		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1874822310102113"
			crossorigin="anonymous"></script>
		<script
			async
			custom-element="amp-ad"
			src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
	{/if}
</svelte:head>
