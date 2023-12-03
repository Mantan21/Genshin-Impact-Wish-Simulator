<script>
	import { onMount } from 'svelte';
	import { API_HOST } from '$lib/env';
	import { lazyLoad } from '$lib/helpers/lazyload';
	import { imageCDN } from '$lib/helpers/assets';
	import { onlineBanner } from '$lib/helpers/custom-banner';
	import ButtonGeneral from '$lib/components/ButtonGeneral.svelte';

	let customList = [];
	onMount(async () => {
		try {
			const request = await fetch(API_HOST + '/storage');
			const { success, data } = await request.json();
			if (!success) return;
			customList = data;
		} catch (e) {
			console.error(e);
		}
	});

	const block = async (id) => {
		await onlineBanner.block(id);
		const index = customList.findIndex(({ id: lID }) => id === lID);
		customList[index].blocked = true;
	};
</script>

<div class="list">
	{#if customList.length < 1}
		<span> waiting ...</span>
	{:else}
		{#each [...customList].reverse() as data}
			{@const { bannerName, hostedImages = {}, blocked, id } = data}
			{@const { artURL = '', faceURL = '', thumbnail = '' } = hostedImages}
			<div class="item" {id}>
				<div class="images">
					<img use:lazyLoad={imageCDN(artURL)} alt={bannerName} />
					<img use:lazyLoad={imageCDN(faceURL)} alt="Face" />
					<img use:lazyLoad={imageCDN(thumbnail)} alt="Thumbail" />
				</div>
				<div class="action">
					<div class="name">{bannerName}</div>
					{#if blocked}
						<ButtonGeneral disabled>Blocked</ButtonGeneral>
					{:else}
						<ButtonGeneral on:click={() => block(id)}>Block</ButtonGeneral>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.item {
		padding: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.7);
		border-bottom: 1px solid rgba(0, 0, 0, 0.7);
	}

	.images {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.images img {
		width: 30%;
		max-width: 250px;
		max-height: 250px;
	}

	.action {
		padding: 1rem;
	}
</style>
