<script>
	export let name = '';
</script>

<div class="item-list" class:genesis={name === 'genesis'}>
	<div class="list-body">
		<slot />
	</div>
</div>

<style>
	/* List */
	.item-list {
		height: calc(100vh - 155px);
		margin: 15px 0;
		overflow-y: auto;
		overflow-x: hidden;
	}
	:global(.mobile) .item-list {
		height: calc(100vh - 90px);
		margin: 5px 0 0;
		padding: 0;
	}
	:global(.mobile) .genesis {
		height: calc(100vh - 60px);
	}

	.list-body {
		display: flex;
		flex-wrap: wrap;
	}

	@media screen and (max-width: 400px) {
		.list-body {
			justify-content: space-between;
		}
	}
</style>
