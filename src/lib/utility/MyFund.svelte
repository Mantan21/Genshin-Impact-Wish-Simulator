<script>
	import { onMount } from 'svelte';
	import Icon from '$lib/utility/Icon.svelte';
	import ExchangePopup from '$lib/shop/ExchangePopup.svelte';

	export let type = 'primogem';

	let clickAudio;
	let showExchangePopup = false;

	const handlePopup = () => {
		if (type !== 'primogem') return;
		showExchangePopup = !showExchangePopup;
		clickAudio.currentTime = 0;
		clickAudio.play();
	};

	onMount(() => {
		clickAudio = document.querySelector('#button-sfx');
	});
</script>

<!-- Exchange -->
<ExchangePopup
	fundType="genesis"
	itemToBuy="primogem"
	show={showExchangePopup}
	on:cancel={handlePopup}
	on:confirm={handlePopup}
/>
<!-- Exchange -->

<button class={type} on:click={handlePopup}>
	<Icon
		{type}
		height="80%"
		width="auto"
		style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
	/>
	<slot />
	{#if type === 'primogem'}
		<i class="gi-plus" />
	{/if}
</button>

<style>
	.gi-plus {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 1.2rem;
		height: 1.2rem;
		color: #000;
		background-color: #fff;
		border-radius: 100%;
		position: absolute;
		right: 3px;
		top: 50%;
		font-size: 0.8rem;
		transform: translateY(-50%);
	}
	.primogem {
		padding-right: 30px !important;
	}

	button {
		display: inline-block;
		max-width: 112px;
		height: 25px;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		position: relative;
		margin: 0 8px;
		padding: 0 15px 0 30px;
	}

	@media screen and (max-width: 900px) {
		button {
			height: 20px;
			margin: 0 3px;
		}
	}

	@media screen and (max-width: 400px) {
		button {
			max-width: 80px;
		}
		.primogem {
			margin-bottom: 2px;
			padding: 0 30px;
		}

		.gi-plus {
			right: 2px;
			transform: translateY(-50%) scale(0.9);
		}
	}
</style>
