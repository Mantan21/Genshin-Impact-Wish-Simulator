<script>
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import {
		assets,
		bannerActive,
		bannerList,
		bannerPhase,
		pageActive,
		patchVersion
	} from '$lib/store/stores';
	import playSfx from '$lib/helpers/audio';
	import browserState from '$lib/helpers/browserState';
	import { beginner } from '$lib/data/banners/beginner.json';
	import { get4StarChars, getAllChars, getAllWeapons } from '$lib/helpers/wish/wishBase';
	import Details from './_details.svelte';
	import { setContext } from 'svelte';
	import { localConfig } from '$lib/store/localstore';

	$: banner = $bannerList[$bannerActive].type;

	let items = [];
	let drop3star = [];
	let drop4star = [];
	let drop5star = [];

	let bannerTitle;
	let featured = [];

	const filterRelease = (releaseVersion, pathcNow, phaseNow) => {
		if (!releaseVersion) return true;
		const [v, phs] = releaseVersion.split('-');
		if (parseFloat(pathcNow) < parseFloat(v)) return false;
		if (parseFloat(pathcNow) === parseFloat(v) && phaseNow <= parseInt(phs)) {
			return false;
		}
		return true;
	};

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
				.filter(({ release }) => filterRelease(release, this._patch, this._phase))
				.map(({ type, name }) => ({ name, type }))
				.filter(({ name }) => !this._std.includes(name));
		},

		_showStandard() {
			const weapon5 = getAllWeapons(5).filter(({ limited }) => !limited);
			drop5star = [...this._stdDropChar5, ...weapon5];
			bannerTitle = $t('wish.banner.name.wanderlust');

			drop4star = drop4star
				.filter(({ release }) => filterRelease(release, this._patch, this._phase))
				.filter(({ limited }) => !limited)
				.map(({ type, name }) => ({ name, type }));
		},

		_showEvents() {
			const { character } = $bannerList[$bannerActive];
			drop5star = this._stdDropChar5;
			drop5star.unshift({ name: character.character, type: 'character', rateup: true });
			bannerTitle = $t(`wish.banner.name.${character.name.slice(0, -2)}`, {
				default: 'UnReleased Banner'
			});

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
				.filter(({ release }) => filterRelease(release, this._patch, this._phase))
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
				.filter(({ release }) => filterRelease(release, this._patch, this._phase))
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
	setContext('close-detail', handleCLose);

	let tplVersion = localConfig.get('detail-tpl') || 'v2';
	const setTpl = (v) => {
		localConfig.set('detail-tpl', v);
		tplVersion = v;
	};
	setContext('detail-tpl', setTpl);
</script>

<section transition:fade={{ duration: 200 }}>
	{#if tplVersion !== 'v2'}
		<div class="header">
			<button on:click={handleCLose}>
				<i class="gi-reply" />
			</button>

			<button class="switchNewTpl" on:click={() => setTpl('v2')}> Switch to V2</button>
		</div>
	{/if}

	<div
		class="content-details"
		class:v2={tplVersion === 'v2'}
		style={tplVersion === 'v2' ? `background-image:url(${$assets['wish-background.webp']})` : ''}
	>
		{#await Data.get($patchVersion, $bannerPhase, banner)}
			<div class="content-details">{$t('waiting')}...</div>
		{:then data}
			<Details
				{tplVersion}
				data={{ banner, bannerTitle, featured, items }}
				drops={{ drop3star, drop4star, drop5star }}
			/>
		{/await}
	</div>
</section>

<style>
	section {
		background-color: #ebebeb;
		width: 100%;
		height: 100%;
		color: var(--text-color);
		overflow-y: auto;
		position: relative;
		z-index: +1;
	}

	.header {
		display: flex;
		padding: 0 2%;
		justify-content: space-between;
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
	.switchNewTpl {
		color: darkgoldenrod;
		text-decoration: underline;
		transition: all 0.3s;
	}
	.switchNewTpl:hover {
		color: rgb(255, 238, 213);
	}

	.content-details {
		padding: 5rem 10% 1rem;
		width: 100%;
		overflow-x: hidden;
	}

	.content-details.v2 {
		background-size: cover;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10%;
		overflow-x: auto;
	}

	.content-details.v2::-webkit-scrollbar {
		display: none;
	}

	@media screen and (max-width: 780px) {
		.content-details {
			padding: 1.5rem 5% 0.5rem;
		}
	}
</style>
