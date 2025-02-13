<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ModalWelcome from './ModalWelcome.svelte';

	const closeModal = () => goto('/inventory');
</script>

<slot />

{#if $page.url.pathname === '/inventory/signup'}
	<ModalWelcome on:confirm={closeModal} />
{/if}
