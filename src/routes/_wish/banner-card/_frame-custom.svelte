<script>
	import { fly } from 'svelte/transition';
	import { getContext, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import {
		customData,
		editID,
		editorMode as editMode,
		isCustomBanner,
		proUser
	} from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { BannerManager } from '$lib/helpers/dataAPI/api-indexeddb';
	import { maintenance } from '$lib/helpers/banner-custom';
	import { highlightBannerName } from '$lib/helpers/nameText';
	import SvgIcon from '$lib/components/SVGIcon.svelte';
	import Dropnotes from './__dropnotes.svelte';

	export let bannerName = '';
	export let character = '';
	export let charTitle = '';
	export let vision = '';
	export let editorMode = false;
	export let onBannerEdit = false;
	export let watermark = '';

	const deleteBanner = getContext('deleteBanner');
	const editBanner = () => {
		playSfx();
		editID.set($customData.itemID);
		editMode.set(true);
	};

	let infoContainer;
	let myBannerCount = 0;
	$: disableEdit = !$proUser && myBannerCount > 3;
	onMount(async () => {
		const { getListByStatus } = BannerManager;
		const list = (await getListByStatus('owned')) || [];
		myBannerCount = list.length;

		if (onBannerEdit) return;
		OverlayScrollbars(infoContainer, {
			sizeAutoCapable: false,
			className: 'os-theme-light',
			scrollbars: { visibility: 'hidden' }
		});
	});
</script>

<div class="frame-content" class:editorMode class:onBannerEdit>
	<div class="top bg-{vision}">
		{$t('wish.banner.character-event')}
	</div>
	<div class="heading" in:fly={{ x: 15, duration: 700 }}>
		<h1 class="card-stroke">
			{@html highlightBannerName(bannerName || $t('customBanner.titleOfBanner'), vision)}
		</h1>
	</div>

	{#if $isCustomBanner}
		<div class="action">
			{#if $customData.status === 'owned' && !editorMode && !disableEdit}
				<button class="edit" on:click={editBanner}>
					<i class="gi-pen" /> <span>{$t('customBanner.edit')}</span>
				</button>
			{/if}

			{#if !maintenance}
				<button class="delete" on:click={deleteBanner}>
					<i class="gi-delete" />
					{$t('customBanner.delete')}
				</button>
			{/if}
		</div>
	{/if}

	<div class="info" bind:this={infoContainer}>
		<Dropnotes element={vision} banner="character-event" />
	</div>

	<div class="character">
		<div class="char-name">
			<span>
				{character || $t('customBanner.charName')}
			</span>
			<span class="up">{$t('wish.banner.up')}</span>

			<div class="textbg">
				<div class="icon-vision {vision} filter-drop">
					<SvgIcon name={vision} />
				</div>
				<div class="stars">
					{#each Array(5) as _}
						<i class="gi-star" />
					{/each}
				</div>
			</div>
		</div>

		{#if charTitle}
			<div class="char-title">
				{charTitle || $t('customBanner.charTitle')}
			</div>
		{/if}
	</div>

	<div class="watermark">{watermark || ''}</div>
</div>

<style>
	.frame-content {
		width: 100%;
		aspect-ratio: 1080/533;
		position: absolute;
		color: #565654;
		display: block;
		font-size: calc(1.8 / 100 * var(--content-width));
		line-height: 130%;
		bottom: 0;
		left: 0;
		z-index: +10;
	}
	.frame-content.onBannerEdit {
		pointer-events: none;
		opacity: 0.5;
	}

	.frame-content > div {
		text-align: left;
		position: absolute;
	}

	.heading {
		position: absolute;
		display: flex;
		align-items: center;
		bottom: 67%;
		left: 0;
		margin: 0 4%;
		height: calc(0.23 * var(--content-height));
		width: 45%;
	}

	h1 {
		text-align: left;
		line-height: 100%;
		font-size: calc(4.5 / 100 * var(--content-width));
	}

	:global(.zh-CN) h1 {
		font-size: calc(7 / 100 * var(--content-width));
	}
	:global(.ja-JP) h1 {
		max-width: 80%;
		font-size: calc(6 / 100 * var(--content-width));
	}

	.editorMode h1 {
		bottom: 70%;
	}

	.action {
		position: absolute;
		top: 0;
		right: 0;
		opacity: 0;
		transition: all 0.25s;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.action button {
		color: rgba(255, 255, 255, 0.8);
		padding: calc(1.7 / 100 * var(--content-width)) calc(2.5 / 100 * var(--content-width));
		display: flex;
		align-items: center;
		line-height: 0;
		border-radius: 2%;
		font-size: calc(1.7 / 100 * var(--content-width));
		transition: all 0.25s;
	}
	button.edit {
		background-color: rgba(0, 0, 0, 0.5);
	}
	button.edit:hover {
		background-color: rgba(0, 0, 0, 0.8);
	}

	button.delete {
		background-color: rgba(234, 37, 37, 0.5);
	}
	button.delete:hover {
		background-color: rgba(234, 37, 37, 1);
	}

	.action i {
		transform: translateX(-50%);
	}
	.frame-content:hover .action {
		opacity: 1;
	}
	.action button:active {
		transform: scale(0.9);
	}

	.top {
		color: #fff;
		padding: 0.3% 1.4%;
		border-bottom-left-radius: 2rem;
		border-top-left-radius: 2rem;
		border-bottom-right-radius: 4rem;
		top: 0;
		left: 0;
		transform: translate(-3%, -15%);
	}

	.info {
		left: 0;
		top: 40%;
		width: 40%;
		height: 42%;
		display: block;
		padding-left: 4%;
	}
	.onBannerEdit .info {
		overflow: hidden;
	}

	.editorMode .info {
		top: 32.5%;
	}

	.character {
		--text-width: calc(30 / 100 * var(--content-width));
		width: calc(30 / 100 * var(--content-width));
		left: 48.5%;
		bottom: 10%;
	}

	.character .char-name {
		color: #fff;
		display: inline-block;
		-webkit-text-stroke: 0.02rem #565654;
		text-shadow: 0 0 0.15rem #d2c69c;
		line-height: 100%;
		position: relative;
		font-size: calc(11 / 100 * var(--text-width));
		white-space: nowrap;
	}

	:global(.zh-CN) .character .char-name {
		font-size: calc(17 / 100 * var(--text-width));
	}
	:global(.ja-JP) .character .char-name {
		font-size: calc(15 / 100 * var(--text-width));
	}

	.char-name span {
		filter: drop-shadow(0 0.3rem 0.5rem #000);
	}

	.char-name .up {
		color: #fff664;
		-webkit-text-stroke: 0.05rem #e7a12e;
		font-size: calc(2 / 100 * var(--content-width));
		filter: drop-shadow(0 0.3rem 0.5rem #fff);
		position: absolute;
		top: 0;
		right: 0;
		transform: translateX(100%) translateY(-50%);
		text-transform: uppercase;
		text-shadow: 0 0 0.4rem #f79c09;
	}

	.character .char-title {
		color: #cfbc99;
		background-color: #39425d;
		padding: 1% 2%;
		white-space: nowrap;
		width: fit-content;
	}

	.textbg {
		background-color: rgba(0, 0, 0, 0.55);
		width: calc(100% + (0.15 * var(--content-height)));
		transform: translateX(calc(7.5 / 100 * var(--content-height) * -1));
		height: calc(9 / 100 * var(--content-height));
		margin-top: calc(-3 / 100 * var(--content-height));
		filter: drop-shadow(0 0 calc(0.02 * var(--content-height)) #000);
		position: relative;
		z-index: -2;
	}

	.stars {
		position: absolute;
		left: calc(7.5 / 100 * var(--content-height));
		bottom: -10%;
	}

	.gi-star {
		color: #f7cf33;
		display: inline-block;
		font-size: calc(3.5 / 100 * var(--content-height));
	}

	.icon-vision {
		width: calc(9 / 100 * var(--content-height));
		transform: translate(-45%, -40%);
		position: absolute;
		left: 0;
		top: 0;
	}
	.icon-vision :global(svg) {
		width: 100%;
		height: 100%;
	}

	.watermark {
		right: 2%;
		bottom: 2%;
		font-style: italic;
		font-weight: bold;
		color: #fff;
		font-size: calc(0.035 * var(--content-height));
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		text-shadow: 0 0 calc(0.05 * var(--content-height)) #000;
	}
</style>
