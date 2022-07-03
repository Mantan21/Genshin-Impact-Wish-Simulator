<script>
	import {
		acquaint,
		genesis,
		intertwined,
		primogem,
		stardust,
		starglitter
	} from '$lib/store/stores';
	import { localBalance } from '$lib/store/localstore';
	import Icon from '$lib/components/utility/Icon.svelte';
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import { createEventDispatcher } from 'svelte';
	import Range from './parts/_range.svelte';
	import { getName } from '$lib/functions/nameText';

	export let show = false;
	export let itemToBuy = 'intertwined';
	export let fundType = 'genesis';
	export let noConfirm = false;

	export let outfit = false;
	export let description = '';
	export let rarity = 0;
	export let price = 0;

	const data = {
		intertwined: {
			description:
				"A fateful stone that connects dreams. Its glimmers can entwine fates and connect dreams, just as how its glimmer links stars into the shapes of a heart's desires.",
			star: 5
		},
		acquaint: {
			description:
				"A seed that lights up the night. No matter the distance apart, guided by the stone's glimmer, the fated will meet under the stars.",
			star: 5
		}
	};

	const base = {
		starglitter: 5,
		stardust: 125,
		primogem: 160
	};

	let contentHeight;
	let rangeVal = 1;
	let maxRange = 1;
	let minRange = 0;

	let fundQty = 0;
	let fateQty = 0;

	$: {
		if (fundType === 'starglitter') {
			fateQty = ($starglitter - ($starglitter % base.starglitter)) / base.starglitter;
			fundQty = base.starglitter * rangeVal;
		}

		if (fundType === 'stardust') {
			fateQty = ($stardust - ($stardust % base.stardust)) / base.stardust;
			fundQty = base.stardust * rangeVal;
		}

		if (fundType === 'primogem') {
			fateQty = ($primogem - ($primogem % base.primogem)) / base.primogem;
			fundQty = base.primogem * rangeVal;
		}

		if (fundType === 'genesis' && outfit) {
			fundQty = price;
			fateQty = 1;
		}

		if (fundType === 'genesis' && !outfit) {
			fateQty = $genesis;
			fundQty = rangeVal;
		}

		maxRange = fateQty > 0 ? fateQty : 1;
		minRange = fateQty > 1 ? 1 : 0;
	}

	$: itemFieldStyle = `height:${(45 / 100) * contentHeight}px`;
	$: pictureWidthStyle = `height:${(45 / 100) * contentHeight}px; width:${
		(45 / 100) * contentHeight
	}px`;
	$: descriptionStyle = `max-width:calc(100% - ${(45 / 100) * contentHeight}px)`;

	const dispatch = createEventDispatcher();
	const cancelBuy = () => {
		dispatch('cancel');
		rangeVal = 1;
	};

	const buyHandle = () => {
		if (fateQty < 1) {
			dispatch('confirm', { status: 'failed', items: {} });
			return;
		}

		let fundAfterBuy;
		let itemAfterBuy;
		const pay = rangeVal * base[fundType];

		// Control Currency
		if (fundType === 'starglitter') {
			fundAfterBuy = $starglitter - pay;
			starglitter.set(fundAfterBuy);
		}
		if (fundType === 'stardust') {
			fundAfterBuy = $stardust - pay;
			stardust.set(fundAfterBuy);
		}
		if (fundType === 'primogem') {
			fundAfterBuy = $primogem - pay;
			primogem.set(fundAfterBuy);
		}
		if (fundType === 'genesis') {
			fundAfterBuy = $genesis - rangeVal;
			genesis.set(fundAfterBuy);
		}

		// Control Item that want to buy
		if (itemToBuy === 'intertwined') {
			itemAfterBuy = rangeVal + $intertwined;
			intertwined.set(itemAfterBuy);
		}
		if (itemToBuy === 'acquaint') {
			itemAfterBuy = rangeVal + $acquaint;
			acquaint.set(itemAfterBuy);
		}

		if (itemToBuy === 'primogem') {
			itemAfterBuy = rangeVal + $primogem;
			primogem.set(itemAfterBuy);
		}

		localBalance.set(itemToBuy, itemAfterBuy);
		localBalance.set(fundType, fundAfterBuy);
		dispatch('confirm', {
			fundAfterBuy,
			fundType,
			itemToBuy,
			item: { itemToBuy, value: rangeVal }
		});

		rangeVal = 1;
	};
</script>

<PopUp
	{show}
	title="Item To {fundType === 'genesis' ? 'Exchange' : 'Purchase'}"
	on:cancel={cancelBuy}
	on:confirm={buyHandle}
	button={(outfit ? noConfirm : fateQty < 1) ? 'cancel' : 'all'}
