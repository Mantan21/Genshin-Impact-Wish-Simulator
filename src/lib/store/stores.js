import { writable }  from 'svelte/store';

const isLoaded = writable(false);

const bannerActive = writable('');
const showBeginner = writable(true);

// viewport 
const viewportWidth = writable(0)
const viewportHeight = writable(0)

// Mobile Detect
const isMobile = writable(false);
const mobileMode = writable(false); //false

export { bannerActive, isLoaded, viewportWidth, viewportHeight, isMobile, mobileMode, showBeginner };
