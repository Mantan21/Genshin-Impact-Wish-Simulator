<script>
	import { fly, fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import {
		bannerActive,
		viewportHeight,
		viewportWidth,
		patchVersion,
		bannerList,
		fatePoint,
		selectedCourse,
		pageActive,
		mobileMode
	} from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import browserState from '$lib/functions/browserState';

	$: mobileBannerStyle = $mobileMode ? `max-width: ${(150 / 100) * $viewportHeight}px;` : '';
	$: style =
		$viewportHeight > 800 ||
		$viewportHeight > $viewportWidth ||
		$viewportHeight / $viewportWidth > 0.5
			? 'bottom: unset; top: 50%; transform: translate(-50%, -50%);' + mobileBannerStyle
			: mobileBannerStyle;

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

	const openDetails = () => {
		pageActive.set('details');
		browserState.set('details');
		return playSfx();
	};
</script>

<div class="banner" {style}>
	{#if activeBanner.type === 'beginner'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<div class="banner-content">
				<img src="/assets/images/banner/beginner.webp" alt="Beginner Banner" />
				<button class="detail" on:click={openDetails}> {$t('details.text')} </button>
			</div>
		</div>
	{:else if activeBanner.type === 'weapons'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<div class="banner-content">
				<img
					src="/assets/images/banner/{$patchVersion}/{activeBanner.weapons.name}.webp"
					alt="Weapon Banner"
				/>

				{#if $selectedCourse.name}
					<div class="selected" class:fill={$fatePoint === 2}>
						{$t('wish.banner.courseSetFor', {
							values: { selectedCourse: $t(`weapon.${$selectedCourse.name}`) }
						})}
					</div>
				{/if}
				<button class="detail" on:click={openDetails}> {$t('details.text')} </button>
			</div>
		</div>
	{:else if activeBanner.type === 'standard'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<div class="banner-content">
				<img
					src="/assets/images/banner/standard/{activeBanner.character.name}.webp"
					alt="Standard Banner"
				/>
				<button class="detail" on:click={openDetails}> {$t('details.text')} </button>
			</div>
		</div>
	{:else if activeBanner.type === 'events'}
		<div in:fly={{ x: 50, duration: 1000 }}>
			<div class="banner-content">
				<img
					src="/assets/images/banner/{$patchVersion}/{activeBanner.character.name}.webp"
					alt="Character Events Banner"
				/>
				<button class="detail" on:click={openDetails}> {$t('details.text')} </button>
			</div>
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
	.banner-content {
		max-height: 100%;
		max-width: 100%;
	}
	.banner-content {
		position: relative;
	}

	:global(.mobile) .banner {
		padding: 0;
		width: 88%;
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
	.detail {
		position: absolute;
		left: 5%;
		bottom: 13%;
		background-color: #eee8e3;
		color: rgba(0, 0, 0, 0.5);
		padding: 0.2rem 1.5rem;
		border-radius: 20px;
		border: #e2d7b6 0.1rem solid;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.detail:hover {
		background-color: #e2d7b6;
		color: rgba(0, 0, 0, 1);
	}
</style>
