<script>
	import { t } from 'svelte-i18n';
	import { bannerActive, bannerList, bannerPhase, patchVersion } from '$lib/store/stores';
	import { beginner } from '$lib/data/banners/beginner.json';
	import { get4StarChars, getAllChars, getAllWeapons } from '$lib/helpers/wish/wishBase';
	import Details from './_details.svelte';
	import { getBannerName } from '$lib/helpers/nameText';

	export let tplVersion;

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
			const { data } = await import(`../../../data/banners/events/${patch}.json`);
			const { standardVersion, weapons, events } = data.find((d) => d.phase === phase).banners;
			const { standard } = await import(`../../../data/banners/standard/${standardVersion}.json`);

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
				return name === beginner.featured.character;
			});
			const obj = {
				rarity: 4,
				items: [{ name, title, vision }]
			};

			items = [obj];
			bannerTitle = $t('wish.banner.beginner');

			drop5star = this._stdDropChar5.filter(({ name }) => beginner.characters.includes(name));
			drop4star = drop4star.filter(({ name }) => beginner.characters.includes(name));
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
			bannerTitle = $t(`wish.banner.name.${getBannerName(character.name).name}`, {
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
</script>

{#await Data.get($patchVersion, $bannerPhase, banner)}
	<div>{$t('waiting')}...</div>
{:then data}
	<Details
		{tplVersion}
		data={{ banner, bannerTitle, featured, items }}
		drops={{ drop3star, drop4star, drop5star }}
	/>
{/await}
