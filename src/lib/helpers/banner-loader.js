import { beginner } from '$lib/data/banners/beginner.json';
import { BannerManager } from '$lib/store/IDB-manager';
import {
	activeBanner,
	activeVersion,
	bannerList,
	editorMode,
	isFatepointSystem,
	showBeginner
} from '$lib/store/app-stores';
import { localConfig, rollCounter } from '$lib/store/localstore-manager';

const idb = BannerManager;
const useCustomBanner = async (from, bannerID) => {
	try {
		const useLocal = from.match('local');
		const data = useLocal ? await idb.get(bannerID) : {};
		// prettier-ignore
		const { bannerName = '', character = '', rateup = [], images= {}, vision = 'pyro', charTitle = '', artPosition= {} } = data;
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
		editorMode.set(false);
		activeBanner.set(0);
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
		const { standard } = await import(`$lib/data/banners/standard/${stdver}.json`);

		const charEventBanner = {
			type: 'character-event',
			rateup: events.rateup,
			stdver
		};
		events.featured.forEach((eventdata) => list.push({ ...eventdata, ...charEventBanner }));
		list.push({ type: 'weapon-event', stdver, ...weapons });
		list.push({ type: 'standard', stdver, ...standard.featured });

		bannerList.set(list);
		isFatepointSystem.set(!!weapons.fatepointsystem);

		activeVersion.set({ patch, phase });
		activeBanner.set(0);
		localConfig.set('version', `${patch}-${phase}`);
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

