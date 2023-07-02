<script>
	import { t } from 'svelte-i18n';
	import { getContext } from 'svelte';
	import { rollCounter, localPity, guaranteedStatus } from '$lib/store/localstore-manager';
	import { showBeginner, beginnerRemaining } from '$lib/store/app-stores';
	import { HistoryManager } from '$lib/store/IDB-manager';
	import { playSfx } from '$lib/helpers/audio/audio';

	import Modal from '$lib/components/ModalTpl.svelte';
	import Toast from '$lib/components/Toast.svelte';

	export let banner;
	export let v2 = false;

	let showModal = false;
	let showToast = false;

	const { clearHistory } = HistoryManager;

	const clear = getContext('clearHistory');
	const confirmReset = async () => {
		await clearHistory(banner);
		localPity.set(`pity5-${banner}`, 0);
		localPity.set(`pity4-${banner}`, 0);
		if (banner.match('event')) {
			guaranteedStatus.set(`${banner}-4star`, false);
			guaranteedStatus.set(`${banner}-5star`, false);
		} else guaranteedStatus.set(banner, false);

		if (banner === 'beginner') {
			rollCounter.set('beginner', 0);
			showBeginner.set(true);
			beginnerRemaining.set(20);
		}
		clear();
		playSfx();

		showModal = false;
		showToast = true;
	};

	const handleModal = () => {
		playSfx(showModal ? 'close' : 'modal');
		showModal = !showModal;
	};
</script>

{#if showModal}
	<Modal title={$t('history.resetPromptTitle')} on:cancel={handleModal} on:confirm={confirmReset}>
		<div class="confirmation">
			<p>
				{@html $t('history.resetPrompt', {
					values: { bannerName: `<b>${$t(`wish.banner.${banner}`)}</b>` }
				})}
			</p>
		</div>
	</Modal>
{/if}

{#if showToast}
	<Toast on:close={() => (showToast = false)}>{$t('history.resetSuccess')}</Toast>
{/if}

<button class="reset" class:v2 on:click={handleModal}>
	<i class="gi-delete" />
	{$t('history.resetButton')}
</button>

<style>
	.confirmation {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		font-family: var(--genshin-font);
		padding: 3%;
	}

	.reset {
		color: #bd6932;
		font-size: 1em;
	}

	.v2.reset {
		font-size: calc(0.016 * var(--content-width));
	}
	.reset:hover {
		text-decoration: underline;
	}
</style>
