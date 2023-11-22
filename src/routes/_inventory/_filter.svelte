<script>
	import { getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { playSfx } from '$lib/helpers/audio/audio';
	import CheckBox from '$lib/components/CheckBox.svelte';

	export let activeItem;
	export let itemQty;
	export let showAll;
	export let orderby;

	const order = getContext('orderby');
	const reverse = getContext('reverse');

	const showAllInventory = getContext('showAll');
	const handleShowAll = ({ detail }) => showAllInventory(!!detail.checked);

	let showOrderOption = false;
	const handleShowOrderOption = () => {
		playSfx();
		showOrderOption = !showOrderOption;
	};

	const selectOrder = (val) => {
		order(val);
		handleShowOrderOption();
	};

	onMount(() => {
		const section = document.querySelector('section');
		section.addEventListener('mousedown', () => (showOrderOption = false));
	});
</script>

<div class="filter">
	<div class="row">
		<button class="btn reverse" on:click={reverse} title="Reverse Order">
			<i class="gi-exchange" />
		</button>
		<div class="selector" on:mousedown|stopPropagation>
			<button class="selected-option" on:click={handleShowOrderOption}>
				{$t('inventory.sort')} / {$t(`inventory.${orderby}`)}

				{#if showOrderOption}
					<i class="gi-caret-up" />
				{:else}
					<i class="gi-caret-down" />
				{/if}
			</button>

			{#if showOrderOption}
				<div class="option-list above" transition:fade={{ duration: 200 }}>
					{#each ['release', 'rarity', 'name', 'quantity'] as val}
						<button class:selected={orderby == val} on:click={() => selectOrder(val)}>
							{$t(`inventory.${val}`)}
						</button>
					{/each}

					{#if activeItem === 'character'}
						<button class:selected={orderby == 'element'} on:click={() => selectOrder('element')}>
							{$t(`inventory.element`)}
						</button>
					{/if}

					{#if activeItem === 'weapon'}
						<button class:selected={orderby == 'type'} on:click={() => selectOrder('type')}>
							{$t(`inventory.type`)}
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<CheckBox on:change={handleShowAll} checked={showAll}>
			{$t(`inventory.showAllOption`, {
				values: { item: $t(activeItem) }
			})}
			<span> {itemQty.owned}/{itemQty.all}</span>
		</CheckBox>
	</div>
</div>

<style>
	.filter {
		height: 3rem;
		width: 100%;
	}

	.filter .row {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 2%;
	}

	.selector button {
		width: 100%;
	}

	.filter :global(.checkbox) {
		color: var(--tertiary-color);
	}
</style>
