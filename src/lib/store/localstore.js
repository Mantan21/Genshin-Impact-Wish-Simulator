const pity5star = {
	set(banner, pity) {
		localStorage.setItem(`${banner}5sPity`, pity);
		return pity;
	},
	get(banner) {
		let pity = parseInt(localStorage.getItem(`${banner}5sPity`));
		if (pity > 90) return 0;
		return pity || 0;
	}
};

const pity4star = {
	set(banner, pity) {
		localStorage.setItem(`${banner}4sPity`, pity);
		return pity;
	},
	get(banner) {
		let pity = parseInt(localStorage.getItem(`${banner}4sPity`));
		if (pity > 11) return 0;
		return pity || 0;
	}
};

const beginnerRoll = {
	set(pity) {
		localStorage.setItem('beginnerRoll', pity);
		return pity;
	},
	get() {
		let pity = parseInt(localStorage.getItem('beginnerRoll'));
		if (pity > 20) return 20;
		return pity || 0;
	}
};

const guaranteedStatus = {
	_getData() {
		const status = localStorage.getItem('guaranteedStatus');
		if (!status) return { status: {} };
		const parsed = JSON.parse(status);
		return parsed;
	},

	set(key, value = false) {
		const { status } = this._getData();
		status[key] = !!value;
		localStorage.setItem('guaranteedStatus', JSON.stringify({ status }));
	},

	get(key) {
		const { status } = this._getData();
		return !!status[key];
	}
};

const localBalance = {
	set(type, qty) {
		localStorage.setItem(type, qty);
		return qty;
	},
	get(type) {
		const qty = localStorage.getItem(type);
		if (qty !== null && qty !== 'undefined') return parseInt(qty);
		return null;
	}
};

const localBannerVersion = {
	set(patch, phase) {
		localStorage.setItem('version', `${patch}-${phase}`);
	},
	get() {
		return localStorage.getItem('version');
	},
	clear() {
		return localStorage.removeItem('version');
	}
};

const firstShare = {
	set(value) {
		return localStorage.setItem('firstshare', value);
	},
	get() {
		return localStorage.getItem('firstshare');
	},
	check() {
		return localStorage.getItem('firstshare') !== 'yes';
	}
};

const localFatePoint = {
	getData() {
		const localFatepointData = localStorage.getItem('fatepoint');
		if (!localFatepointData) return { data: [] };
		const parsed = JSON.parse(localFatepointData);
		return parsed;
	},

	init(patch, phase, selected = null) {
		this.patch = patch;
		this.phase = phase;
		this.selected = selected;
		this.data = this.getData().data;
		this.selectedPhase = this.data.find((d) => d.patch === patch && d.phase === phase);
		return this;
	},

	set(point) {
		const { patch, phase, selected } = this;
		if (!this.selectedPhase) this.data.push({ patch, phase, selected, point });
		const findIndex = this.data.findIndex((d) => d.patch === patch && d.phase === phase);
		this.data[findIndex].point = point;
		this.data[findIndex].selected = selected;
		localStorage.setItem('fatepoint', JSON.stringify({ data: this.data }));
	},

	getSelected() {
		if (this.selectedPhase === undefined) return null;
		return this.selectedPhase.selected;
	},

	getPoint() {
		const { selectedPhase } = this;
		return selectedPhase ? selectedPhase.point : 0;
	},

	remove() {
		const { patch, phase, data } = this;
		const index = data.findIndex((d) => d.patch === patch && d.phase === phase);
		const newArray = data.filter((ar, i) => i !== index);
		localStorage.setItem('fatepoint', JSON.stringify({ data: newArray }));
	}
};

const localConfig = {
	_getData() {
		const config = localStorage.getItem('config');
		if (!config) return { config: {} };
		const parsed = JSON.parse(config);
		return parsed;
	},

	get(key) {
		const { config } = this._getData();
		return config[key] || null;
	},

	set(key, value) {
		const { config } = this._getData();
		config[key] = value;
		localStorage.setItem('config', JSON.stringify({ config }));
	}
};

const localOutfits = {
	_get() {
		const outfits = localStorage.getItem('outfits');
		if (!outfits) return { outfits: [] };
		const parsed = JSON.parse(outfits);
		return parsed;
	},

	get(outfitName) {
		const { outfits } = this._get();
		return outfits.find(({ name }) => name === outfitName);
	},

	check(outfitName) {
		const { outfits } = this._get();
		const filtered = outfits.filter(({ name }) => name === outfitName);
		return filtered.length > 0;
	},

	set(outfitName, isSet = false) {
		const { outfits } = this._get();
		if (this.check(outfitName)) {
			const index = outfits.findIndex(({ name }) => name === outfitName);
			outfits[index].isSet = isSet;
		} else {
			outfits.push({ name: outfitName, isSet });
		}
		localStorage.setItem('outfits', JSON.stringify({ outfits }));
	}
};

const localWelkin = {
	getData() {
		const welkin = localStorage.getItem('welkin');
		if (!welkin) return { remaining: 0, diff: 0 };
		const parsed = JSON.parse(welkin);

		const utc = new Date().getTime() - 3 * 3600 * 1000;
		const today = new Date(utc).toDateString();
		const counter = Math.abs(new Date(today) - new Date(parsed.latestCheckIn));
		parsed.diff = Math.ceil(counter / (1000 * 60 * 60 * 24));
		return parsed;
	},

	checkin(action = 'checkin') {
		let { remaining, latestCheckIn } = this.getData();
		const time = new Date().getTime() - 3 * 3600 * 1000;
		const today = new Date(time).toDateString();
		if (!latestCheckIn && action !== 'checkin') {
			const object = { remaining: 29, latestCheckIn: today, diff: 0 };
			return localStorage.setItem('welkin', JSON.stringify(object));
		}

		if (action !== 'checkin') {
			const days = remaining < 1 ? 29 : 30;
			const object = { remaining: days + remaining, latestCheckIn: today, diff: 0 };
			return localStorage.setItem('welkin', JSON.stringify(object));
		}

		const counter = Math.abs(new Date(today) - new Date(latestCheckIn));
		const diffDays = Math.ceil(counter / (1000 * 60 * 60 * 24));

		remaining = remaining - diffDays;
		remaining = remaining < 0 ? 0 : remaining;
		latestCheckIn = today;
		localStorage.setItem('welkin', JSON.stringify({ remaining, latestCheckIn, diff: 0 }));
	}
};

export {
	pity4star,
	pity5star,
	beginnerRoll,
	guaranteedStatus,
	localBalance,
	localBannerVersion,
	firstShare,
	localFatePoint,
	localConfig,
	localOutfits,
	localWelkin
};
