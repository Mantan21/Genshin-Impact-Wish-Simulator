<script>
	import { assets } from '$lib/store/stores';
	import { getContext } from 'svelte';

	export let dataLength;
	export let activepage;
	export let itemPerPage;
	export let v2 = false;

	const navigate = getContext('navigation');

	const previous = () => {
		if (activepage > 1) navigate(activepage - 1);
	};

	const next = () => {
		if (dataLength > activepage * itemPerPage) navigate(activepage + 1);
	};
</script>

<div class="pagination" class:v2>
	<button class="prev" disabled={activepage === 1} on:click={previous}>
		{#if v2}
			<img class="left" src={$assets['arrow-up.png']} alt="arrow" />
		{:else}
			<i class="gi-angle-left" />
		{/if}
	</button>
	<span class="active">{activepage}</span>
	<button class="next" disabled={!(dataLength > activepage * itemPerPage)} on:click={next}>
		{#if v2}
			<img class="right" src={$assets['arrow-up.png']} alt="arrow" />
		{:else}
			<i class="gi-angle-right" />
		{/if}
	</button>
</div>

<style>
	.pagination {
		display: flex;
		width: 100%;
		margin: 10px;
		text-align: center;
		justify-content: center;
	}

	.pagination button,
	.pagination span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		aspect-ratio: 1/1;
		border-radius: 2px;
		margin: 5px;
	}
	.pagination button {
		background-color: #c3a280;
		color: #d7cbbd;
	}
	.pagination span {
		background-color: #918981;
		color: #fff;
	}

	/* V2 */
	.pagination.v2 {
		margin: 1% 0 0;
		font-size: calc(0.02 * var(--content-width));
		color: #8e8e8e;
	}

	.pagination.v2 button,
	.pagination.v2 span {
		width: calc(0.028 * var(--content-width));
		margin: 0 2%;
		background-color: transparent;
	}

	.pagination.v2 span {
		color: var(--text-color);
	}
	.pagination.v2 button {
		border-radius: 100%;
		border: 2px solid #d7cbbd;
	}

	img.left {
		transform: rotate(-90deg);
	}
	img.right {
		transform: rotate(90deg);
	}

	button img {
		width: calc(0.015 * var(--content-width));
	}
	button:disabled img {
		opacity: 0.3;
	}
</style>
