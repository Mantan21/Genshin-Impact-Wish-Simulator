<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { assets } from '$lib/store/stores';
	import ButtonModal from '../utility/ButtonModal.svelte';
	import { adKey } from '$lib/helpers/accessKey';
	import playSfx from '$lib/helpers/audio';

	import Modal from '$lib/components/utility/ModalTpl.svelte';
	import Toast from '$lib/components/utility/Toast.svelte';
	import Icon from '../utility/Icon.svelte';

	let showToast = false;
	let input = '';
	let error = false;
	let waiting = false;
	let message = '';

	const removeAds = async () => {
		waiting = true;
		const { msg, validity } = await adKey.verify(input);
		error = !validity;
		if (validity) return window.location.reload();
		message = msg;
		waiting = false;
		showToast = true;
	};

	let checkingLocal = true;
	let userHasKey = false;
	let isUserKeyValid = false;

	const checkLocal = async () => {
		const { validity, storedKey } = await adKey.checkLocal();
		input = storedKey;
		userHasKey = !!storedKey;
		isUserKeyValid = validity;
		checkingLocal = false;
	};

	// Modal
	let showModal = false;
	const confirmModal = () => {
		adKey.clear();
		checkLocal();
		showModal = false;
	};
	const cancelModal = () => (showModal = false);

	const handleKey = () => {
		showModal = true;
		playSfx();
	};

	onMount(checkLocal);
</script>

<Modal
	title="Remove AdKey"
	show={showModal}
	button="all"
	on:confirm={confirmModal}
	on:cancel={cancelModal}
>
	<div class="confirmation">
		<span>
			Are You sure to remove the current adKey ? You need to enter a new key to remove the future
			ads!
		</span>
	</div>
</Modal>

{#if showToast}
	<Toast on:close={() => (showToast = false)}>{message}</Toast>
{/if}

<div
	class="content-container"
	in:fade={{ duration: 200 }}
	style="--bg-icon:url('{$assets['modal-bg-icon.png']}')"
>
	{#if checkingLocal}
		<div class="row loader">
			<Icon type="loader" />
			<span> Checking Stored AdKey </span>
		</div>
	{:else}
		<form class="row" on:submit|preventDefault={!waiting ? removeAds : null} in:fade>
			<label for="key">Input the Key to Remove Ads !</label>
			<div class="input">
				<input
					type="text"
					id="key"
					bind:value={input}
					placeholder="Enter Key"
					class:error={error || (!isUserKeyValid && userHasKey)}
					disabled={userHasKey}
				/>
				<div class="note">
					{#if !isUserKeyValid && userHasKey}
						<span class="invalid"> Your key isn't valid, Get a new one Here </span>
					{:else}
						<span> Don't have a key? Get a new one </span>
					{/if}
					<a
						href="https://ko-fi.com/post/AdFree-Wish-Simulator-Enjoy-Simulator-Without-Ads-G2G2DQ57O"
						target="_blank"
						on:click|stopPropagation
					>
						Here!
					</a>
				</div>

				{#if userHasKey}
					<ButtonModal type="cancel" on:click={handleKey}>Remove Key</ButtonModal>
				{:else}
					<ButtonModal on:click={removeAds} disabled={!input || waiting}>
						{waiting ? 'Waiting...' : 'Remove Ads'}
					</ButtonModal>
				{/if}
			</div>
		</form>
	{/if}
	<div class="admin-note">
		<picture> <img src={$assets['imbroke.webp']} alt="I'm Broke" /> </picture>
		<p>
			* I need to say sorry about the ads. Actually I don't want to ruin your wishing experience,
			but I don't have any Team or Sponsor to keep this app alive. If you don't want to spend
			anythings, You can still turn on the Ad Blocker or just use custom DNS, I will not forbid you.
		</p>
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

	a {
		color: #f29f0f;
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

	label {
		font-size: 1.5rem;
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

	.note {
		margin-bottom: 5%;
	}
	.note .invalid {
		color: #ee6c4c;
	}

	.admin-note {
		padding: 1% 5% 5%;
		text-align: center;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	picture {
		width: 15%;
	}

	@media screen and (max-width: 530px) {
		picture {
			width: 30%;
		}
	}

	img {
		width: 100%;
	}

	.admin-note p {
		padding-left: 2%;
	}
</style>
