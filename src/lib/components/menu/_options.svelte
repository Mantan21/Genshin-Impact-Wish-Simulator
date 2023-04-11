<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { locales, locale, t } from 'svelte-i18n';
	import {
		acquaint,
		bannerPhase,
		intertwined,
		pageActive,
		patchVersion,
		primogem,
		stardust,
		starglitter
	} from '$lib/store/stores';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { localeName, flags } from '$lib/data/country.json';
	import browserState from '$lib/helpers/browserState';
	import { availableCurrencies, userCurrencies } from '$lib/helpers/currencies';
	import { localBalance, localConfig } from '$lib/store/localstore';
	import Icon from '../utility/Icon.svelte';

	export let text;
	export let name;
	export let sub = false;
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

	// Currency
	$: currencyIndicator = $locale ? userCurrencies.checkUsedCurrency().currency : '';
	const setCurrency = (selected) => {
		playSfx();
		localConfig.set('currency', selected);
		currencyIndicator = selected;
		userCurrencies.init(selected);
		handleOption('');
	};

	// Wish Amount
	const selectAmount = (val) => {
		playSfx();
		handleOption('');
		dispatch('select', val);
	};

	const getValue = (value) => {
		let result = 0;
		switch (value) {
			case 'primogem':
				result = $primogem;
				break;
			case 'intertwined':
				result = $intertwined;
				break;
			case 'acquaint':
				result = $acquaint;
				break;
			case 'starglitter':
				result = $starglitter;
				break;
			case 'stardust':
				result = $stardust;
				break;

			default:
				break;
		}
		return result;
	};

	const setValues = (e) => {
		let val = e.target.value;
		val = val.length > 9 ? val.substring(0, 9) : val;
		val = parseInt(val, 10);
		const value = !isNaN(val) ? val : 0;
		switch (name) {
			case 'primogem':
				primogem.set(value);
				break;
			case 'intertwined':
				intertwined.set(value);
				break;
			case 'acquaint':
				acquaint.set(value);
				break;
			case 'starglitter':
				starglitter.set(value);
				break;
			case 'stardust':
				stardust.set(value);
				break;

			default:
				break;
		}
		localBalance.set(name, value);
		e.target.value = val;
	};
</script>

<div class="option" class:sub>
	<div class="option-name">
		{#if sub}
			<Icon type={name} style="margin: -1% 2% -1% 0" />
		{/if}
		{text}
	</div>

	{#if sub}
		<input
			type="number"
			class="option-select"
			on:input={setValues}
			min="0"
			max="999999999"
			maxlength="9"
			value={getValue(name) || 0}
		/>
	{:else if name === 'locale'}
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
	{:else if name === 'wishAmount'}
		<div class="option-select wishAmount">
			<button
				class="selected"
				style="width: 100%; height:100%"
				on:click|stopPropagation={openOption}
			>
				{activeIndicator === 'default' ? $t('outfit.default') : $t(`menu.${activeIndicator}`)}
			</button>
			<i class="gi-caret-{showOption ? 'up' : 'down'}" />
			{#if showOption}
				<div class="select" in:fly={{ duration: 200, y: -10 }}>
					{#each ['default', 'unlimited', 'manual'] as item}
						<button class:selected={activeIndicator === item} on:click={() => selectAmount(item)}>
							<span style="text-align:center;width:100%;padding: 3%">
								{item === 'default' ? $t('outfit.default') : $t(`menu.${item}`)}
							</span>
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
		width: 100%;
		padding: 0.35rem 1rem;
		border-top-left-radius: 5rem;
		border-bottom-left-radius: 5rem;
		border: solid transparent;
		border-width: 0.2rem 0 0.2rem 0.2rem;
		white-space: nowrap;
	}
	.sub .option-name {
		width: 87%;
		margin-left: 10%;
		position: relative;
	}

	.sub .option-name::before {
		content: '';
		position: absolute;
		left: -13%;
		width: 15%;
		height: 148%;
		z-index: -1;
		bottom: 50%;
		border-bottom: #dcd4c2 dashed 0.12rem;
		border-left: #dcd4c2 dashed 0.12rem;
		opacity: 0.5;
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
		font-size: 0.7rem;
	}
	input.option-select {
		font-size: 0.8rem;
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
		padding: 1% 2%;
	}

	.select button {
		display: block;
		width: 100%;
		padding: 6%;
		color: #eee;
		margin: 1% 0;
		transition: all 0.2s;
		position: relative;
	}

	.select button:hover,
	.select button.selected {
		background-color: #717887;
		border-radius: 2rem;
	}

	.select button.selected::after {
		content: '✔';
		color: #eee;
		position: absolute;
		display: block;
		top: 50%;
		right: 8%;
		font-size: 170%;
		line-height: 0;
		transform: translateY(-50%);
	}

	.locale {
		font-family: var(--gi-global-font);
	}
	.locale .select button {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 0%;
		padding: 6% 8%;
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
