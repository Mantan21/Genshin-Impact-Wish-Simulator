import { currencies } from '$lib/data/pricelist.json';
import { expenses, pricelist, primogem, intertwined } from '$lib/store/app-stores';
import { cookie } from './dataAPI/api-cookie';
import { storageLocal } from './dataAPI/api-localstore';
import { checkLocale } from './i18n';

export const availableCurrencies = currencies.map(({ symbol, currency }) => ({ symbol, currency }));
export const formatNumber = (n) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const userCurrencies = {
	init(currency = null) {
		const { symbol, list, format } = this.checkUsedCurrency(currency);
		this._symbol = symbol;
		this._list = list;
		this._format = format;
		const { welkin, genesis } = list;
		const prices = { genesis: {} };

		prices.welkin = this.formatPrice(welkin);
		Object.keys(genesis).forEach((key) => {
			prices.genesis[key] = this.formatPrice(genesis[key]);
		});
		pricelist.set(prices);
	},

	checkUsedCurrency(curr) {
		const used = curr || cookie.get('currency') || checkLocale();
		const filtered = currencies.find(({ country, currency }) => {
			const isCurrDetected = used === currency;
			const isCountryAvailable = country.find((v) => used.toLocaleLowerCase().includes(v));
			const isUsed = isCurrDetected || (used.length < 6 && isCountryAvailable);
			return isUsed;
		});
		return filtered || currencies.find(({ currency }) => currency === 'USD');
	},

	formatPrice(price) {
		const decimal = price.toFixed(2).toString();
		const formated = formatNumber(decimal);
		return this._format.replace('{symbol}', this._symbol).replace('{nominal}', formated);
	},

	getTotalSpend(totalPull) {
		const pricePerUnit = this._list.genesis['60'] / 60;
		const pullPrice = totalPull * 160 * pricePerUnit;
		return this.formatPrice(pullPrice);
	},

	getTotalExp(priceString, add=true) {
		const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
		let totalExp = parseFloat(storageLocal.get('expenses')) || 0;
		console.log("totalExp", totalExp);
		if (totalExp + price <= 1000) {
			expenses.set(totalExp + price);
			storageLocal.set('expenses', totalExp + price);
			console.log("Expenses so faw", totalExp + price);
			//expenses.(totalExp + price);
		} 
	},
	
	currReplenish(group, banner) {
		if (group === 'f2p') primogem.update((n) => n + 6047)
		else {
			intertwined.update((n) => n + 4);
			primogem.update((n) => n + 9727);
		}
		const boss_fight = storageLocal.get('boss') || 0;
		if (boss_fight[banner]) primogem.update((n) => n + 800);
		console.log("boss fight", boss_fight[banner], boss_fight);
	}
};
