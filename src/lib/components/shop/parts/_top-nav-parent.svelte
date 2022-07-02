<div class="nav-item-list">
	<slot />
</div>

<style>
	div {
		display: flex;
		border-top: 1px solid #d2c69c;
		border-bottom: 1px solid #d2c69c;
		width: fit-content;
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0)
		);
	}
</style>
