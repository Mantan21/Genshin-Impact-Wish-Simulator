<script>
	import { fade } from 'svelte/transition';
	import { bannerActive, isLoaded, showBeginner } from '$lib/store/stores';
	import { beginnerRoll } from '$lib/store/localstore';
	import { onMount } from 'svelte';

	onMount(() => {
		if (beginnerRoll.get() > 19) showBeginner.set(false);
	});

	$: if ($isLoaded) {
		if ($showBeginner) bannerActive.set('beginner');
		else bannerActive.set('limited');
	}
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
		</div>
	</div>
{/if}
