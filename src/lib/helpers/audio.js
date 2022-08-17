import { browser } from '$app/env';
import { Howl } from 'howler';
import { localConfig } from '$lib/store/localstore';
import camera from '$lib/data/audio/camera';
import changebanner from '$lib/data/audio/changebanner';
import click from '$lib/data/audio/click';
import close from '$lib/data/audio/close';
import exchange from '$lib/data/audio/exchange';
import inventory from '$lib/data/audio/inventory';
import item from '$lib/data/audio/item';
import obtain from '$lib/data/audio/obtain';
import popup from '$lib/data/audio/popup';
import roll from '$lib/data/audio/roll';
import shop from '$lib/data/audio/shop';

const source = {
	changebanner,
	close,
	click,
	exchange,
	popup,
	shop,
	obtain,
	roll,
	inventory,
	item,
	camera,
	wishBacksound: '/assets/sfx/wish-backsound.ogg',
	resultList: '/assets/sfx/result-list.ogg',
	reveal3Star: '/assets/sfx/reveal-3star.ogg',
	reveal4Star: '/assets/sfx/reveal-4star.ogg',
	reveal5Star: '/assets/sfx/reveal-5star.ogg'
};

const sounds = {};
const soundInit = () => {
	if (!browser) return;
	Object.keys(source).forEach((key) => {
		sounds[key] = new Howl({
			src: [source[key]],
			loop: key === 'wishBacksound'
		});
	});
};
soundInit();

const playSfx = (nameOfSoundfx = 'click', { paused = false } = {}) => {
	try {
		if (!sounds[nameOfSoundfx]) throw new Error('No Sound effect for ' + nameOfSoundfx);
		if (paused || localConfig.get('muted')) {
			if (nameOfSoundfx.includes('reveal')) sounds[nameOfSoundfx].stop();
			else sounds[nameOfSoundfx].pause();
		} else sounds[nameOfSoundfx].play();
	} catch (e) {
		console.error('Unable to Play Sfx : ', e.message);
	}
};

export default playSfx;
