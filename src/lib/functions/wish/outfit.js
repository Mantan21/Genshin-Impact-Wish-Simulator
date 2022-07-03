import { outfits } from '$lib/data/outfits.json';
import { localOutfits } from '$lib/store/localstore';

const check = (charName) => {
	const filtered = outfits.filter(({ characterName }) => charName === characterName);
	return { outfitAvailable: filtered.length > 0, outfitName: filtered[0]?.name };
};

const checkAndGetOutfitPath = (charName, charRarity, face = false) => {
	const defaultDir = face ? 'face' : `splash-art/${charRarity}star`;
	const defaultPath = `/assets/images/characters/${defaultDir}/${charName}.webp`;
	const { outfitAvailable, outfitName } = check(charName);
	if (!outfitAvailable) return defaultPath;

	const ownedOutfits = localOutfits.get(outfitName);
	if (!ownedOutfits) return defaultPath;

	const { isSet } = ownedOutfits;
	const outfitDir = face ? 'face' : 'splash-art';
	const outfitPatch = `/assets/images/characters/outfit/${outfitDir}/${outfitName}.webp`;
	return isSet ? outfitPatch : defaultPath;
};

export { checkAndGetOutfitPath };
