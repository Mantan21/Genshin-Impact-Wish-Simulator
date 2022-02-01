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
	import playSfx from '$lib/functions/audio';

	export let show = false;
	export let itemToBuy = 'intertwined';
	export let fundType = 'primogem';

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

		if (fundType === 'genesis') {
			fateQty = $genesis;
			fundQty = rangeVal;
		}

		maxRange = fateQty > 0 ? fateQty : 1;
		minRange = fateQty > 1 ? 1 : 0;
	}
	$: rangeStyle = `--min: ${minRange}; --max: ${maxRange}; --val: ${rangeVal}`;

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
			dispatch('confirm', { status: 'failed' });
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
		rangeVal = 1;
		localBalance.set(itemToBuy, itemAfterBuy);
		localBalance.set(fundType, fundAfterBuy);
		dispatch('confirm', {
			fundAfterBuy,
			fundType,
			itemToBuy
		});
	};
</script>

<PopUp
	{show}
	title="Item To Exchange"
	on:cancel={cancelBuy}
	on:confirm={buyHandle}
	button={fateQty < 1 ? 'cancel' : 'all'}
>
	<div class="content" bind:clientHeight={contentHeight}>
		{#if fundType === 'genesis'}
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
					<span class="primogem" class:red={fateQty < 1}>
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
					<Icon type={itemToBuy} width="70%" />
				</picture>
				<div class="description" style={descriptionStyle}>
					<div class="title">{itemToBuy} Fate</div>
					<div class="star">
						{#each Array(data[itemToBuy].star) as _, i}
							<i class="gi-star" />
						{/each}
					</div>

					<p>
						{data[itemToBuy].description}
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
				<div class="input">
					<button
						class="min"
						disabled={rangeVal <= 1}
						on:click={() => {
							if (rangeVal > 1) rangeVal--;
							playSfx();
						}}
					>
						<span style="font-size: 1.5rem; margin-top: -0.4rem; margin-left: 0rem"> - </span>
					</button>
					<div class="control">
						<span style="pointer-events:none">{minRange}</span>
						<input
							class="range"
							type="range"
							max={maxRange}
							min={minRange}
							bind:value={rangeVal}
							style={rangeStyle}
						/>
						<span style="pointer-events:none">{maxRange}</span>
					</div>
					<button
						class="plus"
						disabled={rangeVal >= maxRange}
						on:click={() => {
							if (rangeVal < maxRange) rangeVal++;
							playSfx();
						}}
					>
						<i class="gi-plus" />
					</button>
				</div>

				{#if fundType === 'genesis'}
					<div class="consume" style="display: inline-flex; align-items:center">
						Consume
						<Icon type="genesis" />
						<span class:red={$genesis < 1}> {rangeVal}</span>
					</div>
				{/if}
				{#if fateQty < 1}
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
		align-itmes: center;
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
	.rangeInput,
	.control,
	.input {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		width: 100%;
		position: relative;
		font-size: 1rem;
	}
	.slider {
		height: 100%;
	}

	.control {
		flex-direction: row;
		margin: 0 3rem;
	}

	.control > span {
		width: 2.2em;
		height: 2em;
		line-height: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: larger;
	}

	/* range */
	[type='range'] {
		--range: calc(var(--max) - var(--min));
		--ratio: calc((var(--val) - var(--min)) / var(--range));
		--sx: calc(0.5 * 1.5em + var(--ratio) * (100% - 1.5em));
		margin: 0;
		padding: 0;
		width: 55%;
		height: 1.5em;
		background: transparent;
		font: 1em/1 arial, sans-serif;
	}
	[type='range'],
	[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
	}
	[type='range']::-webkit-slider-runnable-track {
		box-sizing: border-box;
		border: none;
		width: 100%;
		height: 0.4em;
		background: #ccc;
	}
	[type='range']::-webkit-slider-runnable-track {
		background: linear-gradient(#4a5265, #4a5265) 0 / var(--sx) 100% no-repeat #ccc;
		border-radius: 10px;
	}
	[type='range']::-moz-range-track {
		box-sizing: border-box;
		border-radius: 10px;
		width: 100%;
		height: 0.4em;
		background: #ccc;
	}

	/* duplicated because browsers ignore
	 * the whole selector when they see
	 * non-standard rules
	 * (FF 96, Chrome 97)
	 */
	[type='range']::-ms-track {
		box-sizing: border-box;
		border: none;
		width: 100%;
		height: 0.4em;
		background: #ccc;
	}

	[type='range']::-moz-range-progress {
		height: 0.4em;
		border-radius: 10px;
		background: #4a5265;
	}

	[type='range']::-ms-fill-lower {
		height: 0.4em;
		background: #ccc;
	}

	[type='range']::-webkit-slider-thumb {
		box-sizing: border-box;
		border: none;
		border-radius: 0;
		width: 0.75em;
		height: 0.75em;
		background: #4a5265;
		margin-top: -0.22rem;
		transform: rotate(45deg);
		border: 0.15em solid #ece6de;
		outline: 0.15em solid #4a5265;
		box-shadow: 0 0 6px #ece6de;
	}

	[type='range']::-moz-range-thumb {
		box-sizing: border-box;
		border: none;
		border-radius: 0;
		width: 0.75em;
		height: 0.75em;
		background: #4a5265;
		margin-top: -0.22rem;
		transform: rotate(45deg);
		border: 0.15em solid #ece6de;
		outline: 0.15em solid #4a5265;
		box-shadow: 0 0 6px #ece6de;
	}

	[type='range']::-ms-tooltip {
		display: none;
	}

	button.plus:disabled,
	button.min:disabled {
		background-color: rgb(173, 179, 192);
	}

	button.plus,
	button.min {
		background-color: #4a5265;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0;
		position: absolute;
		width: 2rem;
		height: 2rem;
		padding: 0.5rem;
		color: #fff;
		border-radius: 100%;
		top: 50%;
		transform: translateY(-50%);
	}

	button.plus {
		right: 7%;
	}
	button.min {
		left: 7%;
		z-index: +3;
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
