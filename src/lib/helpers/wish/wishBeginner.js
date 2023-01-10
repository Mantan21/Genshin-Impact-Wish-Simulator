import { guaranteedStatus, beginnerRoll } from '$lib/store/localstore';
import { showBeginner } from '$lib/store/stores';
import { get3StarItem, get4StarItem, getAllChars, rand } from './wishBase';

const beginerWish = (rarity, beginnerData) => {
	let { character, vision } = beginnerData.featured;

	const alreadyGetFeatured = guaranteedStatus.get('beginner');
	const rollCount = beginnerRoll.get() || 0;
	beginnerRoll.set(rollCount + 1);

	if (rollCount === 9) {
		// Guaranteed get noelle in 10 pul
		// if already get Noelle, no more guaranteed
		if (!alreadyGetFeatured) {
			guaranteedStatus.set('beginner', true);
			return { type: 'character', rarity: 4, name: character, vision };
		}
	}

	// remove beginner banner after 20 roll
	if (rollCount >= 19) showBeginner.set(false);

	if (rarity === 3) return get3StarItem();
	if (rarity === 5) {
		const result = getAllChars(5).filter(({ name }) => beginnerData.characters.includes(name));
		return rand(result);
	}

	if (rarity === 4) {
		const result = get4StarItem('beginner', null, null, beginnerData.characters);
		const isItemRateup = character.includes(result.name);

		// set Guaranteed status
		if (!alreadyGetFeatured && isItemRateup) guaranteedStatus.set('beginner', true);
		return result;
	}
};

export default beginerWish;
