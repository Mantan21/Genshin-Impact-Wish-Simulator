<script>
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import { beginnerRoll } from '$lib/store/localstore';

	export let character = '';
	export let isError = false;
	$: char = $t(`${character.character}.name`);

	const highlightBannerName = (bannerName) => {
		const splited = bannerName.split(' ');
		return `${splited[0]} <span class="geo"> ${splited.slice(1).join(' ')}</span>`;
	};

	const remaining = browser ? 20 - beginnerRoll.get() : 0;
</script>

<div class="frame-content" class:error={isError}>
	<div class="top">
		{$t('wish.banner.novice')}
	</div>
	<h1 class="card-stroke" in:fly={{ x: 10, duration: 700 }}>
		{@html highlightBannerName($t(`wish.banner.beginner`))}
	</h1>
	<div class="set" in:fly={{ x: 10, duration: 700 }}>
		{$t('wish.banner.beginnerSet', { values: { character: char } })}
	</div>
	<div class="desc" in:fly={{ x: 10, duration: 700 }}>
		<p>
			{$t('wish.banner.wishDescription')}
		</p>
	</div>
	<div class="note" in:fly={{ x: 10, duration: 700 }}>
		{$t('wish.banner.beginnerNote')}
	</div>
	<div class="featured" in:fly={{ x: 10, duration: 700 }}>
		<div class="charName" style="position: relative;">
			<span>
				{char}
			</span>
			<span class="up">{$t('wish.banner.up')}</span>
		</div>
	</div>

	<div class="char-title" in:fly={{ x: 10, duration: 700 }}>
		{$t(`${character.character}.title`)}
	</div>

	<div class="chances">
		{$t('wish.banner.beginnerChance', { values: { chances: `${remaining}/20` } })}
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
	}

	.frame-content.error {
		background-color: #fff;
	}

	h1,
	.frame-content > div {
		text-align: left;
		position: absolute;
	}
	h1 :global(span) {
		color: #cba885;
		display: block;
	}
	h1 {
		bottom: 73.5%;
		left: 0;
		margin: 0 4%;
		line-height: 125%;
		font-size: calc(4.5 / 100 * var(--content-width));
	}

	:global(.zh-CN) h1,
	:global(.ja-JP) h1 {
		font-size: calc(6 / 100 * var(--content-width));
	}

	.top {
		color: #fff;
		background-color: #e79649;
		padding: 0.3% 1.4%;
		border-bottom-left-radius: 2rem;
		border-top-left-radius: 2rem;
		border-bottom-right-radius: 4rem;
		top: 0;
		left: 0;
		transform: translate(-3%, -15%);
	}

	.set {
		bottom: 54%;
		left: 4%;
		width: 36%;
		font-size: calc(2.4 / 100 * var(--content-width));
		line-height: 120%;
	}

	.desc {
		left: 7.5%;
		width: 32.5%;
		top: 55.2%;
		transform: translateY(-50%);
		color: #fff;
		height: 14%;
		overflow-y: auto;
		display: flex;
		align-items: center;
	}

	.desc p {
		line-height: 120%;
	}

	.note {
		top: 63%;
		left: 4%;
		width: 36%;
	}

	.featured {
		top: 65.6%;
		left: 57.6%;
		color: #fff;
		font-size: calc(4.9 / 100 * var(--content-width));
		-webkit-text-stroke: 0.05rem #565654;
		text-shadow: 0 0 0.15rem #d2c69c;
	}

	:global(.ja-JP) .featured,
	:global(.zh-CN) .featured {
		top: 68%;
	}

	.charName span:not(.up) {
		filter: drop-shadow(0 0.3rem 0.5rem #000);
	}

	.charName span.up {
		color: #fff664;
		-webkit-text-stroke: 0.05rem #e7a12e;
		font-size: calc(1.5 / 100 * var(--content-width));
		filter: drop-shadow(0 0.3rem 0.5rem #fff);
		position: absolute;
		top: 0;
		right: 0;
		transform: translateX(100%);
		text-transform: uppercase;
		text-shadow: 0 0 0.4rem #f79c09;
	}

	.char-title {
		left: 57.6%;
		top: 83.5%;
		color: #cfbc99;
		background-color: #39425d;
	}

	.chances {
		right: 0;
		bottom: 7.3%;
		color: #e7dfd0;
		background-color: #252d3a;
		padding-right: 1%;
	}
</style>
