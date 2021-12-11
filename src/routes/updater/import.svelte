<script>
	/* eslint-disable no-undef */
	import { onMount } from 'svelte';
	import { importAndReplace } from '$lib/export-import/import';

	onMount(() => importAndReplace());
</script>

<section>Import and replace Current IDB</section>
