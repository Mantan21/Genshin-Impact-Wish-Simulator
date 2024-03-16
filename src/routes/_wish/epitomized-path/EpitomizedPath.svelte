<script>
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import hotkeys from 'hotkeys-js';
	import { viewportWidth, activeVersion, course, assets } from '$lib/store/app-stores';
	import { fatepointManager } from '$lib/helpers/dataAPI/api-localstore';
	import { playSfx } from '$lib/helpers/audio/audio';

	import Modal from '$lib/components/ModalTpl.svelte';
	import Details from './details.svelte';
	import Selector from './selector.svelte';

	$: half = $viewportWidth < 500;
	let clientWidth;

	onMount(() => playSfx('bookflip'));

	const handleClose = getContext('handleEpitomizedModal');
	const closePath = () => {
		handleClose();
		playSfx('close');
		playSfx('bookflip');
	};

	let showCancelConfirmation = false;
	const closeModal = () => {
		playSfx('close');
		showCancelConfirmation = false;
	};

	setContext('cancelCourse', () => {
		showCancelConfirmation = true;
		playSfx();
	});

	setContext('setCourse', (target) => {
		if (target === null) return;

		playSfx('click');
		const { patch, phase } = $activeVersion;

		// set to local
		const localFate = fatepointManager.init({ version: patch, phase });
		localFate.set(0, target);

		// set to App
		course.set({ selected: target, point: 0 });
		handleClose();
	});

	const confirmCancel = () => {
		playSfx();
		const { patch, phase } = $activeVersion;
		// clear local
		const localFate = fatepointManager.init({ version: patch, phase });
		localFate.remove();

		// clear App
		course.set({ point: 0, selected: null });

		showCancelConfirmation = false;
		handleClose();
		return;
	};

	hotkeys('esc,e', 'epipath', (e) => {
		e.preventDefault();
		closePath();
	});

	hotkeys.setScope('epipath');
	onDestroy(() => hotkeys.deleteScope('epipath', 'index'));
</script>

{#if showCancelConfirmation}
	<Modal on:confirm={confirmCancel} on:cancel={closeModal}>
		<div
			class="pop-up"
			style="display: flex; width:100%; height:100%; justify-content: center; align-items:center;"
		>
			<div>
				{$t('wish.epitomizedPath.cancelPrompt')}
				<br />
				<span style="font-size: smaller; padding: 2rem">
					{$t('wish.epitomizedPath.cancelDesc')}
				</span>
			</div>
		</div>
	</Modal>
{/if}

<section class="modal" transition:fade={{ duration: 250 }}>
	<div
		class="modal-content"
		style="--modal-width: {clientWidth}px"
		transition:fly={{ y: 40, duration: 250 }}
		bind:clientWidth
	>
		<img src={$assets[`epitomized-${half ? 'half' : 'bg'}.webp`]} alt="Epitomized Book" />
		<button class="close-modal" on:click={closePath}>
			<i class="gi-close" />
		</button>
		<div class="container">
			{#if !half}
				<Details />
			{/if}
			<Selector />
		</div>
	</div>
</section>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: var(--screen-height);
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(2px);
	}

	.modal-content {
		width: 1000px;
		max-width: 90%;
		min-width: 250px;
		aspect-ratio: 919/549;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	:global(.mobile) .modal-content {
		max-width: 140vh;
		border-radius: 0.8rem;
	}

	.modal-content img {
		position: relative;
		width: 100%;
	}

	.close-modal {
		position: absolute;
		top: 1.5rem;
		right: -0.2rem;
		z-index: +10;
	}
	.gi-close {
		font-size: 1.3rem;
		background-color: transparent;
		color: #383b40;
	}
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
	}

	.container > :global(div) {
		flex-basis: 50%;
		flex-grow: 1;
	}

	span {
		color: #f0b164;
	}
	button i {
		width: 2rem;
		height: 2rem;
		background-color: #353533;
		border-radius: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
		margin-right: 2rem;
	}
</style>
