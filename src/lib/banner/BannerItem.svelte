<script>
	import { fly } from 'svelte/transition';
	import {
		bannerActive,
		viewportHeight,
		viewportWidth,
		patchVersion,
		bannerVersion,
		bannerList
	} from '$lib/store/stores';
	import setup from '$lib/setup/wish-setup.json';

	let { version, bannerNumber } = setup;
	$: if ($patchVersion !== '0.0') version = $patchVersion;
	$: if ($bannerVersion !== 0) bannerNumber = $bannerVersion;

	$: style =
		$viewportHeight > 800 ||
		$viewportHeight > $viewportWidth ||
		$viewportHeight / $viewportWidth > 0.5
			? 'bottom: unset; top: 50%; transform: translate(-50%, -50%);'
			: '';

	$: list = $bannerList[$bannerActive];
	$: limitedlist = $bannerList.filter(({ type }) => type === 'limited');
	$: limitedBannerIndex = limitedlist.findIndex(({ character }) => {
		const nm = list.character;
		if (nm) return character.name === nm.name;
	});
	$: limitedBannerName = limitedlist.length > 1 ? `limited${limitedBannerIndex}` : 'limited';
</script>

<div class="banner" {style}>
	{#if list.type === 'beginner'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="/assets/images/banner/beginner.webp" alt="Beginner Banner" />
		</div>
	{:else if list.type === 'weapon'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="/assets/images/banner/{version}/weapon-{bannerNumber}.webp" alt="Weapon Banner" />
		</div>
	{:else if list.type === 'standard'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="/assets/images/banner/standard.webp" alt="Standard Banner" />
		</div>
	{:else if list.type === 'limited'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img
				src="/assets/images/banner/{version}/{limitedBannerName}-{bannerNumber}.webp"
				alt="Limited Banner"
			/>
		</div>
	{/if}
</div>

<style>
	.banner {
		padding: 30px 0;
		dipslay: block;
		width: 80%;
		max-width: 850px;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	img {
		max-height: 100%;
		max-width: 100%;
	}

	:global(.mobile) .banner {
		padding: 0;
		width: 88%;
		max-width: 155vh;
		margin-bottom: -10px;
	}
</style>
