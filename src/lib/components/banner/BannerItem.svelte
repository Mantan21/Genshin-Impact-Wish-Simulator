<script>
	import { fly } from 'svelte/transition';
	import {
		bannerActive,
		viewportHeight,
		viewportWidth,
		patchVersion,
		bannerList,
		fatePoint,
		selectedCourse
	} from '$lib/store/stores';
	import { getName } from '$lib/functions/nameText';

	$: style =
		$viewportHeight > 800 ||
		$viewportHeight > $viewportWidth ||
		$viewportHeight / $viewportWidth > 0.5
			? 'bottom: unset; top: 50%; transform: translate(-50%, -50%);'
			: '';

	$: activeBanner = $bannerList[$bannerActive];
</script>

<div class="banner" {style}>
	{#if activeBanner.type === 'beginner'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img src="/assets/images/banner/beginner.webp" alt="Beginner Banner" />
		</div>
	{:else if activeBanner.type === 'weapons'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<div class="weapon-banner">
				<img
					src="/assets/images/banner/{$patchVersion}/{activeBanner.weapons.name}.webp"
					alt="Weapon Banner"
				/>

				{#if $selectedCourse.name}
					<div class="selected" class:fill={$fatePoint === 2}>
						Course Set For: {getName($selectedCourse.name)}
					</div>
				{/if}
			</div>
		</div>
	{:else if activeBanner.type === 'standard'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img
				src="/assets/images/banner/standard/{activeBanner.character.name}.webp"
				alt="Standard Banner"
			/>
		</div>
	{:else if activeBanner.type === 'events'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<img
				src="/assets/images/banner/{$patchVersion}/{activeBanner.character.name}.webp"
				alt="Character Events Banner"
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
		max-height: 75vh;
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
		max-height: unset;
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
