import { writable } from 'svelte/store';
import { beginner } from '$lib/data/banners/beginner.json';
import { wishPhase } from '$lib/data/wish-setup.json';

const assets = writable({});
const pageActive = writable('index');
const backsound = writable(false);
const muted = writable(false);
const notice = writable([]);
const animeoff = writable(false);

// Banner
const patchVersion = writable(0);
const bannerPhase = writable(wishPhase);
const bannerActive = writable(0);
const showBeginner = writable(true);

const isFatepointSystem = writable(false);
const fatePoint = writable(0);
const showFatepointModal = writable(false);
const selectedCourse = writable({});
const fatepointCounterActive = writable(false);
const isAcquaintUsed = writable(true);

// viewport
const viewportWidth = writable(0);
const viewportHeight = writable(0);

// Mobile Detect
const isMobile = writable(false);
const mobileMode = writable(false);
const isPWA = writable(false);

// Wish
const bannerList = writable([{ type: 'beginner', character: beginner.featured }]);

const genesis = writable(0);
const stardust = writable(0);
const starglitter = writable(0);
const primogem = writable(1600);

const intertwined = writable(0);
const acquaint = writable(0);
const unlimitedFates = writable(false);
const priceList = writable({ genesis: {}, welkin: null });

const query = writable('');

export {
	animeoff,
	assets,
	pageActive,
	patchVersion,
	bannerPhase,
	bannerActive,
	isFatepointSystem,
	fatePoint,
	showFatepointModal,
	fatepointCounterActive,
	selectedCourse,
	backsound,
	muted,
	notice,
	viewportWidth,
	viewportHeight,
	isMobile,
	mobileMode,
	isPWA,
	showBeginner,
	bannerList,
	genesis,
	stardust,
	starglitter,
	primogem,
	intertwined,
	acquaint,
	unlimitedFates,
	isAcquaintUsed,
	priceList,
	query
};
