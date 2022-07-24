import { outfits } from '$lib/data/outfits.json';
import { localOutfits } from '$lib/store/localstore';

const checkOutfitAvaibility = (charName) => {
	if (!charName) return false;
	const filtered = outfits.filter(({ characterName }) => charName === characterName);
	return { outfitAvailable: filtered.length > 0, outfitName: filtered[0]?.name };
};

const isOutfitOwned = (charName) => {
	const { outfitName } = checkOutfitAvaibility(charName);
	const ownedOutfits = localOutfits.get(outfitName);
	return !!ownedOutfits;
};

const isOutfitSet = (charName) => {
	const { outfitAvailable, outfitName } = checkOutfitAvaibility(charName);
	if (!outfitAvailable) return false;
	const ownedOutfits = localOutfits.get(outfitName);
	if (!ownedOutfits) return false;
	return ownedOutfits.isSet;
};

const getOutfit = (charName, charRarity, face = false) => {
	const nullItem = { name: '', wishBoxPosition: {}, rarity: 0 };
	const { name, wishBoxPosition, rarity } =
		outfits.find(({ characterName }) => charName === characterName) || nullItem;
	const defaultDir = face ? 'face' : `splash-art/${charRarity}star`;
	const defaultPath = `/images/characters/${defaultDir}/${charName}.webp`;
	const dir = face ? 'face' : 'splash-art';
	return {
		outfitPath: `/images/characters/outfit/${dir}/${name}.webp`,
		defaultPath,
		outfitName: name,
		outfitRarity: rarity,
		wishBoxPosition
	};
};

export { getOutfit, checkOutfitAvaibility, isOutfitSet, isOutfitOwned };
