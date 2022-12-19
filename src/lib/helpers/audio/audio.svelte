<script context="module">
	import { browser } from '$app/environment';
	import { Howl } from 'howler';
	import { localConfig } from '$lib/store/localstore';
	import camera from './camera';
	import changebanner from './changebanner';
	import click from './click';
	import close from './close';
	import exchange from './exchange';
	import inventory from './inventory';
	import history from './history';
	import obtain from './obtain';
	import modal from './modal';
	import roll from './roll';
	import shopopen from './shopopen';
	import shopnav from './shopnav';
	import shopsubnav from './shopsubnav';
	import collectionitem from './collectionitem';
	import prevbanner from './prevbanner';

	const source = {
		changebanner,
		close,
		click,
		collectionitem,
		exchange,
		modal,
		obtain,
		roll,
		inventory,
		history,
		camera,
		shopopen,
		shopnav,
		shopsubnav,
		prevbanner,
		wishBacksound: '/sfx/wish-backsound.ogg',
		resultList: '/sfx/result-list.ogg',
		reveal3Star: '/sfx/reveal-3star.ogg',
		reveal4Star: '/sfx/reveal-4star.ogg',
		reveal5Star: '/sfx/reveal-5star.ogg'
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

	export const playSfx = (nameOfSoundfx = 'click', { paused = false } = {}) => {
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
</script>
