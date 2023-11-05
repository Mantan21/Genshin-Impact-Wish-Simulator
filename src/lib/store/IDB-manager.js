import { browser } from '$app/environment';
import { openDB } from 'idb';

const version = 3;
const DBName = 'WishSimulator';

let IndexedDB;

if (browser) {
	IndexedDB = openDB(DBName, version, {
		async upgrade(db, oldVer, newVer, transaction) {
			if (!db.objectStoreNames.contains('history')) {
				const historyStore = db.createObjectStore('history', {
					keyPath: 'id',
					autoIncrement: true
				});
				historyStore.createIndex('banner', 'banner', { unique: false });
				historyStore.createIndex('itemID', 'itemID', { unique: false });
			} else {
				const historyStore = transaction.objectStore('history');
				const hasID = historyStore.indexNames.contains('itemID');
				if (!hasID) historyStore.createIndex('itemID', 'itemID', { unique: false });
			}

			if (!db.objectStoreNames.contains('assets')) {
				db.createObjectStore('assets', { keyPath: 'key', autoIncrement: false });
			}

			if (!db.objectStoreNames.contains('custombanner')) {
				const bnStore = db.createObjectStore('custombanner', {
					keyPath: 'itemID',
					autoIncrement: false
				});
				bnStore.createIndex('status', 'status', { unique: false });
			}
		}
	});
}

export const HistoryManager = {
	async historyCount() {
		return (await IndexedDB).count('history');
	},
	async getListByBanner(banner) {
		return (await IndexedDB).getAllFromIndex('history', 'banner', banner);
	},

	async countItem(name) {
		return (await IndexedDB).countFromIndex('history', 'name', name);
	},

	async getByID(itemID) {
		return (await IndexedDB).getAllFromIndex('history', 'itemID', itemID);
	},

	async clearHistory(banner) {
		try {
			const idb = await IndexedDB;
			const keys = await idb.getAllKeysFromIndex('history', 'banner', banner);
			keys.forEach((key) => idb.delete('history', key));
			return 'success';
		} catch (e) {
			return 'failed';
		}
	},
	async clearIDB() {
		return (await IndexedDB).clear('history');
	},
	async getAllHistories() {
		return (await IndexedDB).getAll('history');
	},
	async addHistory(data) {
		// eslint-disable-next-line no-prototype-builtins
		if (!data.hasOwnProperty('banner')) return;
		return (await IndexedDB).put('history', data);
	},
	async delete(id) {
		if (!id) return;
		return (await IndexedDB).delete('history', id);
	}
};

// Assets Manager
export const AssetManager = {
	async put(data) {
		// eslint-disable-next-line no-prototype-builtins
		if (!data.hasOwnProperty('key')) return;
		return (await IndexedDB).put('assets', data);
	},
	async get(key) {
		if (!key) return null;
		return (await IndexedDB).get('assets', key);
	},
	async delete(key) {
		if (!key) return;
		return (await IndexedDB).delete('assets', key);
	}
};

// Custom Banner
export const BannerManager = {
	async getAll() {
		return (await IndexedDB).getAll('custombanner');
	},
	async put(data = {}) {
		if (!('itemID' in data)) return;
		const lastModified = new Date().toISOString();
		const idb = await IndexedDB;
		return idb.put('custombanner', { lastModified, ...data });
	},
	async get(itemID) {
		if (!itemID) return null;
		return (await IndexedDB).get('custombanner', itemID);
	},

	async getListByStatus(status) {
		return (await IndexedDB).getAllFromIndex('custombanner', 'status', status);
	},

	async delete(key) {
		if (!key) return;
		return (await IndexedDB).delete('custombanner', key);
	}
};
