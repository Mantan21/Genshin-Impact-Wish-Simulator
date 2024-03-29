<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t, json } from 'svelte-i18n';

	import { assets, proUser, showAd } from '$lib/store/app-stores';
	import { adKey } from '$lib/helpers/accessKey';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { pushToast } from '$lib/helpers/toast';

	import Modal from '$lib/components/ModalTpl.svelte';
	import ButtonModal from '$lib/components/ButtonModal.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let input = '';
	let userKey = '';
	let error = false;
	let waiting = false;

	const getProAccount = async () => {
		playSfx();
		waiting = true;
		const { msg: message, validity } = await adKey.verify(input);
		if (validity) return window.location.reload();
		error = !validity;
		pushToast({ message: $t(message), type: error ? 'error' : '' });
		waiting = false;
	};

	let checkingLocal = true;
	let userHasKey = false;
	let dateExpired = '';
	let isUserKeyValid = false;
	let isOffline = false;

	const checkLocal = async () => {
		const { validity, storedKey, status, expiryDate } = await adKey.initialLoad();
		isOffline = status === 'offline';
		userKey = storedKey;
		userHasKey = !!storedKey;
		isUserKeyValid = validity;
		dateExpired = expiryDate;
		if (userHasKey) input = '✼✼✼✼✼';
		checkingLocal = false;
	};

	const showKeyHandle = () => {
		input = input.includes('✼') ? userKey : '✼✼✼✼✼';
	};

	// Modal
	let showModal = false;
	const confirmModal = () => {
		playSfx();
		adKey.clear();
		checkLocal();
		proUser.set(false);
		showAd.set(true);
		showModal = false;
		input = '';
	};
	const cancelModal = () => (showModal = false);

	const handleKey = () => {
		showModal = true;
		playSfx();
	};

	onMount(checkLocal);
</script>

{#if showModal}
	<Modal title={$t('menu.removeKey')} on:confirm={confirmModal} on:cancel={cancelModal}>
		<div class="confirmation">
			<span>
				{$t('menu.removeKeyConfirm')}
			</span>
		</div>
	</Modal>
{/if}

<div
	class="content-container"
	in:fade={{ duration: 200 }}
	style="--bg-icon:url('{$assets['modal-bg-icon.png']}')"
>
	{#if checkingLocal}
		<div class="row loader">
			<Icon type="loader" />
			<span> {$t('menu.checkingKey')} </span>
		</div>
	{:else}
		<form class="row" on:submit|preventDefault={!waiting ? getProAccount : null} in:fade>
			<label for="key">{$t('menu.inputKeyTxt')}</label>
			<div class="input">
				<div class="field" style="position: relative">
					<input
						type="text"
						id="key"
						bind:value={input}
						placeholder={$t('menu.inputKeyPlaceholder')}
						class:error={error || (!isUserKeyValid && userHasKey)}
						disabled={userHasKey}
					/>
					{#if userHasKey}
						<button class="toggle-visible" on:click|preventDefault={showKeyHandle}>
							<i class="gi-eye{input.includes('✼') ? '-slash' : ''}" />
						</button>
					{/if}
				</div>
				<div class="note">
					{#if isOffline}
						<span class="invalid"> {$t('menu.verifyFail')} </span>
					{:else if isUserKeyValid}
						<span class="keyValid"> {$t('menu.adFreeUser')} </span>
					{:else}
						{#if dateExpired && dateExpired !== 'none'}
							<span class="invalid"> {$t('menu.keyExpired1')}</span>
						{:else if !isUserKeyValid && userHasKey}
							<span class="invalid"> {$t('menu.invalidKey')} </span>
						{:else}
							<span> {$t('menu.noKey')} </span>
						{/if}
						<br />

						<a
							style="color: #127399;"
							href="https://ko-fi.com/post/AdFree-Wish-Simulator-Enjoy-Simulator-Without-Ads-G2G2DQ57O"
							target="_blank"
							on:click|stopPropagation
						>
							{$t('menu.getNewKey')}
						</a>
						or
						<a
							style="color: #be1e2d;"
							target="_blank"
							href="https://trakteer.id/mantan21/showcase/access-key-untuk-membership-SJ9X6"
						>
							Here for Indonesian!
						</a>
					{/if}
				</div>

				{#if userHasKey}
					<ButtonModal type="cancel" on:click={handleKey}>{$t('menu.removeKey')}</ButtonModal>
				{:else}
					<ButtonModal on:click={getProAccount} disabled={!input || waiting}>
						{waiting ? $t('waiting') : $t('menu.getpro')}
					</ButtonModal>
				{/if}
			</div>
		</form>
	{/if}
	<div class="admin-note">
		<picture>
			<img src={$assets['qiqi.webp']} alt="Benefits" crossorigin="anonymous" />
		</picture>

		<h3>{$t('menu.benefit')}</h3>
		<ol>
			{#each $json('menu.authorNotes') as benefit}
				<li>
					{@html $t(benefit, {
						values: {
							HSRWishSim: `<a href="https://hsr.wishsimulator.app" target="_blank">
									"Honkai: Star Rail" Wrap Simulator
								</a>`
						}
					})}
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.content-container {
		background-color: #fbf6ee;
		background-image: var(--bg-icon);
		background-repeat: no-repeat;
		background-size: 50%;
		background-position: 50% 60%;
		border-radius: 0.5rem;
		color: var(--text-color);
	}

	.confirmation {
		padding: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.row {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	:global(.mobile) form.row {
		transform: scale(0.8);
	}

	.loader span {
		margin-top: 1.5rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	@media screen and (max-width: 700px) {
		.content-container {
			background-size: 80%;
		}
	}

	form {
		padding: 0 2%;
	}

	label {
		font-size: 1.5rem;
		text-align: center;
		padding: 0 5%;
	}

	.input {
		text-align: center;
		padding: 2% 0 0;
		width: 80%;
		max-width: 30rem;
	}

	input {
		width: 100%;
		padding: 0 1.5rem;
		margin-bottom: 2%;
		height: 3rem;
		display: block;
		border-radius: 3rem;
		border: #c3b8a5 2px solid;
		background-color: var(--tertiary-color);
		outline: none;
		transition: all 0.2s;
	}

	input:focus {
		box-shadow: 0 0 0.4rem rgba(227, 149, 48, 0.7);
	}

	input.error {
		border: #ee6c4c 2px solid;
	}
	input.error:focus {
		box-shadow: 0 0 0.4rem rgba(222, 47, 34, 0.7);
	}
	input:disabled {
		background-color: transparent;
		opacity: 0.7;
	}
	input:not(.error):disabled {
		border: 2px solid #64ad15 !important;
	}

	.toggle-visible {
		position: absolute;
		height: 100%;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		padding: 0.5rem;
		aspect-ratio: 1/1;
		font-size: 150%;
		color: rgba(0, 0, 0, 0.5);
	}

	.note {
		margin-bottom: 5%;
	}

	.keyValid {
		color: #64ad15;
	}
	.invalid {
		color: #ee6c4c;
	}
	.invalid,
	.keyValid {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.admin-note {
		padding: 1% 5% 5%;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.admin-note ol {
		width: 50%;
	}

	picture {
		width: 15%;
		margin-bottom: -1rem;
	}

	@media screen and (max-width: 530px) {
		.admin-note ol {
			width: 90%;
		}
		picture {
			width: 30%;
		}
	}

	img {
		width: 100%;
	}
</style>
