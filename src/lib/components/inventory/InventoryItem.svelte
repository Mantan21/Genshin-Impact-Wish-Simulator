<script>
	import { getName } from '$lib/functions/nameText';
	import { createEventDispatcher } from 'svelte';

	export let rarity = 3;
	export let type = 'character';
	export let name = 'No Name';
	export let vision = '';
	export let weaponType = '';
	export let qty = 0;
	export let isOwned = true;

	const dispatch = createEventDispatcher();
	const handleShowDetails = () => {
		if (!isOwned) return;
		return dispatch('click', {
			name
		});
	};
</script>

<div class="content" class:owned={isOwned}>
	{#if !isOwned}
		<div class="overlay" />
	{/if}
	<picture class="wish-result star{rarity} {type}" on:click={handleShowDetails}>
		{#if type === 'character'}
			<img src="/assets/images/characters/profile/{name}.webp" alt={getName(name)} />
			<span class="gi-{vision} element" />
		{:else}
			<img
				src="/assets/images/weapons/{weaponType}/{rarity}star/{name}.webp"
				alt={getName(name)}
				class={weaponType}
			/>
		{/if}
		{#if qty > 1}
			<span class="qty"> {qty}x </span>
		{/if}
	</picture>
	<div class="caption">
		<div class="star">
			{#each Array(rarity) as _, i}
				<i class="gi-star" />
			{/each}
		</div>
		<span>
			{getName(name)}
		</span>
	</div>
</div>

<style>
	.content {
		border-radius: 0.5em;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		background-color: #fff;
		color: #3a4156;
		line-height: 1.2rem;
		position: relative;
	}
	.content.owned::after {
		content: '';
		position: absolute;
		z-index: -1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border-radius: 0.8rem;
		border: 0.3rem solid #eac343;
		opacity: 0;
		transition: opacity 0.15s;
	}
	.content.owned:hover::after {
		opacity: 1;
	}

	.overlay {
		top: 0;
		left: 0;
		position: absolute;
		z-index: +1;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.5;
		border-radius: 0.5em;
	}

	picture {
		width: 100%;
		aspect-ratio: 1/1;
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		background-size: cover;
		position: relative;
		overflow: hidden;
		border-top-left-radius: 0.5em;
		border-top-right-radius: 0.5em;
		border-bottom-right-radius: 1.2em;
	}
	picture img {
		width: 100%;
		object-fit: cover;
	}

	picture span {
		position: absolute;
		top: 0;
	}
	.element {
		left: 0;
		font-size: 2rem;
	}
	.qty {
		right: 0;
		background-color: #a36b5e;
		border-bottom-left-radius: 0.5rem;
		font-size: 0.9rem;
		padding: 0.1rem 0.3rem;
		color: #f0c882;
	}
	.star3 {
		background-image: url('/assets/images/utility/3star-bg.webp');
	}
	.star4 {
		background-image: url('/assets/images/utility/4star-bg.webp');
	}
	.star5 {
		background-image: url('/assets/images/utility/5star-bg.webp');
	}

	.star {
		position: absolute;
		left: 50%;
		top: -0.7rem;
		transform: translateX(-50%);
	}
	.gi-star {
		color: #eac343;
		font-size: 1.3rem;
	}

	:global(.mobile) .gi-star {
		font-size: 1rem;
	}
	@media screen and (max-width: 500px) {
		.gi-star {
			font-size: 1rem;
		}
	}

	.caption {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 0.2rem;
		position: relative;
	}
	.caption span {
		display: block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: capitalize;
	}

	:global(.popup-content) .caption {
		padding: 0 0.2rem;
		font-size: 0.6rem;
	}

	img.claymore {
		transform: rotate(18deg) scale(1.15) translateX(-1.5em);
	}

	img.bow {
		transform: rotate(10deg) scale(1.25) translate(-1em, -1em);
	}

	img.polearm {
		transform: rotate(10deg) scale(1.5) translate(-12%, 12%);
	}

	img.sword {
		transform: rotate(10deg) scale(1.2) translateY(-1em) translateX(-0.7em);
	}

	@media screen and (max-width: 500px) {
		.caption {
			font-size: 0.85rem;
		}
	}
</style>
