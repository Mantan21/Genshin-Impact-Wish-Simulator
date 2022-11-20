import { browser } from '$app/environment';
import { openDB } from 'idb';

const version = 1;
const DBName = 'WishSimulator';
const storeName = 'history';

let IndexedDB;
if (browser) {
	IndexedDB = openDB(DBName, version, {
		upgrade(db) {
			const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
			store.createIndex('banner', 'banner', { unique: false });
			store.createIndex('name', 'name', { unique: false });
		}
	});
}

const HistoryIDB = {
	async historyCount() {
		return (await IndexedDB).count(storeName);
	},
	async getList(banner) {
		return (await IndexedDB).getAllFromIndex(storeName, 'banner', banner);
	},

	async countItem(name) {
		return (await IndexedDB).countFromIndex(storeName, 'name', name);
	},

	async getByName(name) {
		return (await IndexedDB).getAllFromIndex(storeName, 'name', name);
	},

	async resetHistory(banner) {
		try {
			const idb = await IndexedDB;
			const keys = await idb.getAllKeysFromIndex(storeName, 'banner', banner);
			keys.forEach((key) => idb.delete(storeName, key));
			return 'success';
		} catch (e) {
			return 'failed';
		}
	},
	async clearIDB() {
		return (await IndexedDB).clear(storeName);
	},
	async getAllHistories() {
		return (await IndexedDB).getAll(storeName);
	},
	async addHistory(data) {
		// eslint-disable-next-line no-prototype-builtins
		if (!data.hasOwnProperty('banner')) return;
		return (await IndexedDB).put(storeName, data);
	},
	async delete(id) {
		if (!id) return;
		return (await IndexedDB).delete(storeName, id);
	}
};

export default HistoryIDB;
