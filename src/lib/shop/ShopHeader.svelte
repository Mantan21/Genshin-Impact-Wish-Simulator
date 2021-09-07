<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Icon from '$lib/utility/Icon.svelte';
	import { genesis, primogem, stardust, starglitter } from '$lib/store/stores';

	export let showNavbar = true;
	export let showNavbarButton = true;
	export let activeShop = 'genesis';

	let audio;
	const dispatch = createEventDispatcher();

	onMount(() => {
		audio = document.querySelector('#button-sfx');
	});
	const handleClick = () => {
		showNavbar = !showNavbar;
		dispatch('showNavbar', { showNavbar });
	};

	const handleClose = () => {
		audio.src = '/assets/sfx/button-click.ogg';
		audio.play();
	};
</script>

<div class="item-header" transition:fly={{ y: -20 }}>
	<div class="info" style="display: flex; align-items: center">
		{#if showNavbarButton}
			<button class="toggle" on:click={handleClick}>
				<span />
			</button>
		{/if}
		<span> All Items below will never resfreshes </span>
	</div>
	<div class="fates">
		{#if activeShop === 'genesis'}
			<button class="primogem">
				<Icon
					type="primogem"
					height="80%"
					width="auto"
					style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
				/>
				{$primogem}
			</button>
			<button class="genesis-crystal">
				<Icon
					type="genesis"
					height="80%"
					width="auto"
					style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
				/>
				{$genesis}
			</button>
		{:else if activeShop === 'paimon-bargains'}
			<button class="stardust">
				<Icon
					type="stardust"
					height="80%"
					width="auto"
					style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
				/>
				{$stardust}
			</button>
			<button class="starglitter">
				<Icon
					type="starglitter"
					height="80%"
					width="auto"
					style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
				/>
				{$starglitter}
			</button>
			<button class="primogem">
				<Icon
					type="primogem"
					height="80%"
					width="auto"
					style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
				/>
				{$primogem}
			</button>
		{/if}

		<a href="/" class="close" sveltekit:prefetch on:click={handleClose}>
			<i class="gi-close" />
		</a>
	</div>
</div>

<style>
	.toggle {
		display: inline-block;
		width: 40px;
		height: 40px;
		border: 1px solid #d2c69c;
		margin-right: 5px;
		position: relative;
	}

	.toggle span {
		display: block;
		width: 60%;
		height: 2px;
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		background-color: #d2c69c;
	}
	.toggle span::after,
	.toggle span::before {
		display: block;
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		content: '';
		background-color: #d2c69c;
	}
	.toggle span::before {
		top: -300%;
	}
	.toggle span::after {
		bottom: -300%;
	}

	.item-header {
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #d2c69c;
	}
	:global(.mobile) .item-header {
		height: 40px;
	}

	.fates {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.fates button {
		padding: 0 15px 0 30px;
		display: inline-block;
		max-width: 112px;
		height: 25px;
		position: relative;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		margin: 0 8px;
	}
	.fates .close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0rem;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		border-radius: 100%;
		text-decoration: none;
	}
	:global(.mobile) .fates .close {
		width: 28px;
		height: 28px;
	}

	@media screen and (max-width: 890px) {
		.fates button {
			height: 20px;
			margin: 0 3px;
		}
		.close {
			width: 30px;
			height: 30px;
			margin: 3px;
		}
	}
	@media screen and (max-width: 500px) {
		.item-header {
			flex-direction: column;
			justify-content: center;
		}
		.info {
			width: 100%;
		}
		.fates .close {
			position: fixed;
			top: 2%;
			right: 5%;
		}
	}
	@media screen and (max-width: 400px) {
		.fates button {
			max-width: 80px;
		}
	}
</style>
