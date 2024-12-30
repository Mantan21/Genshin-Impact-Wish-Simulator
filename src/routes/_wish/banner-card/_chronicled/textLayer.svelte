<script>
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { chronicledCourse } from '$lib/store/app-stores';
	import { getBannerName, highlightBannerName } from '$lib/helpers/nameText';
	import { getDetails } from '$lib/helpers/gacha/itemdrop-base';
	import RateUpSelector from './rateupSelector.svelte';
	import Epitomized from './_epitomized.svelte';
	import Dropnotes from '../__dropnotes.svelte';
	import RateuplistHorizontal from './_rateuplist-horizontal.svelte';

	export let bannerData = {};
	export let courseData = {};
	export let picked = '';
	export let translated = '';

	const regions = {
		mondstadt: 'anemo',
		liyue: 'geo',
		inazuma: 'electro',
		sumeru: 'dendro',
		fontaine: 'hydro',
		natlan: 'pyro'
	};

	const { bannerName, characters, weapons, region } = bannerData;
	$: localeBannerName = $t(`banner.${getBannerName(bannerName).name}`);
	$: element = regions[region] || 'anemo';

	const listOfItem = [...characters['5star'], ...weapons['5star']];
	const rateupList = listOfItem.map((name) => getDetails(name));
</script>

<div class="frame-content">
	<div class="top bg-{element}">{$t('wish.banner.chronicled')}</div>
	<div class="heading" in:fly={{ x: 15, duration: 700 }}>
		<h1 class="card-stroke">
			{@html highlightBannerName(localeBannerName, element)}
		</h1>
	</div>

	<div
		class="description"
		class:hasCourse={!!courseData.selected}
		in:fly={{ x: 15, duration: 700 }}
	>
		{#if !!courseData.selected}
			<Dropnotes {element} banner="chronicled" />
			<div style="margin-top: auto;" in:fly|local={{ x: 20 }}>
				<Epitomized {courseData} />
				<RateuplistHorizontal {rateupList} exclude={$chronicledCourse.selected} />
			</div>
		{:else}
			<div class="courseNote">{$t('epitomizedPath.chartChronicled')}</div>
			<RateUpSelector {rateupList} {picked} />
		{/if}
	</div>

	<div class="selected" in:fly={{ x: 10, duration: 700 }}>
		<div class="item">
			<span class="name"> {translated} </span>
			<span class="up">{$t('wish.banner.up')}</span>

			<div class="textbg">
				<div class="stars">
					{#each Array(5) as _}
						<i class="gi-star" />
					{/each}
				</div>
				{#if courseData.selected}
					<div class="current-selection" class:fill={$chronicledCourse.point > 0}>
						{$t('epitomizedPath.currentSelection', { values: { itemType: $t(courseData.type) } })}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.frame-content {
		width: 100%;
		height: 100%;
		position: relative;
		color: #565654;
		display: block;
		font-size: calc(1.6 / 100 * var(--content-width));
		line-height: 130%;
	}

	.frame-content > div {
		position: absolute;
	}

	.heading {
		position: absolute;
		display: flex;
		align-items: center;
		bottom: 75%;
		left: 0;
		margin: 0 4%;
		height: calc(9.5 / 100 * var(--content-width));
		width: 50%;
	}

	h1 {
		text-align: left;
		line-height: 100%;
		font-size: calc(4.5 / 100 * var(--content-width));
	}

	:global(.zh-CN) h1,
	:global(.ja-JP) h1 {
		font-size: calc(5.5 / 100 * var(--content-width));
	}
	:global(.ja-JP) h1 {
		max-width: 80%;
	}

	.top {
		color: #fff;
		padding: 0.3% 1.4%;
		border-bottom-left-radius: 2rem;
		border-top-left-radius: 2rem;
		border-bottom-right-radius: 4rem;
		top: 0;
		left: 0;
		transform: translate(-3%, -15%);
		font-size: calc(1.8 / 100 * var(--content-width));
	}

	.description {
		--width: calc(0.48 * var(--content-width));
		width: var(--width);
		left: 0;
		top: 26%;
		display: block;
		padding-left: 4%;
		overflow: auto;
	}

	.description.hasCourse {
		height: calc(30 / 100 * var(--content-width));
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.courseNote {
		height: calc(4.25 / 100 * var(--content-width));
		overflow: auto;
	}

	.selected {
		--text-width: calc(30 / 100 * var(--content-width));
		width: var(--text-width);
		left: 56%;
		bottom: 27%;
	}

	.selected .item {
		color: #fff;
		display: inline-block;
		position: relative;
	}

	:global(.zh-CN) .selected .item span:not(.up),
	:global(.ja-JP) .selected .item span:not(.up) {
		font-size: calc(15 / 100 * var(--text-width));
	}

	.item span {
		display: block;
		position: relative;
		z-index: +2;
		max-width: calc(27 / 100 * var(--content-width));
		font-size: calc(11 / 100 * var(--text-width));
		line-height: 100%;
		filter: drop-shadow(0 0.3rem 0.5rem #000);
		-webkit-text-stroke: 0.02rem #565654;
	}

	.item .up {
		color: #fff664;
		-webkit-text-stroke: 0.05rem #e7a12e;
		font-size: calc(2 / 100 * var(--content-width));
		filter: drop-shadow(0 0.3rem 0.5rem #fff);
		position: absolute;
		top: 0;
		right: 0;
		transform: translateX(100%) translateY(-50%);
		text-transform: uppercase;
		text-shadow: 0 0 0.4rem #f79c09;
	}

	.textbg {
		background-color: rgba(0, 0, 0, 0.75);
		margin-top: calc(-3 / 100 * var(--content-height));
		width: calc(100% + (0.1 * var(--content-height)));
		min-width: calc(0.25 * var(--content-height));
		height: calc(70% + (0.08 * var(--content-height)));
		transform: translate(
			calc(3 / 100 * var(--content-height) * -1),
			calc(10% + (0.065 * var(--content-height)))
		);
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.stars {
		position: absolute;
		left: calc(3 / 100 * var(--content-height));
		bottom: 10%;
	}

	.gi-star {
		color: #f7cf33;
		display: inline-block;
		font-size: calc(3.5 / 100 * var(--content-height));
	}

	.current-selection {
		position: absolute;
		bottom: 0;
		left: 0;
		line-height: 120%;
		transform: translateY(95%);
		font-size: calc(2.9 / 100 * var(--content-height));
		min-width: calc(30 / 100 * var(--content-width));
		padding: calc(0.75 / 100 * var(--content-height)) calc(3 / 100 * var(--content-height));
		background-color: rgba(85, 109, 139, 0.9);
	}

	.current-selection.fill {
		background-color: #52b5f0;
	}
</style>

