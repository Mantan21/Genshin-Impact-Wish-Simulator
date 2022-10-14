<script>
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	const timer = setTimeout(() => {
		dispatch('close');
		clearTimeout(timer);
	}, 3000);
</script>

<div class="toast" transition:fly={{ y: -20 }}>
	<slot />
</div>

<style>
	.toast {
		padding: 0.5rem 1.5rem;
		text-align: center;
		border-radius: 0.3rem;
		min-width: 10rem;
		max-width: 20rem;
		color: var(--tertiary-color);
		background-color: #4a5265;
		position: fixed;
		z-index: 999;
		left: 50%;
		top: 7%;
		transform: translateX(-50%);
		font-size: 0.7rem;
	}
</style>
