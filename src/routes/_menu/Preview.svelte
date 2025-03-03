<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import OverlayScrollbars from 'overlayscrollbars';
	import updates from '$lib/data/updates.json';
	import { assets, activeVersion, customData, isCustomBanner } from '$lib/store/app-stores';

	const { patch: version, phase } = $activeVersion;

	let processedUpdates = [...updates.data].reverse();

	let latestIndex = processedUpdates.findIndex(item => item.patch == version);
	let newPatchIndex = latestIndex + 1;

	let updatesContainer;
	onMount(() => {
		OverlayScrollbars(updatesContainer, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<div class="updates content-container" in:fade={{ duration: 200 }}>
	<div class="text">
		You can Check what are changes we made on <a
			on:click|stopPropagation
			href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator"
			target="_blank"
		>
			Github Repository
		</a>. You can submit an issue if you find something wrong !
	</div>
	<div class="update-item" bind:this={updatesContainer}>
		{#each [...updates.data].reverse() as { description, date, video, patch }, i (i)}
			<h2>
				<i class="tgl"> {date} </i>
				{#if version == patch}
					( Latest Banner )
				{:else if i == newPatchIndex}
					( New Patch )
				{/if}
			</h2>
			{#each description as txt} <p>{@html txt}</p> {/each}
			<br>
			<div align="center"><iframe width="640" height="360"
			src={video} title="Preview">
			</iframe></div>
			{/each}
	</div>
</div>

<style>
	.text {
		color: #fff;
		margin-bottom: 1rem;
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	.text a {
		text-decoration: underline;
		transition: all 0.2s;
		color: #ffffff;
	}

	a:hover {
		color: #f7cf33;
	}

	.updates .update-item {
		font-weight: 100;
		background-color: #fff;
		padding: 1rem 2.5rem 0.5rem;
		font-size: 0.87rem;
		border-radius: 0.3rem;
	}

	.update-item {
		height: 100%;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 0.97rem;
		display: block;
		overflow: hidden;
	}

	.updates p {
		position: relative;
		padding-left: 1rem;
	}
	.updates p::before {
		content: '*';
		display: inline-block;
		width: 10px;
		line-height: 0;
		font-size: 1.3rem;
		padding-top: 0.5rem;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	.updates h2:nth-child(1) {
		margin-top: 0;
	}
	.updates h2 {
		margin-left: -1rem;
		font-weight: bold;
		color: #f7cf33;
	}
	.updates .tgl {
		color: #bd6932;
	}
</style>
