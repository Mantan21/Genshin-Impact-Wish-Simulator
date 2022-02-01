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

const beginnerAlreadyGuaranteed = {
	set(opt) {
		localStorage.setItem('beginnerAlreadyGuaranteed', opt);
		return opt;
	},
	get() {
		let isGuaranteed = localStorage.getItem('beginnerAlreadyGuaranteed');
		return isGuaranteed;
	}
};

const nextGuaranteed = {
	set(opt) {
		localStorage.setItem('nextGuaranteed', opt);
		return opt;
	},
	get() {
		const isGuaranteed = localStorage.getItem('nextGuaranteed');
		return isGuaranteed;
	}
};

const nextWeaponGuaranteed = {
	set(opt) {
		localStorage.setItem('nextWeaponGuaranteed', opt);
		return opt;
	},
	get() {
		const isGuaranteed = localStorage.getItem('nextWeaponGuaranteed');
		return isGuaranteed;
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

export {
	pity4star,
	pity5star,
	beginnerRoll,
	beginnerAlreadyGuaranteed,
	nextGuaranteed,
	nextWeaponGuaranteed,
	localBalance,
	localBannerVersion,
	firstShare,
	localFatePoint
};
