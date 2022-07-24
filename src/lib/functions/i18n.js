import { browser } from '$app/env';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

const supportedLocales = ['en-US', 'id-ID', 'zh-CN'];

const mountLocale = () => {
	supportedLocales.forEach((langID) => {
		register(langID, () => import(`../../locales/${langID}.json`));
		register(langID, () => import(`../../locales/characters/${langID}.json`));
		register(langID, () => import(`../../locales/weapons/${langID}.json`));
	});
	

	const savedLocale = browser ? localStorage.getItem('locale') : 'en';
	const isLocale = savedLocale && supportedLocales.includes(savedLocale);
	const usedLocale = !isLocale && browser ? getLocaleFromNavigator() : savedLocale;

	init({
		fallbackLocale: 'en-US',
		initialLocale: usedLocale
	});
};

export { mountLocale };
