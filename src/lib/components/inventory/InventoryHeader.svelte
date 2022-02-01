<script>
	import {
		acquaint,
		genesis,
		intertwined,
		pageActive,
		primogem,
		stardust,
		starglitter
	} from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import Icon from '$lib/components/utility/Icon.svelte';

	export let activeItem = '';

	const buttonCLick = () => {
		playSfx('close');
		pageActive.set('index');
	};
</script>

<h1 class="title">Inventory / {activeItem}s</h1>
<div class="budget">
	<button class="starglitter">
		<Icon
			type="starglitter"
			height="80%"
			width="auto"
			style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
		/>
		{$starglitter}
	</button>
	<button class="stardust">
		<Icon
			type="stardust"
			height="80%"
			width="auto"
			style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
		/>
		{$stardust}
	</button>
	<button class="intertwined">
		<Icon
			height="70%"
			width="auto"
			style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
			type="intertwined"
		/>
		{$intertwined}
	</button>
	<button class="acquiant">
		<Icon
			height="70%"
			width="auto"
			style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
			type="acquaint"
		/>
		{$acquaint}
	</button>
	<button class="primogem">
		<Icon
			type="primogem"
			height="80%"
			width="auto"
			style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
		/>
		{$primogem}
	</button>
	<button class="genesis">
		<Icon
			type="genesis"
			height="80%"
			width="auto"
			style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
		/>
		{$genesis}
	</button>
</div>
<button class="close" on:click={buttonCLick}>
	<i class="gi-close" />
</button>

<style>
	.title {
		color: #d2c69c;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		text-align: left;
	}
	:global(.mobile) .title {
		font-size: small;
	}
	.budget {
		text-align: right;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-left: auto;
	}

	button {
		display: inline-block;
		max-width: 112px;
		height: 25px;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		position: relative;
		margin: 0 8px;
		padding: 0 15px 0 30px;
	}

	.close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		line-height: 0;
	}

	@media screen and (max-width: 900px) {
		.title {
			font-size: small;
		}
		button {
			height: 20px;
			margin: 0 3px;
		}
		.close {
			width: 30px;
			height: 30px;
			margin: 3px;
		}

		:global(main):not(.mobile) .budget {
			flex-wrap: wrap;
		}
	}
	@media screen and (max-width: 400px) {
		button {
			max-width: 80px;
		}
	}
</style>
