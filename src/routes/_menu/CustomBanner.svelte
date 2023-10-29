<script>
	import { fade } from 'svelte/transition';
	import { getContext, onMount } from 'svelte';
	import { assets, editID, editorMode, proUser, viewportWidth } from '$lib/store/app-stores';
	import { BannerManager } from '$lib/store/IDB-manager';
	import ButtonModal from '$lib/components/ButtonModal.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import ModalTpl from '$lib/components/ModalTpl.svelte';
	import { playSfx } from '$lib/helpers/audio/audio';

	let headerHeight;
	let rowWidth = 0;
	$: itemWidth = $viewportWidth > 640 ? rowWidth / 3 : rowWidth / 2;

	let ready = false;
	let customList = [];
	onMount(async () => {
		customList = await BannerManager.getAll();
		if (customList.length < 1) return;
		ready = true;
	});

	const handleClose = getContext('handleMenu');
	const customizeBanner = (bannerID) => {
		editorMode.set(true);
		editID.set(bannerID || null);
		handleClose();
	};

	let showToast = false;
	let showModal = false;
	let idToDelete = 0;
	const removeBanner = async () => {
		playSfx();
		const idb = BannerManager;
		await idb.delete(idToDelete);
		customList = customList.filter(({ id }) => id != idToDelete);
		showToast = true;
		showModal = false;
		idToDelete = 0;
	};

	const selectToDelete = (id) => {
		if (!id) return;
		idToDelete = id;
		showModal = true;
		playSfx('modal');
	};

	const cancelModal = () => {
		showModal = false;
		playSfx('close');
	};
</script>

