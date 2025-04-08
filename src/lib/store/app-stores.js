import { writable } from 'svelte/store';
import { initialAmount, version, wishPhase } from '$lib/data/wish-setup.json';
import { storageLocal } from '$lib/helpers/dataAPI/api-localstore';
import { browser } from '$app/environment';

const { fates, genesis: igen, primogem: ipri } = initialAmount;

export const preloadVersion = writable({ patch: version, phase: wishPhase });
export const activeVersion = writable({ patch: version, phase: wishPhase });
export const bannerList = writable([]);
export const activeBanner = writable(0);
export const bannerNames = [
                'farewell-of-snezhnaya-5', 
                'drifting-luminescence-4', 
                'moment-of-bloom-5', 
                'gentry-of-hermitage-6', 
                'sparkling-steps-4',
                'the-hearths-ashen-shadow-2', 
                'immaculate-pulse-3', 
                'reign-of-serenity-4', 
                'the-heron_s-court-4', 
                'the-transcendent-one-returns-2', 
                'oni_s-royale-4', 
                'chanson-of-many-waters-2', 
                'tempestuous-destiny-1', 
                'azure-excursion-3', 
                'decree-of-the-deeps-3', 
                'leaves-in-the-wind-5'];

// Beginner
export const showBeginner = writable(true);
export const beginnerRemaining = writable(20);

// Epitomized Path
export const isFatepointSystem = writable(false); // Weapon
export const course = writable({ selected: null, point: 0 });
export const chronicledCourse = writable({ selected: null, type: null, point: 0 });

function persistStore(key, initVal) {
    if (!browser) {
        // Server-side: Just return a normal writable store
        return writable(initVal);
    }
    
    const storedVal = JSON.stringify(storageLocal.get(key));
    const store = writable(storedVal != '{}' ? JSON.parse(storedVal) : initVal);

    store.subscribe((val) => {
        storageLocal.set(key, val);
    });
    return store;
}

// Game Currencies
export const genesis = writable(igen);
export const primogem = persistStore('primogem', ipri);
export const acquaint = persistStore('acquaint', fates  );
export const intertwined = writable(fates);
export const stardust = writable(0);
export const starglitter = writable(0);
export const pricelist = writable({});

// Settings
export const autoskip = writable(false);
export const wishAmount = writable('default');
export const multipull = writable(10);

// other
export const proUser = writable(false);
export const showAd = writable(false);
export const mobileMode = writable(false);
export const isMobile = writable(false);
export const isPWA = writable(false);
export const viewportHeight = writable(0);
export const viewportWidth = writable(0);

export const notice = writable([]);
export const assets = writable([]);
export const toastMsg = writable([]);

export const editorMode = writable(false);
export const editID = writable(0);
export const customData = writable({});
export const isCustomBanner = writable(false);

export const exchange = writable(0);
export const expenses = writable(true);
export const bonusGen = writable({});

// Button counters
export const history = writable(0);
export const inventory = writable(0);
export const shop = writable(0);
export const pull_roll = writable(0);
export const details = writable(0);


export function resetStore() {
    history.set(0);
    inventory.set(0);  
    shop.set(0);
    pull_roll.set(0);
    details.set(0);
}