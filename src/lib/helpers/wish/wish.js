import { beginner } from '$lib/data/banners/beginner.json';
import { get3StarItem, get4StarItem, getStandard5StarItem } from './wishBase';
import limitedWish from './wishLimited';
import beginerWish from './wishBeginner';
import weaponWish from './wishWeapon';
import roll from './roll';

const Wish = {
	async init(version, phase) {
		const { data } = await import(`../../data/banners/events/${version}.json`);
		const { standardVersion, weapons, events } = data.find((d) => d.phase === phase).banners;
		const { standard } = await import(`../../data/banners/standard/${standardVersion}.json`);
		this._version = version;
		this._phase = phase;
		this._beginner = beginner;
		this._events = events;
		this._isDualBanner = Array.isArray(events.item) && events.item?.length > 1;
		this._weapons = weapons;
		this._standard = standard;
		return this;
	},

	_limitedWish(rarity, indexOfBannerEvents) {
		const { item } = this._events;
		const eventBanner = limitedWish.init(this._events, indexOfBannerEvents);
		const result = eventBanner.get(rarity, {
			excluded: this._standard.characters,
			version: this._version,
			phase: this._phase
		});
		result.bannerName = Array.isArray(item) ? item[indexOfBannerEvents].name : item.name;
		return result;
	},

	_beginnerWish(rarity) {
		const result = beginerWish(rarity, this._beginner);
		result.bannerName = 'beginner';
		return result;
	},

	_standardWish(rarity) {
		let result;
		if (rarity === 3) result = get3StarItem();
		if (rarity === 4) result = get4StarItem('standard', this._version, this._phase);
		if (rarity === 5) result = getStandard5StarItem({ exclude: this._standard.characters });
		result.bannerName = this._standard.featured.name;
		result.status = null;
		return result;
	},

	_weaponWish(rarity) {
		const { _weapons, _phase, _version } = this;
		const weaponBanner = weaponWish.init(_version, _phase, _weapons);
		const result = weaponBanner.get(rarity);
		result.bannerName = _weapons.name;
		return result;
	},

	getItem(rarity, banner, indexOfBanner) {
		let result;
		if (banner === 'beginner') result = this._beginnerWish(rarity);
		if (banner === 'standard') result = this._standardWish(rarity);
		if (banner === 'events') result = this._limitedWish(rarity, indexOfBanner);
		if (banner === 'weapons') result = this._weaponWish(rarity);
		if (!result) return { type: null, rarity: 0, name: null };

		const date = new Date();
		result.time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
		return result;
	}
};

export { roll };
export default Wish;
