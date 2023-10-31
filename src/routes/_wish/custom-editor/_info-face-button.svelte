<script>
	import Toast from '$lib/components/Toast.svelte';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { getContext } from 'svelte';

	export let onBannerEdit = false;
	export let faceURL = '';

	let showToast = false;
	let toastMsg = '';

	const editInfo = getContext('editInfo');
	const changeFace = getContext('changeFace');
	const allowedType = 'image/png, image/webp, image/jpeg';

	const closeToast = () => {
		showToast = false;
		toastMsg = '';
	};

	const showInfoEditor = () => {
		editInfo(true);
		playSfx('modal');
	};

	const handleImage = (e) => {
		try {
			const file = e.target.files[0];
			const isImage = allowedType.match(file.type);

			if (!isImage) {
				toastMsg = 'not an Image';
				showToast = true;
				throw new Error(toastMsg);
			}

			const fileSize = file.size;
			const maxSize = 1024 * 1024 * 2; // 2MB
			if (fileSize > maxSize) {
				toastMsg = 'Image is too Large, max size: 2MB';
				showToast = true;
				throw new Error(toastMsg);
			}

			changeFace(file);
		} catch (e) {
			console.error(e);
		}
	};
</script>

{#if showToast}
	<Toast autoclose on:close={closeToast}>{toastMsg}</Toast>
{/if}

<div class="info" class:onBannerEdit>
	<div class="pic">
		<label class="face" for="faceInput" on:mousedown={() => playSfx()}>
			<div class="overlay">
				<i class="gi-picture" />
				<span>Face Icon</span>
			</div>

			{#if faceURL}
				<img src={faceURL} alt="Face" />
			{:else}
				<img class="placeholder" src="/images/utility/face-placeholder.webp" alt="" />
			{/if}
		</label>

		<input
			class="inputFile"
			type="file"
			id="faceInput"
			accept={allowedType}
			on:change={handleImage}
		/>
	</div>

	<div class="customize">
		<button class="detail" on:click={showInfoEditor}> <i class="gi-pen" /> Edit Info </button>
		<br />
		<button class="splashart"> <i class="gi-pen" /> Adjust Splash Art </button>
	</div>
</div>

<style>
	.info {
		position: absolute;
		z-index: +11;
		left: 5%;
		bottom: 5%;
		display: flex;
		align-items: center;
	}

	.info.onBannerEdit {
		pointer-events: none;
		opacity: 0.5;
	}

	.face {
		display: flex;
		aspect-ratio: 1/1;
		background-color: #efeeee;
		border: #c5b894 calc(0.005 * var(--content-height)) solid;
		border-radius: 5%;
		width: calc(0.18 * var(--content-height));
		position: relative;
	}

	.inputFile {
		position: absolute;
		height: 100%;
		width: 100%;
		opacity: 0;
		top: 0;
		left: 0;
		pointer-events: none;
	}

	.overlay {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		border: #e7e4de 0.1rem dashed;
		position: absolute;
		z-index: +2;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: all 0.25s;
	}

	.overlay i {
		color: rgba(255, 255, 255, 0.5);
		line-height: 0;
		font-size: calc(2.5 / 100 * var(--content-width));
	}
	.overlay span {
		color: #fff;
		font-size: calc(1.3 / 100 * var(--content-width));
		margin-top: 10%;
	}

	.face:hover .overlay {
		opacity: 1;
	}

	.face img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	img.placeholder {
		opacity: 0.5;
	}

	.customize {
		transform: translateX(calc(0.02 * var(--content-height)));
	}

	.customize button {
		background-color: #efeeee;
		color: rgba(0, 0, 0, 0.5);
		border-radius: 20px;
		border: #e2d7b6 0.1rem solid;
		font-size: calc(1.5 / 100 * var(--content-width));
		transition: background 0.25s, color 0.25s;
		padding: calc(0.5 / 100 * var(--content-width)) calc(2.5 / 100 * var(--content-width));
		transition: all 0.25s;
	}

	.customize button:hover {
		background-color: #e0ddd4;
		color: rgba(0, 0, 0, 1);
	}

	.customize button:active {
		transform: scale(0.95);
	}
</style>
