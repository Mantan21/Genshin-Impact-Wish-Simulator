import { getAllChars, get3StarItem, get4StarItem, standardChars5Star, rand } from './wishBase';
import { guaranteedStatus } from '$lib/store/localstore';

const limitedWish = {
	init(eventsData, indexOfBanner) {
		const { item, rateup } = eventsData;
		this._character = item;
		this._rateup = rateup;
		this._indexOfBanner = indexOfBanner;
		return this;
	},

	_rateupChars() {
		return getAllChars(4).filter(({ name }) => this._rateup.includes(name));
	},

	_featuredChars() {
		let { _character, _indexOfBanner } = this;
		if (Array.isArray(_character)) _character = _character[_indexOfBanner];
		const result = getAllChars(5).find(({ name }) => name === _character.character);
		return result;
	},

	get(rarity, opt) {
		const { version, phase, excluded } = opt;
		if (rarity === 3) return get3StarItem();
		if (rarity === 4) {
			const resultType = rand(['rateup', 'std']);
			if (resultType === 'std') return get4StarItem('limited', version, phase);

			// If rate up character
			return rand(this._rateupChars());
		}

		if (rarity === 5) {
			// Guaranteed
			const limitedResult = this._featuredChars();
			if (guaranteedStatus.get('events')) {
				guaranteedStatus.set('events', false);
				return limitedResult;
			}

			// not guaranteed
			const resultType = rand(['limited', 'std']);
			if (resultType === 'std') {
				guaranteedStatus.set('events', true);
				return rand(standardChars5Star(excluded));
			}

			// win 50: 50
			guaranteedStatus.set('events', false);
			return limitedResult;
		}
	}
};

export default limitedWish;
