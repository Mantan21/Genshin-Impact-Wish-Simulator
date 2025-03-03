<script>
	import { t } from 'svelte-i18n';
	import { assets, activeVersion, customData, isCustomBanner } from '$lib/store/app-stores';
	import updates from '$lib/data/updates.json';
	import characters from '$lib/data/characters.json';

	export let tplVersion = 'v1';

	const { patch: version, phase } = $activeVersion;

	let processedUpdates = [...updates.data].reverse();

	let latestIndex = processedUpdates.findIndex(item => item.patch == version);
	let newPatchIndex = latestIndex + 1;

</script>

<div class="list" class:v2={tplVersion === 'v2'}>
	<h4>{$t('details.itemWishFor')}</h4>
	{#each [...updates.data].reverse() as { character }, i (i)}
		{#if i == newPatchIndex}
			<i>
			</i>
		{/if}	
	{/each}
</div>

<style>
	.gi-arrow-up {
		font-size: 1.2rem;
		vertical-align: middle;
		line-height: 0;
		color: #51be51;
	}

	.gi-star {
		color: #feca33;
	}

	:not(.v2) h3,
	:not(.v2) .table .body .row {
		vertical-align: middle;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	h3 {
		padding: 0 0.7rem;
		font-weight: 400;
		background-color: #a28052;
		display: flex;
		align-items: center;
		margin-bottom: 1%;
	}

	.v2 h3 {
		color: #fff;
		font-size: calc(0.015 * var(--content-width));
		padding: 0.5% 2%;
		margin: 0;
	}

	h3 span {
		padding-left: 2rem;
	}

	h3.star5 {
		background-color: #dbbba4;
	}
	.v2 h3.star5 {
		background-color: #cfb383;
	}

	h3.star4 {
		background-color: #b7abbf;
	}
	.v2 h3.star4 {
		background-color: #b5a8c9;
	}

	h3.star3 {
		background-color: #a5bacc;
	}
	.v2 h3.star3 {
		background-color: #aabdc9;
	}

	h4,
	h5 {
		color: #a28052;
		font-weight: 500;
		font-size: larger;
		margin-top: 1%;
		margin-bottom: 2%;
	}

	.v2 h4,
	.v2 h5 {
		color: var(--text-color);
		font-size: calc(0.015 * var(--content-width));
	}

	h5 {
		margin: 1%;
	}
	h5 i {
		color: #a28052;
	}

	.table {
		padding: 0 0 2rem;
		width: 100%;
		font-size: 0.9rem;
	}
	.v2 .table {
		padding: 0 0 calc(0.02 * var(--content-width));
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		border: 0.2px solid #b5b2ae;
	}
	.row.head {
		background-color: #dbd7d3;
		font-family: var(--genshin-font);
	}
	.v2 .row.head {
		background-color: #ede1ca;
	}
	.body .row {
		border-top: 0;
	}

	.cell:nth-child(odd) {
		width: calc(3 / 14 * 100%);
	}
	.cell:nth-child(even) {
		width: calc(4 / 14 * 100%);
	}

	.cell {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0.5rem;
		height: 100%;
		text-align: center;
		line-height: 1.2rem;
		height: 3.2rem;
	}

	.v2 .cell {
		font-size: calc(0.015 * var(--content-width));
		height: calc(0.05 * var(--content-width));
	}

	.head .cell {
		border: solid #b5b2ae;
		border-width: 0 0.07rem;
	}
	.body .cell {
		border: solid #b5b2ae;
		border-width: 0 0.07rem 0.07rem 0;
		color: #a7865a;
	}
	.v2 .head .cell {
		border-color: #d3bc8e;
	}
	.v2 .body .cell {
		border-color: #d3bc8e;
		color: #5b5453;
	}
</style>
