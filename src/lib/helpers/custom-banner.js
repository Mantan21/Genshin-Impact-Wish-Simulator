import { BannerManager } from '$lib/store/IDB-manager';

const idb = BannerManager;
export const localBanner = {
	isComplete: async (id) => {
		const { character, images, rateup = [], bannerName } = (await idb.get(id)) || {};
		const { artURL } = images || {};
		const complete = !!artURL && !!character && rateup.length > 0 && !!bannerName;
		return complete;
	}
};

