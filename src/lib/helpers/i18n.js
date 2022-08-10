import { browser } from '$app/env';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

const supportedLocales = ['en-US', 'id-ID', 'ru-RU', 'zh-CN'];
const itemLocales = ['en-US', 'ru-RU', 'zh-CN'];

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
		register(langID, () => import(`../../locales/characters/${langID}.json`));
		register(langID, () => import(`../../locales/weapons/${langID}.json`));
	});

	const usedLocale = checkLocale();
	init({
		fallbackLocale: 'en-US',
		initialLocale: usedLocale
	});
};

export { mountLocale, checkLocale };
