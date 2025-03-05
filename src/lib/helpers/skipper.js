import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { getName } from '$lib/helpers/nameText';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { imageCDN } from '$lib/helpers/assets';
	import { lazyLoad } from '$lib/helpers/lazyload';

    import {
		activeBanner,
		bannerList,
		assets,
        preloadVersion,
		activeVersion,
	} from '$lib/store/app-stores';
    import updates from '$lib/data/updates.json';
    import { BannerManager } from '$lib/helpers/dataAPI/api-indexeddb';    

	export let groupby = 'version';
	export let groupName;
	export let data;

	const isCustom = groupName.toLowerCase() === 'custom';

    let processedUpdates = [...updates.data].reverse();

	let latestIndex = processedUpdates.findIndex(item => item.patch == activePatch);
	let newPatchIndex = latestIndex + 1;

    let newBanner = processedUpdates[newPatchIndex]

    let patch = newBanner ? newBanner.patch : null;

    let phase = 1;

	const navigate = getContext('navigate');
	const selectBanner = (patch, phase) => {
		playSfx();
		// If select the same banner with the active one, change nothing just back to index
		const { patch: activePatch, phase: activePhase } = $activeVersion;
		navigate('index');
		if (activePhase === phase && activePatch === patch) return;

		// Select a banner
		preloadVersion.set({ patch, phase });
	};