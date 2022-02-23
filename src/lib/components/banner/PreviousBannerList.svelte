<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import OverlayScrollbars from 'overlayscrollbars';

	import { bannerPhase, patchVersion, pageActive, bannerActive } from '$lib/store/stores';
	import { localBannerVersion } from '$lib/store/localstore';
	import { getName } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';
	import { allPatch } from '$lib/setup/wish-setup.json';
	import { APP_TITLE } from '$lib/env';
	import browserState from '$lib/functions/browserState';

	let allBanners = [];
	let dataToShow = [];
	let showGroup = false;
	let groupby = 'version';

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
				weapons = { name: weapons.name, list: weapons.featured };
				return { patch, phase, chars: events.item, weapons };
			});
			return [patch.toString(), data];
		});
		allBanners = dataToShow = data.reverse();
		return data;
	};
	checkAllBanner();

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
</script>

<svelte:head>
	<title>All Banners | {APP_TITLE}</title>
</svelte:head>

<section>
	<header transition:fly={{ y: -20 }}>
		<h1>Previous Banner</h1>
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
				<div class="sort-selector">
					<div
						class="selected-filter"
						on:click|stopPropagation={() => {
							showGroup = !showGroup;
							playSfx();
						}}
					>
						Group / {groupby}

						{#if showGroup}
							<i class="gi-caret-up" />
						{:else}
							<i class="gi-caret-down" />
						{/if}
					</div>

					{#if showGroup}
						<div class="filter-list" transition:fade={{ duration: 200 }}>
							<a
								href="##"
								class:selected={groupby == 'version'}
								on:click|preventDefault={() => selectGroup('version', false)}
							>
								Version
							</a>
							<a
								href="##"
								class:selected={groupby == 'character'}
								on:click|preventDefault={() => selectGroup('character', false)}
							>
								Character
							</a>
							<a
								href="##"
								class:selected={groupby == 'weapon'}
								on:click|preventDefault={() => selectGroup('weapon', false)}
							>
								Weapon
							</a>
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
				{#each dataToShow as [group, data], x (x)}
					<div animate:flip={{ duration: (i) => 30 * Math.sqrt(i) }}>
						<div class="group-title">
							<h2>
								{groupby === 'version' ? `Version ${group}` : getName(group)}
								<i class="gi-primo-star" />
							</h2>
						</div>
						{#each data as { patch, phase, chars, weapons }, i (i)}
							<a
								in:fade
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
									{#if Array.isArray(chars)}
										<div class:dual={chars.length > 1}>
											{#each chars as { character, name }, i}
												<img
													src="/assets/images/banner/{patch}/{name}.webp"
													alt={getName(character)}
													style={chars.length > 1 ? '' : `width: 100%; height: 100%`}
												/>
											{/each}
										</div>
									{:else}
										<img
											src="/assets/images/banner/{patch}/{chars.name}.webp"
											alt={getName(chars.name)}
										/>
									{/if}
									<img
										src="/assets/images/banner/{patch}/{weapons.name}.webp"
										alt={getName(weapons.name)}
									/>
								</div>
								<h3 class="name">
									{#if Array.isArray(chars)}
										{getName(chars.map(({ character }) => character).join(', '))}
									{:else}
										{getName(chars.character)}
									{/if}
									&
									{getName(weapons.list.map(({ name }) => name).join(', '))}
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
		background-image: url('/assets/images/background/constellation.webp');
		background-size: cover;
		color: #d2c69c;
		font-size: 0.97rem;
	}
	h1 {
		color: #d2c69c;
	}
	h2 {
		font-size: 1.1rem;
		padding: 0.2rem 2rem 0.2rem 6rem;
		margin-left: -5rem;
		margin-top: 1rem;
		border-radius: 40px;
		background-color: #ede5d8;
		display: inline-block;
		position: relative;
		text-transform: capitalize;
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

	button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		padding: 0;
		line-height: 0;
		border-radius: 40px;
		transition: all 0.2s;
	}

	button:hover {
		background-color: var(--tertiary-color);
	}
	.close {
		border: 3.5px solid #abbcc6;
		margin-left: auto;
	}
	:global(.mobile) .close {
		width: 2rem;
		height: 2rem;
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

	.sort-selector {
		color: #3a4156;
		font-size: 1rem;
		margin: 0 0.5rem;
		display: inline-block;
		width: 200px;
		max-width: 35%;
		position: relative;
		text-transform: capitalize;
	}
	.selected-filter {
		background-color: #ede5d8;
		padding: 0.05rem 1rem;
		border-radius: 10px;
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
		background-color: #ede5d8;
		transform: translateY(100%);
		border-radius: 0.3rem;
		padding: 0.2rem 0;
		z-index: +1;
	}

	.filter-list a {
		padding: 0.2rem 1rem;
		text-decoration: none;
		color: #3a4156;
	}
	.filter-list a.selected {
		background-color: rgb(218, 202, 177);
	}

	.filter button {
		width: 2rem;
		height: 2rem;
		font-size: 1.2rem;
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
		max-width: 46%;
		margin: 0.5rem 0.5rem 1rem;
		text-align: center;
	}

	:global(.mobile) .item {
		width: 65vh;
	}

	.banner {
		display: flex;
		justify-content: space-between;
	}
	.item img {
		width: 49.5%;
		object-position: 88%;
	}
	.dual {
		width: 50%;
		display: flex;
	}

	.item .name {
		width: 100%;
		padding: 0.3rem;
		font-weight: 400;
		font-size: 0.97rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: capitalize;
	}
	@media screen and (max-width: 900px) {
		.close {
			width: 2.5rem;
			height: 2.5rem;
			margin: 3px;
		}
	}
</style>
