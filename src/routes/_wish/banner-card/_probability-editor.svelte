<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { getRate, setRate } from '$lib/helpers/gacha/probabilities';
	import { playSfx } from '$lib/helpers/audio/audio';
	import ButtonGeneral from '$lib/components/ButtonGeneral.svelte';
	import ButtonModal from '$lib/components/ButtonModal.svelte';

	export let type = 'character-event';
	export let fullscreenEditor = false;

	const editprob = getContext('editprob');
	const showModalReset = getContext('showModalReset');
	const resetClick = () => {
		showModalReset();
		playSfx();
	};

	$: baseRate4 = getRate(type, 'baseRate4');
	$: baseRate5 = getRate(type, 'baseRate5');
	$: charRate = getRate(type, 'charRate');
	$: winRate = getRate(type, 'winRate');
	$: selectedRate = getRate(type, 'selectedRate');
	$: hard4 = getRate(type, 'hard4');
	$: hard5 = getRate(type, 'hard5');
	$: max4 = getRate(type, 'max4');
	$: max5 = getRate(type, 'max5');
	$: disGuaranteed = getRate(type, 'disGuaranteed');

	const guaranteedToggle = () => {
		setRate(type, 'disGuaranteed', disGuaranteed);
		playSfx('click2');
	};

	const changeRate = (e, variable) => {
		const val = e.target.value;
		const maxVal = variable.match('Rate4') ? 100 - baseRate5 : 100;
		const capVal = parseFloat(val) < maxVal || !val ? val : maxVal;

		if (val >= maxVal) e.target.value = capVal;
		setRate(type, variable, capVal || 0);

		if (variable === 'baseRate4') return (baseRate4 = capVal);
		if (variable === 'baseRate5') {
			baseRate5 = capVal;
			const isOverLimit = parseFloat(baseRate5) + parseFloat(baseRate4) > 100;
			if (isOverLimit) {
				baseRate4 = 100 - baseRate5;
				setRate(type, 'baseRate4', baseRate4);
			}
		}
	};

	const changePity = (e, variable) => {
		const val = e.target.value;
		let finalVal = 1;

		// Max Pity Changer
		if (variable.match('max')) {
			const capVal = val <= 1 || !val ? 1 : val;
			finalVal = parseInt(capVal);
			e.target.value = finalVal;

			if (variable === 'max5') {
				max5 = finalVal;
				const maxHard = hard5 >= max5 - 1 ? max5 - 1 : hard5;
				if (hard5 >= maxHard || isNaN(finalVal)) {
					hard5 = isNaN(finalVal) ? 0 : maxHard;
					setRate(type, 'hard5', hard5 || 0);
				}
			}

			if (variable === 'max4') {
				max4 = finalVal;
				const maxHard = hard4 >= max4 - 1 ? max4 - 1 : hard4;
				if (hard4 >= maxHard || isNaN(finalVal)) {
					hard4 = isNaN(finalVal) ? 0 : maxHard;
					setRate(type, 'hard4', hard4 || 0);
				}
			}
		}

		// Hard Pity Changer
		if (variable.match('hard')) {
			const maxPity = variable === 'hard5' ? max5 : max4;
			const cap = (maxPity || 0) - 1;
			finalVal = val >= cap ? cap : val;
			if (val >= cap) e.target.value = finalVal;
			if (variable === 'hard4') hard4 = finalVal;
			if (variable === 'hard5') hard5 = finalVal;
		}

		setRate(type, variable, finalVal || 1);
	};
</script>

