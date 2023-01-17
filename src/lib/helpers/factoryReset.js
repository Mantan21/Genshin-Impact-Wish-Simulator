import {
	acquaint,
	genesis,
	intertwined,
	primogem,
	stardust,
	starglitter,
	showBeginner,
	unlimitedFates,
	bannerPhase,
	patchVersion,
	selectedCourse,
	muted,
	notice,
	animeoff
} from '$lib/store/stores';
import { locale } from 'svelte-i18n';
import HistoryIDB from '$lib/store/historyIdb';
import { wishPhase, version } from '$lib/data/wish-setup.json';
import { localConfig } from '$lib/store/localstore';

const { clearIDB } = HistoryIDB;

const clearCacheStorage = async () => {
	const keys = await caches.keys();
	for (const key of keys) await caches.delete(key);
	return true;
};

const factoryReset = async ({ clearCache = false }) => {
	const adKey = localConfig.get('adKey');

	localStorage.clear();
	localConfig.set('animatedBG', true);
	localConfig.set('adKey', adKey);
	localStorage.setItem('primogem', 1600);
	locale.update((langID) => {
		localStorage.setItem('locale', langID);
		return langID;
	});

	await clearIDB();
	if (clearCache) await clearCacheStorage();

	acquaint.set(0);
	genesis.set(0);
	intertwined.set(0);
	primogem.set(1600);
	stardust.set(0);
	starglitter.set(0);

	selectedCourse.set({});

	showBeginner.set(true);
	bannerPhase.set(wishPhase);
	patchVersion.set(version);

	// Setting
	unlimitedFates.set(false);
	muted.set(false);
	notice.set([]);
	animeoff.set(false);
};

export default factoryReset;
