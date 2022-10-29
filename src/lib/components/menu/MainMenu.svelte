<script>
	import { browser } from '$app/env';
	import { afterUpdate, createEventDispatcher, setContext, getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { locale, t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';

	import {
		assets,
		isMobile,
		mobileMode,
		muted,
		unlimitedFates,
		viewportHeight
	} from '$lib/store/stores';
	import { localConfig } from '$lib/store/localstore';
	import factoryReset from '$lib/helpers/factoryReset';
	import playSfx from '$lib/helpers/audio';
	import updates from '$lib/setup/updates.json';

	// Components
	import Modal from '$lib/components/utility/ModalTpl.svelte';
	import Toast from '$lib/components/utility/Toast.svelte';
	import Option from './OptionMenu.svelte';
	export let show = false;
	let showResetModal = false;
	let showToast = false;
	let clearCache = false;
	let activeContent = 'options';
	let optionToShow = '';

	const handleOption = (selected) => (optionToShow = selected);
	setContext('handleOption', handleOption);

	const selectMenu = (menu) => {
		activeContent = menu;
		playSfx();
	};

	// Unlimited Fates
	const selectUnlimitedOptions = (e) => {
		const { selected } = e.detail;
		const optionValue = selected === 'yes';
		localConfig.set('unlimitedFates', optionValue);
		return unlimitedFates.set(optionValue);
	};

	// Show Collection
	let showAllItemsIndicator = browser ? !!localConfig.get('showAllItems') : false;
	const showAllItemsOption = (e) => {
		const { selected } = e.detail;
		localConfig.set('showAllItems', selected === 'yes');
		showAllItemsIndicator = selected === 'yes';
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

	// Audio
	const handleAudio = (e) => {
		const { selected } = e.detail;
		const optionValue = selected === 'yes';
		localConfig.set('muted', optionValue);
		muted.set(optionValue);
	};

	// Reset
	const reset = () => {
		showResetModal = true;
		playSfx('modal');
	};
	setContext('factoryReset', reset);

	const confirmReset = async () => {
		showResetModal = false;
		await factoryReset({ clearCache });
		showToast = true;
	};

	const cancelReset = () => {
		showResetModal = false;
	};

	const dispatch = createEventDispatcher();
	const handleClose = () => {
		dispatch('close');
		playSfx('close');
	};

	let updatesContainer;
	let optionsContainer;
	afterUpdate(() => {
		const content = updatesContainer || optionsContainer;
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

{#if show}
	<Modal
		title="Factory Reset"
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
					<label for="cache">{$t('menu.clearCache')}</label>
				</div>
			</div>
		</div>
	</Modal>

	{#if showToast}
		<Toast on:close={() => (showToast = false)}>{$t('menu.resetSuccess')}</Toast>
	{/if}

	<section
		transition:fade={{ duration: 200 }}
		style="height: {$viewportHeight}px;"
		on:click|preventDefault={() => handleOption('')}
	>
		<div class="head">
			<h1>{$t('menu.text')} / {$t(`menu.${activeContent}`)}</h1>
			<button class="close" on:click={handleClose}>
				<i class="gi-close" />
			</button>
		</div>
		<div class="container">
			<div class="sidebar">
				<div class="menu-list" style="--bg-active: url('{$assets['menu-active.png']}')">
					<div class="menu-item" class:active={activeContent === 'options'}>
						<button on:click={() => selectMenu('options')}> {$t('menu.options')} </button>
					</div>
					<div class="menu-item" class:active={activeContent === 'updates'}>
						<button on:click={() => selectMenu('updates')}> {$t('menu.updates')} </button>
					</div>
				</div>
			</div>

			<div class="content">
				{#if activeContent === 'options'}
					<div in:fade={{ duration: 200 }} class="content-container" bind:this={optionsContainer}>
						<Option
							text={$t('menu.language')}
							name="locale"
							activeIndicator={$locale}
							showOption={optionToShow === 'locale'}
						/>

						<Option
							text={$t('menu.currency')}
							name="currency"
							showOption={optionToShow === 'currency'}
						/>

						<Option
							name="fates"
							text={$t('menu.fates')}
							showOption={optionToShow === 'fates'}
							activeIndicator={$unlimitedFates}
							on:select={selectUnlimitedOptions}
						/>

						<Option
							name="audio"
							text={$t('menu.mute')}
							activeIndicator={$muted}
							on:select={handleAudio}
							showOption={optionToShow === 'audio'}
						/>

						<Option
							name="animatedbg"
							text={$t('menu.animatedbg')}
							activeIndicator={animatedbg}
							on:select={showAnimatedBG}
							showOption={optionToShow === 'animatedbg'}
						/>

						<Option name="switchBanner" text={$t('menu.switchBanner')} />

						<Option
							name="inventory"
							text={$t('menu.showAllitems')}
							activeIndicator={showAllItemsIndicator}
							on:select={showAllItemsOption}
							showOption={optionToShow === 'inventory'}
						/>

						<Option name="reset" text={$t('menu.factoryReset')} />

						<h2>Notes :</h2>
						<div class="notes">
							<ol>
								<li>
									I heard a lot of people are annoyed with ads, so I decided to created another site
									without ads, but this is available for supporters only. If you are interested in
									it, you can go here &raquo; <a
										on:click|stopPropagation
										href="https://archon.wishsimulator.app"
										target="_blank"
									>
										Archon.WishSimulator.App
									</a>
									&laquo; and
									<a
										on:click|stopPropagation
										href="https://ko-fi.com/post/AdFree-Wish-Simulator-Enjoy-Simulator-Without-Ads-G2G2DQ57O"
										target="_blank"
									>
										here
									</a> to get the access key
								</li>
								<li>
									This simulator has pity system almost like the real game, the rate of getting rare
									item will increase when you reach a certain pity depending on where banner you
									pull. you can go <a
										on:click|stopPropagation
										href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator#pity-system"
										target="_blank"
										rel="noopener noreferrer"
									>
										Here
									</a>
									to find details of the probability. If you has any idea, please send me feedback by
									creating
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
									This app use Localstorage and IndexedDB to save your pull history, it's native on
									your browser, if you clear your browser data, you will lost your data that related
									to this app too. No chance to recover it back, because we never store your data on
									cloud
								</li>
								<li>
									This App does not collect or store any personally identifiable information about
									you. However, this app use third party services that may collect information used
									to identify you. The information that these third party services request will be
									retained on your device and is not collected by me in any way.
								</li>
							</ol>
						</div>
					</div>
				{/if}

				{#if activeContent === 'updates'}
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
							{#each [...updates.data].reverse() as { description, date }, i (i)}
								<h2>
									<i class="tgl"> {date} </i>
									{#if i === 0} ( Latest Update ) {/if}
								</h2>
								{#each description as txt} <p>{@html txt}</p> {/each}
							{/each}
						</div>
					</div>
				{/if}

				{#if $isMobile && !$mobileMode}
					<div class="rotate">
						<i class="gi-rotate-phone" />
						<span>{$t('menu.rotate')} </span>
					</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

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

	h2 {
		color: var(--tertiary-color);
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	section {
		width: 100vw;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		backdrop-filter: blur(12px);
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 100;
	}
	.head {
		display: flex;
		justify-content: space-between;
		margin: 2%;
		color: var(--tertiary-color);
	}
	:global(.mobile) .head {
		margin: 0.5rem 2%;
	}

	.container {
		display: flex;
		justify-content: center;
		margin: 0 2%;
		height: calc(100% - 7rem);
	}

	:global(.mobile) .container {
		height: calc(100% - 5rem);
	}

	.sidebar {
		width: 30%;
		max-width: 20rem;
	}
	:global(.mobile) .sidebar {
		width: 25%;
	}
	.sidebar .menu-list {
		display: flex;
		flex-direction: column;
	}

	.menu-item button {
		color: var(--tertiary-color);
		transition: all 0.2s;
		opacity: 0.8;
		transform-origin: left;
		padding: 5%;
		width: 100%;
		text-align: left;
		padding-left: 2.5rem;
		font-size: 110%;
	}

	.menu-item {
		position: relative;
	}
	.menu-item.active button {
		color: #fff;
		opacity: 1;
		position: relative;
	}
	.menu-item.active::after {
		content: '';
		background-image: var(--bg-active);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.menu-item:hover button {
		opacity: 1;
	}

	.content {
		width: 70%;
		position: relative;
	}

	.text {
		color: #fff;
		margin-bottom: 1rem;
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	a {
		text-decoration: underline;
		transition: all 0.2s;
	}
	a:hover {
		color: #f29f0f;
	}

	.notes,
	.updates .update-item {
		font-weight: 100;
		background-color: #fff;
		padding: 1rem 2.5rem 0.5rem;
		font-size: 0.87rem;
		border-radius: 0.3rem;
	}
	.content-container {
		display: flex;
		flex-direction: column;
		height: 100%;
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

	ol li {
		margin-bottom: 1rem;
	}

	.rotate {
		position: fixed;
		bottom: 5%;
		left: 5%;
		color: #fff;
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.gi-rotate-phone {
		font-size: 3rem;
		animation: rotatePhone 1s infinite alternate;
	}

	:global(.mobile) .close {
		margin-right: 4%;
	}

	@media screen and (max-width: 900px) {
		:global(main):not(.mobile) .container {
			flex-direction: column;
		}

		:global(main):not(.mobile) .content {
			width: 100%;
			height: 100%;
			margin-top: 1.5rem;
		}
		:global(main):not(.mobile) .sidebar {
			width: 100%;
			max-width: unset;
		}
		:global(main):not(.mobile) .sidebar .menu-list {
			flex-direction: row;
			justify-content: center;
		}
		:global(main):not(.mobile) .menu-item.active::after {
			display: none;
		}
		:global(main):not(.mobile) .menu-item button {
			padding: 0.2rem 1rem;
			border-radius: 50px;
			opacity: unset;
			font-size: 135%;
		}
		:global(main):not(.mobile) .menu-item.active button,
		:global(main):not(.mobile) .menu-item:hover button {
			background-color: var(--tertiary-color);
			color: #4a5265;
			transform: unset;
		}
	}

	@keyframes rotatePhone {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-90deg);
		}
	}
</style>
