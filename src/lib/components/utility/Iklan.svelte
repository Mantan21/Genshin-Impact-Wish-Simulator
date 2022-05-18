<script>
	import { onMount } from 'svelte';

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

{#if head}
	<script
		data-cfasync="false"
		type="text/javascript"
		data-adel="atag"
		src="//acacdn.com/script/atg.js"
		czid="v1xd6wvvpe"></script>
{/if}
