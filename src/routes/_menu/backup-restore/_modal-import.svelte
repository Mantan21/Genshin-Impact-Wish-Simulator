<script>
	import { createEventDispatcher, getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { calculateByteSize } from '$lib/helpers/dataAPI/api-filesystem';
	import { placeDataToAppDB } from '$lib/helpers/dataAPI/data-merger';
	import { playSfx } from '$lib/helpers/audio/audio';

	import ModalTpl from '$lib/components/ModalTpl.svelte';
	import CheckBox from '$lib/components/CheckBox.svelte';
	import Icon from '$lib/components/Icon.svelte';

	export let importData = {};
	const { file, parsedFile } = importData;
	let action = '';
	let processing = false;

	const closeModalImport = getContext('handleModalImport');
	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('cancel');
		playSfx('close');
	};

	const confirm = async () => {
		playSfx();
		processing = true;

		await placeDataToAppDB(parsedFile, action);
		closeModalImport();
		processing = false;
	};

	const checkboxHandle = (act, { detail }) => {
		const { checked } = detail;
		if (checked) return (action = act);
		action = '';
	};
</script>

<ModalTpl
	title="Import Data"
	on:cancel={closeModal}
	on:confirm={confirm}
	disabled={!action || processing}
	noDimiss
>
	{#if processing}
		<div class="import-content">
			<div class="row loader" in:fade>
				<Icon type="loader" />
			</div>
		</div>
	{:else}
		<div class="import-content">
			<caption>
				<strong> {file.name} ({calculateByteSize(file.size)}) </strong> will be added to the App, please
				choose what action you want to perform!
			</caption>

			<div class="import-option">
				<CheckBox
					id="_merge"
					checked={action === 'merge'}
					on:change={(e) => checkboxHandle('merge', e)}
				>
					<span>
						Merge Data <small>Automatically remove duplicate item(s) and insert new item(s)</small>
					</span>
				</CheckBox>

				<CheckBox
					id="_replace"
					checked={action === 'replace'}
					on:change={(e) => checkboxHandle('replace', e)}
				>
					<span>
						Replace Data
						<small> Erase the current App Data and replace it with the imported one. </small>
					</span>
				</CheckBox>
			</div>
		</div>
	{/if}
</ModalTpl>

<style>
	/* Modal */
	.import-content {
		padding: 5%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	caption {
		width: 100%;
	}

	.import-option {
		font-size: 80%;
		width: 80%;
	}

	.import-option :global(.checkbox) {
		margin-top: 3% !important;
	}

	.import-option :global(label) {
		text-align: left;
		display: flex;
		align-items: center;
	}
	.import-option :global(small) {
		display: block;
	}

	.import-option :global(label i) {
		margin-right: 2%;
	}

	.row.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
