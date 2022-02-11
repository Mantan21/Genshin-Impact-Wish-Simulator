<script>
	import { browser } from '$app/env';
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { getName } from '$lib/functions/nameText';
	import OverlayScrollbars from 'overlayscrollbars';
	import updates from '$lib/setup/updates.json';
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import factoryReset from '$lib/functions/factoryReset';
	import playSfx from '$lib/functions/audio';
	import { bannerPhase, pageActive, patchVersion } from '$lib/store/stores';

	export let show = false;
	let showResetPopup = false;
	let showToast = false;
	let activeContent = 'options';

	const reset = () => {
		showResetPopup = true;
		playSfx('popup');
	};
	const confirmReset = async () => {
		showResetPopup = false;
		await factoryReset();
		showToast = true;
		const t = setTimeout(() => {
			showToast = false;
			clearTimeout(t);
		}, 3000);
	};

	const cancelReset = () => {
		showResetPopup = false;
	};

	const dispatch = createEventDispatcher();
	const handleClose = () => {
		dispatch('close');
		history.back();
	};

	let content;
	$: if (activeContent === 'updates') {
		if (browser)
			OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	}
</script>

<PopUp
	title="Factory Reset"
	show={showResetPopup}
	button="all"
	on:confirm={confirmReset}
	on:cancel={cancelReset}
>
	<div class="confirmation">
		<div style="padding: 1rem">
			Are You sure to clear <strong> All Data </strong> and restore to default ?
			<br />
			<small> It also remove your History, Pity Count, Balance and all items from Inventory.</small>
		</div>
	</div>
</PopUp>

{#if show}
	{#if showToast}
		<div class="toast" transition:fly={{ y: -20 }}>Reset Successfull</div>
	{/if}

	<section transition:fade={{ duration: 200 }}>
		<div class="head">
			<h1>Menu / {getName(activeContent)}</h1>
			<button class="close" on:click={handleClose} title="Change Banner">
				<i class="gi-close" />
			</button>
		</div>
		<div class="container">
			<div class="sidebar">
				<div class="menu-list">
					<div class="menu-item" class:active={activeContent === 'options'}>
						<button on:click={() => (activeContent = 'options')}> Options </button>
					</div>
					<div class="menu-item" class:active={activeContent === 'updates'}>
						<button on:click={() => (activeContent = 'updates')}> Update History </button>
					</div>
				</div>
			</div>

			<div class="content">
				{#if activeContent === 'options'}
					<div in:fade={{ duration: 200 }}>
						<div class="option">
							<div class="option-name">Unlimited Fates</div>
							<div class="option-select">No</div>
						</div>
						<div class="option">
							<div class="option-name">Switch Banner</div>
							<button class="option-select" on:click={() => pageActive.set('previous-banner')}>
								{$patchVersion} - {$bannerPhase}
							</button>
						</div>
						<div class="option">
							<div class="option-name">Clear Data and Restore Default</div>
							<button class="option-select" on:click={reset}>
								<i
									class="gi-delete"
									style="vertical-align: bottom; line-height: 0; margin-right: .2rem"
								/> Reset Now
							</button>
						</div>

						<h2>Notes :</h2>
						<div class="notes">
							<ol>
								<li>
									Remember, We never collect your data, all task that made by this site will
									processed on your computer.
								</li>
								<li>
									This site use Localstorage and IndexedDB to save your pull history, it's on your
									browser, if you clear your browser data, you will lost your data that related to
									this site too. No chance to recover it back, because we never save your data on
									cloud (point 1)
								</li>
							</ol>
						</div>
					</div>
				{/if}

				{#if activeContent === 'updates'}
					<div class="updates" in:fade={{ duration: 200 }}>
						<div class="text">
							You can Check what are changes we made on <a
								href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator"
								target="_blank"
							>
								Github Repository
							</a>. You can submit an issue if you find something wrong !
						</div>
						<div class="update-item" bind:this={content}>
							{#each updates.data.reverse() as { description, date }, i (i)}
								<h2>
									<i class="tgl"> {date} </i>
									{#if i === 0} ( Latest Update ) {/if}
								</h2>
								{#each description as txt} <p>{@html txt}</p> {/each}
							{/each}
						</div>
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

	h2 {
		color: var(--tertiary-color);
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	section {
		width: 100vw;
		height: 100vh;
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
	.close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		line-height: 0;
		overflow: hidden;
		border-radius: 50px;
		transition: all 0.2s;
	}

	.close:hover {
		background-color: var(--tertiary-color);
	}

	:global(.mobile) .close {
		width: 2rem;
		height: 2rem;
	}

	.container {
		display: flex;
		justify-content: center;
		margin: 0 2%;
		height: calc(100% - 7rem);
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
		padding: 0.5rem;
	}

	.menu-item::before {
		content: '\65';
		font-family: 'genshin-icon' !important;
		font-style: normal !important;
		font-weight: normal !important;
		font-variant: normal !important;
		text-transform: none !important;
		speak: none;
		line-height: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #fff;
		padding: 0.5rem;
		visibility: hidden;
	}
	.menu-item.active::before {
		visibility: visible;
	}
	.menu-item.active button {
		transform: scale(1.2);
		color: #fff;
		opacity: 1;
	}
	.menu-item:hover button {
		color: #fff;
		opacity: 1;
	}

	.content {
		width: 70%;
	}
	.option {
		display: flex;
		width: 100%;
		padding: 0.5rem 0;
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
		width: 25%;
		text-align: center;
		position: relative;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-top-right-radius: 5rem;
		border-bottom-right-radius: 5rem;
		transition: all 0.2s;
	}

	.option-select:hover {
		background-color: #f0e0c7;
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
	}
	a:hover {
		color: var(--tertiary-color);
	}

	.notes,
	.updates .update-item {
		font-weight: 100;
		background-color: #fff;
		padding: 1rem 2.5rem 0.5rem;
		font-size: 0.87rem;
		border-radius: 0.3rem;
	}
	.updates {
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

	.toast {
		padding: 0.5rem 1rem;
		text-align: center;
		border-radius: 0.3rem;
		width: 10rem;
		color: var(--tertiary-color);
		background-color: #4a5265;
		position: fixed;
		z-index: 102;
		left: 50%;
		top: 1rem;
		transform: translateX(-50%);
		font-size: 0.7rem;
	}
	@media screen and (max-width: 900px) {
		.close {
			width: 2.5rem;
			height: 2.5rem;
			margin: 3px;
		}

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
		:global(main):not(.mobile) .menu-item::before {
			display: none;
		}
		:global(main):not(.mobile) .menu-item button {
			padding: 0.2rem 1rem;
			border-radius: 50px;
			opacity: unset;
		}
		:global(main):not(.mobile) .menu-item.active button,
		:global(main):not(.mobile) .menu-item:hover button {
			background-color: var(--tertiary-color);
			color: #4a5265;
			transform: unset;
		}
	}
</style>
