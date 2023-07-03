import { storageVersion, version as siteVersion, wishPhase } from '$lib/data/wish-setup.json';
import {
	activeVersion,
	autoskip,
	beginnerRemaining,
	wishAmount,
	primogem,
	acquaint,
	stardust,
	genesis,
	starglitter,
	intertwined
} from '$lib/store/app-stores';
import { localBalance, rollCounter, localConfig } from '$lib/store/localstore-manager';
import { noticeMark } from './noticeMark';

/**
 * Read Balance From LocalStorage
 * @param null
 */
export const importLocalConfig = () => {
	const {
		primogem: pr,
		intertwined: iw,
		acquaint: ac,
		genesis: gs,
		stardust: sd,
		starglitter: sg
	} = localBalance.all() || {};
	if (!isNaN(pr)) primogem.set(pr);
	if (!isNaN(ac)) acquaint.set(ac);
	if (!isNaN(iw)) intertwined.set(iw);
	if (!isNaN(gs)) genesis.set(gs);
	stardust.set(isNaN(sd) ? 0 : sd);
	starglitter.set(isNaN(sg) ? 0 : sg);

	const lAutoSkip = localConfig.get('autoskip') || false;
	autoskip.set(lAutoSkip);

	const lWishAmount = localConfig.get('wishAmount') || 'default';
	wishAmount.set(lWishAmount);

	const starterRollCount = rollCounter.get('beginner') || 0;
	beginnerRemaining.set(20 - starterRollCount);

	// Setting
	noticeMark.onLoadCheck();
	console.log('Balance Updated');
};

/**
 * Set Banner Version And Phase base on user Storage
 * @param null
 */
export const setBannerVersionAndPhase = () => {
	const localstoreVersion = localConfig.get('storageVersion');
	const localVersion = localConfig.get('version') || '';
	let [patch, phase] = localVersion.split('-');

	if (localstoreVersion !== storageVersion) {
		localConfig.set('version', `${siteVersion}-${wishPhase}`);
		localConfig.set('storageVersion', storageVersion);
		[patch, phase] = [siteVersion, wishPhase];
	}
	activeVersion.set({ patch: patch, phase: parseInt(phase) });

	console.log(`Banner version set to ${patch} phase ${phase}`);
};