{#if showModal}
	<ModalTpl title="Remove Banner" on:confirm={removeBanner} on:cancel={cancelModal}>
		<div class="confirmation">
			<div class="wrapper">
				<span> Are You Sure to delete this banner ? </span>
				<small>
					If you've shared this banner publicly, The Travelers who have made wishes on your banner
					will no longer be able to access it.
				</small>
			</div>
		</div>
	</ModalTpl>
{/if}

{#if showToast}
	<Toast autoclose on:close={() => (showToast = false)}>Banner Removed</Toast>
{/if}

<div
	class="content-container"
	in:fade={{ duration: 200 }}
	style="--bg-icon:url('{$assets['modal-bg-icon.png']}');
  --item-width:{itemWidth}px; --height:{headerHeight}px"
	bind:clientWidth={rowWidth}
>
	<div class="header" bind:clientHeight={headerHeight}>
		{#if !ready}
			<h1><span> Create a Custom Banner </span></h1>
		{:else}
			<h1>
				<span> Your Banners </span>
				<button class="question" on:click={() => (ready = false)}>i</button>
			</h1>
		{/if}

		{#if customList.length > 1 && !$proUser}
			<div class="notice">
				You are not a member, please delete some banners to activate the editor
			</div>
		{/if}
	</div>

	<div class="wrapper">
		{#if !ready}
			<div class="disclaimer" in:fade|local={{ duration: 250 }}>
				<article>
					<p>
						Every banner you add is saved in your browser's memory. <b>WishSimulator.App</b> does not
						collect or store your banner data in cloud storage unless you click the Share Button.
					</p>
					<p>
						<b>WishSimulator.App</b> does not collect your personal information. So, if an incident
						occurs on your device and causes your browser to clear your local storage, you will also
						lose all your data, and you will not be able to edit the banner(s) you have created.
						<u>In such a case, what you can do is create a new custom banner</u>.
					</p>

					<p>
						If you log in using a Patreon account, <b>WishSimulator.App</b> will save your Patreon ID,
						allowing you to edit your banner even if you lose data in your browser storage. However,
						this will only happen if you press the Share button. If you don't share your banner, WishSimulator.App
						still won't save your data.
					</p>
				</article>
				<ButtonModal width="200px" on:click={() => (ready = true)}>Create Banner</ButtonModal>
			</div>
		{/if}

		{#if ready}
			<div class="row" transition:fade|local={{ duration: 250 }}>
				{#if customList.length > 0}
					{#each customList as { id, images }}
						<div class="item" {id}>
							<button class="banner-item">
								<img
									src="/images/banner/character-events/conjuring-chiaroscuro-1.webp"
									alt="Custom Banner"
								/>
							</button>
							<div class="action">
								{#if !(customList.length > 1 && !$proUser)}
									<button class="edit" on:click={() => customizeBanner(id)}>
										<i class="gi-pen" /> <span>Edit</span>
									</button>
								{/if}
								<button class="delete" on:click={() => selectToDelete(id)}>
									<i class="gi-delete" /> <span>Delete</span>
								</button>
							</div>
						</div>
					{/each}
				{/if}

				{#if $proUser || customList.length < 1}
					<div class="item blank">
						<button class="add" on:click={() => customizeBanner()}>
							<i class="gi-plus" />
							<span>Add Banner</span>
						</button>
					</div>
				{:else}
					<div class="item blank locked">
						<button class="add" disabled>
							<i class="gi-lock" />
							<span>Become a Member to Add More Banner</span>
						</button>
					</div>
				{/if}
			</div>
		{/if}
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
		padding: 2%;
	}

	@media screen and (max-width: 700px) {
		.content-container {
			background-size: 80%;
		}
	}

	.confirmation {
		padding: 5%;
		height: 100%;
		align-items: center;
		display: flex;
	}
	.confirmation small {
		display: block;
	}

	.header h1 {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.question {
		width: 25px;
		line-height: 0;
		margin-left: 1%;
		border-radius: 100%;
		aspect-ratio: 1/1;
		border: 1px solid var(--text-color);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		transition: color 0.25s, background 0.25s, transform 0.25s;
	}

	.question:hover {
		background-color: var(--text-color);
		color: #fff;
	}

	.question:active {
		transform: scale(0.9);
	}

	/* Disclaimer */
	.disclaimer {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		padding: 2%;
		overflow: auto;
		z-index: +2;
		text-align: center;
	}

	article {
		padding: 2%;
		text-align: left;
		background-color: #fff;
		margin-bottom: 2%;
		border-radius: 0.5rem;
	}
	p {
		margin-bottom: 3%;
	}

	/*  */
	.notice {
		width: 100%;
		margin: 1% 0;
		padding: 2%;
		color: #fff;
		background-color: rgba(217, 67, 67, 0.75);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 100%;
		font-weight: bold;
	}

	.wrapper {
		width: 100%;
		height: calc(100% - var(--height));
		overflow-y: auto;
		position: relative;
	}

	.row {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 2%;
		flex-wrap: wrap;
	}

	.item {
		margin: calc(0.04 * var(--item-width));
		margin-bottom: calc(0.12 * var(--item-width));
		aspect-ratio: 1080/533;
		width: 30%;
		position: relative;
	}

	@media screen and (max-width: 640px) {
		.item {
			width: 45%;
		}
	}

	.banner-item {
		width: 100%;
		height: 100%;
		display: flex;
		border: 2px solid #c3b8a5;
		position: relative;
	}

	.banner-item::after {
		content: '';
		position: absolute;
		z-index: +1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border-radius: calc(0.03 * var(--item-width));
		border: calc(0.015 * var(--item-width)) solid #eac343;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.banner-item:hover::after {
		opacity: 1;
	}

	.item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.action {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		transform: translateY(120%);
		display: flex;
		justify-content: center;
	}

	.action button {
		font-size: 80%;
		line-height: 0;
		padding: 2% 5%;
		opacity: 0.8;
		display: inline-flex;
		align-items: center;
		border-radius: 2rem;
		color: #fff;
		margin: 0 1%;
		transition: transform 0.25s, background 0.25s;
	}

	.action button:active {
		transform: scale(0.9);
	}

	.action button i {
		transform: translateX(-15%);
		display: inline-block;
	}

	.edit {
		background-color: #00b5a9;
	}
	.edit:hover {
		background-color: #078f86;
	}

	.delete {
		background-color: #ff1c1c;
	}
	.delete:hover {
		opacity: 1;
		background-color: #cb1717;
	}

	.item.blank {
		border-radius: calc(0.02 * var(--item-width));
		transition: border 0.25s;
		border: 2px dashed #c3b8a5;
	}
	.item.blank:hover {
		border-color: #857d71;
	}

	.add {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #c3b8a5;
		line-height: 0;
		transition: color 0.25s;
	}

	.add:hover {
		color: #857d71;
	}

	.add i {
		font-size: calc(0.1 * var(--item-width));
		margin-bottom: 2%;
	}
	.add span {
		font-size: calc(0.05 * var(--item-width));
		display: block;
		line-height: 100%;
	}
</style>
