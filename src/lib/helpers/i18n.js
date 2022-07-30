import { browser } from '$app/env';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

const supportedLocales = ['en-US', 'id-ID', 'zh-CN'];
const itemLocales = ['en-US', 'zh-CN'];

const mountLocale = () => {
	supportedLocales.forEach((langID) => {
		register(langID, () => import(`../../locales/${langID}.json`));
	});

	itemLocales.forEach((langID) => {
		register(langID, () => import(`../../locales/characters/${langID}.json`));
		register(langID, () => import(`../../locales/weapons/${langID}.json`));
	});

	const savedLocale = browser ? localStorage.getItem('locale') : null;
	const browserLocale = savedLocale || getLocaleFromNavigator();
	const usedLocale = supportedLocales.find((langID) => langID.includes(browserLocale));

	init({
		fallbackLocale: 'en-US',
		initialLocale: usedLocale
	});
};

export { mountLocale };
