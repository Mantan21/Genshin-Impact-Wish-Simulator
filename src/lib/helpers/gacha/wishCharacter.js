import { guaranteedStatus, rollCounter } from '../dataAPI/api-localstore';
import { prob } from './probabilities';
import {
	get3StarItem,
	get4StarItem,
	rand,
	get5StarItem,
	isRateup,
	checkGuaranteed
} from './itemdrop-base';

const characterWish = {
	init({ indexOfBanner, featured, rateup, version, phase, stdver, customData }) {
		this._featured = featured;
		this._rateup = rateup;
		this._indexOfBanner = indexOfBanner;
		this._version = version;
		this._phase = phase;
		this._stdver = stdver;
		this._customData = customData;
		return this;
	},

	get(rarity) {
		if (rarity === 3) {
			const droplist = get3StarItem();
			return rand(droplist);
		}

		if (rarity === 4) {
			const { _version: version, _phase: phase, _rateup: rateup } = this;
			const { status: isGuaranteed, never, always } = checkGuaranteed('character-event', 4);
			const useRateup = (isGuaranteed && !never) || always || isRateup('character-event');

			const droplist = get4StarItem({
				banner: 'character-event',
				rateupNamelist: rateup,
				useRateup,
				version,
				phase
			});

			guaranteedStatus.set('character-event-4star', !useRateup);
			return rand(droplist);
		}

		if (rarity === 5) {
			const { _featured, _indexOfBanner, _stdver, _customData, _version } = this;
			const { status: isGuaranteed, never, always } = checkGuaranteed('character-event', 5);
			const useRateup = (isGuaranteed && !never) || always || isRateup('character-event');

			// capturing Radiance
			let captured = false;
			if (_version >= 5.0 && !useRateup) {
				const radianceRoll = (rollCounter.get('radiance') || 0) + 1;
				const radianceRate = radianceRoll < 2 ? 0 : radianceRoll * 25;
				const { captureRadiance } = prob([
					{ captureRadiance: 'lose', chance: 100 - radianceRate },
					{ captureRadiance: 'win', chance: radianceRate }
				]);
				captured = captureRadiance === 'win';
				rollCounter.set('radiance', captured ? 0 : radianceRoll);
			}

			const droplist = get5StarItem({
				banner: 'character-event',
				stdver: _stdver,
				rateupItem: [_featured[_indexOfBanner].character],
				customData: _customData,
				useRateup: useRateup || captured
			});
			const result = rand(droplist);

			const statusGuarateed = (isGuaranteed && !never) || always;
			const rateUpStatus = statusGuarateed ? 'guaranteed' : 'win';
			const regularStatus = useRateup ? rateUpStatus : 'lose';
			const status = captured ? 'captured' : regularStatus;
			guaranteedStatus.set('character-event-5star', !(useRateup || captured));
			if (status === 'win') rollCounter.set('radiance', 0);
			return { ...result, status, captured };
		}
	}
};

export default characterWish;
