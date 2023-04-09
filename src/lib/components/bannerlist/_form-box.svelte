<script>
	import { getContext, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { query } from '$lib/store/stores';

	export let groupby;
	let showOptions;

	const handleSearch = getContext('handleSearch');
	const selectGroup = getContext('selectGroup');
	const reverseContext = getContext('reverse');

	const reverse = () => {
		reverseContext();
		showOptions = false;
	};

	const toggleOption = (op = null) => {
		showOptions = !showOptions;
		if (op === 'dimiss') return;
		playSfx();
	};

	onMount(() => {
		const section = document.querySelector('#previous');
		section.addEventListener('click', () => (showOptions = false));
	});
</script>

<div class="filter">
	<div class="row">
		<div class="search">
			<input
				class="wishinput"
				type="text"
				name="q"
				id="q"
				placeholder={$t('wish.banner.findBanner')}
				value={$query}
				on:input={handleSearch}
				title="Find by Character's or Weapon's Name (4star or 5star) or Banner Name"
			/>
			<button><i class="gi-search" /></button>
		</div>

		<div class="selector">
			<div class="selected-option" on:click|stopPropagation={toggleOption}>
				{$t('wish.banner.group')} / {groupby === 'version' ? $t(`version`) : $t(groupby)}
				<i class="gi-caret-{showOptions ? 'up' : 'down'}" />
			</div>

			{#if showOptions}
				<div class="option-list below" transition:fade={{ duration: 200 }}>
					{#each ['version', 'character', 'weapon'] as val}
						<a
							href="/"
							class:selected={groupby == val}
							on:click|preventDefault={() => selectGroup(val, false)}
						>
							{$t(val)}
						</a>
					{/each}
				</div>
			{/if}
		</div>
		<button class="btn reverse" title="Reverse Group" on:click|stopPropagation={reverse}>
			<i class="gi-exchange" />
		</button>
	</div>
</div>

<style>
	.filter {
		height: 3rem;
		width: 100%;
	}

	:global(.mobile) .filter {
		height: 2rem;
		margin-top: -0.5rem;
	}

	.filter .row {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 2%;
	}

	.search {
		width: 20rem;
		position: relative;
		max-width: 60%;
	}

	.search input {
		font-size: 0.75rem;
		padding-right: 12%;
	}
	.search button {
		position: absolute;
		right: 5%;
		top: 55%;
		transform: translateY(-50%);
	}

	.selector {
		width: 12rem;
		min-width: fit-content;
		max-width: 40%;
	}
</style>
