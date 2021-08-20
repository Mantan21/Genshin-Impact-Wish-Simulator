<script>
	import { fade } from 'svelte/transition';
	import { bannerActive, isLoaded } from '$lib/store/stores';

	$: if ($isLoaded) {
		const showBanner = setTimeout(() => {
			bannerActive.set('beginner');
			clearTimeout(showBanner);
		}, 3000);
	}
</script>

{#if !$isLoaded}
	<div class="loader" out:fade={{ delay: 5500, duration: 500 }}>
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
