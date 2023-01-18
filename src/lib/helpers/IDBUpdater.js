import HistoryIDB from '$lib/store/historyIdb';

const { getByName, addHistory } = HistoryIDB;

const updateNameFromIDB = async (before, after) => {
	const kokomi = await getByName(before);
	kokomi.forEach(async (item) => {
		item.name = after;
		await addHistory(item);
	});
};

export const IDBUpdater = () => {
	updateNameFromIDB('sagonomiya-kokomi', 'sangonomiya-kokomi');
	updateNameFromIDB('alhaitam', 'alhaitham');
};

