import { browser } from '$app/env';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

const supportedLocales = ['en-US', 'id-ID', 'zh-CN'];

const mountLocale = () => {
	supportedLocales.forEach((langID) => {
		register(langID, () => import(`../../locales/${langID}.json`));
	});
	register('en-US', () => import(`../../locales/characters/en-US.json`));
	register('en-US', () => import(`../../locales/weapons/en-US.json`));

	const savedLocale = browser ? localStorage.getItem('locale') : 'en';
	const isLocale = savedLocale && supportedLocales.includes(savedLocale);
	const usedLocale = !isLocale && browser ? getLocaleFromNavigator() : savedLocale;

	init({
		fallbackLocale: 'en-US',
		initialLocale: usedLocale
	});
};

export { mountLocale };
