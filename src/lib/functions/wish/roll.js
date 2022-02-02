import HistoryIDB from '$lib/store/historyIdb';
import { pity4star, pity5star } from '$lib/store/localstore';
import {
	base4StarChance,
	base5StarCharBanner,
	base5StarWeaponBanner
} from '$lib/setup/probability';
import prob from './prob';
import getWishItem from './getWishItem';

const { addHistory, countItem } = HistoryIDB;

/**
 *
 * @param {string} bannerToRoll
 * @returns {Object}
 */
const roll = async (bannerToRoll) => {
	const banner = bannerToRoll.replace(/\d{1}/, '');
	const pity4 = pity4star.get(banner);
	const pity5 = pity5star.get(banner);
	const maxPity = banner === 'weapon' ? 80 : 90;

	const chance5star =
		banner === 'weapon' ? base5StarWeaponBanner[pity5] : base5StarCharBanner[pity5];
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

	const result = prob(item);
	let pity = 1;

	if (result.rarity === 5) {
		pity4star.set(banner, pity4 + 1);
		pity5star.set(banner, 0);
		pity = pity5 + 1;
	}

	if (result.rarity === 4) {
		pity4star.set(banner, 0);
		pity5star.set(banner, pity5 + 1);
		pity = pity4 + 1;
	}

	if (result.rarity === 3) {
		pity4star.set(banner, pity4 + 1);
		pity5star.set(banner, pity5 + 1);
	}

	const wishResult = getWishItem(bannerToRoll, result.rarity);
	wishResult.pity = pity;
	wishResult.banner = banner;

	const numberOfItemOfHistory = await countItem(wishResult.name);
	addHistory(wishResult);

	wishResult.isNew = numberOfItemOfHistory < 1;
	if (wishResult.type === 'character') {
		if (numberOfItemOfHistory < 1) return wishResult;
		wishResult.stelaFortuna = numberOfItemOfHistory < 8;
	}
	wishResult.fateType = wishResult.rarity === 3 ? 'stardust' : 'starglitter';
	wishResult.fateQty = wishResult.rarity === 3 ? 15 : 10;

	// console.log(wishResult)
	return wishResult;
};

export default roll;
