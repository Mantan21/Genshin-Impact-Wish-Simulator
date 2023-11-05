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
	deleteImage: async ({ hash, id } = {}) => {
		if (!(hash && id)) return;

		const formdata = new FormData();
		formdata.append('action', 'delete');
		formdata.append('delete', 'image');
		formdata.append('deleting[id]', id);
		formdata.append('deleting[hash]', hash);

		const data = await fetch('https://ibb.co/json', { method: 'POST', body: formdata });
		const { status_code } = await data.json();
		return status_code === 200;
	},

	updateData: async (localID) => {
		if (!localID) return;

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

		try {
			const body = { app: 'genshin', action: 'put', data: localData, id: shareID };
			const headers = new Headers();
			headers.append('Content-Type', 'application/json');

			const request = await fetch(apiURL + '/storage', {
				method: 'POST',
				body: JSON.stringify(body),
				headers
			});

			const { success, id, message } = await request.json();
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

	deleteBanner: async (bannerID) => {
		try {
			const { shareID } = await idb.get(bannerID);
			if (!shareID) {
				await idb.delete(bannerID);
				return { status: 'ok' };
			}

			// Remove from Cloud
			const body = { app: 'genshin', action: 'delete', id: shareID };
			const headers = new Headers();
			headers.append('Content-Type', 'application/json');

			const request = await fetch(apiURL + '/storage', {
				method: 'POST',
				body: JSON.stringify(body),
				headers
			});

			const { success } = await request.json();
			if (!success) throw new Error('Failed to Remove');
			await idb.delete(bannerID);
			return { status: 'ok' };
		} catch (e) {
			return { status: 'error' };
		}
	}
};

