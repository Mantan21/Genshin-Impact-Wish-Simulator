<div class="item-list">
	<div class="list-body">
		<slot />
	</div>
</div>

<style>
	/* List */
	.item-list {
		height: calc(var(--content-height) * 0.78);
		margin: 15px 0;
		overflow-y: auto;
		overflow-x: hidden;
	}
	:global(.mobile) .item-list {
		margin: 5px 0 0;
		padding: 0;
	}

	.list-body {
		display: flex;
		flex-wrap: wrap;
	}

	@media screen and (max-width: 400px) {
		.list-body {
			justify-content: space-between;
			padding: 0 2.3%;
		}
	}
</style>
