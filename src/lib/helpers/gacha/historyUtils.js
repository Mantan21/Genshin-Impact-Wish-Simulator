import { localPity, owneditem, rollCounter, localConfig } from '../dataAPI/api-localstore';

export function initialize (banner) {
	let isInitialized = localStorage.getItem(`isInitialized-${banner}`);

	if (isInitialized === 'false' || !isInitialized) {
		//Initialize values
		localStorage.setItem(`extraPity-${banner}`, 0);
		localStorage.setItem(`current10PullCount-${banner}`, 0);
		localStorage.setItem(`totalPulls-${banner}`, 0);
		console.log("initialized");
		localStorage.setItem(`lastversion`, null);
		localStorage.setItem(`lastIndexOfBanner-${banner}`, -1);
		localStorage.setItem(`isInitialized-${banner}`, true);
	}
}

export function checkBanner(banner, indexOfBanner) {
    const localVersion = localConfig.get('version') || '';
	let [patch, phase] = localVersion.split('-');
	let lastVersion = localStorage.getItem(`lastversion`);

    let lastIndexOfBanner = parseInt(localStorage.getItem(`lastIndexOfBanner-${banner}`)) || -1;

    if ((lastIndexOfBanner !== -1 && lastIndexOfBanner !== indexOfBanner) || (lastVersion !== patch && lastVersion !== "null")) {
		console.log('Banner Change Detected');
		
        return { bool: true, patch: patch, phase: phase };

	}
    else return { bool: false, patch: patch, phase: phase };


}

export function getPulls(banner){
    let current10PullCount = parseInt(localStorage.getItem(`current10PullCount-${banner}`)) || 0;
	let totalPullsTemp = parseInt(localStorage.getItem(`totalPulls-${banner}`)) || 0;

    return { current10PullCount, totalPullsTemp }
}

