<script>
	import axios from "axios";
	import { user, isAuthenticated, checkSession } from '$lib/store/authStore.js';

	import { getContext, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';

	import { isPWA } from '$lib/store/app-stores';
	import { adKey, verifyKey } from '$lib/helpers/accessKey';
	import { browserDetect } from '$lib/helpers/mobileDetect';
	import Modal from '$lib/components/ModalTpl.svelte';

	let userGroup;
	let content;
	let contentHeight;

	let message = "";
	let messageType = "";

	let ign = "";
	let group = "";

	const startApp = getContext('startApp');

	async function signUp() {
		try {
			const response = await axios.post("/api/signup", { ign, group }, { withCredentials: true });
			message = "Sign-up successful! 🎉";
			messageType = "success";
			await checkSession();
			// userGroup = userSession?.group;
			return response;
		} catch (error) {
			console.error("Sign-up error:", error.response ? error.response.data : error.message); // Logs detailed error
			message = "❌ Sign-up failed! Please try again.";
			messageType = "error";
			throw new Error("Sign-up failed");
		}
	};

	onMount(async () => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});


	const handleConfirm = async () => {
    try {
		await signUp();
		startApp();
    } catch (error) {}
	};

	// export userSession
</script>

<Modal confirmOnly title={$t('title')} on:confirm={handleConfirm}>
	<section bind:clientHeight={contentHeight} style="--modalHeight:{contentHeight}px">
		<p class="sp">
			{$t('fanmade')} <br />
			{#if !$isPWA}
				<a href="/install">{$t('originalAuthor')}</a>
			{/if}
		</p>
		{#if message}
			<div class="message {messageType}">
				{message}
			</div>
		{/if}
		{#if !browserDetect().isSupported && isPWA}
			<div class="updates adExpired">
				<strong>
					We highly recommend installing <span style="display: inline; color:#5ab3ff">
						Google Chrome
					</span>
					for optimal performance as some features may not be fully supported on.
				</strong>
			</div>
		{:else}
			<div class="signup" bind:this={content}>
				<h1>Please fill in this form to create an account.</h1>
				<div class="form-group">
					<input type="text" placeholder="Enter your Username" bind:value={ign} required />
				</div>
      			<!-- <label for="group">Choose Your Account Type</label> -->
				<div class="form-group">
					<select id="group" bind:value={group} required>
						<option value="" disabled selected>Choose Your Account Type</option>
						<option value="f2p">Free to Play</option>
						<option value="dolphin">Dolphin Account</option>
						<option value="whale">Whale Account</option>
					</select>
				</div>
			</div>
		{/if}
		<p class="credit">{$t('disclaimer')}</p>
	</section>
</Modal>

<style>
	section {
		width: 100%;
		height: 100%;
		padding: 0 1.5rem;
	}

	.credit {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 0.9rem;
	}

	.signup {
		text-align: left;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #fff;
		font-size: 0.97rem;
		height: calc(0.6 * var(--modalHeight));
		padding: 0.5rem;
		display: block;
		overflow: hidden;
	}

	.form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

	.signup h1 {
		font-style: 'Segoe UI';
		font-size: 1.2rem;
		color: #858181;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.signup input, .signup select {
	width: 100%;
	max-width: 300px;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	font-size: 1rem;
	background: #fff;
	transition: 0.3s;
	}

	.signup input:focus, .signup select:focus {
		border-color: #5ab3ff;
		outline: none;
		box-shadow: 0 0 5px rgba(90, 179, 255, 0.5);
	}

	.signup select {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem; 
		cursor: pointer;
	}

	.signup label {
		display: block;
		font-weight: bold;
		color: #555;
		margin-top: 1rem;
	}

	.signup button {
		background: #5ab3ff;
		color: #fff;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		font-size: 1rem;
		cursor: pointer;
		transition: 0.3s;
	}

	.signup button:hover {
		background: #479ce6;
	}


	.message {
        text-align: center;
        padding: 10px;
        margin-top: 10px;
        border-radius: 5px;
        font-weight: bold;
    }

    .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

	.sp {
		font-size: 0.9rem;
		padding: 0rem 0 0.5rem;
	}

	a {
		transition: all 0.2s;
	}
	.sp a {
		font-weight: bold;
		color: #e3a023;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	a:active {
		transform: scale(0.9);
	}
</style>
