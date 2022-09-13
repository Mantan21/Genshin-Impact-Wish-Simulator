<script>
	import { fly } from 'svelte/transition';
	import MyFund from '$lib/components/utility/MyFund.svelte';
	import { genesis, primogem, starglitter, stardust } from '$lib/store/stores';
	export let itemToBuy = '';
</script>

<div class="funds" in:fly={{ y: -15, duration: 300 }}>
	<div class="fates">
		{#if ['intertwined', 'acquaint'].includes(itemToBuy)}
			<MyFund type="starglitter">{$starglitter}</MyFund>
			<MyFund type="stardust">{$stardust}</MyFund>
		{/if}
		<MyFund type="primogem" increament={false}>{$primogem}</MyFund>
		<MyFund type="genesis">{$genesis}</MyFund>
	</div>
</div>

<style>
	.funds {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		padding: 1.2rem 3%;
		background-color: #1a1b24;
		display: flex;
		justify-content: flex-end;
	}
	:global(.mobile) .funds {
		padding: 0.7rem 3%;
	}
</style>
