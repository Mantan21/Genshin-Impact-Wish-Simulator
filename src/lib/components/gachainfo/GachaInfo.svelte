<script>
	import { fade } from 'svelte/transition';
	import { setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { assets, pageActive } from '$lib/store/stores';
	import { localConfig } from '$lib/store/localstore';
	import browserState from '$lib/helpers/browserState';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import Book from './_parts/book.svelte';
	import MainDetails from './details/MainDetails.svelte';
	import MainHistory from './history/MainHistory.svelte';

	export let page = '';

	const handleCLose = () => {
		browserState.back();
		pageActive.set('index');
		playSfx('close');
	};
	setContext('close-detail', handleCLose);

	let tplVersion = localConfig.get('detail-tpl') || 'v2';
	const setTpl = (v) => {
		localConfig.set('detail-tpl', v);
		tplVersion = v;
	};
	setContext('detail-tpl', setTpl);
</script>

<section transition:fade={{ duration: 200 }}>
	{#if tplVersion !== 'v2'}
		<div class="header">
			<button on:click={handleCLose}>
				<i class="gi-reply" />
			</button>

			<button class="switchNewTpl" on:click={() => setTpl('v2')}> {$t('history.switchv2')} </button>
		</div>
	{/if}

	<div
		class="content-details {page}"
		class:v2={tplVersion === 'v2'}
		style={tplVersion === 'v2' ? `background-image:url(${$assets['wish-background.webp']})` : ''}
	>
		<Book {tplVersion}>
			{#if page === 'details'}
				<MainDetails {tplVersion} />
			{:else if page === 'history'}
				<MainHistory {tplVersion} />
			{/if}
		</Book>
	</div>
</section>

<style>
	section {
		background-color: #ebebeb;
		width: 100%;
		height: 100%;
		color: var(--text-color);
		overflow-y: auto;
		position: relative;
		z-index: +1;
	}

	.content-details:not(.v2) {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.content-details :global(h1),
	.content-details :global(.pop-footer button) {
		font-family: var(--genshin-font);
	}

	.header {
		display: flex;
		padding: 0 2%;
		justify-content: space-between;
		background-color: rgb(20, 18, 15);
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: +10;
	}

	.gi-reply {
		color: #dbd7d3;
		font-size: 2.2rem;
		line-height: 0;
		padding: 0.3rem 1rem;
		display: inline-block;
	}
	.switchNewTpl {
		color: darkgoldenrod;
		text-decoration: underline;
		transition: all 0.3s;
	}
	.switchNewTpl:hover {
		color: rgb(255, 238, 213);
	}

	.content-details {
		padding: 4rem 10% 1rem;
		width: 100%;
		overflow-x: hidden;
	}

	.content-details.v2 {
		background-size: cover;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10%;
		overflow-x: auto;
		background-position: 20%;
	}

	.content-details.v2::-webkit-scrollbar {
		display: none;
	}

	:global(.mobile) .content-details.v2 {
		padding-left: 0;
		padding-right: 0;
	}

	@media screen and (max-width: 780px) {
		:global(main):not(.mobile) .content-details {
			padding: 3.5rem 5% 0;
		}

		:global(main):not(.mobile) .content-details.v2 {
			padding: 0 5% !important;
		}
	}
</style>
