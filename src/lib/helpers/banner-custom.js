import { API_HOST } from '$lib/env';
import { BannerManager } from './dataAPI/api-indexeddb';
import { initCDNURL } from './assets';

const idb = BannerManager;
export const maintenance = false;

export const localBanner = {
	isComplete: async (itemID) => {
		const { character, images, rateup = [], bannerName } = (await idb.get(itemID)) || {};
		const { artURL } = images || {};
		const complete = !!artURL && !!character && rateup.length > 0 && !!bannerName;
		return complete;
	},

	isHostedBanner: async (itemID) => {
		const data = await idb.get(itemID);
		return 'hostedImages' in data;
	},

	renewImage: async ({ id = 0, newData = {}, key = '' }) => {
		const { data = {} } = newData;
		const { url: imageURL, delete_url } = data;
		const [, , , imgID, hash] = delete_url.split('/');
		const idbData = await idb.get(id);

		// create placeholder
		const { hostedImages = {}, imageHash = {}, imgChanged = {} } = idbData;
		const hashList = Object.keys(imageHash).map((k) => imageHash[k].id);
		idbData.hostedImages = hostedImages;
		idbData.imageHash = imageHash;
		idbData.imgChanged = imgChanged;

		const dontRemoveImage = hashList.filter((id) => id === imageHash[key]?.id).length > 1;
		if (!dontRemoveImage) {
			await onlineBanner.deleteImage(imageHash[key] || {});
		}

		// Set new values
		idbData.hostedImages[key] = imageURL;
		idbData.imageHash[key] = { id: imgID, hash };
		idbData.imgChanged[key] = false;
		return idb.put(idbData);
	}
};

