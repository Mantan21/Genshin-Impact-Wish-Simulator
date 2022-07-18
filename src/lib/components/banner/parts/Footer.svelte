<script>
	import { createEventDispatcher } from 'svelte';
	import {
		bannerActive,
		bannerList,
		mobileMode,
		pageActive,
		stardust,
		starglitter,
		isAcquaintUsed,
		acquaint,
		intertwined,
		unlimitedFates
	} from '$lib/store/stores';
	import Icon from '$lib/components/utility/Icon.svelte';
	import FatepointButton from '../fatepoint/FatepointButton.svelte';
	import playSfx from '$lib/functions/audio';
	import browserState from '$lib/functions/browserState';

	$: fateQty = $isAcquaintUsed ? $acquaint : $intertwined;
	$: fateType = $isAcquaintUsed ? 'acquaint' : 'intertwined';
	$: activeBanner = $bannerList[$bannerActive];
	$: bannerActiveType = activeBanner.type + (isNaN(activeBanner.index) ? '' : activeBanner.index);
	$: multiRollPrice = bannerActiveType === 'beginner' ? 8 : 10;

	const changePage = (page) => {
		pageActive.set(page);
		browserState.set(page);
		if (page === 'shop') return playSfx('shop');
		return playSfx();
	};

	const dispatch = createEventDispatcher();
	const handleSingleRollClick = () => {
		playSfx('roll');
		dispatch('singleRoll');
	};
	const handleMultiRollClick = () => {
		playSfx('roll');
		dispatch('multiRoll');
	};
</script>

<div id="footer" style="width: 100%; height: 100%">
	<div class="footer-info">
		{#if !$mobileMode}
			<FatepointButton />
			<div class="wish">
				<div class="starglitter">
					<Icon type="starglitter" />
					<span> {$starglitter} </span>
				</div>
				<div class="stardust">
					<Icon type="stardust" />
					<span> {$stardust} </span>
				</div>
			</div>
		{/if}
	</div>

	<div class="row">
		<div class="left menu-button">
			<button on:click={() => changePage('shop')}> Shop </button>
			<button on:click={() => changePage('inventory')}> Inventory </button>
			<button on:click={() => changePage('history')}> History </button>
		</div>
		<div class="right roll-button">
			{#if bannerActiveType !== 'beginner'}
				<button class="single wish-button" on:click={handleSingleRollClick}>
					<div class="top">Wish x1</div>
					<div class="bottom">
						<Icon type={fateType} />
						<span style="margin-left: 7px">
							x
							<span class:red={fateQty < 1 && !$unlimitedFates}> 1 </span></span
						>
					</div>
				</button>
			{/if}

			<button class="ten wish-button" on:click={handleMultiRollClick}>
				{#if bannerActiveType === 'beginner'}
					<span class="discount">-20%</span>
				{/if}
				<div class="top">Wish x10</div>
				<div class="bottom">
					<Icon type={fateType} />
					<span style="margin-left: 7px">
						x
						<span class:red={fateQty < multiRollPrice && !$unlimitedFates}> {multiRollPrice} </span>
					</span>
				</div>
			</button>
		</div>
	</div>
</div>

<style>
	#footer {
		position: relative;
	}

	.red {
		color: #de2f22 !important;
	}

	.footer-info {
		position: absolute;
		left: 5%;
		bottom: 75%;
		align-items: center;
		display: flex;
		flex-direction: column;
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

	.wish-button {
		transform: scale(1);
		transition: all 0.2s;
		color: #4a5265;
		text-decoration: none;
	}

	.wish-button:active {
  		filter: brightness(85%);
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

	.menu-button button {
		border-radius: 50px;
		background-color: #e0ddd4;
		box-shadow: 0 2px 2px 0 rgba(100, 100, 100, 0.2),
    0 2px 2px 0 rgba(100, 100, 100, 0.19);
		padding: 3px 20px;
		margin: 2px 5px;
		transition: all 0.2s;
		border: solid transparent;
	}

	.menu-button button:hover {
		border: 3px solid white;
		transition: none;
	}

	.menu-button button:active {
		animation-name: colourchange;
		animation-duration: 0.2s;
		animation-fill-mode: forwards;
	}

	@keyframes colourchange {
		50% {
			color: #ffffda;
			background: #ede9cc;
		}
		100% {
			border: 3px solid darkgray;
			color: white;
			background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
			#e0ddd4;
		}
		}

	.roll-button {
		text-align: right;
	}

	.roll-button button {
		background-image: url('/assets/images/utility/button.webp');
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		width: 230px;
		aspect-ratio: 355/88;
		margin: 0 5px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #a49a90;
		transition: all 0.2s;
	}
	.roll-button button .bottom {
		display: flex;
		align-items: center;
	}

	.discount {
		background-color: #8ab958;
		position: absolute;
		z-index: +2;
		left: 15%;
		top: -5%;
		border-radius: 20px;
		color: #fff;
		transform: scale(0.8) translateX(-50%);
		padding: 0.2rem 0.5rem;
	}

	@media screen and (min-width: 750px) {
		.discount {
			font-size: 0.7rem;
		}
	}

	/* mobile */
	:global(.mobile) .row {
		padding: 0;
	}
	:global(.mobile) .menu-button button {
		padding: 1.5px 11px;
		margin: 1px 2px;
		font-size: 0.75rem;
	}
	:global(.mobile) .roll-button {
		margin-right: 40px !important;
	}
	:global(.mobile) .roll-button button {
		margin-right: -0.7rem !important;
		margin-left: -0.7rem !important;
		font-size: 0.75rem;
	}
	:global(.mobile) .roll-button :global(img) {
		transform: scale(0.7);
	}
	:global(.mobile) .bottom {
		margin-top: -3px;
	}

	/* Media Query */

	@media screen and (max-width: 900px) {
		button,
		.menu-button button {
			padding: 2px 15px;
			margin: 2px 5px;
		}

		.roll-button button {
			width: 180px;
			height: 40px;
			margin: 0;
		}
		.roll-button :global(img) {
			transform: scale(0.8);
		}
	}

	@media screen and (max-width: 700px) {
		.roll-button {
			width: 100%;
		}
	}
	@media screen and (max-width: 550px) {
		.menu-button {
			width: 100%;
		}
		.roll-button {
			width: auto;
		}
	}

	@media screen and (max-width: 400px) {
		.menu-button button {
			padding: 1px 10px;
			margin: 1px 2px;
		}
		.roll-button button {
			width: 140px;
			height: 30px;
			margin: 0;
		}
		.roll-button :global(img) {
			transform: scale(0.7);
		}
		.roll-button .bottom {
			margin-top: -3px;
		}
	}
</style>
