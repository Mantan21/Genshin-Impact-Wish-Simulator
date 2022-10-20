<script>
	// Library
	import { onMount, setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import { bannerActive, bannerList } from '$lib/store/stores';
	import { APP_TITLE } from '$lib/env';

	// Components
	import SelectBanner from './_select-banner.svelte';
	import Report from './_report.svelte';
	import Filter from './_filter.svelte';
	import Reset from './_reset.svelte';
	import Legends from './_legends.svelte';
	import Pagination from './_pagination.svelte';
	import List from './_list.svelte';
	import Title from '../_parts/title.svelte';

	export let tplVersion;

	let dataLength = 0;
	let filteredDataLength = 0;
	let activepage = 1;
	let itemPerPage = tplVersion === 'v2' ? 5 : 6;
	let filterBy = 'All';

	$: banner = $bannerList.find((v, i) => i === $bannerActive).type;

	const selectBanner = (path) => {
		activepage = 1;
		banner = path;
		filterBy = 'All';
	};
	setContext('selectBanner', selectBanner);

	const clearHistory = () => {
		filterBy = 'clear';
		activepage = 1;
	};
	setContext('clearHistory', clearHistory);

	const filter = (selected) => {
		filterBy = selected;
		activepage = 1;
	};
	setContext('tableFilter', filter);

	const setDataLength = (allData, dataToShow) => {
		dataLength = allData;
		filteredDataLength = dataToShow;
	};
	setContext('setDataLength', setDataLength);

	const navigation = (page) => (activepage = page);
	setContext('navigation', navigation);

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<svelte:head>
	<title>
		{$t(`history.title`)} | {$t('title', { default: APP_TITLE })}
	</title>
</svelte:head>

{#if tplVersion === 'v2'}
	<Title banner="history" />
	<SelectBanner v2 {banner} />
	<div class="container">
		<p class="v2">{$t('history.disclaimer')}</p>
		<div class="row">
			<Report {dataLength} {banner} v2 />
			<Filter {filterBy} v2 />
		</div>
		<List v2 {banner} filter={filterBy} page={{ activepage, itemPerPage }} />
	</div>
	<Legends {banner} v2 />
	<Pagination v2 dataLength={filteredDataLength} {itemPerPage} {activepage} />
{:else}
	<SelectBanner {banner} />
	<p>{$t('history.disclaimer')}</p>

	<div class="info">
		<div class="left">
			<Report {dataLength} {banner} />
		</div>
		<div class="right">
			<Reset {banner} />
			<Filter {filterBy} />
		</div>
	</div>

	<List {banner} filter={filterBy} page={{ activepage, itemPerPage }} />
	<Legends {banner} />
	<Pagination dataLength={filteredDataLength} {itemPerPage} {activepage} />
{/if}

<style>
	p {
		padding: 1rem 0;
	}

	.info {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 0.5rem;
	}
	@media screen and (max-width: 450px) {
		.info {
			flex-direction: column;
			width: 100%;
		}
		.left {
			width: 100%;
		}
	}
	.info > .right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	/* V2 */
	.row {
		display: flex;
	}

	.container {
		height: 100%;
		overflow: auto;
	}
	p.v2 {
		color: #8e8e8e;
		line-height: 120%;
		padding: calc(0.008 * var(--content-width)) 0;
		font-size: calc(0.014 * var(--content-width));
	}
</style>
