<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import playSfx from '$lib/helpers/audio';
	import { viewportHeight } from '$lib/store/stores';
	import ButtonPopup from './ButtonPopup.svelte';

	export let show = false;
	export let title = '';
	export let confirm = true;
	export let confirmText = '';
	export let button = 'all';
	export let sfx = true;
	export let disclaimer = false;

	let content;

	onMount(() =>
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' })
	);

	const dispatch = createEventDispatcher();
	const confirmClick = () => {
		dispatch('confirm');
		if (sfx) playSfx();
	};
	const cancelClik = () => {
		dispatch('cancel');
		if (sfx) playSfx();
	};
</script>

{#if show}
	<div class="popup" transition:fade={{ duration: 80 }} style="height: {$viewportHeight}px;">
		<div class="popup-content">
			<span class="corner top-left" />
			<span class="corner top-right" />
			<span class="corner bottom-left" />
			<span class="corner bottom-right" />
			<i class="gi-inazuma bg" />
			<div class="container">
				{#if title}
					<h1 class="pop-header">{title}</h1>
				{/if}
				<div class="pop-body" class:disclaimer class:large={!title && !confirm} bind:this={content}>
					<slot />
				</div>

				{#if confirm}
					<div class="pop-footer">
						{#if ['cancel', 'all'].indexOf(button) > -1}
							<ButtonPopup type="cancel" on:click={cancelClik} />
						{/if}
						{#if ['confirm', 'all'].indexOf(button) > -1}
							<ButtonPopup type="confirm" on:click={confirmClick}>
								{confirmText || $t('confirmButton')}
							</ButtonPopup>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 997;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(2px);
	}

	.popup-content {
		width: 35rem;
		max-width: 90%;
		background-color: #ece6de;
		padding: 8px;
		text-align: center;
		color: #383b40;
		position: relative;
		border-radius: 0.8rem;
	}

	:global(.mobile) .popup-content {
		max-width: 100vh;
	}

	.container {
		width: 100%;
		height: 100%;
		border: 2px solid #ddd5c8;
	}
	.corner {
		background-image: url('/images/utility/corner.webp');
		background-size: cover;
		width: 2.35rem;
		aspect-ratio: 1/1;
		font-size: 1.5rem;
		display: inline-block;
		position: absolute;
	}

	.top-left {
		top: -0.9rem;
		left: -0.9rem;
		transform: rotate(-90deg);
	}
	.top-right {
		top: -0.9rem;
		right: -0.9rem;
	}
	.bottom-left {
		bottom: -0.9rem;
		left: -0.9rem;
		transform: rotate(-180deg);
	}
	.bottom-right {
		bottom: -0.9rem;
		right: -0.9rem;
		transform: rotate(90deg);
	}
	.bg {
		font-size: 17em;
		position: absolute;
		top: 60%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #e4dcce;
	}

	.pop-header {
		font-size: 130%;
		margin: 0.4rem 7%;
		padding-bottom: 0.4rem;
		border-bottom: 0.2rem solid #ddd5c8;
		position: relative;
		z-index: +1;
	}
	.pop-body {
		height: 15rem;
		max-height: 45vh;
		position: relative;
		z-index: +1;
		font-size: 1.2rem;
		display: flex;
		justify-content: center;
	}

	:global(.mobile) .pop-body {
		height: 12rem;
	}

	.disclaimer {
		height: 18rem;
	}

	.pop-body.large {
		height: 25rem;
		max-height: 70vh;
	}

	.pop-footer {
		display: flex;
		padding: 0.7rem 0;
		justify-content: space-around;
		position: relative;
		z-index: +1;
	}
	.pop-footer::before {
		width: 80%;
		content: '';
		display: block;
		border-top: 0.2rem solid #ddd5c8;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
