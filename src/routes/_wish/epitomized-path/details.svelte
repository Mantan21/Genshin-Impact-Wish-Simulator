<script>
	import { onMount } from 'svelte';
	import { json, t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import { assets } from '$lib/store/app-stores';

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<div class="article">
	<img src={$assets['epitomized-ribbon.webp']} alt="ribbon" class="ribbon" />
	<div class="wrapper">
		<h1>
			<span>
				{$t('wish.epitomizedPath.text')}
			</span>
		</h1>
		<div class="content" bind:this={content}>
			<div class="description">
				{#each $json('wish.epitomizedPath.description') as desc}
					<p>· {@html desc}</p>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.article {
		font-size: calc(1.75 / 100 * var(--modal-width));
		position: relative;
		padding: 3.5% 5%;
	}

	:global(.half) .article {
		font-size: calc(3 / 100 * var(--modal-width));
	}

	.ribbon {
		position: absolute;
		top: 0;
		left: 8.5%;
		transform: translateY(-1.5%);
		width: calc(5.3 / 100 * var(--modal-width));
	}

	:global(.half) .ribbon {
		width: calc(7 / 100 * var(--modal-width));
	}

	.wrapper {
		width: 100%;
		height: 100%;
		border: 1px solid transparent;
		background-color: #e2dbd2;
	}

	.content {
		width: 100%;
		height: 83%;
		overflow: hidden;
		margin: 5% 0 0;
		text-align: left;
		color: #aa8e77;
	}

	.description {
		padding: 3%;
	}

	h1 {
		height: calc(6 / 100 * var(--modal-width));
		font-size: calc(3 / 100 * var(--modal-width));
		background-color: #d3c2af;
		width: 100%;
		padding-left: 15%;
		color: #7c613f;
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
	}
	:global(.half) h1 {
		height: calc(10 / 100 * var(--modal-width));
		font-size: calc(5 / 100 * var(--modal-width));
	}

	p :global(span) {
		color: #f0b164;
	}
</style>
