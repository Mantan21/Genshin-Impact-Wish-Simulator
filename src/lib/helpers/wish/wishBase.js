import weaponsDB from '$lib/data/weapons.json';
import charsDB from '$lib/data/characters.json';

const rand = (array) => array[Math.floor(Math.random() * array.length)];

const getAllChars = (star) =>
	charsDB.data
		.filter(({ rarity }) => rarity === star)
		.map((arr) => {
			arr.type = 'character';
			return arr;
		});

const getAllWeapons = (star) =>
	weaponsDB.data
		.filter(({ rarity }) => rarity === star)
		.map((arr) => {
			arr.type = 'weapon';
			return arr;
		});

const standardChars5Star = (chars) => getAllChars(5).filter(({ name }) => chars.includes(name));
const standardWeapons = (star, exclude = []) => {
	return getAllWeapons(star)
		.filter(({ limited }) => !limited)
		.filter(({ name }) => !exclude.includes(name));
};

const get4StarChars = getAllChars(4).filter(({ name }) => {
	return !charsDB.onlyStandard.includes(name);
});

const filterCharByReleased = (charlist, version = null, phase = null) => {
	return charlist.filter(({ release }) => {
		if (!release) return true;
		const [v, phs] = release.split('-');
		if (parseFloat(version) < parseFloat(v)) return false;
		if (parseFloat(version) === parseFloat(v) && phase <= parseInt(phs)) return false;
		return true;
	});
};

const get3StarItem = () => rand(standardWeapons(3));
const get4StarItem = (
	bannerToRoll = 'allExcludeStandard',
	version = null,
	phase = null,
	exinclude = []
) => {
	let charList = get4StarChars;

	if (bannerToRoll === 'beginner') {
		charList = charList.filter(({ name }) => exinclude.includes(name));
		return rand(charList);
	}

	const itemType = rand(['weap', 'char']);
	// Show All standard chars exlude new character
	if (bannerToRoll === 'standard') charList = getAllChars(4);

	const items = itemType === 'weap' ? standardWeapons(4) : charList;
	let filtered = filterCharByReleased(items, version, phase);
	if (exinclude.length > 0) {
		filtered = filtered.filter(({ name }) => !exinclude.includes(name));
	}

	return rand(filtered);
};

const getStandard5StarItem = ({ exclude }) => {
	const itemType = rand(['weap', 'char']);
	const items = itemType === 'weap' ? standardWeapons(5) : standardChars5Star(exclude);
	return rand(items);
};

export {
	rand,
	getAllChars,
	getAllWeapons,
	get3StarItem,
	get4StarItem,
	get4StarChars,
	getStandard5StarItem,
	standardWeapons,
	standardChars5Star
};
