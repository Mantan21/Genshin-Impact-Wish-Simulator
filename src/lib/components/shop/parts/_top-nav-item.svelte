<script>
	import { createEventDispatcher } from 'svelte';

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
	<div class="border">
		<i class="gi-primo-star left" />
		<i class="gi-primo-star right" />
		<slot />
	</div>
</button>

<style>
	.nav-link-item {
		color: #d2c69c;
		position: relative;
		padding: 0 3px;
		transition: all 0.2s;
	}

	.active::after,
	.nav-link-item:hover::after {
		background-color: #ede5d8;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		content: '';
		display: block;
		width: 100%;
		height: 120%;
		border-radius: 6px;
		transition: all 0.2s;
	}

	.nav-link-item.active .border,
	.nav-link-item:hover .border {
		color: #40475a;
	}
	:global(.mobile) .nav-link-item .border {
		font-size: 0.8rem;
		padding: 3px 12px;
	}
	.nav-link-item .border {
		padding: 5px 20px;
		border: 2px solid transparent;
		position: relative;
		z-index: +1;
		border-radius: 6px;
		transition: all 0.2s;
	}
	.nav-link-item.active .border {
		border: 2px solid #c1b198;
	}

	.border i {
		font-size: 2rem;
		display: inline-block;
		margin-right: 10px;
	}
	:global(.mobile) .border i {
		font-size: 1.5rem;
	}

	.gi-primo-star {
		right: -1.3rem;
		font-size: 1.3rem;
	}
	:global(.mobile) .gi-primo-star {
		right: -1rem;
		font-size: 1rem;
	}

	.nav-link-item .border i {
		display: none;
	}
	.nav-link-item.active .border i {
		position: absolute;
		display: unset;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		color: #c1b198;
	}
	.nav-link-item.active .border i.left {
		left: 0.1em;
		right: unset;
	}
	.nav-link-item.active .border i.right {
		right: 0.1em;
		margin-right: 0;
	}

	@media screen and (max-width: 400px) {
		.nav-link-item {
			font-size: 0.8rem;
		}
	}
</style>
