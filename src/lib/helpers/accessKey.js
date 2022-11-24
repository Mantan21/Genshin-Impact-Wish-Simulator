import { localConfig } from '$lib/store/localstore';

const digestMessage = async (message) => {
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
};

const fetchKey = async () => {
	const date = new Date().toISOString();
	const data = await fetch(
		`https://gist.githubusercontent.com/AguzzTN54/3816708e01827a5c64f4903242ede7b0/raw?date=${date}`
	);
	const { hash } = await data.json();
	return hash;
};

const checkKey = async (key) => {
	const baseKey = await fetchKey();
	const inputKey = await digestMessage(key?.trim());
	return baseKey === inputKey;
};

const adKey = {
	_set(key) {
		const reversed = key.trim().split('').reverse().join('');
		localConfig.set('adKey', reversed);
	},

	clear() {
		return localConfig.set('adKey', null);
	},

	async checkLocal() {
		try {
			const storedKey = localConfig.get('adKey');
			const reversedKey = storedKey?.split('').reverse().join('');
			if (!storedKey) return { validity: false, storedKey: reversedKey };
			const isKeyValid = await checkKey(reversedKey);
			return { validity: isKeyValid, storedKey: reversedKey };
		} catch (e) {
			return { validity: false, storedKey: null };
		}
	},

	async verify(key) {
		try {
			const isKeyValid = await checkKey(key);
			if (isKeyValid) this._set(key);
			const msg = isKeyValid ? 'success' : 'Invalid Key';
			return { validity: isKeyValid, msg };
		} catch (e) {
			return { validity: false, msg: 'Connection Failed' };
		}
	}
};

export { adKey };

