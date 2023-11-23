import { BannerManager, HistoryManager } from '$lib/store/IDB-manager';
import { cookie } from '$lib/store/cookie';
import { storageLocal } from '$lib/store/localstore-manager';

export const generateFileString = async () => {
	const banners = await BannerManager.getAll();
	const histories = await HistoryManager.getAllHistories();
	const settings = storageLocal.getData();
	const accessKey = cookie.get('accessKey');

	const dataToExport = { banners, histories, settings, accessKey };
	return JSON.stringify(dataToExport);
};

export const generateExport = async () => {
	const text = await generateFileString();
	const blob = new Blob([text], { type: 'text/plain' });
	const anchor = document.createElement('a');

	const date = new Date().toLocaleDateString();
	anchor.download = `WishSimulator.App_Backup_${date}.bin`;
	anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
	anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
	anchor.click();
};

