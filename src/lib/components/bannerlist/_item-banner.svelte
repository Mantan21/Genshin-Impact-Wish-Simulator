<script>
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { getName } from '$lib/helpers/nameText';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import browserState from '$lib/helpers/browserState';
	import { localBannerVersion } from '$lib/store/localstore';
	import { bannerPhase, patchVersion, pageActive, bannerActive } from '$lib/store/stores';

	export let groupby = 'version';
	export let groupName;
	export let data;

	const selectBanner = (patch, phase) => {
		playSfx();
		browserState.back();
		// If select the same banner with the active one, change nothing just back to index
		if ($bannerPhase === phase && $patchVersion === patch) return pageActive.set('index');

		// Select a banner
		bannerActive.set(0);
		patchVersion.set(patch);
		bannerPhase.set(phase);
		localBannerVersion.set(patch, phase);
	};
</script>

<div class="group-title">
	<h2>
		{groupby === 'version'
			? `${$t('version')} ${groupName}`
			: groupby === 'weapon'
			? $t(groupName)
			: $t(`${groupName}.name`)}
		<i class="gi-primo-star" />
	</h2>
</div>

{#each data as { patch, phase, chars, weapons }, i (i)}
	<a
		in:fade={{ duration: 300, delay: Math.sqrt(i * 10000) }}
		href="/"
		class="item"
		on:click|preventDefault={() => selectBanner(patch, phase)}
		title={getName(chars.map(({ character }) => character).join(', '))}
	>
		<div class="banner">
			<div class:dual={chars?.length > 1}>
				{#each chars as { character, name }, i}
					<img
						src="/images/banner/thumbnail/{name}.webp"
						alt={getName(character)}
						class="dual{i + 1}"
						loading="lazy"
						style={chars.length > 1 ? '' : `width: 100%; height: 100%`}
						on:error={(e) => e.target.remove()}
						crossorigin="anonymous"
					/>
				{/each}
			</div>
			<div>
				<img
					src="/images/banner/thumbnail/{weapons.name}.webp"
					alt={getName(weapons.name)}
					loading="lazy"
					on:error={(e) => e.target.remove()}
				/>
			</div>
		</div>
		<h3 class="name">
			{chars.map(({ character }) => $t(`${character}.name`)).join(', ')}
			&
			{weapons.list.map(({ name }) => $t(name)).join(', ')}
		</h3>
	</a>
{/each}

<style>
	h2 {
		font-size: 1.1rem;
		padding: 0.2rem 2rem 0.2rem 6rem;
		margin-left: -5rem;
		margin-top: 1rem;
		border-radius: 40px;
		background-color: var(--tertiary-color);
		display: inline-block;
		position: relative;
		color: #383b40;
	}

	h2 .gi-primo-star {
		color: #ede5d8;
		position: absolute;
		right: 0;
		top: 50%;
		line-height: 0;
		transform: translate(80%, -50%);
	}

	.item {
		display: inline-flex;
		flex-direction: column;
		width: 60vh;
		max-width: 460px;
		margin: 0.5rem 0.5rem 1rem;
		text-align: center;
	}

	@media screen and (max-width: 1000px) {
		.item {
			width: 46%;
			min-width: 125px;
		}
	}

	:global(.mobile) .item {
		width: 65vh;
	}

	.banner {
		display: flex;
		justify-content: space-between;
	}
	.banner > div {
		width: 49.5%;
		height: 100%;
		aspect-ratio: 200/99;
		background-image: linear-gradient(90deg, #fbf6ee 30%, #ccc, #fbf6ee);
		background-size: 400%;
		display: flex;
		animation: infinite alternate 2s skeleton;
	}

	@keyframes skeleton {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 300% 0;
		}
	}

	.banner > div:not(.dual) img {
		width: 100%;
	}

	.dual .dual1 {
		object-position: 60%;
		width: 40% !important;
		aspect-ratio: 81.1/99.35;
		margin-right: auto;
	}
	.dual .dual2 {
		margin-left: auto;
		object-position: 100%;
		width: 60% !important;
		aspect-ratio: 121.65/99.35;
	}

	.item .name {
		width: 100%;
		padding: 0.3rem;
		font-weight: 400;
		font-size: 0.97rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