>
	<div class="content" bind:clientHeight={contentHeight}>
		{#if fundType === 'genesis' && !outfit}
			<!-- Genesis Exchange -->
			<div class="row genesis-exchange" style={itemFieldStyle}>
				<div class="col genesis">
					<picture>
						<Icon type="genesis" width="50%" />
						<span>Genesis Crystal</span>
					</picture>
				</div>

				<div class="col primo-exchange">
					<picture>
						<Icon type="primogem" width="50%" />
						<span>Primogem</span>
					</picture>
				</div>

				<div class="divider">
					<i class="gi-arrow-right" />
				</div>
			</div>

			<!-- End Genesis Exchange -->
		{:else}
			<div class="item" style={itemFieldStyle}>
				<div class="primo">
					<span class="primogem" class:red={outfit ? $genesis < price : fateQty < 1}>
						<Icon
							type={fundType}
							height="80%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
						/>
						{fundQty}
					</span>
				</div>
				<picture style={pictureWidthStyle}>
					{#if outfit}
						<img
							src="/assets/images/characters/outfit/thumbnail/{itemToBuy}.webp"
							width="75%"
							alt={getName(itemToBuy)}
						/>
					{:else}
						<Icon type={itemToBuy} width="70%" />
					{/if}
				</picture>
				<div class="description" style={descriptionStyle}>
					<div class="title">
						{#if outfit}
							{getName(itemToBuy)}
						{:else}
							{itemToBuy} Fate
						{/if}
					</div>
					<div class="star">
						{#each Array(rarity || data[itemToBuy]?.star) as _, i}
							<i class="gi-star" />
						{/each}
					</div>

					<p>
						{description || data[itemToBuy]?.description}
					</p>
				</div>
			</div>
		{/if}

		<div class="slider">
			<div class="rangeNumber">
				<span>Qty :</span>
				<span style="font-size: larger">{rangeVal}</span>
			</div>
			<div class="rangeInput">
				<Range
					on:rangeChange={({ detail }) => (rangeVal = detail.value)}
					disabled={outfit || fateQty < 1}
					{maxRange}
					{minRange}
					{rangeVal}
				/>
				{#if fundType === 'genesis' && !outfit}
					<div class="consume" style="display: inline-flex; align-items:center">
						Consume
						<Icon type="genesis" />
						<span class:red={$genesis < 1}> {rangeVal}</span>
					</div>
				{/if}
				{#if outfit ? $genesis < price : fateQty < 1}
					<div class="error red">Insufficient Funds</div>
				{/if}
			</div>
		</div>
	</div>
</PopUp>

<style>
	.red {
		color: #de2f22 !important;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		width: 100%;
		background-image: linear-gradient(-15deg, #e0b466, #817874);
	}
	.primo {
		position: absolute;
		top: 0.2rem;
		right: 0.2rem;
	}
	.primogem {
		padding: 2px 15px 0 30px;
		display: inline-flex;
		align-items: center;
		max-width: 112px;
		height: 25px;
		position: relative;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		text-align: center;
		margin: 0 8px;
		font-size: 0.8rem;
	}

	picture {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.description {
		color: #fff;
		font-size: 0.7rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		padding: 0.3rem;
	}
	.title {
		font-size: 1.1rem;
		text-transform: capitalize;
	}
	.gi-star {
		color: #eac343;
		font-size: 0.9rem;
		padding-top: 2px;
	}

	.description p {
		height: 100%;
		overflow-y: auto;
		color: #fff;
	}

	.genesis-exchange {
		display: flex;
		width: 80%;
		height: 100%;
		position: relative;
		margin: 0 auto;
	}

	.col {
		width: 100%;
		flex-basis: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 0.1em 0 0.7em;
	}

	.col span {
		width: 100%;
		position: absolute;
		bottom: 0.3rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.7rem;
	}

	.divider {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: x-large;
		color: #fff;
	}
	.genesis-exchange .genesis {
		background-color: #d1c8bb;
	}
	.genesis-exchange .primo-exchange {
		background-color: #ecd7a5;
	}

	.slider,
	.rangeNumber,
	.rangeInput {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		width: 100%;
		position: relative;
		font-size: 1rem;
	}
	.rangeNumber {
		font-size: 0.8rem;
		margin-bottom: -0.5rem;
	}
	.slider {
		height: 100%;
	}

	@media screen and (max-width: 890px) {
		.primogem {
			height: 20px;
			margin: 0 3px;
		}
	}
	@media screen and (max-width: 400px) {
		.primogem {
			max-width: 80px;
		}
	}
</style>
