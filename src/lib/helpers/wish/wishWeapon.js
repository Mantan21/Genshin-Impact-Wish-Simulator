import { localFatePoint, guaranteedStatus } from '$lib/store/localstore';
import { fatePoint, selectedCourse } from '$lib/store/stores';
import { rand, getAllWeapons, get3StarItem, get4StarItem, standardWeapons } from './wishBase';
import prob from './prob';

const fatepoint = {
	init(version, phase, featuredData) {
		this._localFate = localFatePoint.init(version, phase);
		this._version = version;
		this._phase = phase;
		this._featured = featuredData;
		return this;
	},

	check() {
		const localSelectedCourse = this._localFate.getSelected();
		if (localSelectedCourse === null) return { localSelectedCourse };
		this.localFate = localFatePoint.init(this._version, this._phase, localSelectedCourse);
		const localPoint = this._localFate.getPoint();
		this.localPoint = localPoint;
		if (localPoint !== 2) return { localSelectedCourse: null, localPoint };

		/** Reset when Full Point */
		this._localFate.remove();
		return { localSelectedCourse, localPoint };
	},

	updater(obj) {
		const localSelectedCourse = this._localFate.getSelected();
		if (localSelectedCourse === null) return;
		const resultIndex = this._featured.findIndex(({ name }) => obj.name === name);

		if (localSelectedCourse - 1 === resultIndex) {
			fatePoint.set(0);
			selectedCourse.set({ name: null, index: null });
			return this._localFate.remove();
		}

		const point = this.localPoint + 1;
		fatePoint.set(point);
		return this._localFate.set(point);
	}
};

const weaponWish = {
	init(version, phase, weaponsData) {
		this._weapons = weaponsData;
		this._phase = phase;
		this._version = version;
		return this;
	},

	_rateupWeapons() {
		return getAllWeapons(4).filter(({ name }) => this._weapons.rateup.includes(name));
	},
	_featuredWeaponsName() {
		return this._weapons.featured.map(({ name }) => name);
	},
	_featuredWeapons() {
		return getAllWeapons(5).filter(({ name }) => this._featuredWeaponsName().includes(name));
	},

	get(rarity) {
		if (rarity === 3) return get3StarItem();
		if (rarity === 4) {
			// guaranteed after lost 75:25
			const isGuaranteed = guaranteedStatus.get('weapons4Star');
			const item = [
				{ type: 'rateup', chance: 75 },
				{ type: 'std', chance: 25 }
			];
			const { type } = prob(item);
			if (type === 'rateup' || isGuaranteed) {
				// If rate up Weapons
				const result = rand(this._rateupWeapons());
				guaranteedStatus.set('weapons4Star', false);
				return result;
			}

			// Non-Rateup Items
			const rateupNames = this._rateupWeapons().map(({ name }) => name);
			const result = get4StarItem('weapons', this._version, this._phase, rateupNames);
			guaranteedStatus.set('weapons4Star', true);
			return result;
		}

		if (rarity === 5) {
			const { _version, _phase, _weapons } = this;
			const course = fatepoint.init(_version, _phase, _weapons.featured);
			const { localSelectedCourse, localPoint } = course.check();
			const isGuaranteed = guaranteedStatus.get('weapons');

			// When Fatepoint already Filled, guaranteed to pull selected Weapon
			if (localPoint > 1) {
				guaranteedStatus.set('weapons', false);
				const result = this._featuredWeapons().find(({ name }) => {
					return _weapons.featured[localSelectedCourse - 1].name === name;
				});
				result.status = 'selected';
				course.updater(result);
				return result;
			}

			// When Not guaranteed ( Rate OFF)
			let status;
			if (!isGuaranteed) {
				const item = [
					{ type: 'featured', chance: 75 },
					{ type: 'std', chance: 25 }
				];
				const { type } = prob(item);

				// Lose rateoff
				if (type === 'std') {
					const result = rand(standardWeapons(5, this._featuredWeaponsName()));
					guaranteedStatus.set('weapons', true);
					course.updater(result);
					result.status = 'lose';
					return result;
				}
				status = 'win';
			} else status = 'guaranteed';

			// When Guaranteed and win rate off
			const result = rand(this._featuredWeapons());
			guaranteedStatus.set('weapons', false);
			course.updater(result);
			result.status = status;
			return result;
		}
	}
};

export default weaponWish;
