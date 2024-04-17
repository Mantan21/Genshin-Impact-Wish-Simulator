<script>
	import { getContext, setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import {
		activeBanner,
		assets,
		bannerList,
		chronicledCourse,
		activeVersion
	} from '$lib/store/app-stores';
	import { fatepointManager } from '$lib/helpers/dataAPI/api-localstore';
	import { getDetails, regionElement } from '$lib/helpers/gacha/itemdrop-base';
	import { playSfx } from '$lib/helpers/audio/audio';
	import Artwork from './artwork.svelte';
	import TextLayer from './textLayer.svelte';

	const chronicled = $bannerList[$activeBanner];
	const { region, characters } = chronicled;

	let pickedItem, selected, point;
	$: ({ selected, point } = $chronicledCourse);
	$: selectedItem = selected || pickedItem || characters['5star'][0];
	$: details = getDetails(selectedItem);
	$: element = details.vision || regionElement(region);
	$: courseData = { selected, type: details.type, weaponType: details.weaponType, point };

	setContext('itemPicker', (picked) => {
		const { name } = picked;
		if (pickedItem === name) return;
		playSfx('click2');
		pickedItem = name;
	});

	const openModal = getContext('handleEpitomizedModal');
	const openDetail = () => {
		playSfx();
		openModal();
	};
	const confirmCourse = () => {
		const { patch, phase } = $activeVersion;
		const localPoint = fatepointManager.init({ version: patch, phase, banner: 'chronicled' });
		const { type } = details;
		localPoint.set(0, selectedItem, type);
		chronicledCourse.set({ selected: selectedItem, type, point: 0 });
		playSfx();
	};
</script>

<div class="wrapper card-image" style="min-height: 100px; width: 100%;">
	<picture style="position: relative; width: 100%;">
		<img
			src={$assets[`blank/chronicled-${element}`]}
			alt="Chronicled Banner"
			crossorigin="anonymous"
		/>
	</picture>

	<Artwork
		type={details.type}
		item={selectedItem}
		weaponType={details?.weaponType}
		position={details?.offset?.banner}
	/>
</div>

<div class="frame skeleton-event">
	<TextLayer
		{courseData}
		bannerData={chronicled}
		picked={selectedItem}
		translated={details.type === 'weapon' ? $t(selectedItem) : $t(`${selectedItem}.name`)}
	/>

	{#if !selected}
		<div class="epibutton">
			<div class="col" style="margin-right: 1%;">
				<button class="detail" on:click={openDetail}>
					<i> <b>i</b></i> <span>{$t('epitomizedPath.viewDetails')}</span>
				</button>
			</div>
			<div class="col" style="margin: 0 1%;">
				<button class="confirm" on:click={confirmCourse}>
					<i class="gi-circle-o" /> <span> {$t('epitomizedPath.confirm')}</span>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	picture,
	img {
		width: 100%;
		display: block;
	}

	.epibutton {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		z-index: +10;
		transform: translateY(50%);
	}

	.epibutton button {
		background-color: #fff;
		color: rgba(0, 0, 0, 0.75);
		border-radius: 20rem;
		border: #ddc889 calc(0.006 * var(--content-height)) solid;
		font-size: calc(1.75 / 100 * var(--content-width));
		transition: background 0.25s, color 0.25s, transform 0.25s;
		padding: calc(0.01 * var(--content-width)) calc(0.04 * var(--content-width));
		position: relative;
	}

	.epibutton button:hover {
		background-color: #e0ddd4;
		color: rgba(0, 0, 0, 1);
	}
	.epibutton button:active {
		transform: scale(0.95);
	}

	button i {
		width: calc(0.03 * var(--content-width));
		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
			sans-serif;
		font-style: normal;
		font-weight: 400;
		line-height: 0;
		background-color: #353533;
		border-radius: 100%;
		aspect-ratio: 1/1;
		color: #fff;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 4%;
		top: 50%;
		transform: translateY(-50%);
	}
	button.confirm i {
		color: #ffc107;
	}
	button.detail i {
		color: #98cb37;
	}
	button span {
		display: inline-block;
		transform: translateX(calc(0.01 * var(--content-width)));
	}
</style>
