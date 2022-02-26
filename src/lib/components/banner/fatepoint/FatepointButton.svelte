<script>
	import { browser } from '$app/env';
	import {
		bannerActive,
		bannerList,
		bannerPhase,
		fatePoint,
		isFatepointSystem,
		patchVersion,
		selectedCourse,
		showFatepointPopup
	} from '$lib/store/stores';
	import playSfx from '$lib/functions/audio';
	import FatepointIcon from './FatepointIcon.svelte';
	import { localFatePoint } from '$lib/store/localstore';

	$: isWeapon = $bannerList[$bannerActive].type === 'weapons';

	const getSelectedCourse = (banners, course) => {
		if (!course) return selectedCourse.set({ name: null, index: null });

		const selected = banners.find(({ type }) => type === 'weapons');
		if (!selected) return selectedCourse.set({ name: null, index: null });

		const selectedName = selected.weapons.featured[course - 1].name;
		selectedCourse.set({ name: selectedName, index: course - 1 });
	};

	const checkFatepoint = (banners) => {
		if (!browser) return;
		const localFate = localFatePoint.init($patchVersion, $bannerPhase);
		const point = localFate.getPoint();
		let course = localFate.getSelected();
		getSelectedCourse(banners, course);
		fatePoint.set(point);
	};

	const handleClick = () => {
		playSfx();
		showFatepointPopup.set(true);
	};

	$: checkFatepoint($bannerList);
</script>

{#if $isFatepointSystem && isWeapon}
	<button class="container" on:click={handleClick}>
		<FatepointIcon active={$fatePoint === 2} />
		<div class="point-number">
			{#if $selectedCourse.name}
				<span>{$fatePoint}</span>/2
			{:else}
				<span class="small">Epitomized Path</span>
			{/if}
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

	.point-number span.small {
		font-size: 0.75rem;
		line-height: 0.7rem;
		padding: 0 1rem;
		color: var(--text-color);
	}

	:global(.mobile) button {
		margin-top: auto;
		margin-bottom: 10%;
	}
	:global(.mobile) .point-number {
		padding: 0.1rem;
	}
	:global(.mobile) .point-number span.small {
		font-size: 0.5rem;
		line-height: 0.5rem;
	}
</style>
