<script>
	import { onMount } from 'svelte';
	import { json, t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import { assets } from '$lib/store/app-stores';
	import CronicledDetails from './_chronicled-details.svelte';

	export let isChronicled = false;
	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

{#if isChronicled}
	<div class="article chronicled">
		<CronicledDetails />
	</div>
{:else}
	<div class="article weapon">
		<img src={$assets['epitomized-ribbon.webp']} alt="ribbon" class="ribbon" />
		<div class="wrapper">
			<h1>
				<span>
					{$t('epitomizedPath.heading')}
				</span>
			</h1>
			<div class="content" bind:this={content}>
				<div class="description">
					{#each $json('epitomizedPath.description') as desc}
						<p>· {@html desc}</p>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.article {
		position: relative;
		font-size: calc(3.3 / 100 * var(--modal-height));
	}
	.article.weapon {
		padding: 3.5% 5%;
	}
	.article.chronicled {
		padding: 2.5% 2.5% 4%;
	}

	.ribbon {
		position: absolute;
		top: 0;
		left: 8.5%;
		transform: translateY(-1.5%);
		width: calc(0.09 * var(--modal-height));
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
		height: calc(10 / 100 * var(--modal-height));
		font-size: calc(4.2 / 100 * var(--modal-height));
		background-color: #d3c2af;
		width: 100%;
		padding-left: 18%;
		color: #7c613f;
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
	}
	p :global(span) {
		color: #ea930e;
	}
</style>
