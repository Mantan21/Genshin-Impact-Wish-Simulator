import HistoryIDB from '$lib/store/historyIdb';
import { pity4star, pity5star } from '$lib/store/localstore';
import prob, { base4StarChance, base5StarCharBanner, base5StarWeaponBanner } from './prob';

const { addHistory, countItem } = HistoryIDB;

/**
 * Roll and get result for the selected Banner
 * @param {string} banner Wich banner to do roll
 * @param {number} indexOfBanner Index Of active banner among the dual banner
 * @param {Object} WishInstance Wish Instance, init first, then put as argument here
 * @returns Wish Result Object
 */
const roll = async (banner, indexOfBanner, WishInstance) => {
	const pity4 = pity4star.get(banner);
	const pity5 = pity5star.get(banner);
	const maxPity = (banner === 'weapon' ? 80 : 90) - 1; // Minus 1 to match with index of base pity

	const chance5star =
		banner === 'weapons' ? base5StarWeaponBanner[pity5] || 100 : base5StarCharBanner[pity5] || 100;
	let chance4star = base4StarChance[pity4];
	let chance3star = 100 - base4StarChance[pity4] - chance5star;

	if (chance3star < 0 && pity5 > maxPity - 1) chance4star = 0;
	if (chance3star < 0) chance3star = 0;

	const item = [
		{
			rarity: 3,
			chance: chance3star
		},
		{
			rarity: 4,
			chance: chance4star
		},
		{
			rarity: 5,
			chance: chance5star
		}
	];

	const { rarity } = prob(item);
	let pity = 1;

	if (rarity === 5) {
		pity4star.set(banner, pity4 + 1);
		pity5star.set(banner, 0);
		pity = pity5 + 1;
	}

	if (rarity === 4) {
		pity4star.set(banner, 0);
		pity5star.set(banner, pity5 + 1);
		pity = pity4 + 1;
	}

	if (rarity === 3) {
		pity4star.set(banner, pity4 + 1);
		pity5star.set(banner, pity5 + 1);
	}

	const Wish = await WishInstance;
	const wishResult = Wish.getItem(rarity, banner, indexOfBanner);
	wishResult.pity = pity;
	wishResult.banner = banner;

	const numberOfItemOfHistory = await countItem(wishResult.name);
	await addHistory(wishResult);

	const isFullConstellation = numberOfItemOfHistory > 6;
	const result = { ...wishResult, isNew: numberOfItemOfHistory < 1 };
	if (result.type === 'character') {
		if (numberOfItemOfHistory < 1) return result;
		result.stelaFortuna = !isFullConstellation;
	}
	result.fateType = result.rarity === 3 ? 'stardust' : 'starglitter';
	result.fateQty = result.isNew
		? 0
		: getMilestoneQty(result.rarity, result.type, isFullConstellation);

	return result;
};

const getMilestoneQty = (rarity, type, isFullConstellation) => {
	if (rarity === 3) return 15;

	let charQty;
	const weaponQty = rarity === 4 ? 2 : 10;
	if (rarity === 4) charQty = isFullConstellation ? 5 : 2;
	if (rarity === 5) charQty = isFullConstellation ? 25 : 10;

	return type === 'character' ? charQty : weaponQty;
};

export default roll;
