<script>
	import { t } from 'svelte-i18n';
	import { getContext } from 'svelte';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';

	import { beginnerRoll, guaranteedStatus, pity4star, pity5star } from '$lib/store/localstore';
	import { showBeginner } from '$lib/store/stores';
	import HistoryIDB from '$lib/store/historyIdb';

	import Modal from '$lib/components/utility/ModalTpl.svelte';
	import Toast from '$lib/components/utility/Toast.svelte';

	export let banner;
	export let v2 = false;

	let showModal = false;
	let showToast = false;

	const { resetHistory } = HistoryIDB;

	const clearHistory = getContext('clearHistory');
	const confirmReset = async () => {
		await resetHistory(banner);
		pity5star.set(banner, 0);
		pity4star.set(banner, 0);
		guaranteedStatus.set(banner, false);
		if (!['beginner', 'standard'].includes(banner)) guaranteedStatus.set(`${banner}4Star`, false);
		if (banner === 'beginner') {
			beginnerRoll.set(0);
			showBeginner.set(true);
		}
		clearHistory();
		showModal = false;
		showToast = true;
	};

	const reset = () => {
		showModal = true;
		playSfx();
	};
</script>

<Modal
	show={showModal}
	title={$t('history.resetPromptTitle')}
	on:cancel={() => (showModal = false)}
	on:confirm={confirmReset}
>
	<div class="confirmation">
		<p>
			{@html $t('history.resetPrompt', {
				values: { bannerName: `<b>${$t(`wish.banner.${banner}`)}</b>` }
			})}
		</p>
	</div>
</Modal>

{#if showToast}
	<Toast on:close={() => (showToast = false)}>{$t('history.resetSuccess')}</Toast>
{/if}

<button class="reset" class:v2 on:click={reset}>
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
