<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { locales, locale, t } from 'svelte-i18n';
	import playSfx from '$lib/functions/audio';
	import { localeName, flags } from '../../data/country.json';

	export let text;
	export let name;
	export let activeIndicator;
	export let lang = false;
	export let showOption = false;

	const handleOption = getContext('handleOption');

	const dispatch = createEventDispatcher();
	let select = (selected) => {
		playSfx();
		showOption = !showOption;
		if (!selected) return;

		dispatch('select', { selected });
		handleOption('');
	};

	const setLang = (langID) => {
		playSfx();
		locale.set(langID);
		localStorage.setItem('locale', langID);
		handleOption('');
	};

	const openOption = () => {
		playSfx();
		if (showOption) return handleOption('');
		handleOption(name);
	};
</script>

<div class="option">
	<div class="option-name">{text}</div>

	{#if !lang}
		<div class="option-select">
			<button
				class="selected"
				style="width: 100%; height:100%"
				on:click|stopPropagation={openOption}
			>
				{activeIndicator ? $t('menu.yes') : $t('menu.no')}
			</button>
			<i class="gi-caret-{showOption ? 'up' : 'down'}" />
			{#if showOption}
				<div class="select" in:fly={{ duration: 200, y: -10 }}>
					<button class:selected={!activeIndicator} on:click|stopPropagation={() => select('no')}>
						{$t('menu.no')}
					</button>
					<button class:selected={activeIndicator} on:click|stopPropagation={() => select('yes')}>
						{$t('menu.yes')}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	{#if lang}
		<div class="option-select locale">
			<button
				class="selected"
				style="width: 100%; height:100%"
				on:click|stopPropagation={openOption}
			>
				<img
					src="data:image/png;base64,{flags[activeIndicator.substring(0, 2)]}"
					alt="flag"
					class="flag"
				/>
				{localeName[activeIndicator]}
			</button>
			<i class="gi-caret-{showOption ? 'up' : 'down'}" />
			{#if showOption}
				<div class="select" in:fly={{ duration: 200, y: -10 }}>
					{#each $locales as locale}
						<button
							class:selected={activeIndicator === locale}
							on:click|stopPropagation={() => setLang(locale)}
						>
							<span style="text-align:right; padding-right: 1rem; width:50%">
								<img
									src="data:image/png;base64,{flags[locale.substring(0, 2)]}"
									alt="flag"
									class="flag"
								/>
							</span>
							<span style="text-align:left;width:100%"> {localeName[locale]} </span>
						</button>
					{/each}
					<button on:click|stopPropagation>
						<span style="text-align:left;width:100%; padding: .5rem; text-align:center">
							Suggest language
						</span>
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.option {
		display: flex;
		width: 100%;
		padding: 0.5rem 0;
	}
	@media screen and (max-width: 900px) {
		.option {
			padding: 0.3rem 0;
		}
	}
	.option-name {
		background-color: #fff;
		width: 75%;
		padding: 0.3rem 2rem;
		border-top-left-radius: 5rem;
		border-bottom-left-radius: 5rem;
	}

	.option-select {
		background-color: var(--tertiary-color);
		width: 40%;
		max-width: 14rem;
		text-align: center;
		position: relative;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-top-right-radius: 5rem;
		border-bottom-right-radius: 5rem;
		transition: all 0.2s;
	}

	.option-select i {
		position: absolute;
		top: 50%;
		right: 1rem;
		font-size: 1rem;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.option-select button,
	.option-select {
		font-size: 0.8rem !important;
	}

	.select {
		position: absolute;
		top: 110%;
		left: 0;
		width: 100%;
		background-color: var(--tertiary-color);
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
		z-index: +1;
		border-radius: 0.3rem;
		overflow: hidden;
	}
	.select button {
		display: block;
		width: 100%;
		padding: 0.15rem;
	}

	.select button:hover,
	.select button.selected {
		background-color: #f0e0c7;
	}

	.locale .select button {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 0%;
		padding: 0.5rem;
	}
	.flag {
		width: 1.2rem;
	}
</style>
