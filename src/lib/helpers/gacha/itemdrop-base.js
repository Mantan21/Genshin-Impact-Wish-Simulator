import { standard } from '$lib/data/banners/standard.json';
import { data as weaponsDB } from '$lib/data/weapons.json';
import { data as charsDB, onlyStandard } from '$lib/data/characters.json';
import { getRate, prob } from './probabilities';
import { guaranteedStatus } from '../dataAPI/api-localstore';

export const regionElement = (region) => {
	const base = {
		mondstadt: 'anemo',
		liyue: 'geo',
		inazuma: 'electro',
		sumeru: 'dendro',
		fontaine: 'hydro',
		natlan: 'pyro',
		snezhnaya: 'cryo'
	};
	return base[region];
};

const standardWeapons = (star, includes = []) => {
	return getAllWeapons(star).filter(({ limited, name }) => !limited || includes.includes(name));
};

const filterByReleased = (charlist, version = null, phase = null) => {
	return charlist.filter(({ release }) => {
		if (!release) return true;
		const [v, phs] = release.split('-');
		if (parseFloat(version) < parseFloat(v)) return false;
		if (parseFloat(version) === parseFloat(v) && phase <= parseInt(phs)) return false;
		return true;
	});
};

export const rand = (array) => {
	if (!Array.isArray(array)) return array;
	if (array.length < 2) return array[0];
	return array[Math.floor(Math.random() * array.length)];
};

export const randomNumber = (min = 1, max = 9) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const getAllChars = (star) => {
	return charsDB
		.filter(({ rarity }) => rarity === star)
		.map((arr) => ({ type: 'character', ...arr }));
};

const getAllWeapons = (star) => {
	return weaponsDB
		.filter(({ rarity }) => rarity === star)
		.map((arr) => ({ type: 'weapon', ...arr }));
};

export const getCharDetails = (charName) => {
	if (!charName) return {};
	const findChar = charsDB.find(({ name }) => charName === name);
	return findChar || {};
};

export const getWpDetails = (weaponName) => {
	if (!weaponName) return {};
	const findWP = weaponsDB.find(({ name }) => name === weaponName);
	return findWP || {};
};

export const getDetails = (itemName) => {
	if (!itemName) return {};
	const characterList = charsDB.map((d) => ({ type: 'character', ...d }));
	const weaponList = weaponsDB.map((d) => ({ type: 'weapon', ...d }));
	const list = [...characterList, ...weaponList];
	const findItems = list.find(({ name }) => itemName === name);
	return findItems || {};
};

const char4starList = (banner) => {
	if (banner === 'standard') return getAllChars(4);
	return getAllChars(4).filter(({ name }) => !onlyStandard.includes(name));
};

export const get3StarItem = () => standardWeapons(3);

export const get4StarItem = ({
	banner = 'standard',
	region = null,
	version = null,
	phase = null,
	type = null,
	useRateup = false,
	rateupNamelist = []
} = {}) => {
	// Rateup Item
	if (useRateup) {
		const isChar = banner === 'character-event' || banner === 'beginner';
		const DBList = isChar ? getAllChars(4) : getAllWeapons(4);
		const rateupList = DBList.filter(({ name }) => rateupNamelist.includes(name));
		return rateupList;
	}

	// Beginner droplist
	if (banner === 'beginner') {
		const charList = char4starList(banner).filter(({ release }) => release === '1.0-0');
		return charList;
	}

	// General Wish Result
	let items;
	const isChron = banner === 'chronicled';
	const lsChars = isChron ? getAllChars(4) : char4starList(banner);
	const lsWp = isChron ? getAllWeapons(4) : standardWeapons(4);

	if (type == 'all') {
		items = [...lsChars, ...lsWp];
	} else if (type === 'character') {
		items = lsChars;
	} else if (type === 'weapon') {
		items = lsWp;
	} else {
		const charRate = getRate(banner, 'charRate');
		const { itemType } = prob([
			{ itemType: 'char', chance: charRate },
			{ itemType: 'wp', chance: 100 - charRate }
		]);
		items = itemType === 'wp' ? lsWp : lsChars;
	}

	const result = filterByReleased(items, version, phase);
	// General Result
	if (!isChron) return result.filter(({ name }) => !rateupNamelist.includes(name));
	// chronicled Result
	return result.filter(({ origin, name }) => origin === region || rateupNamelist.includes(name));
};

