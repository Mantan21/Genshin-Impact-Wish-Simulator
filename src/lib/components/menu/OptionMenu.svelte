<script>
	import { browser } from '$app/environment';
	import { getContext, onMount, setContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { locale, t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import { localConfig } from '$lib/store/localstore';
	import { animeoff, muted, unlimitedFates } from '$lib/store/stores';
	import factoryReset from '$lib/helpers/factoryReset';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';

	import Modal from '$lib/components/utility/ModalTpl.svelte';
	import Toast from '$lib/components/utility/Toast.svelte';
	import OptionMenu from './_options.svelte';

	let optionToShow = '';
	const handleOption = (selected) => (optionToShow = selected);
	setContext('handleOption', handleOption);

	const handleSelect = (option, e) => {
		const { selected } = e.detail;
		const optionValue = selected === 'yes';
		localConfig.set(option, optionValue);

		if (option === 'muted') return muted.set(optionValue);
		if (option === 'animeoff') return animeoff.set(optionValue);
	};

	// Animated BG
	const handleAnimatedBG = getContext('animateBG');
	let animatedbg = browser ? !!localConfig.get('animatedBG') : false;
	const showAnimatedBG = (e) => {
		const { selected } = e.detail;
		localConfig.set('animatedBG', selected === 'yes');
		animatedbg = selected === 'yes';
		handleAnimatedBG();
	};

	// WishAmount
	let selectedAmount = localConfig.get('wishAmount') || 'default';
	const handleSelectAmount = ({ detail }) => {
		selectedAmount = detail;
		localConfig.set('wishAmount', detail);
		unlimitedFates.set(detail === 'unlimited');
	};

	// Reset
	let showResetModal = false;
	let clearCache = false;
	let showToast = false;
	let storageSize = '..B';

	const getSize = async () => {
		const { usage } = await navigator.storage.estimate();
		const size = (usage / 1000000).toFixed(2);
		storageSize = `${size}MB`;
	};

	const reset = () => {
		showResetModal = true;
		playSfx('modal');
	};
	setContext('factoryReset', reset);

	const confirmReset = async () => {
		showResetModal = false;
		await factoryReset({ clearCache });
		showToast = true;
		selectedAmount = 'default';
	};

	const cancelReset = () => {
		showResetModal = false;
	};

	let optionsContainer;
	onMount(() => {
		OverlayScrollbars(optionsContainer, { sizeAutoCapable: false, className: 'os-theme-light' });
		getSize();
	});
</script>

<Modal
	title={$t('menu.resetTitle')}
	show={showResetModal}
	button="all"
	on:confirm={confirmReset}
	on:cancel={cancelReset}
>
	<div class="confirmation">
		<div style="padding: 1rem">
			{@html $t('menu.resetPrompt')}
			<br />
			<small>
				{$t('menu.resetDetail')}
			</small>

			<div class="clear-cache">
				<input
					type="checkbox"
					bind:checked={clearCache}
					name="cache"
					id="cache"
					style="margin-right: 2%;"
				/>
				<label for="cache">{$t('menu.clearCache', { values: { size: storageSize } })}</label>
			</div>
		</div>
	</div>
</Modal>

{#if showToast}
	<Toast on:close={() => (showToast = false)}>{$t('menu.resetSuccess')}</Toast>
{/if}

<div in:fade={{ duration: 200 }} class="content-container" bind:this={optionsContainer}>
	<OptionMenu
		text={$t('menu.language')}
		name="locale"
		activeIndicator={$locale}
		showOption={optionToShow === 'locale'}
	/>

	<OptionMenu text={$t('menu.currency')} name="currency" showOption={optionToShow === 'currency'} />

	<OptionMenu
		name="wishAmount"
		text={$t('menu.fates')}
		showOption={optionToShow === 'wishAmount'}
		activeIndicator={selectedAmount}
		on:select={handleSelectAmount}
	/>

	{#each ['intertwined', 'acquaint', 'starglitter', 'stardust', 'primogem'] as item, i}
		{#if selectedAmount === 'manual'}
			<div in:fly|local={{ y: -10, delay: Math.sqrt(i * 10000) }} out:fly|local={{ y: -10 }}>
				<OptionMenu sub name={item} text={$t(`shop.item.${item}`)} />
			</div>
		{/if}
	{/each}

	<OptionMenu
		name="audio"
		text={$t('menu.mute')}
		activeIndicator={$muted}
		on:select={(e) => handleSelect('muted', e)}
		showOption={optionToShow === 'audio'}
	/>

	<OptionMenu
		name="animeoff"
		text={$t('menu.animeoff')}
		activeIndicator={$animeoff}
		on:select={(e) => handleSelect('animeoff', e)}
		showOption={optionToShow === 'animeoff'}
	/>

	<OptionMenu
		name="animatedbg"
		text={$t('menu.animatedbg')}
		activeIndicator={animatedbg}
		on:select={showAnimatedBG}
		showOption={optionToShow === 'animatedbg'}
	/>

	<OptionMenu name="switchBanner" text={$t('menu.switchBanner')} />

	<OptionMenu name="reset" text={$t('menu.factoryReset')} />

	<h2>Notes :</h2>
	<div class="notes">
		<ol>
			<li>
				I tried to create the simulator with pity system almost like the real game, the rate of
				getting rare item will increase once you reach a certain pity depending on where banner you
				pull. you can go <a
					on:click|stopPropagation
					href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator#pity-system"
					target="_blank"
					rel="noopener noreferrer"
				>
					Here
				</a>
				to find details of the probability. If you has any idea, please send me feedback by creating
				<a
					on:click|stopPropagation
					href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator/issues"
					target="_blank"
					rel="noopener noreferrer"
				>
					new issue here
				</a>
			</li>
			<li>
				This app use Localstorage and IndexedDB to save your pull history, it's native on your
				browser, if you clear your browser data, you will lost your data that related to this app
				too. No chance to recover it back, because we never store your data on cloud
			</li>
			<li>
				This App does not collect or store any personally identifiable information about you.
				However, this app use third party services that may collect information used to identify
				you. The information that these third party services request will be retained on your device
				and is not collected by me in any way.
			</li>
		</ol>
	</div>
</div>

<style>
	.confirmation {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.clear-cache {
		font-size: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 5%;
	}
	.clear-cache label {
		width: 60%;
		text-align: left;
	}

	.notes {
		font-weight: 100;
		background-color: #fff;
		padding: 1rem 2.5rem 0.5rem;
		font-size: 0.87rem;
		border-radius: 0.3rem;
	}

	ol li {
		margin-bottom: 1rem;
	}
</style>
