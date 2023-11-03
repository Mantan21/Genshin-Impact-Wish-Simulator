import { beginner } from '$lib/data/banners/beginner.json';
import { standard } from '$lib/data/banners/standard.json';
import { version, wishPhase } from '$lib/data/wish-setup.json';

import { BannerManager } from '$lib/store/IDB-manager';
import {
	activeBanner,
	activeVersion,
	bannerList,
	customData,
	editorMode,
	isCustomBanner,
	isFatepointSystem,
	preloadVersion,
	showBeginner
} from '$lib/store/app-stores';
import { localConfig, rollCounter } from '$lib/store/localstore-manager';

const idb = BannerManager;
const useCustomBanner = async (from, bannerID) => {
	try {
		const useLocal = from.match('local');
		const data = useLocal ? await idb.get(bannerID) : {};
		if (!data) return preloadVersion.set({ patch: version, phase: wishPhase });

		const {
			bannerName = '',
			character = '',
			rateup = [],
			images = {},
			hostedImages = {},
			vision = 'pyro',
			charTitle = '',
			artPosition = {}
		} = data;
		customData.set({ ...data, name: character, images: useLocal ? images : hostedImages });
		bannerList.set([
			{
				type: 'character-event',
				bannerName,
				character,
				rateup,
				images,
				vision,
				charTitle,
				artPosition
			}
		]);

		activeVersion.set({ patch: from, phase: bannerID });
		activeBanner.set(0);
		editorMode.set(false);
		isCustomBanner.set(true);
		localConfig.set('version', `${from}-${bannerID}`);
		return { status: 'ok' };
	} catch (e) {
		console.error(e);
		return { status: 'error' };
	}
};

const checkBeginnerBanner = () => {
	const starterRollCount = rollCounter.get('beginner');
	const isShowBeginner = starterRollCount < 20;
	showBeginner.set(isShowBeginner);
	return isShowBeginner;
};

export const initializeBanner = async ({ patch, phase }) => {
	try {
		if (!patch || !phase) return;
		if (patch.match(/(local|custom)/)) return useCustomBanner(patch, phase);

		const list = checkBeginnerBanner() ? [{ type: 'beginner', ...beginner.featured }] : [];

		const { data } = await import(`$lib/data/banners/events/${patch}.json`);
		const { banners } = data.find((b) => b.phase === phase);
		const { events, weapons, standardVersion: stdver } = banners;
		const { featured: stdFeatured } = standard.find(({ version }) => stdver === version) || {};

		const charEventBanner = {
			type: 'character-event',
			rateup: events.rateup,
			stdver
		};
		events.featured.forEach((eventdata) => list.push({ ...eventdata, ...charEventBanner }));
		list.push({ type: 'weapon-event', stdver, ...weapons });
		list.push({ type: 'standard', stdver, ...stdFeatured });

		bannerList.set(list);
		isFatepointSystem.set(!!weapons.fatepointsystem);

		activeVersion.set({ patch, phase });
		activeBanner.set(0);
		localConfig.set('version', `${patch}-${phase}`);

		customData.set({});
		isCustomBanner.set(false);
		return { status: 'ok' };
	} catch (e) {
		console.error(e);
		return { status: 'error', e };
	}
};

export const handleShowStarter = (isShow) => {
	if (!isShow) {
		return bannerList.update((bn) => {
			return bn.filter(({ type }) => type !== 'beginner');
		});
	}
	return bannerList.update((bn) => {
		bn.unshift({ type: 'beginner', ...beginner.featured });
		return bn;
	});
};

