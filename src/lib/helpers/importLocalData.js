import {
	primogem,
	genesis,
	stardust,
	starglitter,
	intertwined,
	acquaint,
	bannerPhase,
	patchVersion,
	unlimitedFates,
	muted,
	animeoff
} from '$lib/store/stores';
import { localBalance, localBannerVersion, localConfig } from '$lib/store/localstore';
import { storageVersion, version } from '$lib/data/wish-setup.json';
import { noticeMark } from './noticeMark';

/**
 * Read Balance From LocalStorage
 * @param null
 */
const importLocalBalance = () => {
	const localGenesis = localBalance.get('genesis');
	if (localGenesis !== null) genesis.set(localGenesis);

	let localPrimo = localBalance.get('primogem');
	if (localPrimo === null) {
		primogem.subscribe((v) => {
			localPrimo = v;
		});
		localBalance.set('primogem', localPrimo);
	} else primogem.set(localPrimo);

	const localStardust = localBalance.get('stardust');
	if (localStardust !== null) stardust.set(localStardust);

	const localStarglitter = localBalance.get('starglitter');
	if (localStarglitter !== null) starglitter.set(localStarglitter);

	const localIntertwined = localBalance.get('intertwined');
	if (localIntertwined !== null) intertwined.set(localIntertwined);

	const localAcquaint = localBalance.get('acquaint');
	if (localAcquaint !== null) acquaint.set(localAcquaint);

	// Setting
	unlimitedFates.set(localConfig.get('wishAmount') === 'unlimited');
	muted.set(!!localConfig.get('muted'));
	animeoff.set(!!localConfig.get('animeoff'));
	noticeMark.onLoadCheck();

	console.log('Balance Updated');
};

/**
 * Set Banner Version And Phase base on user Storage
 * @param null
 */
const setBannerVersionAndPhase = () => {
	const localstoreVersion = localStorage.getItem('storageVersion');
	if (localstoreVersion !== storageVersion) {
		localBannerVersion.clear();
		localStorage.setItem('storageVersion', storageVersion);
	}

	const localVersion = localBannerVersion.get();
	if (!localVersion) return patchVersion.set(version);
	const [patch, phase] = localVersion.split('-');
	bannerPhase.set(parseInt(phase));
	patchVersion.set(patch);

	console.log(`Banner version set to ${patch} phase ${phase}`);
};

export { importLocalBalance, setBannerVersionAndPhase };