const std5StarCharlist = (stdver = 1, includes = []) => {
	const { characters: stdCharNames } = standard.find(({ version }) => version === stdver);
	return getAllChars(5).filter(({ name }) => {
		return stdCharNames.includes(name) || includes.includes(name);
	});
};

export const get5StarItem = ({
	banner = 'standard',
	region = null,
	stdver = 1,
	type = null,
	useRateup = false,
	rateupItem = [],
	customData = {}
} = {}) => {
	// Featured or selected Character Result
	if (useRateup && banner.match(/character|chronicled/)) {
		if (Object.keys(customData).length > 0) {
			const { vision, character, artPosition, itemID } = customData;
			const result = { name: character, offset: artPosition || {}, type: 'character' };
			return { vision, itemID, rarity: 5, custom: true, ...result };
		}
		const loadItems = type === 'weapon' ? getAllWeapons : getAllChars;
		const featured = loadItems(5).find(({ name }) => name === rateupItem[0]);
		return featured || {};
	}

	// Losing Chronicled Result
	if (banner.match('chronicled')) {
		let resultList = [];
		if (!type || type === 'all') {
			resultList = [...std5StarCharlist(stdver, rateupItem), ...standardWeapons(5, rateupItem)];
		} else if (type === 'weapon') {
			resultList = standardWeapons(5, rateupItem);
		} else {
			resultList = std5StarCharlist(stdver, rateupItem);
		}

		const filtered = resultList.filter(({ origin, name }) => {
			return origin === region || rateupItem.includes(name);
		});
		return filtered;
	}

	// Featured Weapon Result
	if (useRateup && banner === 'weapon-event') {
		const featured = getAllWeapons(5).filter(({ name }) => rateupItem.includes(name));
		return featured;
	}

	// Standard Weapon result
	if (banner === 'weapon-event') {
		const rateupRemoved = standardWeapons(5).filter(({ name }) => !rateupItem.includes(name));
		return rateupRemoved;
	}

	// Beginner Result
	if (banner === 'beginner') {
		const result = std5StarCharlist(1);
		return result;
	}

	// Standard Result
	if (banner === 'standard' || !banner) {
		let resultList;
		if (type === 'all') {
			resultList = [...std5StarCharlist(stdver), ...standardWeapons(5)];
		} else if (type === 'character') {
			resultList = std5StarCharlist(stdver);
		} else if (type === 'weapon') {
			resultList = standardWeapons(5);
		} else {
			const charRate = getRate(banner, 'charRate');
			const { itemType } = prob([
				{ itemType: 'char', chance: charRate },
				{ itemType: 'wp', chance: 100 - charRate }
			]);
			resultList = itemType === 'wp' ? standardWeapons(5) : std5StarCharlist(stdver);
		}
		return resultList;
	}

	// Character Banner Result while lose on character banner
	return std5StarCharlist(stdver).filter(({ name }) => !rateupItem.includes(name));
};

// RateUp Probability
export const isRateup = (banner) => {
	const winRate = getRate(banner, 'winRate');
	const { item } = prob([
		{ item: 'rateup', chance: winRate },
		{ item: 'std', chance: 100 - winRate }
	]);

	return item === 'rateup';
};

// CheckGuaranteed
export const checkGuaranteed = (banner, rarity) => {
	const status = guaranteedStatus.get(`${banner}-${rarity}star`);
	const guaranteedSystem = getRate(banner, 'guaranteed');
	const never = guaranteedSystem === 'never';
	const always = guaranteedSystem === 'always';
	return { status, never, always };
};
