<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import {
		bannerActive,
		bannerList,
		bannerPhase,
		pageActive,
		patchVersion
	} from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import browserState from '$lib/functions/browserState';
	import { beginner } from '$lib/data/banners/beginner.json';
	import { get4StarChars, getAllChars, getAllWeapons } from '$lib/functions/wish/wishBase';
	import { getName } from '$lib/functions/nameText';
	import Description from './Description.svelte';
	import Ads from '../utility/Iklan.svelte';

	$: banner = $bannerList[$bannerActive].type;

	let items = [];
	let drop3star = [];
	let drop4star = [];
	let drop5star = [];

	let bannerTitle;
	let featured = [];

	const Data = {
		async get(patch, phase, bannerType) {
			const { data } = await import(`../../data/banners/events/${patch}.json`);
			const { standardVersion, weapons, events } = data.find((d) => d.phase === phase).banners;
			const { standard } = await import(`../../data/banners/standard/${standardVersion}.json`);

			drop3star = getAllWeapons(3).map(({ name, type }) => ({ name, type }));
			this._stdDropChar5 = standard.characters.map((name) => ({ name, type: 'character' }));
			drop4star = [...getAllChars(4), ...getAllWeapons(4)].filter(({ limited }) => !limited);

			this._std = ['amber', 'kaeya', 'lisa'];
			this._events = events;
			this._weapons = weapons;
			this._standard = standard;
			this._bannerType = bannerType;
			this._phase = phase;
			this._patch = patch;

			if (bannerType === 'beginner') return this._showBeginner();
			if (bannerType === 'standard') return this._showStandard();
			if (bannerType === 'events') return this._showEvents();
			if (bannerType === 'weapons') return this._showWeapons();
		},

		_showBeginner() {
			const { name, title, vision } = get4StarChars.find(({ name }) => {
				return name === beginner.character;
			});
			const obj = {
				rarity: 4,
				items: [{ name, title, vision }]
			};

			items = [obj];
			bannerTitle = $t('wish.banner.beginner');

			drop5star = this._stdDropChar5;
			drop4star = drop4star
				.map(({ type, name }) => ({ name, type }))
				.filter(({ name }) => !this._std.includes(name));
		},

		_showStandard() {
			const weapon5 = getAllWeapons(5).filter(({ limited }) => !limited);
			drop5star = [...this._stdDropChar5, ...weapon5];
			bannerTitle = $t('wish.banner.name.wanderlust');

			drop4star = drop4star
				.filter(({ release }) => {
					if (!release) return true;
					const [v, phs] = release.split('-');
					if (parseFloat(this._patch) < parseFloat(v)) return false;
					if (parseFloat(this._patch) === parseFloat(v) && this._phase <= parseInt(phs)) {
						return false;
					}
					return true;
				})
				.filter(({ limited }) => !limited)
				.map(({ type, name }) => ({ name, type }));
		},

		_showEvents() {
			const { character } = $bannerList[$bannerActive];
			drop5star = this._stdDropChar5;
			drop5star.unshift({ name: character.character, type: 'character', rateup: true });
			bannerTitle = $t(`wish.banner.name.${character.name.slice(0, -2)}`);

			const { name, vision, title } = getAllChars(5).find(({ name }) => {
				return name === character.character;
			});

			const rateUpchar = get4StarChars
				.filter(({ name }) => this._events.rateup.includes(name))
				.map(({ name, vision, title }) => ({ name, vision, title }));

			items = [
				{ rarity: 5, items: [{ name, title, vision }] },
				{ rarity: 4, items: rateUpchar }
			];
			featured = items[0].items;

			drop4star = drop4star
				.filter(({ name }) => !this._events.rateup.includes(name))
				.filter(({ name }) => !this._std.includes(name));
			const rateupDrop = rateUpchar.map(({ name }) => ({ name, type: 'character', rateup: true }));
			drop4star.unshift(...rateupDrop);
		},

		_showWeapons() {
			const weapon5 = this._weapons.featured.map(({ name, type }) => ({ name, type }));
			const weapons4 = getAllWeapons(4)
				.filter(({ name }) => this._weapons.rateup.includes(name))
				.map(({ name, weaponType }) => ({ name, type: weaponType }));

			bannerTitle = $t(`wish.banner.name.epitome-invocation`);

			items = [
				{ rarity: 5, items: weapon5 },
				{ rarity: 4, items: weapons4 }
			];

			drop5star = getAllWeapons(5)
				.filter(({ name, limited }) => {
					return !limited && !weapon5.map(({ name }) => name).includes(name);
				})
				.map(({ name }) => ({ name, type: 'weapon' }));
			drop5star.unshift(...weapon5.map(({ name }) => ({ name, type: 'weapon', rateup: true })));

			drop4star = drop4star
				.filter(({ name }) => !this._events.rateup.includes(name))
				.filter(({ name }) => !this._std.includes(name));
			const rateupDrop = weapons4.map(({ name }) => ({ name, type: 'weapon', rateup: true }));
			drop4star.unshift(...rateupDrop);
		}
	};

	const handleCLose = () => {
		browserState.back();
		pageActive.set('index');
		playSfx('close');
	};

	let content;
	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});

	const highlightBannerName = (bannerName, vision = '') => {
		const splited = bannerName.split(' ');
		return `<span class=${vision}> ${splited[0]} </span> ${splited.slice(1).join(' ')}`;
	};
