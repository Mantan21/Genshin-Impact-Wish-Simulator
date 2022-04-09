import { beginnerAlreadyGuaranteed, beginnerRoll } from '$lib/store/localstore';
import { showBeginner } from '$lib/store/stores';
import { get3StarItem, get4StarItem, get4StarChars, getStandard5StarItem } from './wishBase';
import prob from './prob';

const beginerWish = (rarity, beginnerData, standardData, { version, phase }) => {
	let { character, vision } = beginnerData;

	const alreadyGetFeatured = beginnerAlreadyGuaranteed.get() === 'yes';
	const rollCount = beginnerRoll.get() || 0;
	beginnerRoll.set(rollCount + 1);

	if (rollCount === 19) {
		// If roll count 20
		showBeginner.set(false);
		// if already get Noelle, no more guaranteed
		if (!alreadyGetFeatured) {
			beginnerAlreadyGuaranteed.set('yes');
			return { type: 'character', rarity: 4, name: character, vision };
		}
	}

	if (rarity === 3) return get3StarItem();
	if (rarity === 5) return getStandard5StarItem({ exclude: standardData.characters });

	if (rarity === 4) {
		if (!alreadyGetFeatured) {
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

			const rng = prob(item);
			if (rng.name === 'rateup') {
				// guaranteed probability
				beginnerAlreadyGuaranteed.set('yes');
				return get4StarChars.find((c) => c.name === character);
			}
		}

		// get Random item
		const result = get4StarItem('standard', version, phase);
		if (result.name === character) beginnerAlreadyGuaranteed.set('yes');
		return result;
	}
};

export default beginerWish;
