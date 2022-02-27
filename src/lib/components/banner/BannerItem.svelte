<script>
	import { fly, fade } from 'svelte/transition';
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
	import playSfx from '$lib/functions/audio';

	$: style =
		$viewportHeight > 800 ||
		$viewportHeight > $viewportWidth ||
		$viewportHeight / $viewportWidth > 0.5
			? 'bottom: unset; top: 50%; transform: translate(-50%, -50%);'
			: '';

	$: activeBanner = $bannerList[$bannerActive];

	const navigate = (target) => {
		playSfx('changebanner');
		if (target === 'next') {
			return bannerActive.update((n) => n + 1);
		}
		if (target === 'previous') {
			return bannerActive.update((n) => n - 1);
		}
	};
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
	<div class="navigate">
		{#if $bannerActive > 0}
			<button
				class="left"
				style="margin-right: auto;"
				on:click={() => navigate('previous')}
				transition:fade|local={{ duration: 200 }}
			>
				<i class="gi-arrow-left" />
			</button>
		{/if}

		{#if $bannerActive < $bannerList.length - 1}
			<button
				class="left"
				style="margin-left: auto;"
				on:click={() => navigate('next')}
				transition:fade|local={{ duration: 200 }}
			>
				<i class="gi-arrow-right" />
			</button>
		{/if}
	</div>
</div>

<style>
	.banner {
		padding: 30px 0;
		width: 80%;
		max-width: 850px;
		max-height: 75vh;
		display: flex;
		align-items: center;
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

	.navigate {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 115%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: space-between;
		transition: all 0.2s;
	}
	.navigate button {
		color: #dad4b4;
		font-size: 2rem;
		line-height: 0;
	}

	:global(.mobile) .navigate {
		display: none;
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
