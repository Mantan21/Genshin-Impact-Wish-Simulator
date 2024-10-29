<script>
	import { t } from 'svelte-i18n';
	import { assets, customData, isCustomBanner } from '$lib/store/app-stores';
	import { getName } from '$lib/helpers/nameText';
	import { lazyLoad } from '$lib/helpers/lazyload';
	import Iklan from '$lib/components/Iklan.svelte';

	export let chronicledList = [];
	export let data = {};
	let { weapons = [], character = {}, bannerType = null, rateup = [] } = data;
	const isWP = bannerType === 'weapon-event';
	const bg = $isCustomBanner ? $assets['5star-special.webp'] : $assets['5star-bg.webp'];
</script>

{#if bannerType.match('event')}
	<h2><span> {$t('details.increasedRate')} </span></h2>

	<h3 class="star5">
		<div class="star">
			{#each Array(5) as i} <i class="gi-star" /> {/each}
		</div>
		<span>
			{$t('details.percentageDrop', {
				values: { rarity: 5, percentage: isWP ? '75.000%' : '50.000%' }
			})}
		</span>
	</h3>

	<div class="row">
		{#if !isWP}
			<div class="name">
				<span class="{character.vision}-flat">
					{$isCustomBanner ? character.name : $t(`${character.name}.name`)}
				</span>
			</div>
			<div class="pic">
				<div class="pic-item">
					<picture class="star5" style="background-image:url('{bg}');">
						<i class="gi-{character.vision} {character.vision} icon-gradient filter-drop" />

						{#if $isCustomBanner}
							{@const { images = {}, name = '' } = $customData || {}}
							<img
								use:lazyLoad={images?.faceURL}
								data-placeholder={$assets['face-placeholder.webp']}
								alt={name}
							/>
						{:else}
							<img
								use:lazyLoad={$assets[`face/${character.name}`]}
								alt={getName(character.name)}
								crossorigin="anonymous"
							/>
						{/if}
					</picture>
					<span class="stars">
						{#each Array(5) as i}
							<i class="gi-star" />
						{/each}
					</span>
					<caption>Lv.1</caption>
				</div>
			</div>

			<!-- Weapon -->
		{:else}
			<div class="name">
				{#each weapons as { name }}
					<span class="weapon-flat">{$t(name)}</span>
				{/each}
			</div>
			<div class="pic">
				{#each weapons as { name, type }}
					<div class="pic-item">
						<picture class="star5" style="background-image:url('{$assets['5star-bg.webp']}')">
							<img
								use:lazyLoad={$assets[name]}
								alt={getName(name)}
								class={type}
								crossorigin="anonymous"
							/>
						</picture>
						<span class="stars">
							{#each Array(5) as i}
								<i class="gi-star" />
							{/each}
						</span>
						<caption>Lv.1</caption>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<Iklan type="banner" />

	<!-- 4 Star Item -->
	<h3 class="star4">
		<div class="star">
			{#each Array(4) as i} <i class="gi-star" /> {/each}
		</div>
		<i class="gi-star" style="color: transparent;" />
		<span>
			{$t('details.percentageDrop', {
				values: { rarity: 4, percentage: isWP ? '75.000%' : '50.000%' }
			})}
		</span>
	</h3>

	<div class="row">
		<div class="name">
			{#each rateup as { name, vision }}
				<span class="{vision || 'wanderlust'}-flat">{$t(`${name}${!isWP ? '.name' : ''}`)}</span>
			{/each}
		</div>

		<div class="pic">
			{#if !isWP}
				{#each rateup as { name, vision }}
					<div class="pic-item">
						<picture class="star4" style="background-image:url('{$assets['4star-bg.webp']}')">
							<i class="gi-{vision} {vision} icon-gradient filter-drop" />
							<img
								use:lazyLoad={$assets[`face/${name}`]}
								alt={getName(name)}
								crossorigin="anonymous"
							/>
						</picture>
						<span class="stars">
							{#each Array(4) as i}
								<i class="gi-star" />
							{/each}
						</span>
						<caption>Lv.1</caption>
					</div>
				{/each}
			{:else}
				{#each rateup as { name, type }}
					<div class="pic-item">
						<picture class="star4" style="background-image:url('{$assets['4star-bg.webp']}')">
							<img
								use:lazyLoad={$assets[name]}
								alt={getName(name)}
								class={type}
								crossorigin="anonymous"
							/>
						</picture>
						<span class="stars">
							{#each Array(4) as i}
								<i class="gi-star" />
							{/each}
						</span>
						<caption>Lv.1</caption>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Chronicled banner -->
{:else if bannerType.match('chronicled')}
	<h2>
		{$t('details.chronicledCourse')} <strong class="weapon-flat">50.000%</strong>
	</h2>

	<h3 class="star5">
		<div class="star">
			{#each Array(5) as i} <i class="gi-star" /> {/each}
		</div>
		<span> {$t('details.chronicledPeriod')} </span>
	</h3>

	<div class="row">
		<div class="name">
			{#each chronicledList as { name, vision, type }}
				<span class="{vision || 'weapon'}-flat">
					{type === 'weapon' ? $t(name) : $t(`${name}.name`)}
				</span>
			{/each}
		</div>

		<div class="pic">
			{#each chronicledList as { name, vision, type }}
				<div class="pic-item">
					<picture class="star5" style="background-image:url('{bg}');">
						<i class="gi-{vision} {vision} icon-gradient filter-drop" />
						<img
							use:lazyLoad={type === 'weapon' ? $assets[name] : $assets[`face/${name}`]}
							alt={$t(`${name}.name`)}
							crossorigin="anonymous"
						/>
					</picture>
					<span class="stars">
						{#each Array(5) as i}
							<i class="gi-star" />
						{/each}
					</span>
					<caption>Lv.1</caption>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.beginner :global(span) {
		color: #cba885;
	}

	.gi-star {
		color: #feca33;
	}

	h2 {
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		font-size: calc(0.014 * var(--content-width));
		color: #fff;
		display: flex;
		align-items: center;
		line-height: 0;
		padding: 0.5% 1%;
	}
	h3 span {
		padding-left: 2rem;
		color: #fff;
	}
	h3.star5 {
		background-color: #cfb383;
	}
	h3.star4 {
		background-color: #b5a8c9;
	}
	.weapon-flat {
		color: #bd6932;
	}

	.row {
		display: flex;
		width: 100%;
	}
	.name {
		flex-basis: 35%;
		padding: 1.5%;
	}
	.name span {
		font-size: calc(0.014 * var(--content-width));
		display: block;
		padding: 2% 0;
	}
	.pic {
		flex-basis: 65%;
		padding-bottom: 1%;
	}

	.pic-item {
		margin: 2% 1.5% 0 0;
		padding-bottom: 4%;
		display: inline-block;
		position: relative;
		background-color: #fff;
		border-radius: 4%;
		overflow: hidden;
	}

	picture {
		height: calc(0.095 * var(--content-width));
		display: block;
		aspect-ratio: 1/1;
		background-size: cover;
		position: relative;
		overflow: hidden;
		border-bottom-right-radius: 20%;
	}

	img {
		width: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}

	img.claymore {
		transform: rotate(18deg) scale(1.15) translateX(-0.7em);
	}

	img.bow {
		transform: rotate(10deg) scale(1.25) translate(-0.5em, 0em);
	}

	img.polearm {
		transform: rotate(10deg) scale(1.5) translate(-12%, 12%);
		height: 200%;
	}

	img.sword {
		transform: rotate(10deg) scale(1.2) translateY(-1em) translate(-0.2em, 0.5em);
	}

	.stars {
		position: absolute;
		bottom: 10%;
		left: 50%;
		font-size: calc(0.015 * var(--content-width));
		transform: translateX(-50%);
	}

	picture i {
		position: absolute;
		z-index: +1;
		top: 0;
		left: 0;
		font-size: 1.3rem;
	}

	caption {
		font-size: calc(0.013 * var(--content-width));
		display: block;
		width: 100%;
		text-align: center;
		position: absolute;
		padding: 3%;
	}
</style>
