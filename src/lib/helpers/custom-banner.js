import { BannerManager } from '$lib/store/IDB-manager';

const idb = BannerManager;
const apiURL = 'https://api.wishsimulator.app';

export const localBanner = {
	isComplete: async (id) => {
		const { character, images, rateup = [], bannerName } = (await idb.get(id)) || {};
		const { artURL } = images || {};
		const complete = !!artURL && !!character && rateup.length > 0 && !!bannerName;
		return complete;
	},

	isHostedBanner: async (id) => {
		const data = await idb.get(id);
		return 'hostedImages' in data;
	},

	renewImage: async ({ id = 0, newData = {}, key = '' }) => {
		const { data } = newData;
		const { url: imageURL, delete_url } = data;
		const [, , , imgID, hash] = delete_url.split('/');

		const idbData = await idb.get(id);
		idbData.hostedImages = idbData.hostedImages || {};
		idbData.imageHash = idbData.imageHash || {};
		idbData.imgChanged = idbData.imgChanged || {};

		await onlineBanner.deleteImage(idbData.imageHash[key] || {});
		idbData.hostedImages[key] = imageURL;
		idbData.imageHash[key] = { id: imgID, hash };
		idbData.imgChanged[key] = false;
		return idb.put(idbData);
	}
};

export const onlineBanner = {
	async _postData({ action, data, id }) {
		const body = { app: 'genshin', action, data, id };
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');

		const request = await fetch(apiURL + '/storage', {
			method: 'POST',
			body: JSON.stringify(body),
			headers
		});

		const result = await request.json();
		return result;
	},

	async getData(shareID) {
		try {
			if (!shareID) throw new Error();
			const response = await fetch(`${apiURL}/storage?app=genshin&id=${shareID}`);
			const parsed = (await response.json()) || {};
			parsed.data = { ...parsed.data[0] };
			return parsed;
		} catch (e) {
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
			localData.lastModified = date;

			const onlineData = await this._postData({ id: shareID, action: 'put', data: localData });
			const { success, id, message } = onlineData;
			if (!success) throw new Error('Failed to Update');

			idbData.shareID = id;
			idbData.lastModified = date;
			idbData.isChanged = false;
			await idb.put(idbData);

			return { status: 'ok', shareID: id, thumbnail, message, character };
		} catch (e) {
			console.error(e);
			return { status: 'error' };
		}
	},

	async deleteBanner(bannerID) {
		try {
			const { shareID, imageHash = {} } = (await idb.get(bannerID)) || {};
			if (!shareID) {
				await idb.delete(bannerID);
				return { status: 'ok' };
			}

			// Remove Images
			const keys = Object.keys(imageHash);
			for (let i = 0; i < keys.length; i++) {
				const hashID = imageHash[keys[i]];
				await this.deleteImage(hashID);
			}

			// Remove from Cloud
			const { success } = await this._postData({ action: 'delete', id: shareID });
			if (!success) throw new Error('Failed to Remove');
			await idb.delete(bannerID);
			return { status: 'ok' };
		} catch (e) {
			return { status: 'error' };
		}
	},

	async deleteImage({ hash, id } = {}) {
		if (!(hash && id)) return;

		const formdata = new FormData();
		formdata.append('action', 'delete');
		formdata.append('delete', 'image');
		formdata.append('deleting[id]', id);
		formdata.append('deleting[hash]', hash);

		const data = await fetch('https://ibb.co/json', { method: 'POST', body: formdata });
		const { status_code } = await data.json();
		console.log(id, hash, status_code);
		return status_code === 200;
	}
};
