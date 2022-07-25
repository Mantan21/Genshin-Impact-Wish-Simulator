<script>
	import { t } from 'svelte-i18n';
	import { mobileMode } from '$lib/store/stores';

	const highlightBannerName = (bannerName) => {
		const splited = bannerName.split(' ');
		return `${splited[0]} <span> ${splited.slice(1).join(' ')}</span>`;
	};
</script>

<div class="frame-content">
	{#if $mobileMode}
		<div class="top">
			{$t('wish.banner.standard')}
		</div>
	{/if}
	<h1>{@html highlightBannerName($t(`wish.banner.name.wanderlust`))}</h1>
	<div class="set">
		{$t('wish.banner.standard')}
	</div>
	<div class="desc">
		{$t('wish.banner.wishDescription')}
	</div>
	<div class="note">
		{$t('wish.banner.standardNote')}
	</div>

	{#each ['qiqi', 'mona', 'keqing'] as char}
		<div class="group {char}">
			<div class="group-content">
				<div class="item-name">
					{$t(`${char}.name`)}
				</div>
				<div class="char-title">
					{$t(`${char}.title`)}
				</div>
			</div>
		</div>
	{/each}
	<div class="group skyward">
		<div class="group-content">
			<div class="item-name">
				{$t(`skyward-spine`)}
				<span>{$t('wish.banner.etc')}</span>
			</div>
			<div class="all">
				{$t('wish.banner.allWeaponTypes')}
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
		font-size: calc(1.8 / 100 * var(--content-width));
		line-height: 120%;
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
		top: 5%;
		left: 0;
		margin: 0 4%;
		line-height: 125%;
		font-size: calc(4.5 / 100 * var(--content-width));
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
		transform: translate(-5%, -25%);
	}

	.set {
		bottom: 60%;
		left: 4%;
		width: 36%;
		font-size: calc(2.4 / 100 * var(--content-width));
	}

	.desc {
		left: 7.5%;
		width: 32.5%;
		top: 49.7%;
		transform: translateY(-50%);
		color: #fff;
		height: 14%;
		overflow-y: auto;
	}

	.note {
		top: 58%;
		left: 4%;
		width: 36%;
	}

	.group-content {
		position: relative;
	}
	.item-name {
		color: #fff;
		-webkit-text-stroke: 0.05rem #565654;
		text-shadow: 0 0 0.15rem #d2c69c;
	}
	.char-title {
		color: #cfbc99;
		background-color: #39425d;
		margin-top: calc(2.8 / 100 * var(--content-width));
		padding: 1% 2%;
		white-space: nowrap;
		width: fit-content;
	}
	.qiqi {
		left: 36.5%;
		top: 78%;
	}
	.mona {
		left: 46%;
		top: 21%;
	}
	.qiqi .item-name,
	.mona .item-name {
		font-size: calc(3.3 / 100 * var(--content-width));
	}

	.keqing {
		left: 61%;
		top: 55%;
	}
	.keqing .item-name {
		font-size: calc(4.5 / 100 * var(--content-width));
		transform: translateY(-80%);
	}

	.skyward {
		left: 75%;
		bottom: 4%;
		width: 23%;
		line-height: 170%;
	}

	.skyward .item-name {
		font-size: calc(3.5 / 100 * var(--content-width));
	}
	.item-name span {
		font-size: calc(2 / 100 * var(--content-width));
		white-space: nowrap;
	}
	.all {
		color: #fff;
		background-color: #f7ab48;
		display: inline-block;
		width: fit-content;
		font-size: calc(1.6 / 100 * var(--content-width));
		line-height: 130%;
		padding: 1% 3%;
		margin-top: calc(3.8 / 100 * var(--content-width));
		transform: translateX(-5%);
	}
</style>
