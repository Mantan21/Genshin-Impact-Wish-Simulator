<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import OverlayScrollbars from 'overlayscrollbars';
	import playSfx from '$lib/functions/audio';

	export let show = false;
	export let title = '';
	export let confirm = true;
	export let button = 'all';
	export let sfx = true;

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
	<div class="popup" transition:fade={{ duration: 80 }}>
		<div class="popup-content">
			<i class="gi-primo-star top-left" />
			<i class="gi-primo-star top-right" />
			<i class="gi-primo-star bottom-left" />
			<i class="gi-primo-star bottom-right" />
			<i class="gi-inazuma bg" />
			<div class="container">
				{#if title}
					<h1 class="pop-header">{title}</h1>
				{/if}
				<div class="pop-body" class:large={!title && !confirm} bind:this={content}>
					<slot />
				</div>

				{#if confirm}
					<div class="pop-footer">
						{#if ['cancel', 'all'].indexOf(button) > -1}
							<button class="cancel" on:click={cancelClik}>
								<i class="gi-times" />
								<span> Cancel </span>
							</button>
						{/if}
						{#if ['confirm', 'all'].indexOf(button) > -1}
							<button class="confirm" on:click={confirmClick}>
								<i class="gi-circle-o" />
								<span> Confirm </span>
							</button>
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
		height: 100vh;
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
	}

	:global(.mobile) .popup-content {
		max-width: 110vh;
	}

	.container {
		width: 100%;
		height: 100%;
		border: 2px solid #ddd5c8;
	}
	.gi-primo-star {
		color: #fdf0ac;
		font-size: 1.5rem;
		display: inline-block;
		position: absolute;
		filter: drop-shadow(0 0 7px rgba(227, 149, 48, 0.9));
	}
	.top-left {
		top: -0.8rem;
		left: -0.5rem;
		transform: rotate(-45deg);
	}
	.top-right {
		top: -0.8rem;
		right: -0.5rem;
		transform: rotate(45deg);
	}
	.bottom-left {
		bottom: -0.8rem;
		left: -0.5rem;
		transform: rotate(-135deg);
	}
	.bottom-right {
		bottom: -0.8rem;
		right: -0.5rem;
		transform: rotate(135deg);
	}
	.bg {
		font-size: 17em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #e4dcce;
	}

	.pop-header {
		font-size: 1.2rem;
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

	.pop-footer button {
		border-radius: 40px;
		color: white;
		background-color: #4a5265;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.2em 2.5em 0.3em 0.1em;
		transition: all 0.2s;
	}

	.pop-footer button i {
		width: 1.7rem;
		height: 1.7rem;
		background-color: #353533;
		border-radius: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 0.8rem;
		margin-right: 1.5rem;
	}
	.pop-footer button:hover {
		background-color: rgb(51, 57, 71);
	}
	.gi-times {
		color: #3f9ad1;
	}
	.gi-circle-o {
		color: #ffc107;
	}
</style>
