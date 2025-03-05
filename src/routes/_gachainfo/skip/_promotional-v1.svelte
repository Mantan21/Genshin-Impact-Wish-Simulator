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
		<div align="center"><iframe width="426" height="240"
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

	h2,
	h3 {
		vertical-align: middle;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 500;
		padding: 1rem 0;
		margin: 1.5rem 0 0.5rem;
	}
	h2:not(.chartcourse) {
		display: flex;
	}
	:global(.mobile) h2 {
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}

	h2 span:not(.line) {
		color: var(--text-color);
		width: fit-content;
		white-space: nowrap;
		padding-right: 1rem;
	}

	h2 span.line {
		width: 100%;
		position: relative;
	}

	h2 span.line::after {
		content: '';
		display: block;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		height: 0.1rem;
		background-color: #d1cfcc;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		color: #fff;
		background-color: #a28052;
		display: flex;
		align-items: center;
	}
	h3 span {
		padding-left: 2rem;
		color: var(--text-color);
	}
	h3.star5 {
		background-color: #dbbba4;
	}
	h3.star4 {
		background-color: #b7abbf;
	}

	.character-card {
		background-color: #4d4d4d;
		width: 30%;
		min-width: 250px;
		max-width: 320px;
		aspect-ratio: 320/120;
		margin: 1rem 0.5rem 0 0.5rem;
		position: relative;
		padding: 1rem;
		display: inline-flex;
		overflow: hidden;
	}
	.character-card::after {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 0.1rem solid #6d6a63;
		width: calc(100% - 0.8rem);
		height: calc(100% - 0.8rem);
	}

	:global(.mobile) .character-card {
		min-width: unset;
	}

	picture {
		height: 100%;
		display: inline-block;
		aspect-ratio: 1/1;
		background-size: cover;
		position: relative;
		overflow: hidden;
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

	picture i {
		position: absolute;
		z-index: +1;
		top: 0;
		left: 0;
		font-size: 1.3rem;
	}

	caption {
		color: #fff;
		padding: 0.5rem 1rem;
		position: relative;
		display: inline-flex;
		align-items: flex-start;
		justify-content: stretch;
		text-align: left;
	}

	caption::after {
		content: '';
		display: block;
		right: 0;
		width: calc(100% - 1rem);
		height: 0.1rem;
		top: 70%;
		position: absolute;
		background-color: #fff;
	}

	@media screen and (max-width: 600px) {
		.character-card {
			min-width: calc(50% - 1rem);
		}
	}

	.element {
		color: #fff;
		opacity: 0.08;
		font-size: 7em;
		display: inline-block;
		position: absolute;
		right: 0;
		bottom: 0;
		transform: translate(25%, 35%);
	}
</style>
