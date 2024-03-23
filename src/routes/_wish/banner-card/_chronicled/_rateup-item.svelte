<script>
	import { assets } from '$lib/store/app-stores';
	import { t } from 'svelte-i18n';
	import { fly } from 'svelte/transition';

	export let active = false;
	export let data = {};
	const { type, name, weaponType } = data;
</script>

<div class="item-wrapper wd {type}" class:active>
	{#if active}
		<div class="indicator" transition:fly|local={{ y: -20 }}>
			<img
				alt="Active Indicator"
				style="width: 100%;"
				src="data:image/octet-stream;base64,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"
			/>
		</div>
	{/if}

	<div class="artbox wd">
		<i class="gi-primo-star top" />
		<i class="gi-primo-star bottom" />

		<picture class="wd">
			{#if type === 'weapon'}
				<img class={weaponType} src={$assets[name]} alt={$t(name)} />
			{:else}
				<img src={$assets[`wishcard/${name}`]} alt={$t(`${name}.name`)} />
			{/if}
		</picture>
	</div>
</div>

<style>
	.wd {
		width: 100%;
		height: 100%;
		border-radius: 5rem;
	}

	.item-wrapper {
		position: relative;
		background-color: #e5ddd2;
		border: calc(0.03 * var(--col-width)) solid #cfba8d;
		padding: calc(0.03 * var(--col-width));
		box-shadow: inset 0 0 calc(0.1 * var(--col-width)) rgba(251, 188, 5, 0.5);
		transition: background 0.3s;
	}
	.item-wrapper:hover,
	.item-wrapper.active {
		background-color: #fdf4ed;
		box-shadow: 0 0 calc(0.05 * var(--col-width)) rgba(251, 188, 5, 1),
			inset 0 0 calc(0.15 * var(--col-width)) rgba(251, 188, 5, 0.75);
		border-color: #fff;
	}
	.item-wrapper.active {
		transform: scale(1.05);
	}

	.indicator {
		width: calc(0.375 * var(--col-width));
		aspect-ratio: 1/1.2;
		position: absolute;
		top: 7%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: +10;
	}
	.indicator img {
		animation: indicator infinite alternate 0.75s cubic-bezier(0.445, 0.05, 0.55, 0.95);
	}

	i.top {
		top: 0;
		transform: translate(-50%, -30%);
	}
	i.bottom {
		bottom: 0;
		transform: translate(-50%, 30%);
	}
	.artbox i {
		position: absolute;
		font-size: calc(0.15 * var(--col-width));
		left: 50%;
		line-height: 0;
		z-index: +2;
	}
	.artbox::before {
		content: '';
		border: calc(0.025 * var(--col-width)) dotted #bbb;
		width: 92%;
		height: 96%;
		position: absolute;
		border-radius: inherit;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: +1;
	}

	.artbox {
		color: #dac598;
		position: relative;
	}
	.artbox picture {
		display: block;
		position: absolute;
		overflow: hidden;
	}

	.artbox img {
		width: 115%;
		position: absolute;
		left: 50%;
		top: -10%;
		transform: translateX(-50%);
	}
	.weapon .artbox img {
		width: 175%;
		top: -15%;
		left: 50%;
		filter: drop-shadow(0 0.15rem 0.02rem rgba(0, 0, 0, 1));
	}
	.weapon .artbox img.catalyst {
		top: 50%;
		transform: translate(-50%, -50%);
		width: 140%;
	}

	@keyframes indicator {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(20%);
		}
	}
</style>
