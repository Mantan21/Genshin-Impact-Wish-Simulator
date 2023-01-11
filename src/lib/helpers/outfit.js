import { outfits } from '$lib/data/outfits.json';
import { localOutfits } from '$lib/store/localstore';

const checkOutfitAvaibility = (charName) => {
	if (!charName) return false;
	const filtered = outfits.filter(({ characterName }) => charName === characterName);
	return {
		outfitAvailable: filtered.length > 0,
		outfitName: filtered[0]?.name,
		outfitList: filtered
	};
};

const checkActiveOutfit = (charName) => {
	if (!charName) return;
	const { outfitList } = checkOutfitAvaibility(charName);
	if (outfitList.length < 1) return null;
	const activeOutfit = outfitList.filter(({ name }) => localOutfits.get(name)?.isSet)[0];
	return activeOutfit || null;
};

export { checkOutfitAvaibility, checkActiveOutfit };
