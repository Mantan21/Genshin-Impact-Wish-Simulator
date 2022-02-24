<script>
	import playSfx from '$lib/functions/audio';

	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let text;
	export let activeIndicator;

	let showOption = false;

	const dispatch = createEventDispatcher();
	let select = (selected) => {
		playSfx();
		showOption = !showOption;
		if (!selected) return;

		dispatch('select', {
			selected
		});
	};
</script>

<div class="option">
	<div class="option-name">{text}</div>
	<div class="option-select">
		<button class="selected" style="width: 100%; height:100%" on:click={() => select()}
			>{activeIndicator ? 'Yes' : 'No'}</button
		>
		<i class="gi-caret-{showOption ? 'up' : 'down'}" />
		{#if showOption}
			<div class="select" in:fly={{ duration: 200, y: -10 }}>
				<button class:selected={!activeIndicator} on:click={() => select('no')}> No </button>
				<button class:selected={activeIndicator} on:click={() => select('yes')}> Yes </button>
			</div>
		{/if}
	</div>
</div>

<style>
	.option {
		display: flex;
		width: 100%;
		padding: 0.5rem 0;
	}
	.option-name {
		background-color: #fff;
		width: 75%;
		padding: 0.3rem 2rem;
		border-top-left-radius: 5rem;
		border-bottom-left-radius: 5rem;
	}

	.option-select {
		background-color: var(--tertiary-color);
		width: 40%;
		max-width: 14rem;
		text-align: center;
		position: relative;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-top-right-radius: 5rem;
		border-bottom-right-radius: 5rem;
		transition: all 0.2s;
	}

	.option-select i {
		position: absolute;
		top: 50%;
		right: 1rem;
		font-size: 1rem;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.option-select button,
	.option-select {
		font-size: 0.8rem !important;
	}

	.select {
		position: absolute;
		top: 110%;
		left: 0;
		width: 100%;
		background-color: var(--tertiary-color);
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
		z-index: +1;
		border-radius: 0.3rem;
		overflow: hidden;
	}
	.select button {
		display: block;
		width: 100%;
		padding: 0.15rem;
	}

	.select button:hover,
	.select button.selected {
		background-color: #f0e0c7;
	}
</style>
