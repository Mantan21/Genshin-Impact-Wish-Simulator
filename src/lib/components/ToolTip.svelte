<script>
	export let position = 'bottom';
</script>

<div class="tooltip {position}">
	<i>i</i>
	<span class="tooltiptext">
		<slot />
	</span>
</div>

<style>
	.tooltip {
		position: relative;
		display: inline-block;
	}
	.tooltip i {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1/1;
		width: 1.2rem;
		transform: translateY(-20%);
		font-size: small;
		border: 1px solid var(--text-color);
		font-style: normal;
		text-align: center;
		line-height: 100%;
		border-radius: 100%;
	}

	.tooltip .tooltiptext {
		display: block;
		width: 200px;
		background-color: rgba(0, 0, 0, 0.75);
		color: #fff;
		text-align: center;
		padding: 0.5rem;
		border-radius: 6px;
		position: absolute;
		z-index: +10;
		opacity: 0;
		transition: opacity 0.25s;
		pointer-events: none;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
	}

	.tooltip:hover .tooltiptext {
		opacity: 1;
	}

	.tooltip .tooltiptext::after {
		content: ' ';
		position: absolute;
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
	}

	/* right position */
	.right.tooltip .tooltiptext {
		top: -5px;
		left: 105%;
	}
	.right.tooltip .tooltiptext::after {
		top: 50%;
		right: 100%;
		border-color: transparent rgba(0, 0, 0, 0.75) transparent transparent;
	}

	/* Left Position */
	.left.tooltip .tooltiptext {
		top: -5px;
		right: 105%;
	}
	.left.tooltip .tooltiptext::after {
		top: 50%;
		left: 100%;
		border-color: transparent transparent transparent rgba(0, 0, 0, 0.75);
	}

	/* Top Position */
	.top.tooltip .tooltiptext {
		bottom: 100%;
		left: 50%;
	}
	.top.tooltip .tooltiptext::after {
		top: 100%;
		left: 50%;
		border-color: rgba(0, 0, 0, 0.75) transparent transparent transparent;
	}

	/* bottom position */
	.bottom.tooltip .tooltiptext {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
	}
	.bottom.tooltip .tooltiptext::after {
		position: absolute;
		bottom: 100%;
		left: 50%;
		border-color: transparent transparent rgba(0, 0, 0, 0.75) transparent;
	}
</style>
