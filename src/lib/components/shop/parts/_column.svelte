<script>
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';

	export let style = '';

	$: defaultWitdh = (10 / 100) * $viewportHeight;
	let columnWidth = 0;

	$: if ($mobileMode) {
		columnWidth = (36 / 100) * $viewportHeight;
	} else if ($viewportWidth < 400) {
		columnWidth = (40 / 100) * $viewportWidth;
	} else if (defaultWitdh < 190) {
		columnWidth = 190;
	} else {
		columnWidth = defaultWitdh;
	}
</script>

<div class="column" style="--column-width: {columnWidth}px;{style}">
	<slot />
</div>

<style>
	.column {
		width: var(--column-width);
		height: var(--column-width);
		margin: 0.4rem;
		padding: 0.3rem;
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
