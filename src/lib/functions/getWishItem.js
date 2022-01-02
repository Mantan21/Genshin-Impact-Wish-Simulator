import charsDB from '$lib/setup/characters.json';
import weaponsDB from '$lib/setup/weapons.json';
import wishSetup from '$lib/setup/wish-setup.json';
import previous from '$lib/setup/wishlist.json';
import {
	localBannerVersion,
	beginnerRoll,
	beginnerAlreadyGuaranteed,
	nextGuaranteed,
	nextWeaponGuaranteed,
	localFatePoint
} from '$lib/store/localstore';
import { fatePoint, fatepointCounterActive, showBeginner } from '$lib/store/stores';
import prob from './prob';

let { wishPhase, banner } = wishSetup;
let versionPatch = wishSetup.version;

let { standard, beginner } = banner;
const listOfWishBanner = previous.data.find(({ version }) => version === versionPatch);
let { weapons, limited } = listOfWishBanner.banner[wishPhase - 1];

const checkBanner = () => {
	const localVersion = localBannerVersion.get();
	if (!localVersion) return;

	const [patch, phase] = localVersion.split('-');
	const { banner } = previous.data.find(({ version }) => version === patch);
	({ limited, weapons } = banner[parseInt(phase) - 1]);
	versionPatch = patch;
	wishPhase = parseInt(phase);
};

// WEAPONS DATA
const getAllWeapons = (star) =>
	weaponsDB.data
		.find(({ rarity }) => rarity === star)
		.list.map((arr) => {
			arr.type = 'weapon';
			arr.rarity = star;
			return arr;
		});

const standardWeapons = (star) => getAllWeapons(star).filter(({ limited }) => !limited);

const rateupWeapons = () => getAllWeapons(4).filter(({ name }) => weapons.rateup.includes(name));

const featuredWeaponsName = () => weapons.featured.map(({ name }) => name);
const featuredWeapons = () =>
	getAllWeapons(5).filter(({ name }) => featuredWeaponsName().includes(name));

// CHARACTER DATA
const getAllChars = (star) =>
	charsDB.data
		.find(({ rarity }) => rarity === star)
		.list.map((arr) => {
			arr.type = 'character';
			arr.rarity = star;
			return arr;
		});

const standardChars4Star = getAllChars(4).filter(({ limited }) => !limited);
const commonChar4Star = standardChars4Star.filter(
	({ name }) => !charsDB.onlyStandard.includes(name)
);

const limitedBannerChars4Star = getAllChars(4).filter(
	({ name }) => !charsDB.onlyStandard.includes(name)
);

const standardChars5Star = getAllChars(5).filter(({ name }) => standard.characters.includes(name));

const rateupChars = () => getAllChars(4).filter(({ name }) => limited.rateup.includes(name));

const featuredChars = (banner) => {
	let { character } = limited;
	// Check is it double banner or not
	const bannerNumberOnThisPeriod = parseInt(banner.replace('limited', ''));
	if (!isNaN(bannerNumberOnThisPeriod)) {
		character = character[bannerNumberOnThisPeriod];
	}
	return getAllChars(5).find(({ name }) => name === character.name);
};

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const get3StarItem = () => rand(standardWeapons(3));

const get4StarItem = (bannerToRoll = 'allExcludeStandard') => {
	const itemType = rand(['weap', 'char']);
	let charList;
	switch (bannerToRoll) {
		case 'standard':
			charList = standardChars4Star;
			break;
		case 'limited':
			charList = limitedBannerChars4Star;
			break;
		default:
			charList = commonChar4Star;
			break;
	}
	const items = itemType === 'weap' ? standardWeapons(4) : charList;
	return rand(items);
};

const getStandard5StarChar = () => rand(standardChars5Star);
const getStandard5StarWeapon = () => rand(standardWeapons(5));
const getStandard5StarItem = () => {
	const itemType = rand(['weap', 'char']);
	const items = itemType === 'weap' ? standardWeapons(5) : standardChars5Star;
	return rand(items);
};

const dualBannerIdentifier = (wishResult, banner) => {
	let [, num] = banner.split('limited');
	num = num !== '' ? parseInt(num) : 0;
	wishResult.dualBanner = num + 1;
	return wishResult;
};

const beginnerWish = (rarity) => {
	const rateup = beginner.character.name;
	const rollCount = beginnerRoll.get() || 0;
	beginnerRoll.set(rollCount + 1);

	if (rollCount === 19) {
		// If roll count 20
		beginnerAlreadyGuaranteed.set('yes');
		showBeginner.set(false);
		return { type: 'character', rarity: 4, name: rateup };
	}
	if (rarity === 3) return get3StarItem();
	if (rarity === 5) return getStandard5StarItem();

	if (rarity === 4) {
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

		if (beginnerAlreadyGuaranteed.get() === 'yes') return get4StarItem(); // if already get Noelle, no more guaranteed

		const rng = prob(item);
		if (rng.name === 'rateup') {
			// guaranteed probability
			beginnerAlreadyGuaranteed.set('yes');
			return limitedBannerChars4Star.find((c) => c.name === rateup);
		}

		// get Random item
		const result = get4StarItem();
		if (result.name === rateup) beginnerAlreadyGuaranteed.set('yes');
		return result;
	}
	return null;
};

