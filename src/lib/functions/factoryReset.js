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
	notice
} from '$lib/store/stores';
import { locale } from 'svelte-i18n';
import HistoryIDB from '$lib/store/historyIdb';
import { wishPhase, version } from '$lib/setup/wish-setup.json';

const { clearIDB } = HistoryIDB;
const factoryReset = async () => {
	localStorage.clear();
	localStorage.setItem('primogem', 1600);
	locale.update((langID) => {
		localStorage.setItem('locale', langID);
		return langID;
	});

	await clearIDB();

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
};

export default factoryReset;
