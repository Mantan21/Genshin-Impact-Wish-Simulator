<script>
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { editID } from '$lib/store/app-stores';
	import { BannerManager } from '$lib/store/IDB-manager';

	import Icon from '$lib/components/Icon.svelte';
	import Frame from './_frame.svelte';
	import InfoButton from './_info-face-button.svelte';
	import SplashartForm from './_splashart-form.svelte';
	import MainArt from './_main-art.svelte';
	import VisionPicker from './_vision-picker.svelte';
	import InfoEditor from './_info-editor.svelte';

	let clientHeight;
	let clientWidth;
	let onBannerEdit = false;
	let isInfoEdit = false;
	let isLoaded = false;

	// Banner Info
	let bannerID = $editID;
	let userID;
	let bannerName = '';
	let charName = '';
	let charTitle = '';
	let vision = '';
	let rateup = [];

	let artPosition = { banner: {}, splashart: {}, card: {} };
	let images = { artURL: '', faceURL: '', thumbnail: '' };
	let hostedArt = { deleteURL: '', viewURL: '' };
	let hostedFace = { deleteURL: '', viewURL: '' };
	let hostedThumb = { deleteURL: '', viewURL: '' };
	$: hostedImages = { hostedArt, hostedFace, hostedThumb };

	const idb = BannerManager;
	const readIDB = async (id) => {
		if (isLoaded) return;
		if (!id) {
			vision = 'pyro';
			isLoaded = true;
			return;
		}

		const data = await idb.get(id);
		// prettier-ignore
		({ userID, bannerName, charName, charTitle, vision, rateup, artPosition, hostedImages, images } = data);
		isLoaded = true;
	};

	$: bannerData = {
		userID,
		bannerName,
		charName,
		charTitle,
		vision,
		rateup,
		artPosition,
		hostedImages,
		images
	};

	const autoSave = async (data) => {
		if (!isLoaded) return;
		const lastModified = new Date().toISOString();
		if ($editID) return idb.put({ id: $editID, ...data, lastModified });
		const id = await idb.put({ ...data, lastModified });
		editID.set(id);
		return;
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
			images.artURL = reader.result;
			onBannerEdit = true;
		});
	};
	setContext('changeArt', changeArt);

	const changeFace = (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			images.faceURL = reader.result;
		});
	};
	setContext('changeFace', changeFace);

	const changeThumbnail = (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			images.thumbnail = reader.result;
		});
	};
	setContext('changeThumbnail', changeThumbnail);
</script>

{#await readIDB(bannerID)}
	<div class="loading" out:fade>
		<div class="loader">
			<Icon type="loader" width="40px" />
		</div>
	</div>
{/await}

<div
	class="card"
	id="cardEditor"
	class:isLoaded
	bind:clientWidth
	bind:clientHeight
	style="--content-width:{clientWidth}px; --content-height:{clientHeight}px"
>
	<img src="/images/banner/blank/{vision}.webp" alt="background banner" class="art-bg" />

	<VisionPicker selected={vision} />
	{#key artPosition}
		<MainArt
			{onBannerEdit}
			width={clientWidth}
			height={clientHeight}
			artURL={images?.artURL}
			bannerPosition={artPosition?.banner}
		/>
	{/key}
	<SplashartForm {onBannerEdit} />
	<Frame editorMode {onBannerEdit} {vision} {bannerName} {charName} {charTitle} />
	<InfoButton faceURL={images?.faceURL} {onBannerEdit} />

	{#if isInfoEdit}
		<InfoEditor {rateup} {bannerName} {charName} {charTitle} preview={images?.thumbnail} />
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

	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
		z-index: +20;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(8px);
		background-color: rgba(0, 0, 0, 0.2);
	}

	.loader {
		--text-color: rgba(248, 184, 22, 0.7);
		aspect-ratio: 1/1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
