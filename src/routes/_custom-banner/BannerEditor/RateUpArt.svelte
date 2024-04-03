<script>
	import { t } from 'svelte-i18n';
	import { assets } from '$lib/store/app-stores';

	export let rateup = [];
	export let onBannerEdit = false;
</script>

<div class="rateup-art" class:onBannerEdit>
	<div class="wrapper">
		{#each rateup as name, i}
			{#if name}
				<div class="art art-{i + 1}">
					<img src={$assets[`nobg/${name}`]} alt={$t(`${name}.name`)} />
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.rateup-art {
		position: absolute;
		bottom: 0;
		left: 0;
		width: inherit;
		aspect-ratio: 1080/533;
		z-index: +4;
		pointer-events: none;
	}

	.rateup-art.onBannerEdit {
		opacity: 0.4;
	}

	.wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		mask-image: linear-gradient(to left, black 25%, transparent 35%);
		overflow: hidden;
	}

	.art {
		position: absolute;
		width: 45%;
		height: auto;
		mask-image: linear-gradient(to top, transparent 20%, black 50%, black 95%, transparent);
	}

	.art img {
		width: 100%;
	}

	.art-1 {
		top: -5%;
		right: -5%;
	}
	.art-2 {
		top: 15%;
		right: -12%;
	}
	.art-3 {
		top: 45%;
		right: -3%;
	}
</style>
