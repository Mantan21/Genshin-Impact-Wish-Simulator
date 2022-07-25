<script>
	import { t } from 'svelte-i18n';
	import { mobileMode } from '$lib/store/stores';
	import { data as charsDB } from '$lib/data/characters.json';

	export let data = {};

	const getBannerName = (banner) => {
		const split = banner.split('-');
		return split.slice(0, -1).join('-');
	};
	const { character, name } = data;
	const { vision } = charsDB[0].list.find(({ name }) => name === character);

	const highlightBannerName = (bannerName) => {
		const splited = bannerName.split(' ');
		return `<span class="${vision}">${splited[0]}</span> ${splited.slice(1).join(' ')}`;
	};
</script>

<div class="frame-content">
	{#if $mobileMode}
		<div class="top bg {vision}">
			{$t('wish.banner.events')}
		</div>
	{/if}
	<h1>{@html highlightBannerName($t(`wish.banner.name.${getBannerName(name)}`))}</h1>

	<div class="info">
		<div class="set">
			{$t('wish.banner.probIncreased')}
		</div>
		<div class="desc bg {vision}">
			<div class="icon">
				<i class="gi-primo-star" />
			</div>
			<div class="text">
				{$t('wish.banner.wishDescription')}
			</div>
		</div>
		<div class="note">
			{$t('wish.banner.eventNote')}
		</div>
	</div>

	<div class="character">
		<div class="char-name">
			{$t(`${character}.name`)}
			<span>{$t('wish.banner.up')}</span>
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
		top: 12%;
		left: 0;
		margin: 0 4%;
		line-height: 125%;
		font-size: calc(4.5 / 100 * var(--content-width));
		-webkit-text-stroke: 0.02rem #f4f2f0;
	}

	.top {
		color: #fff;
		background-color: #757acdff;
		padding: 0.1% 1.4% 0.5%;
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

	.character {
		left: 54%;
		bottom: 8%;
	}

	.character .char-name {
		color: #fff;
		display: inline-block;
		max-width: calc(27 / 100 * var(--content-width));
		font-size: calc(4 / 100 * var(--content-width));
		-webkit-text-stroke: 0.05rem #565654;
		text-shadow: 0 0 0.15rem #d2c69c;
		line-height: 100%;
	}

	.char-name span {
		color: #fff664;
		-webkit-text-stroke: 0.05rem #e7a12e;
		font-size: calc(2 / 100 * var(--content-width));
		position: absolute;
		top: 0;
		left: 80%;
		transform: translateX(100%);
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

	h1 :global(span.hydro) {
		color: #06bbff;
	}
	h1 :global(span.geo) {
		color: #debd6c;
	}
	h1 :global(span.pyro) {
		color: #ee6c4c;
	}
	h1 :global(span.anemo) {
		color: #359697;
	}
	h1 :global(span.electro) {
		color: #ca82fc;
	}
	h1 :global(span.cryo) {
		color: #4682b4;
	}

	.bg.hydro {
		background-color: #06bbff;
	}

	.bg.geo {
		background-color: #debd6c;
	}
	.bg.pyro {
		background-color: #ee6c4c;
	}
	.bg.anemo {
		background-color: #359697;
	}
	.bg.electro {
		background-color: #ca82fc;
	}
	.bg.cryo {
		background-color: #4682b4;
	}
</style>
