import { renewSavedFile } from './filesystem';

export const syncData = ({ to } = {}) => {
	if (to === 'local') return renewSavedFile();
	if (to == 'drive') return; //updateDrive()
	renewSavedFile();
	// updateDrive()
	return;
};

export const autoSync = (autoExport) => {
	if (autoExport) return syncData();
	return syncData({ to: 'drive' });
};