<div class="editor {type}" class:fullscreenEditor out:fade|local>
	<div class="header">
		{$t('editor.bannerConfig', { values: { banner: $t(`wish.banner.${type}`) } })}
	</div>
	<div class="body">
		<div class="item">
			<div class="col">
				{$t('editor.baseRate', { values: { rarity: 5 } })}
			</div>
			<div class="col percent">
				<input type="number" value={baseRate5} on:input={(e) => changeRate(e, 'baseRate5')} />
			</div>
		</div>

		<div class="item" class:disabled={baseRate5 >= 100}>
			<div class="col">
				{$t('editor.maxPity', { values: { rarity: 5 } })}
			</div>
			<div class="col">
				<input
					type="number"
					value={max5}
					disabled={baseRate5 >= 100}
					on:input={(e) => changePity(e, 'max5')}
				/>
			</div>
		</div>

		<div class="item" class:disabled={baseRate5 >= 100 || !max5 || max5 <= 1}>
			<div class="col">
				{$t('editor.hardPity', { values: { rarity: 5 } })}
			</div>
			<div class="col">
				<input
					type="number"
					value={hard5}
					disabled={baseRate5 >= 100 || !max5 || max5 <= 1}
					on:input={(e) => changePity(e, 'hard5')}
				/>
			</div>
		</div>

		<div class="item" class:disabled={baseRate5 >= 100 || max5 <= 1}>
			<div class="col">{$t('editor.baseRate', { values: { rarity: 4 } })}</div>
			<div class="col percent">
				<input
					type="number"
					value={baseRate4}
					disabled={baseRate5 >= 100 || max5 <= 1}
					on:input={(e) => changeRate(e, 'baseRate4')}
				/>
			</div>
		</div>

		<div class="item" class:disabled={baseRate5 >= 100 || baseRate4 >= 100 || max5 <= 1}>
			<div class="col">
				{$t('editor.maxPity', { values: { rarity: 4 } })}
			</div>
			<div class="col">
				<input
					type="number"
					value={max4}
					disabled={baseRate5 >= 100 || baseRate4 >= 100 || max5 <= 1}
					on:input={(e) => changePity(e, 'max4')}
				/>
			</div>
		</div>

		<div
			class="item"
			class:disabled={baseRate5 >= 100 || baseRate4 >= 100 || !max4 || max4 <= 1 || max5 <= 1}
		>
			<div class="col">{$t('editor.hardPity', { values: { rarity: 4 } })}</div>
			<div class="col">
				<input
					type="number"
					value={hard4}
					disabled={baseRate5 >= 100 || baseRate4 >= 100 || !max4 || max4 <= 1 || max5 <= 1}
					on:input={(e) => changePity(e, 'hard4')}
				/>
			</div>
		</div>

		{#if type !== 'standard'}
			<div class="item">
				<div class="col">{$t('editor.winRate')}</div>
				<div class="col percent">
					<input type="number" value={winRate} on:input={(e) => changeRate(e, 'winRate')} />
				</div>
			</div>
		{/if}

		<div class="item" class:disabled={baseRate5 >= 100 && type !== 'standard'}>
			<div class="col">
				{$t('editor.charRate')}
				{#if type !== 'standard'}
					<small>{$t('editor.nonRateup')}</small>
				{/if}
				:
			</div>
			<div class="col percent">
				<input
					type="number"
					value={charRate}
					disabled={baseRate5 >= 100 && type !== 'standard'}
					on:input={(e) => changeRate(e, 'charRate')}
				/>
			</div>
		</div>

		{#if type.match('weapon')}
			<div class="item">
				<div class="col">{$t('editor.selectedRate')}</div>
				<div class="col percent">
					<input
						type="number"
						value={selectedRate}
						on:input={(e) => changeRate(e, 'selectedRate')}
					/>
				</div>
			</div>
		{/if}

		{#if type !== 'standard'}
			<div class="item">
				<div class="col">{@html $t('editor.disGuaranteed')}</div>
				<div class="col checkbox">
					<input
						type="checkbox"
						id="dis"
						bind:checked={disGuaranteed}
						on:change={guaranteedToggle}
					/> <label for="dis"> <i class="gi-check" /> </label>
				</div>
			</div>
		{/if}
	</div>
	<div class="footer">
		<ButtonGeneral on:click={resetClick}>{$t('editor.backToDefault')}</ButtonGeneral>
		<ButtonModal
			on:click={() => {
				editprob();
				playSfx('modal');
			}}
		/>
	</div>
</div>

<style>
	.editor {
		background-image: linear-gradient(to top, #eee8e3 50%, #f7f5f4);
		display: flex;
		flex-direction: column;
		min-height: 100%;
		width: 100%;
		font-size: 85%;
		position: relative;
	}

	.editor.fullscreenEditor {
		width: 75%;
		height: 85%;
		min-height: unset;
	}

	.header {
		background-color: rgba(20, 18, 15, 0.85);
		color: #fff;
		padding: 1rem;
	}
	.fullscreenEditor .header {
		padding: 0.75rem 1rem;
	}

	.standard .header {
		background-color: #5b61c4;
	}
	.weapon-event .header {
		background-color: #c86612;
	}

	.body {
		padding: 0 1% 1%;
		width: 100%;
	}
	.fullscreenEditor .body {
		height: 100%;
		overflow-y: auto;
	}

	.footer {
		margin-top: auto;
		padding: 1%;
		text-align: right;
	}

	.item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.28% 0 0.28% 1%;
		border-bottom: rgba(20, 18, 15, 0.5) 1px solid;
		transition: background 0.5s;
	}

	.fullscreenEditor .item {
		font-size: 100%;
	}

	.item:hover,
	.item.disabled {
		background-color: rgba(20, 18, 15, 0.075);
	}

	.item.disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	input:disabled {
		cursor: not-allowed;
	}

	.col {
		position: relative;
		display: block;
	}

	.col:nth-child(1) {
		flex-basis: 90%;
		width: 90%;
	}

	.col:nth-child(2) {
		height: 2rem;
		flex-basis: 10%;
		min-width: 5rem;
	}
	.fullscreenEditor .col:nth-child(2) {
		height: 1.5rem;
	}

	.col.percent:nth-child(2)::after {
		content: '%';
		background-color: #dbd7d0;
		height: 100%;
		aspect-ratio: 1/1;
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1/1;
		color: #787269;
		position: absolute;
		top: 0;
		right: 0;
		border-top-right-radius: 3rem;
		border-bottom-right-radius: 3rem;
	}

	input {
		width: 100%;
		padding: 0 15%;
		margin-bottom: 2%;
		font-size: 80%;
		height: 100%;
		display: block;
		border-radius: 3rem;
		border: #c3b8a5 1px solid;
		outline: none;
		transition: all 0.2s;
	}

	.percent input {
		padding-right: 35%;
	}

	input:focus {
		box-shadow: 0 0 0.4rem rgba(227, 149, 48, 0.7);
	}

	/* Checkbox */
	.checkbox {
		font-size: 150%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.checkbox label {
		text-align: left;
		display: flex;
		align-items: center;
		height: 80%;
	}

	.checkbox input + label i {
		color: white;
		border: 1px solid #aaa;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		aspect-ratio: 1/1;
		background-color: #fff;
		transition: all 0.2s;
	}
	.checkbox input:checked + label i {
		background-color: #06bbff;
	}

	.checkbox:hover input + label i {
		border: 1px solid #06bbff;
		box-shadow: rgba(106, 168, 230, 0.6) 0px 0px 7px 5px;
	}

	.checkbox input {
		display: none;
	}
</style>
