<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => goto('/'));
</script>

<section>
	<div class="box">
		No Content available on this page, please <a href="/"> Back To The Beginning .. </a>
	</div>
	<div class="transparent">
		<a href="/history/limited">limited</a>
		<a href="/history/beginner">beginner</a>
		<a href="/history/weapon">weapon</a>
		<a href="/history/standard"> standard </a>
	</div>
</section>

<style>
	.box {
		font-size: 1rem;
		padding: 2rem;
	}
	.box a {
		font-weight: bold;
		color: #00aaff;
	}
	.transparent a {
		color: transparent;
		font-size: 0;
	}
</style>
