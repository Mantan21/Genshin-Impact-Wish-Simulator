<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { flip } from 'svelte/animate';
	import OverlayScrollbars from 'overlayscrollbars';

	import {
		bannerPhase,
		patchVersion,
		pageActive,
		bannerActive,
		query,
		assets
	} from '$lib/store/stores';
	import { localBannerVersion } from '$lib/store/localstore';
	import { getName } from '$lib/helpers/nameText';
	import playSfx from '$lib/helpers/audio/audio';
	import { allPatch } from '$lib/data/wish-setup.json';
	import { APP_TITLE } from '$lib/env';
	import browserState from '$lib/helpers/browserState';

	let allBanners = [];
	let dataToShow = [];
	let showGroup = false;
	let groupby = 'version';

	let searchValue = $query || '';

	const sort = (arr) =>
		arr.sort((a, b) => {
			if (a[0] > b[0]) return 1;
			if (a[0] < b[0]) return -1;
			return 0;
		});

	const groupByChars = () => {
		const char = {};
		allBanners.forEach((data) => {
			data[1].forEach((dt) => {
				if (Array.isArray(dt.chars)) {
					dt.chars.forEach(({ character }) => {
						char[character] = [...(char[character] || []), dt];
					});
				} else {
					const { character } = dt.chars;
					char[character] = [...(char[character] || []), dt];
				}
			});
		});
		dataToShow = sort(Object.entries(char));
		return;
	};

	const groupByWeapon = () => {
		const weap = {};
		allBanners.forEach((data) => {
			data[1].forEach((wp) => {
				const { weapons } = wp;
				const weapon1 = weapons.list[0].name;
				const weapon2 = weapons.list[1].name;
				weap[weapon1] = [...(weap[weapon1] || []), wp];
				weap[weapon2] = [...(weap[weapon2] || []), wp];
			});
		});
		dataToShow = sort(Object.entries(weap));
		return;
	};

	const groupData = (group) => {
		if (group === 'version') {
			dataToShow = allBanners;
			return;
		}
		if (group === 'character') return groupByChars();
		if (group === 'weapon') return groupByWeapon();
	};

	const selectGroup = (group = null, value = null) => {
		playSfx();
		searchValue = '';
		showGroup = value !== null ? value : !showGroup;
		if (!group) return;
		groupby = group;
		groupData(group);
	};

	const reverse = () => {
		playSfx();
		dataToShow = dataToShow.reverse();
	};

	const checkAllBanner = async () => {
		const patchList = [];
		allPatch.forEach((patch) => {
			const json = import(`../../data/banners/events/${patch.toFixed(1)}.json`);
			patchList.push(json);
		});
		const promise = await Promise.all(patchList);
		const data = promise.map(({ data, patch }) => {
			patch = patch.toFixed(1);
			data = data.map(({ phase, banners }) => {
				let { events, weapons } = banners;
				return {
					rateup: [...events.rateup, ...weapons.rateup],
					weapons: { name: weapons.name, list: weapons.featured },
					chars: events.item,
					patch,
					phase
				};
			});
			return [patch.toString(), data];
		});
		allBanners = data.reverse();
		if (searchValue.trim().length > 0) return handleSearch();
		dataToShow = allBanners;
		return data;
	};
	checkAllBanner();

	const handleSearch = () => {
		groupby = 'version';
		const query = searchValue.trim().toLocaleLowerCase();
		if (query.length < 1) return (dataToShow = allBanners);
		const check = (t) => t.replace(/_/g, '').replace(/-/g, ' ').includes(query);
		const newArr = allBanners.map(([a, b]) => {
			const filtered = b.filter(({ chars, weapons, rateup }) => {
				// Check rateup
				const rateupChar = rateup.map((name) => check(name));
				if (rateupChar.includes(true)) return true;

				// Check Character
				if (Array.isArray(chars)) {
					const result = chars.map(({ character, name }) => check(character) || check(name));
					if (result.includes(true)) return true;
				} else {
					const result = check(chars.character) || check(chars.name);
					if (result) return true;
				}

				// Check Weapon
				const result = weapons.list.map(({ name }) => check(name));
				if (result.includes(true)) return true;
				return check(weapons.name);
			});

			return [a, filtered];
		});
		dataToShow = newArr.filter(([, b]) => b.length > 0);
	};

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

	const handleCLose = () => {
		browserState.back();
		playSfx('close');
		pageActive.set('index');
	};

	const handleCancelSelect = () => {
		showGroup = false;
	};

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});

	onDestroy(() => query.set(''));
</script>

<svelte:head>
	<title>{$t('wish.banner.allBanner')} | {$t('title', { default: APP_TITLE })}</title>
</svelte:head>

