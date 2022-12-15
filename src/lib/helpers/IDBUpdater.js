import HistoryIDB from '$lib/store/historyIdb';

const updateKokomiNameFromIDB = async () => {
	const { getByName, addHistory } = HistoryIDB;
	const kokomi = await getByName('sagonomiya-kokomi');

	kokomi.forEach(async (item) => {
		item.name = 'sangonomiya-kokomi';
		await addHistory(item);
	});
};

export const IDBUpdater = () => updateKokomiNameFromIDB();

