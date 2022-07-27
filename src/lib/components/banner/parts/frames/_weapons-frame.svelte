<script>
	import { t } from 'svelte-i18n';
	import { mobileMode, fatePoint, selectedCourse } from '$lib/store/stores';
	import positionToStyle from '$lib/functions/cssPosition';

	export let data = {};
	const { featured, rateup, textOffset } = data;
	const w = textOffset?.featured?.w || 29;
	const feturedW = `--text-width: calc(${w} / 100 * var(--content-width));`;

	const highlightBannerName = (bannerName) => {
		const splited = bannerName.split(' ');
		return `<span>${splited[0]}</span> ${splited.slice(1).join(' ')}`;
	};
</script>

<div class="frame-content">
	{#if $mobileMode}
		<div class="top bg">
			{$t('wish.banner.weapons')}
		</div>
	{/if}
	<h1>{@html highlightBannerName($t(`wish.banner.name.epitome-invocation`))}</h1>

	<div class="info">
		<div class="set">
			{$t('wish.banner.probIncreased')}
		</div>
		<div class="desc bg">
			<div class="icon">
				<i class="gi-primo-star" />
			</div>
			<div class="text">
				{$t('wish.banner.wishDescription')}
			</div>
		</div>
		<div class="note">
			{$t('wish.banner.viewDetails')}
		</div>
	</div>

	<div class="featured" style="{feturedW}{positionToStyle(textOffset?.featured)}">
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

	<div class="rateup" style={positionToStyle(textOffset?.rateup)}>
		<div class="weapon-name">
			{$t(`${rateup[0]}`)}, <span class="etc"> {$t('wish.banner.etc')}</span>
			<span class="up">{$t('wish.banner.up')}</span>
		</div>
	</div>

	{#if $selectedCourse.name}
		<div class="selected" class:fill={$fatePoint === 2}>
			{$t('wish.epitomizedPath.courseSetFor', {
				values: { selectedCourse: $t($selectedCourse.name) }
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

	h1 :global(span) {
		color: #757acdff;
		display: block;
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
		-webkit-text-stroke: 0.02rem #f4f2f0;
	}

	.top {
		color: #fff;
		background-color: #757acdff;
		padding: 0.3% 1.4%;
		border-bottom-left-radius: 2rem;
		border-top-left-radius: 2rem;
		border-bottom-right-radius: 4rem;
		top: 0;
		left: 0;
		transform: translate(-3%, 70%);
	}

	.info {
		left: 4%;
		top: 40%;
		width: 36%;
		display: block;
		-webkit-text-stroke: 0.002rem #f4f2f0;
	}
	.info::after {
		content: '';
		display: block;
		width: calc(0.55 / 100 * var(--content-width));
		height: 100%;
		background-color: #565654;
		position: absolute;
		left: calc(-3 / 100 * var(--content-width));
		top: 0;
	}

	.set {
		font-size: calc(2.4 / 100 * var(--content-width));
	}

	.desc {
		left: 7.5%;
		top: 49.7%;
		color: #fff;
		height: calc(14 / 100 * var(--content-height));
		display: flex;
		margin: calc(0.7 / 100 * var(--content-width)) 0;
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: calc(1 / 100 * var(--content-width));
		font-size: calc(1.1 / 100 * var(--content-width));
	}

	.desc .text {
		height: 100%;
		overflow-y: auto;
		width: calc(32.5 / 100 * var(--content-width));
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
		-webkit-text-stroke: 0.03rem #565654;
		line-height: 100%;
		position: relative;
	}

	.first-wp {
		font-size: calc(8 / 100 * var(--text-width));
	}

	.second-wp {
		font-size: calc(8 / 100 * var(--text-width));
		margin-top: calc(0.6 / 100 * var(--content-width));
	}

	span.up {
		color: #fff664;
		-webkit-text-stroke: 0.05rem #e7a12e;
		font-size: calc(2 / 100 * var(--content-width));
		position: absolute;
		top: 0;
		left: 90%;
		transform: translateX(100%);
		text-transform: uppercase;
		text-shadow: 0 0 0.4rem #f79c09;
	}

	.rateup .weapon-name {
		font-size: calc(2 / 100 * var(--content-width));
	}
	.rateup span.up {
		left: 100%;
		transform: translateY(-100%) translateX(-50%);
	}
	span.etc {
		font-size: calc(2 / 100 * var(--content-width));
		white-space: nowrap;
	}

	h1 :global(span) {
		color: #ef7c1aff;
	}
	.bg {
		background-color: #ef7c1aff;
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
		background-color: #62c5ff;
	}
</style>
