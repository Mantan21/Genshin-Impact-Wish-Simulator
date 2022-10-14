<script>
	import { getContext } from 'svelte';
	import { assets } from '$lib/store/stores';

	export let tplVersion;

	let contentWidth;
	const close = getContext('close-detail');
	const setTpl = getContext('detail-tpl');
</script>

{#if tplVersion !== 'v2'}
	<slot />
{:else}
	<div class="content-container">
		<button class="old" on:click={() => setTpl('v1')}>Older Layout</button>
		<div
			class="book"
			bind:clientWidth={contentWidth}
			style="--content-width:{contentWidth}px; background-image:url({$assets['book.webp']})"
		>
			<button class="tutup" on:click={close} />
			<div class="book-content">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.content-container {
		min-width: 90%;
		height: 50vh;
		position: relative;
	}

	.tutup {
		width: calc(0.035 * var(--content-width));
		aspect-ratio: 1/1;
		position: absolute;
		top: 6%;
		right: 2%;
	}

	.old {
		position: absolute;
		bottom: 0%;
		left: 50%;
		transform: translateX(-50%) translateY(200%);
		text-decoration: underline;
		transition: all 0.2s;
	}
	.old:hover {
		color: goldenrod;
	}

	.book {
		position: relative;
		display: block;
		margin: auto;
		height: 50vh;
		max-height: 900px;
		aspect-ratio: 487/257;
		overflow: hidden;
		background-size: cover;
		padding: calc(0.015 * var(--content-width)) calc(0.09 * var(--content-width));
	}

	@media screen and (min-width: 700px) {
		.content-container,
		.book {
			height: unset !important;
			width: 95%;
		}
	}

	:global(.mobile) .content-container,
	:global(.mobile) .book {
		height: 80vh !important;
		width: auto;
	}

	.book-content {
		width: 100%;
		height: 93%;
		display: flex;
		flex-direction: column;
	}
</style>
