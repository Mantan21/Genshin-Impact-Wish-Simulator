<script>
	import { fade } from 'svelte/transition';
	import { isLoaded, showBeginner, mobileMode, isMobile } from '$lib/store/stores';
	import { beginnerRoll } from '$lib/store/localstore';
	import { onMount } from 'svelte';

	onMount(() => {
		if (beginnerRoll.get() > 19) showBeginner.set(false);
	});
</script>

{#if !$isLoaded}
	<div class="loader" out:fade={{ duration: 100 }}>
		<div class="content">
			<div class="icon">
				<i class="gi-pyro" />
				<i class="gi-hydro" />
				<i class="gi-anemo" />
				<i class="gi-electro" />
				<i class="gi-dendro" />
				<i class="gi-cryo" />
				<i class="gi-geo" />
			</div>
			<div class="blend">
				<div class="unfilled" />
				<div class="filled animate" />
			</div>

			{#if $isMobile && !$mobileMode}
				<div class="rotate">
					<i class="gi-rotate-phone" />
					<span>Rotate for better experience </span>
				</div>
			{/if}
		</div>
	</div>
{/if}
