<script>
	import { fly } from 'svelte/transition';
	import { locale, t } from 'svelte-i18n';
	import { positionToStyle } from '$lib/helpers/cssPosition';
	import { getBannerName, highlightBannerName } from '$lib/helpers/nameText';
	import { getCharDetails } from '$lib/helpers/gacha/itemdrop-base';
	import Dropnotes from './__dropnotes.svelte';

	export let bannerName = '';
	export let character = '';
	export let textOffset = {};
	export let event2 = false;

	$: localeBannerName = $t(`banner.${getBannerName(bannerName).name}`);
	$: vision = getCharDetails(character).vision;
	$: featuredC = `--text-width: calc(${textOffset?.w || 30} / 100 * var(--content-width));`;
</script>

<div class="frame-content">
	<div class="top bg-{vision}">
		{$t('wish.banner.character-event')}
		{event2 ? ($locale === 'ja-JP' ? '2' : '— 2') : ''}
	</div>
	<div class="heading" in:fly={{ x: 15, duration: 700 }}>
		<h1 class="card-stroke">
			{@html highlightBannerName(localeBannerName, vision)}
		</h1>
	</div>

	<div class="description" in:fly={{ x: 15, duration: 700 }}>
		<Dropnotes element={vision} banner="character-event" />
	</div>

	<div
		class="character"
		style="{featuredC}{positionToStyle(textOffset)}"
		in:fly={{ x: 10, duration: 700 }}
	>
		<div class="char-name">
			<span>
				{$t(`${character}.name`)}
			</span>
			<span class="up">{$t('wish.banner.up')}</span>
		</div>
		<div class="char-title">
			{$t(`${character}.title`)}
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
		font-size: calc(1.8 / 100 * var(--content-width));
		line-height: 130%;
	}

	.frame-content > div {
		text-align: left;
		position: absolute;
	}

	.heading {
		position: absolute;
		display: flex;
		align-items: center;
		bottom: 67%;
		left: 0;
		margin: 0 4%;
		height: calc(0.23 * var(--content-height));
		width: 45%;
	}

	h1 {
		text-align: left;
		line-height: 100%;
		font-size: calc(4.5 / 100 * var(--content-width));
	}

	:global(.zh-CN) h1,
	:global(.ja-JP) h1 {
		font-size: calc(6 / 100 * var(--content-width));
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
	}

	.description {
		left: 0;
		top: 37.5%;
		width: 45%;
		height: 42%;
		display: block;
		padding-left: 4%;
		overflow: auto;
	}
	.description::-webkit-scrollbar {
		display: none;
	}

	.character {
		left: 54%;
		bottom: 8%;
		width: calc(27 / 100 * var(--content-width));
	}

	.character .char-name {
		color: #fff;
		display: inline-block;
		-webkit-text-stroke: 0.02rem #565654;
		text-shadow: 0 0 0.15rem #d2c69c;
		line-height: 100%;
		position: relative;
		font-size: calc(11 / 100 * var(--text-width));
	}

	:global(.zh-CN) .character .char-name {
		font-size: calc(17 / 100 * var(--text-width));
	}
	:global(.ja-JP) .character .char-name {
		font-size: calc(15 / 100 * var(--text-width));
	}

	.char-name span {
		filter: drop-shadow(0 0.3rem 0.5rem #000);
	}

	.char-name .up {
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

	.character .char-title {
		color: #cfbc99;
		background-color: #39425d;
		margin-top: calc(3.5 / 100 * var(--content-width));
		padding: 1% 2%;
		white-space: nowrap;
		width: fit-content;
	}
</style>
