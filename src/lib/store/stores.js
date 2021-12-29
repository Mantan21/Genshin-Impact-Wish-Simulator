import { writable } from 'svelte/store';

const pageActive = writable('index');
const backsound = writable(false);
const isLoaded = writable(false);
const showDisclaimer = writable(true);

// Banner
const patchVersion = writable('0.0');
const bannerVersion = writable(0);
const bannerActive = writable(0);
const showBeginner = writable(true);
const isFatepointSystem = writable(false);
const fatePoint = writable(0);

const showFatepointCounter = writable(0);
const fatepointCounterActive = writable(false);

const isAcquaintUsed = writable(true);

// viewport
const viewportWidth = writable(0);
const viewportHeight = writable(0);

// Mobile Detect
const isMobile = writable(false);
const mobileMode = writable(false);

// Wish
const bannerList = writable([]);
const wishes = writable([]);
const showWish = writable(false); // false

const genesis = writable(0);
const stardust = writable(0);
const starglitter = writable(0);
const primogem = writable(1600);

const intertwined = writable(0);
const acquaint = writable(0);

export {
	pageActive,
	patchVersion,
	bannerVersion,
	bannerActive,
	isFatepointSystem,
	fatePoint,
	showFatepointCounter,
	fatepointCounterActive,
	isLoaded,
	backsound,
	showDisclaimer,
	viewportWidth,
	viewportHeight,
	isMobile,
	mobileMode,
	showBeginner,
	bannerList,
	wishes,
	showWish,
	genesis,
	stardust,
	starglitter,
	primogem,
	intertwined,
	acquaint,
	isAcquaintUsed
};