const limitedWish = (rarity, banner) => {
	if (rarity === 3) return get3StarItem();
	if (rarity === 4) {
		const resultType = rand(['rateup', 'std']);
		if (resultType === 'std') return get4StarItem('limited');

		// If rate up character
		return rand(rateupChars());
	}

	if (rarity === 5) {
		// Guaranteed
		const limitedResult = featuredChars(banner);
		if (nextGuaranteed.get() === 'yes') {
			nextGuaranteed.set('no');
			return limitedResult;
		}

		// not guaranteed
		const resultType = rand(['limited', 'std']);
		if (resultType === 'std') {
			nextGuaranteed.set('yes');
			return getStandard5StarChar();
		}

		// win 50: 50
		nextGuaranteed.set('no');
		return limitedResult;
	}
};

const standardWish = (rarity) => {
	if (rarity === 3) return get3StarItem();
	if (rarity === 4) return get4StarItem('standard');
	if (rarity === 5) return getStandard5StarItem();
	return null;
};

/**
 * Weapon Banner Wish
 */
const fatepoint = {
	init() {
		this.localFate = localFatePoint.init(versionPatch, wishPhase);
		return this;
	},

	check() {
		const selectedCourse = this.localFate.getSelected();
		if (selectedCourse === null) return { selectedCourse };
		this.localFate = localFatePoint.init(versionPatch, wishPhase, selectedCourse);
		const localPoint = this.localFate.getPoint();
		this.localPoint = localPoint;
		if (localPoint !== 2) return { selectedCourse: null, localPoint };

		/** Reset when Full Point */
		this.localFate.remove();
		return { selectedCourse, localPoint };
	},

	updater(obj) {
		const selectedCourse = this.localFate.getSelected();
		if (selectedCourse === null) return;
		const resultIndex = weapons.featured.findIndex(({ name }) => obj.name === name);

		if (selectedCourse === resultIndex) {
			fatePoint.set(0);
			fatepointCounterActive.set(false);
			return this.localFate.remove();
		}

		const point = this.localPoint + 1;
		fatePoint.set(point);
		return this.localFate.set(point);
	}
};

const weaponWish = (rarity) => {
	if (rarity === 3) return get3StarItem();
	if (rarity === 4) {
		const resultType = rand(['rateup', 'std']);
		if (resultType === 'std') return get4StarItem();

		// If rate up character
		return rand(rateupWeapons());
	}

	if (rarity === 5) {
		const course = fatepoint.init();
		/**
		 * When user has 2 fatepoint, guaranteed to get weapon that already selected
		 */
		const { selectedCourse, localPoint } = course.check();
		if (localPoint === 2) {
			nextWeaponGuaranteed.set('no');
			const result = featuredWeapons().find(
				({ name }) => weapons.featured[selectedCourse].name === name
			);
			course.updater(result);
			return result;
		}

		/**
		 * Rate On Condition
		 */
		const weaponResultGuaranteed = rand(featuredWeapons());
		if (nextWeaponGuaranteed.get() === 'yes') {
			nextWeaponGuaranteed.set('no');
			course.updater(weaponResultGuaranteed);
			return weaponResultGuaranteed;
		}

		/**
		 * Rate Off Condition
		 */
		const item = [
			{ type: 'featured', chance: 75 },
			{ type: 'std', chance: 25 }
		];
		const { type } = prob(item);
		if (type === 'std') {
			const result = getStandard5StarWeapon();
			if (featuredWeaponsName().includes(result.name)) nextWeaponGuaranteed.set('no');
			else nextWeaponGuaranteed.set('yes');
			course.updater(result);
			return result;
		}

		// Win 50:50
		nextWeaponGuaranteed.set('no');
		course.updater(weaponResultGuaranteed);
		return weaponResultGuaranteed;
	}
};

const getWishItem = (banner, rarity) => {
	checkBanner();
	let result;
	const date = new Date();
	const time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

	if (banner.includes('limited')) {
		result = dualBannerIdentifier(limitedWish(rarity, banner), banner);
	}
	if (banner === 'beginner') result = beginnerWish(rarity);
	if (banner === 'standard') result = standardWish(rarity);
	if (banner === 'weapon') result = weaponWish(rarity);

	if (!result) return { type: null, rarity: 0, mame: null };
	result.time = time;
	return result;
};

export default getWishItem;