<section style="background-image: url({$assets['constellation.webp']});">
	<header transition:fly={{ y: -20 }}>
		<h1>{$t('wish.banner.previous')}</h1>
		<button class="close" on:click={handleCLose}>
			<i class="gi-close" />
		</button>
	</header>

	<div
		class="body"
		transition:fade={{ duration: 300 }}
		on:click|preventDefault={handleCancelSelect}
	>
		<div class="filter">
			<div class="row">
				<div class="search">
					<input
						type="text"
						name="q"
						id="q"
						placeholder={$t('wish.banner.findBanner')}
						bind:value={searchValue}
						on:input={handleSearch}
						title="Find by Character's or Weapon's Name (4star or 5star) or Banner Name"
					/>
					<button><i class="gi-search" /></button>
				</div>
				<div class="sort-selector">
					<div
						class="selected-filter"
						on:click|stopPropagation={() => {
							showGroup = !showGroup;
							playSfx();
						}}
					>
						{$t('wish.banner.group')} / {groupby === 'version' ? $t(`version`) : $t(groupby)}
						<i class="gi-caret-{showGroup ? 'up' : 'down'}" />
					</div>

					{#if showGroup}
						<div class="filter-list" transition:fade={{ duration: 200 }}>
							{#each ['version', 'character', 'weapon'] as val}
								<a
									href="/"
									class:selected={groupby == val}
									on:click|preventDefault={() => selectGroup(val, false)}
								>
									{$t(val)}
								</a>
							{/each}
						</div>
					{/if}
				</div>
				<button class="sort-button" title="Reverse Group" on:click={reverse}>
					<i class="gi-exchange" />
				</button>
			</div>
		</div>
		<div class="content" bind:this={content}>
			<div id="content">
				{#each dataToShow as [group, data], i (group)}
					<div
						animate:flip={{ duration: (i) => 30 * Math.sqrt(i) }}
						in:fade={{ duration: 300, delay: Math.sqrt(i * 20000) }}
					>
						<div class="group-title">
							<h2>
								{groupby === 'version'
									? `${$t('version')} ${group}`
									: groupby === 'weapon'
									? $t(group)
									: $t(`${group}.name`)}
								<i class="gi-primo-star" />
							</h2>
						</div>
						{#each data as { patch, phase, chars, weapons }, i (i)}
							<a
								in:fade={{ duration: 300, delay: Math.sqrt(i * 10000) }}
								href="/"
								class="item"
								on:click|preventDefault={() => selectBanner(patch, phase)}
								title="{Array.isArray(chars)
									? getName(chars.map(({ character }) => character).join(', '))
									: getName(chars.character)} & {getName(
									weapons.list.map(({ name }) => name).join(', ')
								)}"
							>
								<div class="banner">
									<div class:dual={Array.isArray(chars) && chars?.length > 1}>
										{#if Array.isArray(chars)}
											{#each chars as { character, name }, i}
												<img
													src="/images/banner/thumbnail/{name}.webp"
													alt={getName(character)}
													class="dual{i + 1}"
													loading="lazy"
													style={chars.length > 1 ? '' : `width: 100%; height: 100%`}
													on:error={(e) => e.target.remove()}
												/>
											{/each}
										{:else}
											<img
												src="/images/banner/thumbnail/{chars.name}.webp"
												alt={getName(chars.name)}
												loading="lazy"
												on:error={(e) => e.target.remove()}
											/>
										{/if}
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
									{#if Array.isArray(chars)}
										{chars.map(({ character }) => $t(`${character}.name`)).join(', ')}
									{:else}
										{$t(`${chars.character}.name`)}
									{/if}
									&
									{weapons.list.map(({ name }) => $t(name)).join(', ')}
								</h3>
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-size: cover;
		color: var(--tertiary-color);
		font-size: 0.97rem;
		position: relative;
		z-index: +1;
	}
	h1 {
		color: var(--tertiary-color);
	}
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

	header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 2%;
	}
	:global(.mobile) header {
		padding: 5px 2%;
	}

	button:hover {
		background-color: var(--tertiary-color);
	}

	.close {
		margin-left: auto;
	}
	:global(.mobile) .close {
		margin-right: 4.5%;
	}

	.body {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.filter {
		height: 3rem;
		width: 100%;
	}

	:global(.mobile) .filter {
		height: 2rem;
		margin-top: -0.5rem;
	}

	.filter .row {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 2%;
	}

	.search {
		position: relative;
	}
	.search input {
		background-color: var(--tertiary-color);
		border-radius: 2rem;
		padding: 0.3rem 2rem 0.3rem 1rem;
	}
	.search button {
		background-color: transparent;
		position: absolute;
		right: 0.3rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.sort-button {
		background-color: var(--tertiary-color);
		transform: rotate(90deg);
		border-radius: 100%;
	}
	.sort-selector,
	.search input {
		width: 13rem;
		font-size: 0.75rem;
	}
	.sort-selector {
		color: #3a4156;
		margin: 0 0.5rem;
		display: inline-block;
		position: relative;
	}
	.selected-filter {
		background-color: var(--tertiary-color);
		padding: 0.3rem 1rem;
		border-radius: 10rem;
	}
	.selected-filter i {
		display: inline-block;
		position: absolute;
		right: 1rem;
	}

	.filter-list {
		position: absolute;
		bottom: -30%;
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: var(--tertiary-color);
		transform: translateY(100%);
		border-radius: 0.3rem;
		padding: 0.2rem 0;
		z-index: +1;
	}

	.filter-list a {
		padding: 0.7rem 1rem;
		text-decoration: none;
		color: #3a4156;
		transition: all 0.2s;
	}
	.filter-list a.selected,
	.filter-list a:hover {
		background-color: rgb(231, 219, 199);
	}

	.filter button {
		width: 1.7rem;
		height: 1.7rem;
		font-size: 1rem;
	}

	.gi-exchange {
		transform: rotate(90deg);
	}

	.content {
		padding: 1rem 2%;
		width: 100%;
		height: 100%;
		display: block;
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

	.dual1 {
		object-position: 60%;
		width: 40% !important;
		aspect-ratio: 81.1/99.35;
		margin-right: auto;
	}
	.dual2 {
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
