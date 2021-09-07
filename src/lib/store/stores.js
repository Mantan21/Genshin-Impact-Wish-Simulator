import { writable }  from 'svelte/store';

const backsound = writable(false);
const isLoaded = writable(false);

const bannerActive = writable('');
const showBeginner = writable(true);

// viewport 
const viewportWidth = writable(0)
const viewportHeight = writable(0)

// Mobile Detect
const isMobile = writable(false);
const mobileMode = writable(false);

// Wish
const wishes = writable([]);
const showWish = writable(false); // false

const genesis = writable(0);
const stardust = writable(0);
const starglitter = writable(0);
const primogem = writable(1600);

const intertwined = writable(0);
const acquaint = writable(0);

export {
  bannerActive, isLoaded, backsound,
  viewportWidth, viewportHeight,
  isMobile, mobileMode,
  showBeginner, wishes, showWish,
  genesis, stardust, starglitter, primogem,
  intertwined, acquaint
};
