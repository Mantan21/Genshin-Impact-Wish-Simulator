import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

const supportedLocales = ['zh-CN', 'en-US', 'id-ID', 'it-IT', 'ja-JP', 'ru-RU', 'th-TH', 'vi-VN','pt-BR'];
const itemLocales = ['en-US', 'ja-JP', 'ru-RU', 'zh-CN', 'vi-VN','pt-BR'];

const checkLocale = () => {
	const savedLocale = browser ? localStorage.getItem('locale') : null;
	const browserLocale = savedLocale || getLocaleFromNavigator();
	const usedLocale = supportedLocales.find((langID) => langID.includes(browserLocale));
	return usedLocale || 'en-US';
};

const mountLocale = () => {
	supportedLocales.forEach((langID) => {
		register(langID, () => import(`../../locales/${langID}.json`));
	});

	itemLocales.forEach((langID) => {
		register(langID, () => import(`../../locales/items/${langID}.json`));
	});

	const usedLocale = checkLocale();
	init({
		fallbackLocale: 'en-US',
		initialLocale: usedLocale
	});
};

export { mountLocale, checkLocale };
