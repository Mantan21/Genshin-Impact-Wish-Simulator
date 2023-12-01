<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { getContext, onMount } from 'svelte';

	import { imageCDN } from '$lib/helpers/assets';
	import { preloadVersion } from '$lib/store/app-stores';
	import { BannerManager } from '$lib/store/IDB-manager';
	import { onlineBanner } from '$lib/helpers/custom-banner';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { verifyKey } from '$lib/helpers/accessKey';

	import Icon from '$lib/components/Icon.svelte';
	import ModalTpl from '$lib/components/ModalTpl.svelte';
	import ButtonGeneral from '$lib/components/ButtonGeneral.svelte';

	export let shareID = 0;

	let loaded = false;
	let isError = false;
	let errorType = '';

	let isOwned = false;
	let itemID = 0;
	let hostedImages = '';
	let bannerName = '';
	let vision = '';

	const startApp = getContext('startApp');

	const initBanner = () => {
		verifyKey();
		startApp();
		if (!itemID) return;
		preloadVersion.set({ patch: 'Custom', phase: itemID });
	};

	const retry = () => {
		playSfx();
		loaded = false;
		isError = false;
		errorType = '';
		fetchBannerData(shareID);
	};

	const fetchBannerData = async (shareID) => {
		const { data = {}, success, message } = await onlineBanner.getData(shareID);
		if (!success) {
			if (message === 'Not Found') {
				errorType = 'notFound';
			} else if (message === 'Invalid ID') {
				errorType = 'invalid';
			} else {
				errorType = 'networkError';
			}

			isError = true;
			loaded = true;
			return;
		}

		({ hostedImages = {}, vision = 'pyro', bannerName = 'Unknown Banner', itemID } = data);
		const { status } = (await BannerManager.get(itemID)) || {};

		// Dont replace data if owned already
		isOwned = status === 'owned';
		if (isOwned) return (loaded = true);

		delete data.imageHash;
		delete data.id;
		data.status = 'cloud';
		data.shareID = parseInt(shareID);
		await BannerManager.put(data);
		loaded = true;
		return;
	};

	onMount(() => {
		goto('/');
		if (!shareID) return;
		return fetchBannerData(shareID);
	});
</script>

<ModalTpl confirmOnly title="Looking for a Banner" on:confirm={initBanner} disabled={!loaded}>
	<div class="container">
		{#if isError}
			<div class="content error" in:fade>
				{#if errorType === 'networkError'}
					<div class="error">
						<caption> Network Error </caption>
						<ButtonGeneral on:click={retry}>Retry</ButtonGeneral>
					</div>
				{:else}
					<caption>
						Error:{errorType}; Banner not found, wrong <u>Banner ID</u> or maybe the author has removed
						it.
					</caption>
				{/if}
			</div>
		{:else if !loaded}
			<div class="content" in:fade>
				<caption class="load-text">Identifying Banner</caption>
				<div class="loader">
					<Icon type="loader" />
				</div>
			</div>
		{:else}
			{@const { thumbnail } = imageCDN(hostedImages)}
			<div class="content" in:fade>
				{#if isOwned}
					<caption>
						You're the owner of "<span class="{vision}-flat">{bannerName}</span>" banner, your local
						data will be used instead of the data you've shared online.
					</caption>
				{:else}
					<caption>
						"<span class="{vision}-flat">{bannerName}</span>" is ready to Wish
					</caption>
				{/if}
				{#if thumbnail}
					<img src={thumbnail} alt="Banner Thumbnail" class="thumb" crossorigin="anonymous" />
				{/if}
			</div>
		{/if}
	</div>
</ModalTpl>

<style>
	.container {
		width: 100%;
		height: 100%;
	}
	.content {
		padding: 1% 5%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.content .thumb {
		margin-top: 1rem;
		max-width: 50%;
	}

	.error caption {
		display: block;
		margin-bottom: 1rem;
	}

	caption {
		display: inline-block;
		position: relative;
	}
	.load-text::after {
		content: '.';
		position: absolute;
		right: 0;
		transform: translateX(100%);
		bottom: 0;
		animation: dot 3s infinite;
	}

	.loader {
		margin: 3% 0;
	}

	@media screen and (max-width: 640px) {
		.loader {
			margin: 7% 0;
		}
	}

	@keyframes dot {
		0% {
			content: '.';
		}
		25% {
			content: '..';
		}
		50% {
			content: '...';
		}
		100% {
			content: '';
		}
	}
</style>