export const onlineBanner = {
	async _postData({ action, data = {}, id }) {
		const body = { app: 'genshin', action, data, id };
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');

		const request = await fetch(API_HOST + '/storage', {
			method: 'POST',
			body: JSON.stringify(body),
			headers
		});

		const result = await request.json();
		return result;
	},

	async getData(shareID, multi = false) {
		try {
			if (!shareID) throw new Error();
			const response = await fetch(`${API_HOST}/storage?app=genshin&id=${shareID}`);
			const parsed = (await response.json()) || {};
			const { data = [] } = parsed;

			// Multi ID
			if (multi === 'multi') return parsed;

			// Single ID
			parsed.data = { ...data[0] };
			return parsed;
		} catch (e) {
			console.log(e);
			return { success: false, message: 'error' };
		}
	},

	async updateData(localID) {
		try {
			if (!localID) throw new Error('no ID');

			const date = new Date().toISOString();
			const idbData = await idb.get(localID);
			const localData = { ...idbData };
			const { shareID = null, images, character, isChanged } = localData;
			const { thumbnail } = images;

			// If nothing changed, dont proccess upload
			if (!isChanged) return { status: 'ok', shareID, thumbnail, character };

			delete localData.images;
			delete localData.imgChanged;
			delete localData.status;
			delete localData.isChanged;
			delete localData.shareID;
			delete localData.lastSync;
			localData.lastModified = date;
			if (localData.deleted) localData.deleted = false;

			const onlineData = await this._postData({ id: shareID, action: 'put', data: localData });
			const { success, id, db, message } = onlineData;
			if (!success) throw new Error('Failed to Update');

			idbData.db = db;
			idbData.shareID = id;
			idbData.lastModified = date;
			idbData.lastSync = date;
			idbData.isChanged = false;
			delete idbData.deleted;
			await idb.put(idbData);

			return { status: 'ok', shareID: id, thumbnail, message, character };
		} catch (e) {
			console.error(e);
			return { status: 'error' };
		}
	},

	async deleteBanner(itemID) {
		try {
			const { shareID, status, db, imageHash = {} } = (await idb.get(itemID)) || {};

			// Only delete local data if not shared
			if (status === 'cloud' || !shareID) {
				await idb.delete(itemID);
				return { status: 'ok' };
			}

			// Remove Images
			const keys = Object.keys(imageHash);
			for (let i = 0; i < keys.length; i++) {
				const hashID = imageHash[keys[i]];
				await this.deleteImage(hashID);
			}

			// Remove from Cloud
			const { success } = await this._postData({ action: 'delete', id: shareID, data: { db } });
			if (!success) throw new Error('Failed to Remove');
			await idb.delete(itemID);
			return { status: 'ok' };
		} catch (e) {
			return { status: 'error' };
		}
	},

	async deleteImage({ hash, id } = {}) {
		if (!(hash && id)) return;

		try {
			const formdata = new FormData();
			formdata.append('action', 'delete');
			formdata.append('delete', 'image');
			formdata.append('deleting[id]', id);
			formdata.append('deleting[hash]', hash);

			const data = await fetch('https://ibb.co/json', { method: 'POST', body: formdata });
			const { status_code } = await data.json();
			console.log(id, hash, status_code);
			return status_code === 200;
		} catch (e) {
			console.error(e);
			return false;
		}
	},

	async block(id, db) {
		if (!id) return;
		try {
			const { success } = await this._postData({ action: 'block', id, data: { db } });
			return success;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
};

export const syncCustomBanner = async () => {
	try {
		const storedBanner = (await idb.getAll()) || [];
		if (storedBanner.length < 1) return;

		// Initialize cdn url generator for custom banner images
		await initCDNURL();

		const localBannerIDs = storedBanner.map(({ shareID }) => shareID).filter((id) => !!id);
		const ids = localBannerIDs.join(',');
		const { success, data = [] } = (await onlineBanner.getData(ids, 'multi')) || {};
		if (!success) return;

		// Renew Data
		const blockList = [];
		const deletedList = [];

		for (let x = 0; x < data.length; x++) {
			const dataToStore = { ...data[x] };
			const dataToModify = storedBanner.find(({ shareID }) => shareID === dataToStore.id);
			if (dataToStore.blocked) blockList.push(dataToStore.id); //save id if blocked
			if (dataToStore.deleted) deletedList.push(dataToStore.id);

			dataToStore.status = dataToModify.status;
			dataToStore.shareID = dataToStore.id;
			delete dataToStore.id;

			if (dataToModify.status === 'cloud') {
				delete dataToStore.imageHash;
				await idb.put(dataToStore);
			}

			if (dataToModify.status === 'owned') {
				if (dataToStore.deleted) {
					delete dataToModify.imageHash;
					delete dataToModify.hostedImages;

					const imgObj = {};
					Object.keys(dataToModify.images).forEach((key) => (imgObj[key] = true));
					dataToModify.imgChanged = imgObj;
					dataToModify.isChanged = true;
					await idb.put({ ...dataToModify, deleted: true });
					continue;
				}

				// prettier-ignore
				const { hostedImages = {}, imageHash = {}, blocked = false, lastModified, db = 1 } = dataToStore;
				const modifiedData = {
					...dataToModify,
					hostedImages,
					imageHash,
					blocked,
					db,
					lastSync: lastModified
				};
				await idb.put(modifiedData);
			}
		}

		// Update CustomBanner Data on IDB
		const cloudBannerIDs = data.map(({ id }) => id);
		const unAvailableBanner = localBannerIDs.filter((id) => {
			const isBlocked = blockList.includes(id);
			const isDeleted = deletedList.includes(id);
			const unavailable = !cloudBannerIDs.includes(id);
			return unavailable || isBlocked || isDeleted;
		});

		for (let i = 0; i < unAvailableBanner.length; i++) {
			const sharedID = unAvailableBanner[i];
			const { itemID, status } = storedBanner.find(({ shareID: id }) => id === sharedID);

			// Remove Unavailable Banner
			if (status === 'cloud') {
				await idb.delete(itemID);
				continue;
			}

			// Update shared status to unshared if not found in online storage
			if (status === 'owned') {
				const updatedData = await idb.get(itemID);

				if (updatedData.shareID) continue;

				delete updatedData.imgChanged;
				delete updatedData.shareID;
				updatedData.isChanged = true;
				updatedData.imgChanged = { artURL: true, faceURL: true, thumbnail: true };
				updatedData.lastModified = new Date().toISOString();
				await idb.put(updatedData);
			}
		}
	} catch (e) {
		console.error('sync custom banner failed', e);
	}
};
