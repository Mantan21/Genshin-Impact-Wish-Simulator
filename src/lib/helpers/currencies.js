import { priceList } from '$lib/store/stores';
import { localConfig } from '$lib/store/localstore';
import { currencies } from '$lib/data/currencies.json';
import { checkLocale } from './i18n';

export const availableCurrencies = currencies.map(({ symbol, currency }) => ({ symbol, currency }));
export const formatNumber = (n) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const userCurrencies = {
	init(currency = null) {
		const { symbol, list } = this.checkUsedCurrency(currency);
		this._symbol = symbol;
		this._list = list;
		const { welkin, genesis } = list;
		const prices = { genesis: {} };

		prices.welkin = this.formatPrice(welkin);
		Object.keys(genesis).forEach((key) => {
			prices.genesis[key] = this.formatPrice(genesis[key]);
		});
		priceList.set(prices);
	},

	checkUsedCurrency(curr) {
		const used = curr || localConfig.get('currency') || checkLocale();
		return currencies.find(({ country, currency }) => {
			const isUsed = used === currency || country.find((v) => used.toLocaleLowerCase().includes(v));
			return isUsed;
		});
	},

	formatPrice(price) {
		const decimal = price.toFixed(2).toString();
		const formated = formatNumber(decimal);
		return `${this._symbol} ${formated}`;
	},

	getTotalSpend(totalPull) {
		const pricePerUnit = this._list.genesis['60'] / 60;
		const pullPrice = totalPull * 160 * pricePerUnit;
		return this.formatPrice(pullPrice);
	}
};
