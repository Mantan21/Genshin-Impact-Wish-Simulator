<script>
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';

	export let style = '';
	let columnWidth = '';

	$: if ($viewportWidth < 400) {
		columnWidth = `width: ${(44 / 100) * $viewportWidth}px; height:${
			(44 / 100) * $viewportWidth
		}px;`;
	}
	$: if ($mobileMode) {
		columnWidth = `width: ${(37 / 100) * $viewportHeight - 0.1}px; height:${
			(37 / 100) * $viewportHeight
		}px;`;
	}
</script>

<div class="column" style="{columnWidth}{style}">
	<slot />
</div>

<style>
	.column {
		width: 10vh;
		height: 10vh;
		min-width: 190px;
		min-height: 190px;
		margin: 0.4rem;
		display: block;
	}

	@media screen and (max-width: 890px) {
		.column {
			min-width: 150px;
			min-height: 150px;
		}

		:global(.mobile) .column {
			min-width: 130px;
			min-height: 130px;
		}
	}

	@media screen and (max-width: 400px) {
		.column {
			min-width: 100px;
			min-height: 100px;
		}
	}
</style>
