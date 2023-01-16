<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { locales, locale, t } from 'svelte-i18n';
	import { bannerPhase, pageActive, patchVersion } from '$lib/store/stores';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { localeName, flags } from '$lib/data/country.json';
	import browserState from '$lib/helpers/browserState';
	import { availableCurrencies, userCurrencies } from '$lib/helpers/currencies';
	import { localConfig } from '$lib/store/localstore';

	export let text;
	export let name;
	export let activeIndicator = null;
	export let showOption = false;

	const handleOption = getContext('handleOption');
	const reset = getContext('factoryReset');

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
		userCurrencies.init();
	};

	const openPrevious = () => {
		playSfx('prevbanner');
		browserState.set('previous');
		pageActive.set('previous-banner');
	};

	const openOption = () => {
		playSfx();
		if (showOption) return handleOption('');
		handleOption(name);
	};

	$: currencyIndicator = $locale ? userCurrencies.checkUsedCurrency().currency : '';
	const setCurrency = (selected) => {
		playSfx();
		localConfig.set('currency', selected);
		currencyIndicator = selected;
		userCurrencies.init(selected);
		handleOption('');
	};
</script>

<div class="option">
	<div class="option-name">{text}</div>

	{#if name === 'locale'}
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
						<a
							href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator/tree/master/src/locales"
							target="_blank"
							style="text-align:left;width:100%; padding: .5rem; text-align:center"
						>
							Contribute
						</a>
					</button>
				</div>
			{/if}
		</div>
	{:else if name === 'currency'}
		<div class="option-select locale">
			<button
				class="selected"
				style="width: 100%; height:100%"
				on:click|stopPropagation={openOption}
			>
				{currencyIndicator}
			</button>
			<i class="gi-caret-{showOption ? 'up' : 'down'}" />
			{#if showOption}
				<div class="select" in:fly={{ duration: 200, y: -10 }}>
					{#each availableCurrencies as { currency }}
						<button
							class:selected={currencyIndicator === currency}
							on:click|stopPropagation={() => setCurrency(currency)}
						>
							<span style="text-align:center;width:100%;padding: 3%"> {currency} </span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{:else if name === 'switchBanner'}
		<button class="option-select" on:click={openPrevious}>
			<i class="gi-caret-down" />
			{$patchVersion} - {$bannerPhase}
		</button>
	{:else if name === 'reset'}
		<button class="option-select" on:click={reset}>
			<i class="gi-delete" style="vertical-align: bottom; line-height: 0; margin-right: .2rem" />
			{$t('menu.resetButton')}
		</button>
	{:else}
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
</div>

<style>
	.option {
		display: flex;
		width: 100%;
		padding: 0.4rem 0;
	}
	@media screen and (max-width: 900px) {
		.option {
			padding: 0.3rem 0;
		}
	}
	.option-name {
		background-color: #eae5d9;
		width: 75%;
		padding: 0.35rem 1rem;
		border-top-left-radius: 5rem;
		border-bottom-left-radius: 5rem;
		border: solid transparent;
		border-width: 0.2rem 0 0.2rem 0.2rem;
		white-space: nowrap;
	}

	.option-select {
		background-color: #dcd4c2;
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
		border: solid transparent;
		border-width: 0.2rem 0.2rem 0.2rem 0;
	}

	.option:hover .option-name,
	.option:hover .option-select {
		border-color: #fff;
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
		max-height: 60vh;
		background-color: #565a64;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
		z-index: +1;
		border-radius: 1rem;
		overflow-y: auto;
	}
	.select button {
		display: block;
		width: 100%;
		padding: 6%;
		color: #eee;
	}

	.select button:hover,
	.select button.selected {
		background-color: #717887;
	}

	.locale {
		font-family: var(--gi-global-font);
	}
	.locale .select button {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 0%;
		padding: 8%;
	}

	.flag {
		width: 1.2rem;
	}

	@media screen and (max-width: 900px) {
		:global(main):not(.mobile) .option-name {
			font-size: 120%;
		}
	}
</style>
