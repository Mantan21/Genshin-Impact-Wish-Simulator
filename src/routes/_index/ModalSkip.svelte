<script>
	import { getContext, setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { genesis, primogem } from '$lib/store/app-stores';
	import { localBalance } from '$lib/helpers/dataAPI/api-localstore';
	import { playSfx } from '$lib/helpers/audio/audio';

	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/ModalTpl.svelte';
	import ModalBalance from '../_shop/_modal-balance.svelte';

	import { fade } from 'svelte/transition';
	import { getName } from '$lib/helpers/nameText';

	import { activeVersion, assets, preloadVersion } from '$lib/store/app-stores';
	import { imageCDN } from '$lib/helpers/assets';
	import { lazyLoad } from '$lib/helpers/lazyload';

	export let groupby = 'version';
	export let groupName;
	export let data;

	onMount(async () => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
		const { expiryDate, storedKey } = await adKey.initialLoad();
		dateExpired = expiryDate;
		savedKey = storedKey;
	});

	const isCustom = groupName.toLowerCase() === 'custom';

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
</script>

<Modal title="Skip" on:confirm={selectBanner}>
	<p> test </p>
</Modal>