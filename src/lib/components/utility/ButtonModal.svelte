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
			{text || (type === 'confirm' ? $t('confirmButton') : $t('cancelButton'))}
		</span>
	{/if}
</button>

<style>
	button {
		border-radius: 40px;
		color: white;
		background-color: #4a5265;
		align-items: center;
		padding: 0 0 0 0.3em;
		width: 200px;
		max-width: 100%;
		height: 2.3rem;
		transition: all 0.2s;
		position: relative;
		text-align: center;
		border: 3.5px solid transparent;
		transition: all 0.2s;
	}

	button:active {
		transform: scale(0.9);
		background-color: #e0ddd4 !important;
		border-color: rgb(195, 195, 195) !important;
		box-shadow: rgb(160 175 190 / 60%) 0px 0px 7px 5px;
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
		position: absolute;
		left: 2%;
		top: 50%;
		transform: translateY(-50%);
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

	:global(.mobile) button {
		width: 130px;
		height: 2.1rem;
	}

	@media screen and (max-width: 700px) {
		:global(main):not(.mobile) button {
			width: 120px;
			height: 2rem;
			font-size: 0.85rem;
		}
	}
</style>
