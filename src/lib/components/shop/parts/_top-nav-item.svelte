<script>
	import { createEventDispatcher } from 'svelte';
	import { assets } from '$lib/store/stores';

	export let active = false;
	export let name = '';

	const dispatch = createEventDispatcher();
	const select = () => {
		dispatch('click', {
			selected: name
		});
	};
</script>

<button class="nav-link-item" class:active on:click={select}>
	<div
		class="border"
		style={active ? `background-image:url('${$assets['shop-nav-bg.webp']}')` : ''}
	>
		<slot />
	</div>
</button>

<style>
	.nav-link-item {
		color: #d2c69c;
		position: relative;
		aspect-ratio: 720/100;
		padding: 0 7.5rem;
		height: 2rem;
	}

	.nav-link-item .border {
		height: 2.7rem;
		aspect-ratio: 669/122;
		background-repeat: no-repeat;
		background-size: cover;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		padding: 0 10%;
	}

	.nav-link-item.active .border {
		color: var(--text-color);
	}

	:global(.mobile) .nav-link-item {
		height: 1.7rem;
		font-size: 99%;
		padding: 0;
	}

	:global(.mobile) .nav-link-item .border {
		height: 2.3rem;
		padding: 0 10%;
	}
</style>
