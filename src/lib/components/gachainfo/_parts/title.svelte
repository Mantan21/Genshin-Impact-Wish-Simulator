<script>
	import { assets } from '$lib/store/stores';
	import { t } from 'svelte-i18n';

	export let bannerTitle = '';
	export let banner = '';
	export let vision = '';
	export let tplVersion = '';

	const highlightBannerName = (bannerName, vision = '') => {
		const splited = bannerName.split(' ');
		const joined = splited.slice(1).join(' ');
		return `<span class="${vision || 'epitome'}-flat">${splited[0]}</span> ${joined}`;
	};
</script>

{#if banner === 'history'}
	<h1 class="v2">
		<img src={$assets['brand.png']} alt="Icon" crossorigin="anonymous" />
		<span> {$t('history.title')}</span>
	</h1>
{:else if banner === 'standard'}
	<h1 class="standard" class:v2={tplVersion === 'v2'}>
		{#if tplVersion === 'v2'}
			<img src={$assets['brand.png']} alt="Icon" crossorigin="anonymous" />
		{/if}
		<span>
			{$t('wish.banner.standard')} "{@html highlightBannerName(
				$t('wish.banner.name.wanderlust'),
				'wanderlust'
			)}"
		</span>
	</h1>
{:else}
	<h1 class={banner} class:v2={tplVersion === 'v2'}>
		{#if tplVersion === 'v2'}
			<img src={$assets['brand.png']} alt="Icon" crossorigin="anonymous" />
		{/if}
		<span>
			{#if banner !== 'beginner'}
				{$t(`wish.banner.${banner}`, { default: 'UnReleased Banner' })}
			{/if}
			"{@html highlightBannerName(bannerTitle, vision)}"
		</span>
	</h1>
{/if}

<style>
	h1 {
		font-size: 1.7rem;
		text-align: left;
		background-color: #dadada;
		padding: 0.5rem 5%;
		display: flex;
		align-items: center;
		position: relative;
	}

	:global(.mobile) h1 {
		font-size: 1.3rem;
	}

	h1.v2 {
		background-color: transparent;
		font-size: calc(0.022 * var(--content-width));
		vertical-align: middle;
		padding: calc(0.01 * var(--content-width)) 0;
	}

	h1 img {
		width: calc(0.03 * var(--content-width));
		margin-right: calc(0.01 * var(--content-width));
	}

	h1:not(.v2)::before {
		content: '';
		display: block;
		position: absolute;
		width: 0.8rem;
		height: 80%;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		background-color: var(--text-color);
	}
</style>
