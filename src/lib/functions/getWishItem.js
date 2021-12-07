import charsDB from '$lib/setup/characters.json';
import weaponsDB from '$lib/setup/weapons.json';
import wishSetup from '$lib/setup/wish-setup.json';
import previous from '$lib/setup/previous.json';
import {
	bnversion,
	beginnerRoll,
	beginnerAlreadyGuaranteed,
	nextGuaranteed,
	nextWeaponGuaranteed
} from '$lib/store/localstore';
import { showBeginner } from '$lib/store/stores';
import prob from './prob';

let { standard, beginner, limited, weapons } = wishSetup.banner;

const checkBanner = () => {
	// eslint-disable-next-line
	const localVersion = globalThis.window ? bnversion.get() : null;
	if (!localVersion) return;

	const [patch, versionBanner] = localVersion.split('-');
	const { banner } = previous.data.filter(({ version }) => version === patch)[0];
	({ limited, weapons } = banner[parseInt(versionBanner) - 1]);
};

const weapons3Star = Object.keys(weaponsDB.star3).map((name) => ({
	type: 'weapon',
	rarity: 3,
	name
}));
const standardWeapons4Star = Object.keys(weaponsDB.star4)
	.filter((name) => !weaponsDB.star4[name].limited)
	.map((name) => ({ type: 'weapon', rarity: 4, name }));
const standardWeapons5Star = Object.keys(weaponsDB.star5)
	.filter((name) => !weaponsDB.star5[name].limited)
	.map((name) => ({ type: 'weapon', rarity: 5, name }));

const standardChars4Star = Object.keys(charsDB.star4)
	.filter((name) => !charsDB.star4[name].limited)
	.map((name) => ({ type: 'character', rarity: 4, name }));
const limitedChars4Star = standardChars4Star.filter(
	({ name }) => !charsDB.onlyStandard.includes(name)
);
const standardChars5Star = standard.characters.map((name) => ({
	type: 'character',
	rarity: 5,
	name
}));

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const get3StarItem = () => rand(weapons3Star);

const get4StarItem = (bannerToRoll = 'allExcludeStandard') => {
	const itemType = rand(['weap', 'char']);
	const charList = bannerToRoll === 'standard' ? standardChars4Star : limitedChars4Star;
	const items = itemType === 'weap' ? standardWeapons4Star : charList;
	return rand(items);
};

const getStandard5StarChar = () => rand(standardChars5Star);
const getStandard5StarWeapon = () => rand(standardWeapons5Star);
const getStandard5StarItem = () => {
	const itemType = rand(['weap', 'char']);
	const items = itemType === 'weap' ? standardWeapons5Star : standardChars5Star;
	return rand(items);
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
			return limitedChars4Star.find((c) => c.name === rateup);
		}

		// get Random item
		const result = get4StarItem();
		if (result.name === rateup) beginnerAlreadyGuaranteed.set('yes');
		return result;
	}
	return null;
};

const limitedWish = (rarity, banner) => {
	let { character, rateup } = limited;

	// Check is it double banner or not
	const bannerNumberOnThisPeriod = parseInt(banner.replace('limited', ''));
	if (bannerNumberOnThisPeriod + 1 > 0) {
		character = character[bannerNumberOnThisPeriod];
	}

	if (rarity === 3) return get3StarItem();
	if (rarity === 4) {
		const resultType = rand(['rateup', 'std']);
		if (resultType === 'std') return get4StarItem();

		// If rate up character
		let chars = rateup.map((name) => ({ type: 'character', rarity: 4, name }));
		return rand(chars);
	}

	if (rarity === 5) {
		// Guaranteed
		const limitedResult = { type: 'character', rarity: 5, name: character.name, limited: true };
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

const weaponWish = (rarity) => {
	const weap = weapons.featured.map(({ name }) => name);

	if (rarity === 3) return get3StarItem();
	if (rarity === 4) {
		const resultType = rand(['rateup', 'std']);
		if (resultType === 'std') return get4StarItem();

		// If rate up character
		let weapResult = weapons.rateup.map((name) => ({ type: 'weapon', rarity: 4, name }));
		return rand(weapResult);
	}
	if (rarity === 5) {
		const weaponName = rand(weap);
		const weaponResultGuaranteed = { type: 'weapon', rarity: 5, name: weaponName };
		if (nextWeaponGuaranteed.get() === 'yes') return weaponResultGuaranteed;

		const item = [
			{ type: 'featured', chance: 75 },
			{ type: 'std', chance: 25 }
		];
		const { type } = prob(item);
		if (type === 'std') {
			const result = getStandard5StarWeapon();
			if (weap.includes(result.name)) nextWeaponGuaranteed.set('no');
			return result;
		}

		// Win Weapon
		nextWeaponGuaranteed.set('no');
		return weaponResultGuaranteed;
	}
};

const getWishItem = (banner, rarity) => {
	checkBanner();
	let result;
	const date = new Date();
	const time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

	if (banner === 'beginner') result = beginnerWish(rarity);
	if (banner.includes('limited')) result = limitedWish(rarity, banner);
	if (banner === 'standard') result = standardWish(rarity);
	if (banner === 'weapon') result = weaponWish(rarity);

	if (!result) return { type: null, rarity: 0, mame: null };
	result.time = time;
	return result;
};

export default getWishItem;
