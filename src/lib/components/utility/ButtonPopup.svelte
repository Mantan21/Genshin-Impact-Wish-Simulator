<script>
	import { createEventDispatcher } from 'svelte';
	import { t } from 'svelte-i18n';

	const isSlotpresent = $$props.$$slots;
	export let type = 'confirm';
	export let text = '';
	export let disabled = false;

	const dispatch = createEventDispatcher();
	const click = () => dispatch('click');
</script>

<button on:click|preventDefault={click} {disabled}>
	{#if type === 'confirm'}
		<i class="gi-circle-o" />
	{:else}
		<i class="gi-times" />
	{/if}

	{#if isSlotpresent}
		<slot />
	{:else}
		<span>
			{text || (type === 'confirm' ? $t('site.confirmButton') : $t('site.cancelButton'))}
		</span>
	{/if}
</button>

<style>
	button {
		border-radius: 40px;
		color: white;
		background-color: #4a5265;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.2em 2.5em 0.3em 0.1em;
		transition: all 0.2s;
	}

	button:disabled {
		opacity: 0.7;
	}

	button i {
		width: 1.7rem;
		height: 1.7rem;
		background-color: #353533;
		border-radius: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 0.8rem;
		margin-right: 1.5rem;
	}
	button:hover:not(:disabled) {
		background-color: rgb(51, 57, 71);
	}
	.gi-times {
		color: #3f9ad1;
	}
	.gi-circle-o {
		color: #ffc107;
	}
</style>
