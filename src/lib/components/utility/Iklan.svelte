<script>
	import { onMount } from 'svelte';
	import { isMobile } from '$lib/store/stores';

	export let type = '';
	export let head = false;

	const rand = (array) => array[Math.floor(Math.random() * array.length)];
	const ad = rand([1, 2]);

	onMount(() => {
		if (type !== 'banner') return;
		return (window.adsbygoogle = window.adsbygoogle || []).push({});
	});
</script>

{#if type === 'banner'}
	<ins
		class="adsbygoogle"
		style={{ display: 'inline-block', width: '728px', height: '90px' }}
		data-ad-client="ca-pub-1874822310102113"
		data-ad-slot="22721704232"
	/>
{/if}

{#if head}
	{#if !$isMobile}
		<script
			data-cfasync="false"
			type="text/javascript"
			data-adel="atag"
			src="//acdcdn.com/script/atg.js"
			czid="nmai2xdfj8"></script>
	{/if}

	{#if ad === 1 || $isMobile}
		<script type="text/javascript" src="https://wap4dollar.com/ad/pops/?id=jnf1abpn5a"></script>
	{/if}
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
{/if}
