<script>
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import hotkeys from 'hotkeys-js';
	import {
		viewportWidth,
		activeVersion,
		course,
		assets,
		viewportHeight,
		bannerList,
		activeBanner,
		chronicledCourse
	} from '$lib/store/app-stores';
	import { fatepointManager } from '$lib/helpers/dataAPI/api-localstore';
	import { playSfx } from '$lib/helpers/audio/audio';

	import Modal from '$lib/components/ModalTpl.svelte';
	import ItemSelection from './_item-selection.svelte';
	import Description from './_description.svelte';

	let activeSection = 1;
	let clientHeight;
	let itemWidth;
	$: half = $viewportWidth < 500;
	$: defaultItemWidth = (16.5 / 100) * $viewportHeight;
	$: if (itemWidth < 150) itemWidth = 150;
	else itemWidth = defaultItemWidth;

	const { type: banner } = $bannerList[$activeBanner];
	const { patch, phase } = $activeVersion;

	const flipSection = (to) => {
		playSfx('bookflip');
		activeSection = to;
	};

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
		const localFate = fatepointManager.init({ version: patch, phase });
		localFate.set(0, target); // set to local
		course.set({ selected: target, point: 0 }); // set to App
		handleClose();
	});

	const confirmCancel = () => {
		showCancelConfirmation = false;
		closePath();

		// clear local
		const localFate = fatepointManager.init({ version: patch, phase, banner });
		localFate.remove();

		// clear browser Storage
		if (banner.match('weapon')) return course.set({ point: 0, selected: null });
		chronicledCourse.set({ selected: null, point: 0, type: null });
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
				{$t('epitomizedPath.cancelPrompt')}
				<br />
				<span style="font-size: smaller; padding: 2rem">
					{$t('epitomizedPath.cancelDesc')}
				</span>
			</div>
		</div>
	</Modal>
{/if}

<section class="modal" transition:fade={{ duration: 250 }}>
	<div
		class="modal-content"
		style="--modal-height:{clientHeight}px;--item-width: {itemWidth}px"
		class:half
		bind:clientHeight
		transition:fly={{ y: 40, duration: 250 }}
	>
		<img src={$assets[`epitomized-${half ? 'half' : 'bg'}.webp`]} alt="Epitomized Book" />
		<button class="close-modal" on:click={closePath}>
			<i class="gi-close" />
		</button>
		<div class="container">
			{#if !half || activeSection < 1}
				<Description isChronicled={banner === 'chronicled'} />
			{/if}

			{#if (activeSection > 0 && half) || !half}
				<ItemSelection />
			{/if}
		</div>

		{#if half}
			<div class="pagination">
				{#if activeSection > 0}
					<button
						class="left"
						style="margin-right: auto;"
						on:click={() => flipSection(0)}
						transition:fade|local={{ duration: 200 }}
					>
						<i class="gi-arrow-left" />
					</button>
				{/if}

				{#if activeSection < 1}
					<button
						class="right"
						style="margin-left: auto;"
						on:click={() => flipSection(1)}
						transition:fade|local={{ duration: 200 }}
					>
						<i class="gi-arrow-right" />
					</button>
				{/if}
			</div>
		{/if}
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
		max-width: 90%;
		max-height: 90%;
		width: 1100px;
		min-width: 250px;
		aspect-ratio: 919/549;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.modal-content.half {
		aspect-ratio: 599/719;
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
		top: calc(0.045 * var(--modal-height));
		right: calc(0.045 * var(--modal-height));
		z-index: +10;
	}

	.gi-close {
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
		border-radius: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
	}

	/* pagination */
	.pagination {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		display: flex;
		padding: 0 2.5%;
		z-index: +10;
	}

	.pagination button i {
		font-size: 1.75rem;
	}
</style>
