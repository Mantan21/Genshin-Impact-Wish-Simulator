<script>
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';

	export let data = {};
	const oldStd = data.character.name === 'wanderlust-invocation-1';

	const chars = oldStd ? ['jean', 'diluc'] : ['qiqi', 'mona', 'keqing'];
	const weap = oldStd ? 'skyward-blade' : 'skyward-spine';

	const highlightBannerName = (bannerName) => {
		const oldClass = oldStd ? 'old' : 'wanderlust-flat';
		const splited = bannerName.split(' ');
		return `${splited[0]} <span class="${oldClass}"> ${splited.slice(1).join(' ')}</span>`;
	};
</script>

<div class="frame-content">
	<div class="top bg-wanderlust" class:old={oldStd}>
		{$t('wish.banner.standard')}
	</div>
	<h1 in:fly={{ x: 10, duration: 700 }} class="card-stroke">
		{@html highlightBannerName($t(`wish.banner.name.wanderlust`))}
	</h1>
	<div class="set card-stroke" in:fly={{ x: 10, duration: 700 }}>
		{$t('wish.banner.standard')}
	</div>

	<div class="desc">
		<p>
			{$t('wish.banner.wishDescription')}
		</p>
	</div>
	<div class="note card-stroke" in:fly={{ x: 10, duration: 700 }}>
		{$t('wish.banner.standardNote')}
		{$t('wish.banner.viewDetails')}
	</div>

	{#each chars as char}
		<div class="group {char}" in:fly={{ x: 10, duration: 700 }}>
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
	<div class="group skyward" in:fly={{ x: 10, duration: 700 }}>
		<div class="group-content">
			<div class="item-name">
				{$t(weap)}
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
		display: block;
	}
	h1 :global(span.old) {
		color: #c9a07b;
	}

	h1,
	.frame-content > div {
		text-align: left;
		position: absolute;
	}
	h1 {
		bottom: 73.5%;
		left: 0;
		margin: 0 4%;
		line-height: 125%;
		font-size: calc(4.5 / 100 * var(--content-width));
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
	.top.old {
		background-color: #c9a07b;
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
		top: 49%;
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
		top: 58%;
		left: 4%;
		width: 36%;
	}
	.note.old {
		top: 43%;
	}

	.group-content {
		position: relative;
	}
	.item-name {
		color: #fff;
		-webkit-text-stroke: 0.05rem #565654;
		text-shadow: 0 0 0.15rem #d2c69c;
		filter: drop-shadow(0 0.3rem 0.5rem #000);
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
	.keqing {
		left: 61%;
		top: 55%;
	}
	.jean {
		left: 44%;
		top: 72.5%;
	}
	.diluc {
		left: 78%;
		top: 10%;
	}

	.keqing .item-name {
		font-size: calc(4.5 / 100 * var(--content-width));
		transform: translateY(-80%);
	}
	.qiqi .item-name,
	.mona .item-name {
		font-size: calc(3.3 / 100 * var(--content-width));
	}
	.jean .item-name,
	.diluc .item-name {
		font-size: calc(4 / 100 * var(--content-width));
		margin-bottom: calc(4 / 100 * var(--content-width));
	}

	.skyward {
		left: 75.1%;
		bottom: 4.5%;
		width: 24%;
		line-height: 170%;
	}

	.skyward .item-name {
		font-size: calc(3.5 / 100 * var(--content-width));
	}

	:global(.vi-VN) .skyward .item-name {
		font-size: calc(3 / 100 * var(--content-width));
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
		font-size: calc(1.3 / 100 * var(--content-width));
		line-height: 130%;
		padding: calc(0.2 / 100 * var(--content-width)) calc(2 / 100 * var(--content-width));
		margin-top: calc(3.8 / 100 * var(--content-width));
		transform: translateX(-5%);
	}
</style>
