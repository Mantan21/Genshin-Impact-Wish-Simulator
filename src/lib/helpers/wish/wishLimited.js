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

			// If rate up character
			if (resultType === 'rateup' || guaranteedStatus.get('events4Star')) {
				const result = rand(this._rateupChars());
				guaranteedStatus.set('events4Star', false);
				return result;
			}

			// Non-Rateup Items
			const result = get4StarItem('limited', version, phase);
			const isItemRateup = this._rateupChars()
				.map(({ name }) => name)
				.includes(result.name);
			guaranteedStatus.set('events4Star', !isItemRateup);
			return result;
		}

		if (rarity === 5) {
			// Guaranteed
			const limitedResult = this._featuredChars();
			if (guaranteedStatus.get('events')) {
				guaranteedStatus.set('events', false);
				limitedResult.status = 'guaranteed';
				return limitedResult;
			}

			// not guaranteed
			const resultType = rand(['limited', 'std']);
			if (resultType === 'std') {
				guaranteedStatus.set('events', true);
				const result = rand(standardChars5Star(excluded));
				result.status = 'lose';
				return result;
			}

			// win 50: 50
			guaranteedStatus.set('events', false);
			limitedResult.status = 'win';
			return limitedResult;
		}
	}
};

export default limitedWish;
