import weaponsDB from '$lib/data/weapons.json';
import charsDB from '$lib/data/characters.json';
import { beginner } from '$lib/data/banners/beginner.json';
import {
	beginnerAlreadyGuaranteed,
	beginnerRoll,
	localFatePoint,
	nextGuaranteed,
	nextWeaponGuaranteed
} from '$lib/store/localstore';
import { fatePoint, selectedCourse, showBeginner } from '$lib/store/stores';
import roll from './roll';
import prob from './prob';

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const getAllChars = (star) =>
	charsDB.data
		.find(({ rarity }) => rarity === star)
		.list.map((arr) => {
			arr.type = 'character';
			arr.rarity = star;
			return arr;
		});

const getAllWeapons = (star) =>
	weaponsDB.data
		.find(({ rarity }) => rarity === star)
		.list.map((arr) => {
			arr.type = 'weapon';
			arr.rarity = star;
			return arr;
		});

const getStandard5StarItem = ({ exclude }) => {
	const itemType = rand(['weap', 'char']);
	const items = itemType === 'weap' ? standardWeapons(5) : standardChars5Star(exclude);
	return rand(items);
};

const standardWeapons = (star) => getAllWeapons(star).filter(({ limited }) => !limited);
const standardChars5Star = (exclude) => getAllChars(5).filter(({ name }) => exclude.includes(name));
const standardChars4Star = getAllChars(4).filter(({ limited }) => !limited);

const limitedBannerChars4Star = getAllChars(4).filter(({ name }) => {
	return !charsDB.onlyStandard.includes(name);
});
const commonChar4Star = standardChars4Star.filter(({ name }) => {
	return !charsDB.onlyStandard.includes(name);
});

const get3StarItem = () => rand(standardWeapons(3));
const get4StarItem = (bannerToRoll = 'allExcludeStandard') => {
	const itemType = rand(['weap', 'char']);

	// show standard character exclude starter character ( amber, kaeya, lisa )
	let charList = commonChar4Star;

	// Show All standard chars exlude new character
	if (bannerToRoll === 'standard') charList = standardChars4Star;

	// show standard item exclude starter and new character
	if (bannerToRoll === 'limited') charList = limitedBannerChars4Star;

	const items = itemType === 'weap' ? standardWeapons(4) : charList;
	return rand(items);
};

const limitedWish = {
	init(eventsData, indexOfBanner) {
		const { item, rateup } = eventsData;
		this._character = item;
		this._rateup = rateup;
		this._indexOfBanner = indexOfBanner;
		return this;
	},

	_rateupChars() {
		return getAllChars(4).filter(({ name }) => this._rateup.includes(name));
	},

	_featuredChars() {
		let { _character, _indexOfBanner } = this;
		if (Array.isArray(_character)) _character = _character[_indexOfBanner];
		const result = getAllChars(5).find(({ name }) => name === _character.character);
		return result;
	},

	get(rarity, excludedStandardChar) {
		if (rarity === 3) return get3StarItem();
		if (rarity === 4) {
			const resultType = rand(['rateup', 'std']);
			if (resultType === 'std') return get4StarItem('limited');

			// If rate up character
			return rand(this._rateupChars());
		}

		if (rarity === 5) {
			// Guaranteed
			const limitedResult = this._featuredChars();
			if (nextGuaranteed.get() === 'yes') {
				nextGuaranteed.set('no');
				return limitedResult;
			}

			// not guaranteed
			const resultType = rand(['limited', 'std']);
			if (resultType === 'std') {
				nextGuaranteed.set('yes');
				return rand(standardChars5Star(excludedStandardChar));
			}

			// win 50: 50
			nextGuaranteed.set('no');
			return limitedResult;
		}
	}
};

const beginerWish = (rarity, beginnerData, standardData) => {
	let { character, vision } = beginnerData;

	const alreadyGetFeatured = beginnerAlreadyGuaranteed.get() === 'yes';
	const rollCount = beginnerRoll.get() || 0;
	beginnerRoll.set(rollCount + 1);

	if (rollCount === 19) {
		// If roll count 20
		showBeginner.set(false);
		// if already get Noelle, no more guaranteed
		if (!alreadyGetFeatured) {
			beginnerAlreadyGuaranteed.set('yes');
			return { type: 'character', rarity: 4, name: character, vision };
		}
	}

	if (rarity === 3) return get3StarItem();
	if (rarity === 5) return getStandard5StarItem({ exclude: standardData.characters });

	if (rarity === 4) {
		if (!alreadyGetFeatured) {
			const item = [
				{
					name: 'rateup',
					chance: 25
				},
				{
					name: 'other',
					chance: 75
				}
			];

			const rng = prob(item);
			if (rng.name === 'rateup') {
				// guaranteed probability
				beginnerAlreadyGuaranteed.set('yes');
				return limitedBannerChars4Star.find((c) => c.name === character);
			}
		}

		// get Random item
		const result = get4StarItem();
		if (result.name === character) beginnerAlreadyGuaranteed.set('yes');
		return result;
	}
};

