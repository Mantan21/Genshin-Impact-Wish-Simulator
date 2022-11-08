export const wakeLock = async () => {
	try {
		const isWakeLockSupport = 'wakeLock' in navigator;
		if (!isWakeLockSupport) return;

		let screenLock = await navigator.wakeLock.request('screen');
		window.addEventListener('focus', async () => {
			screenLock = await navigator.wakeLock.request('screen');
		});

		window.addEventListener('blur', async () => {
			await screenLock.release();
			screenLock = null;
		});
	} catch (e) {
		// console
	}
};

