import { localConfig } from '$lib/store/localstore';
import { notice } from '$lib/store/stores';

const getNotices = () => localConfig.get('notice') || [];
const setNotices = (data = []) => localConfig.set('notice', data);

const noticeMark = {
	openNotice(key) {
		const openedNotice = getNotices();
		const isAlreadyOpen = openedNotice.includes(key);
		if (isAlreadyOpen) return;
		openedNotice.push(key);
		setNotices(openedNotice);
		notice.set(openedNotice);
		return;
	},

	onLoadCheck() {
		const openedNotice = getNotices();
		notice.set(openedNotice);
	}
};

export { noticeMark };
