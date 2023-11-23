<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { syncData } from '$lib/helpers/dataAPI/sync';
	import { autoExport, fileData, savingToSystem, fileHandle } from '$lib/store/filesystem-store';
	import {
		FSSupported,
		saveExport,
		verifyFSPermission,
		readFileHandle,
		checkFileExist
	} from '$lib/helpers/dataAPI/filesystem';
	import { generateExport } from '$lib/helpers/dataAPI/export-import';
	import { playSfx } from '$lib/helpers/audio/audio';
	import ButtonModal from '$lib/components/ButtonModal.svelte';

	let fileName, hasPermission, isFileExist;
	$: autoSave = hasPermission && $autoExport;
	$: ({ name: fileName } = $fileData);

	const updatePermission = async () => {
		hasPermission = await verifyFSPermission($fileHandle, { checkOnly: true });
	};

	const saveLocal = async () => {
		playSfx();
		if (!FSSupported()) return generateExport();
		await saveExport();
		await updatePermission();
	};

	const getSize = (size) => {
		if (!size || isNaN(size)) return '';
		const mb = (size / (1024 * 1024)).toFixed(2);
		return `(${mb}MB)`;
	};

	const checkAndUpdate = async () => {
		isFileExist = await checkFileExist($fileHandle);
		if (!isFileExist) return;
		await syncData({ to: 'local' }); // Export once
		autoExport.set(true); // Turn on Auto export
	};

	const allowAutoExport = async () => {
		if (!$fileHandle) await readFileHandle();

		// Check Permission
		if (!hasPermission) {
			hasPermission = await verifyFSPermission($fileHandle);
			if (!hasPermission) throw new Error('Permission Denied');
		}
		return checkAndUpdate();
	};

	const toggleAutoExport = async () => {
		if (!hasPermission) return allowAutoExport(); // get permission
		if ($autoExport) return autoExport.set(false); // turn off auto export
		return checkAndUpdate();
	};

	onMount(async () => {
		await updatePermission();

		// Read Filehandle once
		if ($fileData.name) return;
		readFileHandle();
	});
</script>

<div class="local-sync" in:fade>
	<div class="local-wrapper">
		<div class="drop-area">
			<div class="drop-content">Drop Your File Here</div>
		</div>

		{#if FSSupported() && fileName}
			<button
				class="savedFile"
				class:active={autoSave}
				disabled={$savingToSystem}
				on:click={toggleAutoExport}
			>
				<div class="toggle">
					{#if $savingToSystem}
						<i class="gi-reset" />
					{:else}
						<i class="gi-{autoSave ? 'check' : 'cancel'}" />
					{/if}
					<span> Auto Export to</span>
				</div>
				<div class="fileName">
					<span> <b>{getSize($fileData.size)}</b> {fileName}</span>
				</div>
			</button>
		{:else if isFileExist === false}
			<button class="savedFile error" disabled>
				<span> Cannot find backup file location, please trying to Import/Export again </span>
			</button>
		{/if}

		<div class="button">
			<ButtonModal icon="import">Import Data</ButtonModal>
			<ButtonModal icon="save" on:click={saveLocal}>
				{fileName ? 'Change Location' : 'Export Data'}
			</ButtonModal>
		</div>
	</div>
</div>

<style>
	.local-sync {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.local-wrapper {
		width: 100%;
	}

	.drop-area {
		margin: 1rem 5%;
	}
	.drop-content {
		width: 100%;
		padding: 5%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.5rem;
		border: 0.1rem dashed var(--text-color);
	}

	.savedFile {
		display: flex;
		width: 90%;
		align-items: center;
		margin: 1rem 5%;
		border: 0.075rem solid #adad45;
		border-radius: 2rem;
		overflow: hidden;
		height: 2rem;
		transition: all 0.25s;
	}
	.savedFile.active {
		background-color: var(--tertiary-color);
	}
	.savedFile.error {
		color: #cf2727;
		padding: 0 5%;
		font-size: smaller;
		justify-content: center;
	}

	.savedFile:not(:disabled):hover {
		border-color: brown;
		background-color: #e0ddd4;
	}

	.toggle {
		line-height: 0;
		white-space: nowrap;
		display: flex;
		align-items: center;
		padding: 1% 2% 1% 5%;
	}
	.toggle i {
		font-size: larger;
	}
	.toggle span {
		font-size: smaller;
	}

	.gi-check {
		color: #58c70a;
	}
	.gi-cancel {
		color: #cf2727;
	}
	.gi-reset {
		color: orange;
		font-size: 100% !important;
		transform-origin: 50%;
		transform-box: fill-box;
		animation: rotate 1s linear infinite;
	}

	.fileName {
		width: 100%;
		height: 100%;
		padding-left: 2%;
		display: flex;
		align-items: center;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-style: italic;
		color: brown;
	}

	.fileName span {
		display: block;
		width: 90%;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: capitalize;
	}

	.button {
		text-align: center;
		padding: 1%;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-360deg);
		}
	}
</style>
