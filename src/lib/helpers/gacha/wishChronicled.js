import { chronicledCourse } from '$lib/store/app-stores';
import { fatepointManager } from '../dataAPI/api-localstore';
import { get3StarItem, get4StarItem, get5StarItem, rand } from './itemdrop-base';
import { getRate, prob } from './probabilities';

const fatepoint = {
	init({ version, phase }) {
		this._fatepointManager = fatepointManager.init({ version, phase, banner: 'chronicled' });
		return this;
	},

	check() {
		this._info = this._fatepointManager.getInfo();
		return this._info;
	},

	verify(result) {
		const { _info, _fatepointManager } = this;
		const { selected, point, type } = _info;
		if (!selected) return false;

		// Reset Fatepoint
		if (result.name === selected) {
			_fatepointManager.set(0, null, result.type);
			chronicledCourse.set({ point: 0, selected: null, type: null });
			return point === 1;
		}

		// Update Fatepoint if not a selected item
		_fatepointManager.set(1, selected, type);
		chronicledCourse.set({ point: 1, selected, type });
		return false;
	}
};

const chronicledWish = {
	init({ version, phase, stdver, characters, weapons, region } = {}) {
		this._version = version;
		this._phase = phase;
		this._characters = characters;
		this._weapons = weapons;
		this._stdver = stdver;
		this._region = region;

		this._epitomized = fatepoint.init({ version, phase, characters, weapons });
		return this;
	},

	get(rarity) {
		const { _characters: ch, _weapons: wp } = this;
		// 3 star items
		if (rarity === 3) {
			const droplist = get3StarItem();
			return rand(droplist);
		}

		// 4 star items (Character or Weapon)
		if (rarity === 4) {
			const droplist = get4StarItem({
				banner: 'chronicled',
				version: this._version,
				phase: this._phase,
				region: this._region,
				rateupNamelist: [...ch['4star'], ...wp['4star']]
			});
			return rand(droplist);
		}

		// 5 Star Weapon
		if (rarity === 5) {
			const { _characters: ch, _weapons: wp, _region, _stdver, _epitomized } = this;
			const { point, selected, type } = _epitomized.check();

			const rateUpNameList = type === 'weapon' ? wp['5star'] : ch['5star'];
			const rateupList = rateUpNameList.filter((name) => name !== selected);
			let useRateup = point > 0 && !!selected;

			// Probability to get Selected Item
			if (point < 1 && !!selected) {
				const selectedRate = getRate('chronicled', 'selectedRate');
				const { item } = prob([
					{ item: 'selected', chance: selectedRate },
					{ item: 'random', chance: 100 - selectedRate }
				]);
				useRateup = item === 'selected';
			}

			// list all available
			const droplist = get5StarItem({
				banner: 'chronicled',
				region: _region,
				stdver: _stdver,
				rateupItem: useRateup ? [selected] : rateupList,
				useRateup,
				type
			});

			const result = rand(droplist);
			const isFatepointFull = _epitomized?.verify(result);
			const randomStatus = !selected ? 'unset' : 'lose';
			const fatepointstatus = isFatepointFull ? 'selected' : randomStatus;
			result.status = point < 1 && result?.name === selected ? 'win' : fatepointstatus;
			return result;
		}
	}
};

export default chronicledWish;

