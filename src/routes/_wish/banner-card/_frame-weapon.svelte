<script>
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { course, mobileMode, activeVersion } from '$lib/store/app-stores';
	import { positionToStyle } from '$lib/helpers/cssPosition';
	import { highlightBannerName } from '$lib/helpers/nameText';
	import EpitomizedButton from '../epitomized-path/WeaponButton.svelte';
	import Dropnotes from './__dropnotes.svelte';

	export let featured = {};
	export let rateup = {};
	export let textOffset = {};
	const w = textOffset?.featured?.w || 29;
	const featuredW = `--text-width: calc(${w} / 100 * var(--content-width));`;
	$: steps = $activeVersion.patch >= 5.0 ? 1 : 2;
</script>

<div class="frame-content">
	<div class="top bg-epitome">
		{$t('wish.banner.weapon-event')}
	</div>
	<h1 in:fly={{ x: 10, duration: 700 }}>
		{@html highlightBannerName($t(`banner.epitome-invocation`), 'epitome')}
	</h1>

	<div class="info" in:fly={{ x: 10, duration: 700 }}>
		<Dropnotes element="epitome" banner="weapon-event" />
	</div>

	{#if $mobileMode}\
		<div class="epitomized">
			<EpitomizedButton />
		</div>
	{/if}

	<div
		class="featured"
		style="{featuredW}{positionToStyle(textOffset?.featured)}"
		in:fly={{ x: 10, duration: 700 }}
	>
		<div class="weapon-name first-wp">
			<span>
				{$t(`${featured[0].name}`)}
			</span>
			<span class="up">{$t('wish.banner.up')}</span>
		</div>
		<div class="weapon-name second-wp">
			{$t(`${featured[1].name}`)}
		</div>
	</div>

	<div class="rateup" style={positionToStyle(textOffset?.rateup)} in:fly={{ x: 10, duration: 700 }}>
		<div class="weapon-name">
			<span>{$t(`${rateup[0]}`)}</span>
			<span class="etc"> {$t('wish.banner.etc')}</span>
			<span class="up">{$t('wish.banner.up')}</span>
		</div>
	</div>

	{#if $course.selected !== null}
		<div class="selected" class:fill={$course.point >= steps}>
			{$t('epitomizedPath.courseSetFor', {
				values: { selectedCourse: $t(featured[$course.selected]?.name) }
			})}
		</div>
	{/if}
</div>

<style>
	.frame-content {
		width: 100%;
		height: 100%;
		position: relative;
		color: #565654;
		display: block;
		font-size: calc(1.8 / 100 * var(--content-width));
		line-height: 130%;
	}

	h1,
	.frame-content > div {
		text-align: left;
		position: absolute;
	}
	h1 {
		bottom: 67%;
		left: 0;
		margin: 0 4%;
		line-height: 125%;
		font-size: calc(4.5 / 100 * var(--content-width));
	}

	:global(.mobile) h1 {
		bottom: 71%;
	}

	:global(.zh-CN) h1,
	:global(.ja-JP) h1 {
		font-size: calc(7 / 100 * var(--content-width));
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
	}

	.info {
		left: 0;
		top: 40%;
		width: 40%;
		display: block;
		overflow: auto;
		padding-left: 4%;
	}
	.info::-webkit-scrollbar {
		display: none;
	}

	:global(.mobile) .info {
		top: 30%;
		height: calc(0.13 * var(--content-width));
	}

	.epitomized {
		top: 59%;
		left: 5%;
	}

	.featured {
		left: 37%;
		top: 64%;
		width: calc(22 / 100 * var(--content-width));
	}

	.rateup {
		left: 70%;
		bottom: 21%;
	}

	.weapon-name {
		color: #fff;
		display: block;
		-webkit-text-stroke: 0.015rem #000;
		letter-spacing: -0.05rem;
		line-height: 100%;
		position: relative;
	}

	.weapon-name span:not(.up) {
		filter: drop-shadow(-0.2rem 0.2rem 0.5rem #000);
	}

	.first-wp {
		font-size: calc(8 / 100 * var(--text-width));
	}

	.second-wp {
		font-size: calc(8 / 100 * var(--text-width));
		margin-top: calc(0.6 / 100 * var(--content-width));
	}

	:global(.zh-CN) .first-wp,
	:global(.zh-CN) .second-wp,
	:global(.ja-JP) .first-wp,
	:global(.ja-JP) .second-wp {
		font-size: calc(11 / 100 * var(--text-width));
	}

	span.up {
		color: #fff664;
		-webkit-text-stroke: 0.05rem #e7a12e;
		filter: drop-shadow(0 0.3rem 0.5rem #fff);
		font-size: calc(2 / 100 * var(--content-width));
		position: absolute;
		top: 0;
		right: 0;
		transform: translateX(100%) translateY(-80%);
		text-transform: uppercase;
		text-shadow: 0 0 0.4rem #f79c09;
	}

	.rateup .weapon-name {
		font-size: calc(2 / 100 * var(--content-width));
	}

	:global(.zh-CN) .rateup .weapon-name,
	:global(.ja-JP) .rateup .weapon-name {
		font-size: calc(2.7 / 100 * var(--content-width));
	}

	span.etc {
		font-size: calc(2 / 100 * var(--content-width));
		white-space: nowrap;
	}

	.selected {
		position: absolute;
		bottom: 0rem;
		right: 0;
		max-width: 80%;
		padding: 0.2rem 1rem;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.4);
		font-size: 1rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.selected.fill {
		background-color: #52b5f0;
	}
</style>
