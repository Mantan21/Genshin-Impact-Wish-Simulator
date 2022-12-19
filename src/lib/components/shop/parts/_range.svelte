<script>
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { createEventDispatcher } from 'svelte';

	export let rangeVal;
	export let maxRange;
	export let minRange;
	export let disabled = false;

	$: rangeStyle = `--min: ${minRange}; --max: ${maxRange}; --val: ${rangeVal}`;

	const dispatch = createEventDispatcher();
	const changeRange = (e) => {
		dispatch('rangeChange', {
			value: parseInt(e.target.value)
		});
	};

	let timeout;
	let interval;
	const rangeControl = (plusOrMinus = 'plus') => {
		const change = plusOrMinus === 'plus' ? plus : min;
		change();
		timeout = setTimeout(() => {
			interval = setInterval(change, 50);
		}, 500);
		playSfx();
	};
	const plus = () => {
		if (rangeVal >= maxRange) return clearTimers();
		changeRange({ target: { value: rangeVal + 1 } });
	};
	const min = () => {
		if (rangeVal <= 1) return clearTimers();
		changeRange({ target: { value: rangeVal - 1 } });
	};
	const clearTimers = () => {
		clearTimeout(timeout);
		clearInterval(interval);
	};
</script>

<div class="input">
	<button
		class="min"
		disabled={rangeVal <= 1}
		on:touchstart|preventDefault={() => rangeControl('min')}
		on:mousedown|preventDefault={() => rangeControl('min')}
		on:mouseleave={clearTimers}
		on:mouseup={clearTimers}
		on:touchend={clearTimers}
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
			value={rangeVal}
			on:input={changeRange}
			style={rangeStyle}
			{disabled}
		/>
		<span style="pointer-events:none">{maxRange}</span>
	</div>
	<button
		class="plus"
		on:touchstart|preventDefault={() => rangeControl('plus')}
		on:mousedown|preventDefault={() => rangeControl('plus')}
		on:mouseleave={clearTimers}
		on:mouseup={clearTimers}
		on:touchend={clearTimers}
		disabled={rangeVal >= maxRange}
	>
		<i class="gi-plus" />
	</button>
</div>

<style>
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
		line-height: 0;
	}

	button.plus {
		right: 7%;
	}
	button.min {
		left: 7%;
		z-index: +3;
		padding-top: 1rem;
	}
</style>