</script>

<section bind:this={content} transition:fade={{ duration: 200 }}>
	<div class="header">
		<button on:click={handleCLose}>
			<i class="gi-reply" />
		</button>
	</div>

	<div class="content-details wish-result">
		{#await Data.get($patchVersion, $bannerPhase, banner)}
			<div class="content-details">{$t('waiting')}...</div>
		{:then data}
			{#if banner === 'standard'}
				<h1 class="standard">
					{$t('wish.banner.standard')} "{@html highlightBannerName(
						$t('wish.banner.name.wanderlust')
					)}"
				</h1>
			{:else}
				<h1 class={banner}>
					{#if banner != 'beginner'}
						{$t(`wish.banner.${banner}`)}
					{/if}
					"{@html highlightBannerName(bannerTitle, featured[0]?.vision)}"
				</h1>
			{/if}

			{#if ['events', 'weapons'].includes(banner)}
				<h2><span> {$t('details.increasedRate')} </span> <span class="line" /></h2>

				<h3 class="star5">
					<div class="star">
						{#each Array(5) as i} <i class="gi-star" /> {/each}
					</div>
					<span>
						{$t('details.percentageDrop', { values: { rarity: 5, percentage: '50.000%' } })}
					</span>
				</h3>

				{#if banner === 'events'}
					<div class="character-card star5">
						<picture>
							<i class="gi-{featured[0].vision}" />
							<img
								src="/images/characters/face/{featured[0].name}.webp"
								alt={getName(featured[0].name)}
							/>
						</picture>
						<caption class="name">{$t(`${featured[0].name}.name`)}</caption>
						<i class="gi-{featured[0].vision} element" />
					</div>
				{:else}
					{#each items[0].items as { name, type }}
						<div class="character-card star5 weapons">
							<picture>
								<img
									src="/images/weapons/{type}/5star/{name}.webp"
									alt={getName(name)}
									class={type}
								/>
							</picture>
							<caption class="name">{$t(name)}</caption>
						</div>
					{/each}
				{/if}

				<div style="margin-top: 1rem;" />
				<h3 class="star4">
					<div class="star">
						{#each Array(4) as i} <i class="gi-star" /> {/each}
					</div>
					<i class="gi-star" style="color: transparent;" />
					<span>
						{$t('details.percentageDrop', { values: { rarity: 4, percentage: '50.000%' } })}
					</span>
				</h3>

				{#if banner === 'events'}
					{#each items[1].items as { name, vision }}
						<div class="character-card star4">
							<picture>
								<i class="gi-{vision}" />
								<img src="/images/characters/face/{name}.webp" alt={getName(name)} />
							</picture>
							<caption class="name">{$t(`${name}.name`)}</caption>
							<i class="gi-{vision} element" />
						</div>
					{/each}
				{:else}
					{#each items[1].items as { name, type }}
						<div class="character-card star4">
							<picture>
								<img
									src="/images/weapons/{type}/4star/{name}.webp"
									alt={getName(name)}
									class={type}
								/>
							</picture>
							<caption class="name">{$t(name)}</caption>
						</div>
					{/each}
				{/if}
			{/if}
			<h2><span>{$t('details.wishDetails')} </span> <span class="line" /></h2>

			<Description bannerType={banner} data={items} bannerName={bannerTitle} />

			<br />
			<h4>{$t('details.itemWishFor')}</h4>
			<br />
			<h3 class="star5">
				<div class="star">
					{#each Array(5) as i} <i class="gi-star" /> {/each}
				</div>
				<span>
					{$t('details.probInfo', {
						values: { singlePercentage: '0.600%', avgPercentage: '1.600%', rarity: 5 }
					})}
				</span>
			</h3>
			<div class="table">
				<div>
					<div class="row head">
						<div class="cell">{$t('details.itemType')}</div>
						<div class="cell">{$t('details.itemName')}</div>
						<div class="cell">{$t('details.itemType')}</div>
						<div class="cell">{$t('details.itemName')}</div>
					</div>

					<div class="body">
						<div class="row">
							{#each drop5star as { name, type, rateup }}
								<div class="cell">
									{$t(type)}
								</div>
								<div class="cell">
									{type === 'weapon' ? $t(name) : $t(`${name}.name`)}
									{#if rateup} <i class="gi-arrow-up" />{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<h3 class="star4">
				<div class="star">
					{#each Array(5) as z, i}
						<i class="gi-star" style={i > 3 ? 'color: transparent' : ''} />
					{/each}
				</div>
				<span>
					{$t('details.probInfo', {
						values: { singlePercentage: '5.100%', avgPercentage: '13.000%', rarity: 4 }
					})}
				</span>
			</h3>
			<div class="table">
				<div>
					<div class="row head">
						<div class="cell">{$t('details.itemType')}</div>
						<div class="cell">{$t('details.itemName')}</div>
						<div class="cell">{$t('details.itemType')}</div>
						<div class="cell">{$t('details.itemName')}</div>
					</div>

					<div class="body">
						<div class="row">
							{#each drop4star as { name, type, rateup }}
								<div class="cell">
									{$t(type)}
								</div>
								<div class="cell">
									{type === 'weapon' ? $t(name) : $t(`${name}.name`)}
									{#if rateup} <i class="gi-arrow-up" />{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<Ads type="banner" />

			<h3 class="star3">
				<div class="star">
					{#each Array(5) as x, i}
						<i class="gi-star" style={i > 2 ? 'color: transparent' : ''} />
					{/each}
				</div>
				<span>
					{$t('details.probInfo', {
						values: { singlePercentage: '94.300%', avgPercentage: '85.400%', rarity: 4 }
					})}
				</span>
			</h3>
			<div class="table">
				<div>
					<div class="row head">
						<div class="cell">{$t('details.itemType')}</div>
						<div class="cell">{$t('details.itemName')}</div>
						<div class="cell">{$t('details.itemType')}</div>
						<div class="cell">{$t('details.itemName')}</div>
					</div>

					<div class="body">
						<div class="row">
							{#each drop3star as { name, type }}
								<div class="cell">
									{$t(type)}
								</div>
								<div class="cell">
									{type === 'weapon' ? $t(name) : $t(`${name}.name`)}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/await}
	</div>
</section>

<style>
	h1.weapons :global(span) {
		color: #ef7c1aff;
	}
	.beginner :global(span) {
		color: #cba885;
	}

	h1.standard :global(span) {
		color: #757acdff;
	}

	span {
		color: #cf5e47;
	}

	h1 :global(span.starglitter) {
		color: #c37b4d;
	}
	h1 :global(span.stardust) {
		color: #a256e1;
	}

	h1 :global(span.hydro) {
		color: #06bbff;
	}
	h1 :global(span.geo) {
		color: #f9aa02;
	}
	h1 :global(span.pyro) {
		color: #fe6606;
	}
	h1 :global(span.anemo) {
		color: #369396;
	}
	h1 :global(span.electro),
	.standard :global(span) {
		color: #ca82fc;
	}
	h1 :global(span.cryo) {
		color: #4682b4;
	}

	.gi-arrow-up {
		font-size: 1.2rem;
		vertical-align: middle;
		line-height: 0;
		color: #51be51;
	}

	section {
		background-color: #ebebeb;
		width: 100%;
		height: 100%;
		color: var(--text-color);
		padding-top: 2rem;
	}

	.header {
		display: block;
		background-color: rgb(20, 18, 15);
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: +10;
	}

	.gi-reply {
		color: #dbd7d3;
		font-size: 2.2rem;
		line-height: 0;
		padding: 0.3rem 1rem;
		display: inline-block;
	}

	.content-details {
		padding: 2rem 10% 1rem;
		width: 100%;
		overflow-x: hidden;
	}

	@media screen and (max-width: 780px) {
		.content-details {
			padding: 1.5rem 5% 0.5rem;
		}
	}

	.gi-star {
		color: #feca33;
	}

	h2,
	h3 {
		vertical-align: middle;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	h1 {
		font-size: 1.7rem;
		text-align: left;
		background-color: #dadada;
		padding: 0.5rem 5%;
		display: block;
		position: relative;
	}
	:global(.mobile) h1 {
		font-size: 1.3rem;
	}

	h1::before {
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

	h2 {
		font-size: 1.5rem;
		font-weight: 500;
		padding: 1rem 0;
		margin: 1.5rem 0 0.5rem;
		display: flex;
	}
	:global(.mobile) h2 {
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}

	h2 span:not(.line) {
		color: var(--text-color);
		width: fit-content;
		white-space: nowrap;
		padding-right: 1rem;
	}

	h2 span.line {
		width: 100%;
		position: relative;
	}

	h2 span.line::after {
		content: '';
		display: block;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		height: 0.1rem;
		background-color: #d1cfcc;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		color: #fff;
		background-color: #a28052;
		display: flex;
		align-items: center;
	}
	h3 span {
		padding-left: 2rem;
		color: var(--text-color);
	}
	h3.star5 {
		background-color: #dbbba4;
	}
	h3.star4 {
		background-color: #b7abbf;
	}
	h3.star3 {
		background-color: #a5bacc;
	}
	h4 {
		color: #a28052;
		font-weight: 500;
		font-size: larger;
	}

	.character-card {
		background-color: #4d4d4d;
		width: 30%;
		min-width: 250px;
		max-width: 320px;
		aspect-ratio: 320/120;
		margin: 1rem 0.5rem 0 0.5rem;
		position: relative;
		padding: 1rem;
		display: inline-flex;
	}
	.character-card::after {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 0.1rem solid #6d6a63;
		width: calc(100% - 0.8rem);
		height: calc(100% - 0.8rem);
	}

	:global(.mobile) .character-card {
		min-width: unset;
	}

	picture {
		height: 100%;
		display: inline-block;
		aspect-ratio: 1/1;
		background-size: cover;
		position: relative;
		overflow: hidden;
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

	.star5 picture {
		background-image: url('/images/utility/5star-bg.webp');
	}
	.star4 picture {
		background-image: url('/images/utility/4star-bg.webp');
	}

	picture i {
		position: absolute;
		z-index: +1;
		top: 0;
		left: 0;
		font-size: 1.3rem;
	}

	caption {
		color: #fff;
		padding: 0.5rem 1rem;
		position: relative;
		display: inline-flex;
		align-items: flex-start;
		justify-content: stretch;
		text-align: left;
	}

	caption::after {
		content: '';
		display: block;
		right: 0;
		width: calc(100% - 1rem);
		height: 0.1rem;
		top: 70%;
		position: absolute;
		background-color: #fff;
	}

	@media screen and (max-width: 600px) {
		.character-card {
			min-width: calc(50% - 1rem);
		}
	}

	.element {
		background-image: linear-gradient(#fff, #fff);
		opacity: 0.07;
		font-size: 7em;
		display: inline-block;
		position: absolute;
		right: 0;
		bottom: 0;
		transform: translate(25%, 35%);
	}

	.table {
		padding: 1rem 0 2rem;
		width: 100%;
		font-size: 0.9rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		border: 0.2px solid #b5b2ae;
	}
	.row.head {
		background-color: #dbd7d3;
	}
	.body .row {
		border-top: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.cell:nth-child(odd) {
		width: calc(3 / 14 * 100%);
	}
	.cell:nth-child(even) {
		width: calc(4 / 14 * 100%);
	}

	.cell.fluid {
		width: 100%;
	}

	.cell {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0.5rem;
		height: 100%;
		text-align: center;
		line-height: 1.2rem;
		height: 3.2rem;
	}
	.head .cell {
		border: solid #b5b2ae;
		border-width: 0 0.07rem;
	}
	.body .cell {
		border: solid #b5b2ae;
		border-width: 0 0.07rem 0.07rem 0;
		color: #a7865a;
	}
</style>
