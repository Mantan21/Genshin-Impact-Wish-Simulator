<script>
	import { fly } from 'svelte/transition';
	import {
		bannerActive,
		viewportHeight,
		viewportWidth,
		patchVersion,
		bannerPhase,
		bannerList,
		fatePoint,
		showFatepointCounter
	} from '$lib/store/stores';
	import setup from '$lib/setup/wish-setup.json';
	import { localFatePoint } from '$lib/store/localstore';
	import { getName } from '$lib/functions/nameText';

	let { version, wishPhase } = setup;
	$: if ($patchVersion !== '0.0') version = $patchVersion;
	$: if ($bannerPhase !== 0) wishPhase = $bannerPhase;

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

	/**
	 * Check Fate Point
	 */
	let selectedCourse;
	const checkFatepoint = (patch, banner) => {
		// eslint-disable-next-line
		if (!globalThis.window) return;
		const localFate = localFatePoint.init(patch, banner);
		const { weapons } = $bannerList.find(({ type }) => type === 'weapon');
		const selectedData = weapons[localFate.getSelected()];
		selectedCourse = selectedData ? getName(selectedData.name) : null;
		return selectedCourse;
	};
</script>

<div class="banner" {style}>
	{#if list.type === 'beginner'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="/assets/images/banner/beginner.webp" alt="Beginner Banner" />
		</div>
	{:else if list.type === 'weapon'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<div class="weapon-banner">
				<img src="/assets/images/banner/{version}/weapon-{wishPhase}.webp" alt="Weapon Banner" />

				{#if checkFatepoint($patchVersion, $bannerPhase, /** to trigger when course selected */ $showFatepointCounter)}
					<div class="selected" class:fill={$fatePoint === 2}>
						Course Set For: {selectedCourse}
					</div>
				{/if}
			</div>
		</div>
	{:else if list.type === 'standard'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="/assets/images/banner/standard.webp" alt="Standard Banner" />
		</div>
	{:else if list.type === 'limited'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img
				src="/assets/images/banner/{version}/{limitedBannerName}-{wishPhase}.webp"
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
	img,
	.weapon-banner {
		max-height: 100%;
		max-width: 100%;
	}
	.weapon-banner {
		position: relative;
	}

	:global(.mobile) .banner {
		padding: 0;
		width: 88%;
		max-width: 155vh;
		margin-bottom: -10px;
	}

	.selected {
		position: absolute;
		bottom: 0.3rem;
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
