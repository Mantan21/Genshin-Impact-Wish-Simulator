<script>
	import { browser } from '$app/environment';
	import { t } from 'svelte-i18n';
	import {
		bannerActive,
		bannerList,
		bannerPhase,
		fatePoint,
		isFatepointSystem,
		patchVersion,
		selectedCourse,
		showFatepointModal
	} from '$lib/store/stores';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import { localFatePoint } from '$lib/store/localstore';
	import { noticeMark } from '$lib/helpers/noticeMark';
	import NoticeMark from '$lib/components/utility/NoticeMark.svelte';
	import EpitomizedIcon from './EpitomizedIcon.svelte';

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
		playSfx('exchange');
		showFatepointModal.set(true);
		noticeMark.openNotice(`fatepoint${$patchVersion}-${$bannerPhase}`);
	};

	$: checkFatepoint($bannerList);

	let buttonHeight;
</script>

{#if $isFatepointSystem && isWeapon}
	<button
		class="container"
		style="--height:{buttonHeight}px"
		on:click={handleClick}
		bind:clientHeight={buttonHeight}
	>
		<NoticeMark name="fatepoint{$patchVersion}-{$bannerPhase}" />
		<EpitomizedIcon active={$fatePoint === 2} />
		<div class="point-number">
			{#if $selectedCourse.name}
				<span>{$fatePoint}</span>/2
			{:else}
				<span class="small">{$t('wish.epitomizedPath.text')}</span>
			{/if}
		</div>
	</button>
{/if}

<style>
	button {
		position: relative;
		pointer-events: initial;
	}

	.point-number {
		border-radius: 50px;
		background-color: #ece4d9;
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
		font-size: calc(0.101 * var(--height));
		line-height: 110%;
		display: inline-block;
		color: var(--text-color);
		padding: 1% 10%;
	}
	:global(.mobile) button {
		font-size: 90%;
		padding: 0 0.2rem;
		margin-top: auto;
		margin-bottom: 10%;
	}
	:global(.mobile) span:not(.small) {
		font-size: 120%;
	}
	:global(.mobile) .point-number {
		padding: 0.1rem;
	}
</style>
