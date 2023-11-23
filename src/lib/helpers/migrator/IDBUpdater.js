// import { deleteDB } from 'idb';
import { data as charDB } from '$lib/data/characters.json';
import { data as wpDB } from '$lib/data/weapons.json';
import { HistoryManager } from '$lib/store/IDB-manager';
import { cookie } from '$lib/store/cookie';
import { localConfig } from '$lib/store/localstore-manager';
import { retriveOldData } from './collect-old-data';
import { clearCacheStorage } from '../storage-reset';

const { addHistory, getAllHistories } = HistoryManager;

export const IDBUpdater = async () => {
	const idbVer = localConfig.get('idbVer');
	if (idbVer >= 3) return;

	const accessKey = cookie.get('adKey');
	if (accessKey) cookie.set('accessKey', accessKey);

	// Clear Storage
	await clearCacheStorage();

	// Update IDB
	const itemIDs = {};
	charDB.forEach(({ itemID, name }) => (itemIDs[name] = itemID));
	wpDB.forEach(({ itemID, name }) => (itemIDs[name] = itemID));
	const idbData = await getAllHistories();

	for (let i = 0; i < idbData.length; i++) {
		const data = idbData[i];
		data.itemID = itemIDs[data.name];
		await addHistory(data);

		if (i < idbData.length - 1) continue;
		await retriveOldData();
		localConfig.set('idbVer', 3);
		console.log('IDB Updated');
	}
};

/**
 * This file is Unused for now
 * To use this function, call on Layout.svelte inside onMount Scope
 */
