<script>
	import { assets } from '$lib/store/app-stores';

	export let rateupList = [];
	export let exclude = '';
	const list = rateupList.filter(({ name }) => name !== exclude);
	let scrollElement;
</script>

<div
	class="list"
	bind:this={scrollElement}
	on:mousewheel={(e) => (scrollElement.scrollLeft += e.deltaY)}
>
	<div class="row">
		{#each list as { type, name, weaponType = '' }, i}
			{@const src = type === 'weapon' ? $assets[name] : $assets[`face/${name}`]}
			<div class="col">
				<picture class="{type} {weaponType}">
					<img {src} alt="" />
				</picture>
			</div>
		{/each}
	</div>
</div>

<style>
	.list {
		width: 100%;
		height: calc(0.0435 * var(--content-width));
		overflow: auto;
	}
	.list::-webkit-scrollbar {
		display: none;
	}

	.row {
		height: 100%;
		width: fit-content;
		display: flex;
		flex-wrap: nowrap;
	}

	picture {
		display: block;
		aspect-ratio: 1/1;
		height: 100%;
		border-radius: 100%;
		overflow: hidden;
	}
	img {
		width: 100%;
	}

	.weapon:not(.catalyst) img {
		transform: translateY(-8%) rotate(13deg);
	}
</style>
