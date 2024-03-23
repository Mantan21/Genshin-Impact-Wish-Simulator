<script>
	import { getContext } from 'svelte';
	import RateupItem from './_rateup-item.svelte';

	export let picked = '';
	export let rateupList = [];
	const itemPicker = getContext('itemPicker');
</script>

<div class="rateup">
	<div class="wrapper">
		<div class="row">
			{#each rateupList as data, i}
				<button class="col" on:click={() => itemPicker(data)}>
					<RateupItem {data} active={data.name === picked} />
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.rateup {
		height: calc(26 / 100 * var(--content-width));
		border-top: 2px dashed #ccc;
		border-bottom: 2px dashed #ccc;
		padding: calc(0.25 / 100 * var(--content-width)) 0;
	}
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		padding-right: calc(1 / 100 * var(--content-width));
	}

	.col {
		--col-width: calc(0.2 * var(--width));
		width: 20%;
		flex-basis: 20%;
		aspect-ratio: 1/2;
		padding: calc(0.4 / 100 * var(--content-width));
		transform: scale(1.0002);
		transition: transform 0.25s;
	}

	button:active {
		transform: scale(0.95);
	}
</style>
