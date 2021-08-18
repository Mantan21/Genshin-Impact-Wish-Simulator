<script>
	import { bannerActive } from '$lib/stores';
	import Icon from '$lib/utility/Icon.svelte';

	$: fateType =
		$bannerActive === 'beginner' || $bannerActive === 'standard' ? 'acquaint' : 'intertwined';
</script>

<div id="footer" style="width: 100%; height: 100%">
	<div class="wish">
		<div class="starglitter">
			<Icon type="starglitter" />
			<span> 20</span>
		</div>
		<div class="stardust">
			<Icon type="stardust" />
			<span> 1500</span>
		</div>
	</div>

	<div class="row">
		<div class="left">
			<button> Shop </button>
			<button> Details </button>
			<button> History </button>
		</div>
		<div class="right">
			<button class="single">
				<div class="top">Wish x1</div>
				<div class="bottom">
					<Icon type={fateType} />
					<span style="margin-left: 7px"> x 1</span>
				</div>
			</button>
			<button class="ten">
				<div class="top">Wish x10</div>
				<div class="bottom">
					<Icon type={fateType} />
					<span style="margin-left: 7px"> x 10</span>
				</div>
			</button>
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
		font-size: 0.9em;
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
	.right button {
		background-image: url('./assets/images/utility/button.svg');
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		width: 230px;
		height: 60px;
		margin: 0 5px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: 0.9em;
		color: #a49a90;
	}

	.right button .bottom {
		display: flex;
		align-items: center;
	}
</style>
