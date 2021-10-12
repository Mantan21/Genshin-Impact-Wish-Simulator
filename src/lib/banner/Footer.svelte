<script>
	import { mobileMode, pageActive, stardust, starglitter } from '$lib/store/stores';
	import Icon from '$lib/utility/Icon.svelte';
	import RollButton from '$lib/banner/RollButton.svelte';
	import playSfx from '$lib/functions/audio';

	const changePage = (page) => {
		pageActive.set(page);
		if (page === 'shop') return playSfx('shop');
		return playSfx();
	};
</script>

<div id="footer" style="width: 100%; height: 100%">
	{#if !$mobileMode}
		<div class="wish">
			<div class="starglitter">
				<Icon type="starglitter" />
				<span> {$starglitter}</span>
			</div>
			<div class="stardust">
				<Icon type="stardust" />
				<span> {$stardust}</span>
			</div>
		</div>
	{/if}

	<div class="row">
		<div class="left">
			<button on:click={() => changePage('shop')}> Shop </button>
			<button on:click={() => changePage('inventory')}> Inventory </button>
			<button on:click={() => changePage('history')}> History </button>
		</div>
		<div class="right">
			<RollButton />
		</div>
	</div>
</div>

<style>
	#footer {
		position: relative;
	}

	.wish {
		position: absolute;
		left: 5%;
		top: -5px;
	}
	.wish > div {
		display: inline-flex;
		align-items: center;
		margin-right: 5px;
		padding: 2px 20px 2px 2px;
		font-size: 0.9rem;
	}
	.wish span {
		margin-left: 10px;
		color: #fff;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
	}

	button {
		transform: scale(1);
		transition: all 0.2s;
		color: #4a5265;
		text-decoration: none;
	}
	button:active {
		transform: scale(0.95);
	}

	.row {
		width: 100%;
		height: 100%;
		padding: 0 5%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.left button {
		border-radius: 50px;
		background-color: #fff;
		border: 3px solid #fff;
		padding: 3px 20px;
		margin: 2px 5px;
		transition: all 0.2s;
	}

	.left button:active,
	.left button:hover {
		background-color: #eee2c8;
	}

	.right {
		text-align: right;
	}

	/* mobile */
	:global(.mobile) .row {
		padding: 0;
	}
	:global(.mobile) .left button {
		padding: 1.5px 11px;
		margin: 1px 2px;
		font-size: 0.75rem;
	}
	:global(.mobile) .right {
		margin-right: 40px !important;
	}

	/* Mwedia Query */

	@media screen and (max-width: 900px) {
		button,
		.left button {
			padding: 2px 15px;
			margin: 2px 5px;
		}
	}

	@media screen and (max-width: 700px) {
		.right {
			width: 100%;
		}
	}
	@media screen and (max-width: 550px) {
		.left {
			width: 100%;
		}
		.right {
			width: auto;
		}
	}

	@media screen and (max-width: 400px) {
		.left button {
			padding: 1px 10px;
			margin: 1px 2px;
		}
	}
</style>
