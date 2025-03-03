<script>
	import { t } from 'svelte-i18n';
	import { assets, activeVersion, customData, isCustomBanner } from '$lib/store/app-stores';
	import { getName } from '$lib/helpers/nameText';
	import { lazyLoad } from '$lib/helpers/lazyload';
	import Iklan from '$lib/components/Iklan.svelte';
	import updates from '$lib/data/updates.json';


	const { patch: version, phase } = $activeVersion;

	let processedUpdates = [...updates.data].reverse();

	let latestIndex = processedUpdates.findIndex(item => item.patch == version);
	let newPatchIndex = latestIndex + 1;
</script>

{#each [...updates.data].reverse() as { video, description, date, patch }, i (i)}
	{#if i == newPatchIndex}
		<h2>
			<i class="tgl"> {date} </i>
				( New Patch )
		</h2>
		{#each description as txt} 
			<p>{@html txt}</p> 
		{/each}
		<br>
		<div align="center"><iframe width="512" height="288"
		src={video} title="Preview">
		</iframe></div>
	{/if}
{/each}

<style>
	.beginner :global(span) {
		color: #cba885;
	}

	.gi-star {
		color: #feca33;
	}

	h2 {
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		font-size: calc(0.014 * var(--content-width));
		color: #fff;
		display: flex;
		align-items: center;
		line-height: 0;
		padding: 0.5% 1%;
	}
	h3 span {
		padding-left: 2rem;
		color: #fff;
	}
	h3.star5 {
		background-color: #cfb383;
	}
	h3.star4 {
		background-color: #b5a8c9;
	}
	.weapon-flat {
		color: #bd6932;
	}

	.row {
		display: flex;
		width: 100%;
	}
	.name {
		flex-basis: 35%;
		padding: 1.5%;
	}
	.name span {
		font-size: calc(0.014 * var(--content-width));
		display: block;
		padding: 2% 0;
	}
	.pic {
		flex-basis: 65%;
		padding-bottom: 1%;
	}

	.pic-item {
		margin: 2% 1.5% 0 0;
		padding-bottom: 4%;
		display: inline-block;
		position: relative;
		background-color: #fff;
		border-radius: 4%;
		overflow: hidden;
	}

	picture {
		height: calc(0.095 * var(--content-width));
		display: block;
		aspect-ratio: 1/1;
		background-size: cover;
		position: relative;
		overflow: hidden;
		border-bottom-right-radius: 20%;
	}

	img {
		width: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}

	img.claymore {
		transform: rotate(18deg) scale(1.15) translateX(-0.7em);
	}

	img.bow {
		transform: rotate(10deg) scale(1.25) translate(-0.5em, 0em);
	}

	img.polearm {
		transform: rotate(10deg) scale(1.5) translate(-12%, 12%);
		height: 200%;
	}

	img.sword {
		transform: rotate(10deg) scale(1.2) translateY(-1em) translate(-0.2em, 0.5em);
	}

	.stars {
		position: absolute;
		bottom: 10%;
		left: 50%;
		font-size: calc(0.015 * var(--content-width));
		transform: translateX(-50%);
	}

	picture i {
		position: absolute;
		z-index: +1;
		top: 0;
		left: 0;
		font-size: 1.3rem;
	}

	caption {
		font-size: calc(0.013 * var(--content-width));
		display: block;
		width: 100%;
		text-align: center;
		position: absolute;
		padding: 3%;
	}
</style>
