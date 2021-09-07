<script>
	import { createEventDispatcher } from 'svelte';

	export let active = false;
	export let type = 'limited';
	export let weaponID = [];
	export let character = {
		name: '',
		style: {
			main: '',
			active: ''
		}
	};

	const { style, name } = character;
	const dispatch = createEventDispatcher();
	const buttonClick = () => {
		dispatch('click');
	};
</script>

<button class="button {type}" class:active on:click={buttonClick}>
	<i class="gi-primo-star" />
	<i class="gi-companion" />
	<div class="picture">
		{#if type === 'weapon'}
			{#each weaponID as { name, style, type }}
				<img
					src="./assets/images/weapons/{type}/5star/{name}.webp"
					alt="Weapon Wish"
					style={active ? style.active : style.main}
				/>
			{/each}
		{:else}
			<img
				src="./assets/images/characters/banner-button/{name}.webp"
				alt="{type} Wish"
				style={active ? style.active : style.main}
			/>
		{/if}
	</div>
	{#if type === 'beginner'}
		<div class="discount">-20%</div>
	{/if}
</button>

<style>
	button {
		display: block;
		background-color: var(--secondary-color);
		border-radius: 7px;
		width: 100px;
		height: 45px;
		margin: 10px;
		position: relative;
		transition: all.2s;
	}
	button::after,
	button::before {
		content: '';
		display: block;
		width: 90%;
		height: 75%;
		border: 2.5px solid #6d8fbb;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: all 0.2s;
	}

	button::after {
		border-radius: 7px;
	}

	button::before {
		border-radius: 40%;
	}

	button.active,
	button:hover {
		background-color: var(--tertiary-color);
	}

	button.active::before,
	button.active::after,
	button:hover::before,
	button:hover::after {
		border: 2.5px solid #eee2c8;
	}

	button.active {
		transform: scale(1.1);
	}

	.gi-primo-star {
		left: 15px;
		font-size: 0.7rem;
	}
	.gi-companion {
		right: 5px;
		font-size: 3rem;
		line-height: 0;
		top: 55% !important;
	}

	.gi-primo-star,
	.gi-companion {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: #6d8fbb;
		transition: all 0.2s;
	}

	.active .gi-primo-star,
	.active .gi-companion,
	button:hover .gi-primo-star,
	button:hover .gi-companion {
		color: #eee2c8;
	}

	.picture {
		width: 100%;
		height: 150%;
		position: absolute;
		bottom: 0;
		left: 0;
		overflow: hidden;
		pointer-events: none;
	}
	img {
		position: absolute;
		z-index: +1;
		left: 50%;
		transform: translateX(-50%);
		transition: all 0.2s;
	}

	.discount {
		background-color: #8ab958;
		position: absolute;
		z-index: +2;
		left: 50%;
		bottom: -5px;
		border-radius: 20px;
		color: #fff;
		transform: scale(0.65) translateX(-50%);
		padding: 3px 5px;
	}

	/* mobile */
	:global(.mobile) button {
		transform: scale(0.85);
		margin: 3px 0;
	}

	:global(.mobile) button.active {
		transform: scale(0.95);
	}
</style>
