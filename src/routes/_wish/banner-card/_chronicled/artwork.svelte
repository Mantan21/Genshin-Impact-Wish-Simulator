<script>
	import { positionToStyle } from '$lib/helpers/cssPosition';
	import { assets } from '$lib/store/app-stores';
	import { fly } from 'svelte/transition';

	export let type;
	export let item = '';
	export let weaponType = null;
	export let position = {};

	$: isWp = type === 'weapon';
	$: src = isWp ? $assets[item] : $assets[`splash-art/${item}`];
</script>

<div class="artspace {type}">
	{#key src}
		<div class="art-container" in:fly|local={{ x: 15, duration: 700 }}>
			<img
				{src}
				class={weaponType || ''}
				style={positionToStyle(position)}
				alt="Artwork"
				crossorigin="anonymous"
			/>
		</div>
	{/key}
</div>

<style>
	.artspace {
		width: 65%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		mask-image: linear-gradient(to right, transparent 5%, black 35%, black 70%);
	}

	.artspace.weapon {
		height: 110%;
	}

	.art-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	img {
		background-color: unset;
		width: fit-content;
		position: absolute;
		width: 100%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.weapon img {
		top: unset;
		width: unset;
		left: 50%;
		height: 120%;
		transform: translate(-35%, -10%);
		filter: drop-shadow(0 0.2rem 0.1rem rgba(0, 0, 0, 1));
	}
	.weapon img.catalyst {
		height: unset;
		width: 37.5%;
		top: 50%;
		transform: translate(-35%, -50%);
	}
</style>
