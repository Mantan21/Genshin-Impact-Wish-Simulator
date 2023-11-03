import { deleteDB } from 'idb';
import { data as charDB } from '$lib/data/characters.json';
import { data as wpDB } from '$lib/data/weapons.json';
import { HistoryManager } from '$lib/store/IDB-manager';
import { localConfig } from '$lib/store/localstore-manager';
import { retriveOldData } from './collect-old-data';

const { addHistory, getByName, getAllHistories } = HistoryManager;

// const updateNameFromIDB = async (before, after) => {
// 	const kokomi = await getByName(before);
// 	kokomi.forEach(async (item) => {
// 		item.name = after;
// 		await addHistory(item);
// 	});
// };

// export const IDBUpdater = async () => {
// 	updateNameFromIDB('sagonomiya-kokomi', 'sangonomiya-kokomi');
// 	updateNameFromIDB('alhaitam', 'alhaitham');
// 	await deleteDB('workbox-expiration');
// };

export const IDBUpdater = async () => {
	const idbVer = localConfig.get('idbVer');
	if (!idbVer) return;
	if (idbVer >= 2) return;

	const itemIDs = {};
	charDB.forEach(({ itemID, name }) => (itemIDs[name] = itemID));
	wpDB.forEach(({ itemID, name }) => (itemIDs[name] = itemID));
	const idbData = await getAllHistories();

	idbData.forEach(async (data, i) => {
		data.itemID = itemIDs[data.name];
		await addHistory(data);

		if (i < idbData.length - 1) return;
		await retriveOldData();
		localConfig.set('idbVer', 2);
	});
};

/**
 * This file is Unused for now
 * To use this function, call on Layout.svelte inside onMount Scope
 */