const fatepoint = {
	init(version, phase, featuredData) {
		this._localFate = localFatePoint.init(version, phase);
		this._version = version;
		this._phase = phase;
		this._featured = featuredData;
		return this;
	},

	check() {
		const localSelectedCourse = this._localFate.getSelected();
		if (localSelectedCourse === null) return { localSelectedCourse };
		this.localFate = localFatePoint.init(this._version, this._phase, localSelectedCourse);
		const localPoint = this._localFate.getPoint();
		this.localPoint = localPoint;
		if (localPoint !== 2) return { localSelectedCourse: null, localPoint };

		/** Reset when Full Point */
		this._localFate.remove();
		return { localSelectedCourse, localPoint };
	},

	updater(obj) {
		const localSelectedCourse = this._localFate.getSelected();
		if (localSelectedCourse === null) return;
		const resultIndex = this._featured.findIndex(({ name }) => obj.name === name);

		if (localSelectedCourse - 1 === resultIndex) {
			fatePoint.set(0);
			selectedCourse.set({ name: null, index: null });
			return this._localFate.remove();
		}

		const point = this.localPoint + 1;
		fatePoint.set(point);
		return this._localFate.set(point);
	}
};

const weaponWish = {
	init(version, phase, weaponsData) {
		this._weapons = weaponsData;
		this._phase = phase;
		this._version = version;
		return this;
	},

	_rateupWeapons() {
		return getAllWeapons(4).filter(({ name }) => this._weapons.rateup.includes(name));
	},
	_featuredWeaponsName() {
		return this._weapons.featured.map(({ name }) => name);
	},
	_featuredWeapons() {
		return getAllWeapons(5).filter(({ name }) => this._featuredWeaponsName().includes(name));
	},

	get(rarity) {
		if (rarity === 3) return get3StarItem();
		if (rarity === 4) {
			const resultType = rand(['rateup', 'std']);
			if (resultType === 'std') return get4StarItem();

			// If rate up character
			return rand(this._rateupWeapons());
		}

		if (rarity === 5) {
			const { _version, _phase, _weapons } = this;
			const course = fatepoint.init(_version, _phase, _weapons.featured);
			const { localSelectedCourse, localPoint } = course.check();
			const isGuaranteed = nextWeaponGuaranteed.get() === 'yes';

			// When Fatepoint already Filled, guaranteed to pull selected Weapon
			if (localPoint > 1) {
				nextWeaponGuaranteed.set('no');
				const result = this._featuredWeapons().find(({ name }) => {
					return _weapons.featured[localSelectedCourse - 1].name === name;
				});
				course.updater(result);
				return result;
			}

			// When Not guaranteed ( Rate OFF)
			if (!isGuaranteed) {
				const item = [
					{ type: 'featured', chance: 50 },
					{ type: 'std', chance: 50 }
				];
				const { type } = prob(item);

				// Lose rateoff
				if (type === 'std') {
					const result = rand(standardWeapons(5));
					const isFeaturedStandardWeapon = this._featuredWeaponsName().includes(result.name);
					if (isFeaturedStandardWeapon) nextWeaponGuaranteed.set('no');
					else nextWeaponGuaranteed.set('yes');
					course.updater(result);
					return result;
				}
			}

			// When Guaranteed and win rate off
			const result = rand(this._featuredWeapons());
			nextWeaponGuaranteed.set('no');
			course.updater(result);
			return result;
		}
	}
};

const Wish = {
	async init(version, phase) {
		const { data } = await import(`../../data/banners/events/${version}.json`);
		const { standardVersion, weapons, events } = data.find((d) => d.phase === phase).banners;
		const { standard } = await import(`../../data/banners/standard/${standardVersion}.json`);
		this._version = version;
		this._phase = phase;
		this._beginner = beginner;
		this._events = events;
		this._isDualBanner = Array.isArray(events.item) && events.item?.length > 1;
		this._weapons = weapons;
		this._standard = standard;
		return this;
	},

	_limitedWish(rarity, indexOfBannerEvents) {
		const { item } = this._events;
		const eventBanner = limitedWish.init(this._events, indexOfBannerEvents);
		const result = eventBanner.get(rarity, this._standard.characters);
		result.bannerName = Array.isArray(item) ? item[indexOfBannerEvents].name : item.name;
		return result;
	},

	_beginnerWish(rarity) {
		const result = beginerWish(rarity, this._beginner, this._standard);
		result.bannerName = 'beginner';
		return result;
	},

	_standardWish(rarity) {
		let result;
		if (rarity === 3) result = get3StarItem();
		if (rarity === 4) result = get4StarItem('standard');
		if (rarity === 5) result = getStandard5StarItem({ exclude: this._standard.characters });
		result.bannerName = this._standard.featured.name;
		return result;
	},

	_weaponWish(rarity) {
		const { _weapons, _phase, _version } = this;
		const weaponBanner = weaponWish.init(_version, _phase, _weapons);
		const result = weaponBanner.get(rarity);
		result.bannerName = _weapons.name;
		return result;
	},

	getItem(rarity, banner, indexOfBanner) {
		let result;
		if (banner === 'beginner') result = this._beginnerWish(rarity);
		if (banner === 'standard') result = this._standardWish(rarity);
		if (banner === 'events') result = this._limitedWish(rarity, indexOfBanner);
		if (banner === 'weapons') result = this._weaponWish(rarity);
		if (!result) return { type: null, rarity: 0, name: null };

		const date = new Date();
		result.time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
		return result;
	}
};

export { roll };
export default Wish;
