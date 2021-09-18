<script context="module">
	export const prerender = true;
</script>

<script>
	import { pageActive } from '$lib/store/stores';
	import MainBanner from '$lib/banner/MainBanner.svelte';
	import PreviousBannerList from '$lib/banner/PreviousBannerList.svelte';
</script>

{#if $pageActive === 'index'}
	<MainBanner />
{/if}

{#if $pageActive === 'previous-banner'}
	<PreviousBannerList />
{/if}
