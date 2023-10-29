<script>
	import { setContext } from 'svelte';
	import FrameEditor from './_frame.svelte';
	import InfoButton from './_info-face-button.svelte';
	import SplashartForm from './_splashart-form.svelte';
	import MainArt from './_main-art.svelte';
	import VisionPicker from './_vision-picker.svelte';
	import InfoEditor from './_info-editor.svelte';

	export let idbID = null;

	let clientHeight;
	let clientWidth;
	let onBannerEdit = false;
	let isInfoEdit = false;

	// Banner Info
	let bannerName = '';
	let charName = '';
	let charTitle = '';
	let vision = 'pyro';
	let artURL = '';
	let faceURL = '';
	let rateup = [];

	let artPosition = { banner: {}, splashart: {}, card: {} };
	let hostedArt = { deleteURL: '', viewURL: '' };
	let hostedFace = { deleteURL: '', viewURL: '' };

	$: bannerData = {
		bannerName,
		charName,
		charTitle,
		vision,
		rateup,
		artPosition,
		hostedImages: { hostedArt, hostedFace },
		images: { artURL, faceURL }
	};

	const randomNumber = (/** @type {number} */ min, /** @type {number} */ max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	const autoSave = (bannerData) => {
		const localID = idbID || randomNumber(111111111, 999999999);
		if (!idbID) idbID = localID;
		console.log({ idbID: localID, ...bannerData });
	};
	$: autoSave(bannerData);

	const setPosition = (type, pos) => (artPosition[type] = pos);
	setContext('setPosition', setPosition);

	const editBanner = (val) => (onBannerEdit = val);
	setContext('editBanner', editBanner);

	const editInfo = (val) => (isInfoEdit = val);
	setContext('editInfo', editInfo);

	const setVision = (vi) => (vision = vi);
	setContext('setVision', setVision);

	const setRateup = (chars) => (rateup = chars);
	setContext('setRateup', setRateup);

	const setCharName = (name) => (charName = name);
	setContext('setCharName', setCharName);

	const setCharTitle = (title) => (charTitle = title);
	setContext('setCharTitle', setCharTitle);

	const setBannerName = (name) => (bannerName = name);
	setContext('setBannerName', setBannerName);

	const changeArt = (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			artURL = reader.result;
			onBannerEdit = true;
		});
	};
	setContext('changeArt', changeArt);

	const changeFace = (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			faceURL = reader.result;
		});
	};
	setContext('changeFace', changeFace);
</script>

<div
	class="card"
	bind:clientWidth
	bind:clientHeight
	style="--content-width:{clientWidth}px; --content-height:{clientHeight}px"
>
	<img src="/images/banner/blank/{vision}.webp" alt="background banner" class="art-bg" />

	<VisionPicker selected={vision} />
	<MainArt
		{onBannerEdit}
		width={clientWidth}
		height={clientHeight}
		{artURL}
		bannerPosition={artPosition.banner}
	/>
	<SplashartForm {onBannerEdit} />
	<FrameEditor editorMode {onBannerEdit} {vision} {bannerName} {charName} {charTitle} />
	<InfoButton {faceURL} {onBannerEdit} />

	{#if isInfoEdit}
		<InfoEditor {rateup} {bannerName} {charName} {charTitle} />
	{/if}
</div>

<style>
	.card {
		/* background-image: linear-gradient(to top, #eee8e3 50%, #f7f5f4); */
		position: relative;
	}

	.card {
		width: 100%;
		height: fit-content;
		aspect-ratio: 1080/533;
	}

	img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: contain;
		object-position: center;
	}
</style>
