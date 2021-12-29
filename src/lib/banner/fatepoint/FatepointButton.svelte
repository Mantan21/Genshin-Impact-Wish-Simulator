<script>
	import {
		bannerActive,
		bannerList,
		bannerVersion,
		fatePoint,
		isFatepointSystem,
		patchVersion,
		showFatepointCounter
	} from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import FatepointIcon from './FatepointIcon.svelte';
	import { localFatePoint } from '$lib/store/localstore';

	const handleClick = () => {
		playSfx();
		showFatepointCounter.set(!$showFatepointCounter);
	};

	const checkFatepoint = (patch, banner) => {
		// eslint-disable-next-line
		if (!globalThis.window) return;
		const localFate = localFatePoint.init(patch, banner);
		const point = localFate.getPoint();
		fatePoint.set(point);
	};

	$: checkFatepoint($patchVersion, $bannerVersion);
</script>

{#if $isFatepointSystem && $bannerList[$bannerActive].type === 'weapon'}
	<button class="container" on:click={handleClick}>
		<FatepointIcon active={$fatePoint === 2} />
		<div class="point-number">
			<span>{$fatePoint}</span>/2
		</div>
	</button>
{/if}

<style>
	button {
		position: relative;
	}

	.point-number {
		border-radius: 50px;
		background-color: #fff;
		border: 3px solid #fff;
		padding: 0.2rem;
		width: 100%;
		transition: all 0.2s;
		color: #a49a90;
		border: 1px solid #a49a90;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translateX(-50%);
	}

	.point-number span {
		color: #ff8700;
	}

	:global(.mobile) button {
		margin-top: auto;
		margin-bottom: 10%;
	}
	:global(.mobile) .point-number {
		padding: 0.1rem;
	}
</style>
