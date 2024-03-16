<script>
	import { getContext, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { course, bannerList, activeBanner, viewportHeight } from '$lib/store/app-stores';
	import { getWpDetails } from '$lib/helpers/gacha/itemdrop-base';
	import { playSfx } from '$lib/helpers/audio/audio';
	import hotkeys from 'hotkeys-js';

	import ButtonModal from '$lib/components/ButtonModal.svelte';
	import FatepointSVG from './_svg-background.svelte';
	import InventoryItem from '../../_inventory/_inventory-item.svelte';

	let itemWidth;
	let weaponName = '';
	let selectedCourse = -1;

	$: defaultItemWidth = (16.5 / 100) * $viewportHeight;
	$: if (itemWidth < 150) itemWidth = 150;
	else itemWidth = defaultItemWidth;

	const weapons = $bannerList[$activeBanner].featured.map(({ name }) => getWpDetails(name));
	onMount(() =>
		course.subscribe(({ selected }) => {
			weaponName = weapons[selected]?.name;
			selectedCourse = selected;
		})
	);

	let targetActive = null;
	const cancelCourse = getContext('cancelCourse');
	const setCourse = getContext('setCourse');

	const select = (i) => {
		playSfx('click2');
		targetActive = i;
	};

	// Hotkeys
	hotkeys('left,right', 'epipath', (e) => {
		e.preventDefault();
		if (weaponName) return;

		playSfx('click2');
		const [key] = hotkeys.getPressedKeyString();
		const to = key.toLocaleLowerCase();
		if (to === 'left') {
			targetActive = targetActive <= 0 ? 1 : targetActive - 1;
		}
		if (to === 'right') {
			targetActive = targetActive >= 1 ? 0 : targetActive + 1;
		}
	});

	hotkeys('enter', 'epipath', (e) => {
		e.preventDefault();
		if (targetActive === null) return;
		setCourse(targetActive);
	});
</script>

<div class="weapon-selector" class:counter={weaponName}>
	<div class="bg">
		<FatepointSVG mode={weaponName ? 'counter' : 'bg'} />
	</div>
	<h2 class="top">{$t('wish.epitomizedPath.selectWeapon')}</h2>
	<div class="weapon-item">
		<div class="weapon-list" style="--item-width: {itemWidth}px">
			{#if weaponName}
				<div class="weapon-content">
					<button>
						<InventoryItem
							itemdata={{
								name: weaponName,
								weaponType: weapons[selectedCourse].weaponType,
								type: 'weapon',
								rarity: 5
							}}
						/>
					</button>
				</div>
			{:else}
				{#each weapons as { name, weaponType }, i}
					<div class="weapon-content" class:active={targetActive === i} on:click={() => select(i)}>
						<button>
							<InventoryItem itemdata={{ name, weaponType, type: 'weapon', rarity: 5 }} />
						</button>
					</div>
				{/each}
			{/if}
		</div>
		<div class="text">
			<div>
				{#if weaponName}
					{$t('wish.epitomizedPath.fatePoint')} : <span>{$course.point}</span>/2
				{:else if targetActive === null}
					{$t('wish.epitomizedPath.selectWeapon')}
				{:else}
					{@html $t('wish.epitomizedPath.chartCourseOf', {
						values: {
							target: `<span> ${$t(weapons[targetActive].name)} </span>`
						}
					})}
				{/if}
			</div>
		</div>
	</div>
	<div class="button">
		{#if weaponName}
			<ButtonModal on:click={cancelCourse} type="cancel">
				{$t('wish.epitomizedPath.cancelCourse')}
			</ButtonModal>
		{:else}
			<ButtonModal on:click={() => setCourse(targetActive)} disabled={targetActive === null}>
				{$t('wish.epitomizedPath.chartCourse')}
			</ButtonModal>
		{/if}
	</div>
</div>

<style>
	.weapon-selector {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: #383b40;
	}
	.weapon-selector,
	.weapon-selector > div {
		position: relative;
		padding: 5%;
	}
	.weapon-selector .bg {
		position: absolute;
		width: 90%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.counter.weapon-selector .bg {
		width: 90%;
		top: 48%;
	}

	.top {
		font-size: calc(3 / 100 * var(--modal-width));
		margin-bottom: calc(3 / 100 * var(--modal-width));
		white-space: nowrap;
		display: block;
	}

	:global(.half) .top {
		font-size: calc(6 / 100 * var(--modal-width));
		margin-bottom: calc(7 / 100 * var(--modal-width));
	}

	.weapon-item {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: solid #dcd8cd;
		border-width: 3px 0;
		font-size: x-large;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.counter .weapon-item {
		border: 0;
	}

	.weapon-list {
		height: 100%;
		width: 100%;
		padding: 0 10%;
		background-color: #dcd8cd;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		text-align: center;
		color: #3a4156;
		line-height: 1.2rem;
	}
	.counter .weapon-list {
		background-color: transparent;
	}

	.weapon-content {
		display: inline-block;
		padding: 5%;
		width: 50%;
	}

	.weapon-content button {
		font-size: small;
		aspect-ratio: 8.75 / 10;
		position: relative;
		vertical-align: middle;
		width: 100%;
	}
	:global(.mobile) .weapon-content button {
		font-size: xx-small;
	}

	.weapon-content.active button::after,
	.weapon-content.active button::before {
		position: absolute;
		right: 0;
		top: 0;
	}

	.weapon-content.active button::after {
		display: block;
		content: '';
		width: 100%;
		height: calc(100% - 0.4rem);
		border: solid #bed634;
		border-width: 0.2rem 0;
		border-radius: 0.3rem;
	}
	.weapon-content.active button::before {
		content: '✔';
		font-size: 1.2rem;
		color: #759a28;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #bed634;
		width: 20%;
		height: 20%;
		z-index: +1;
		border-top-right-radius: 0.5em;
	}

	.text {
		margin-top: auto;
		height: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.counter .text {
		height: unset;
		margin-bottom: -1rem;
	}

	.text :global(span) {
		color: #f0b164;
	}

	@media screen and (max-width: 800px) and (min-width: 500px) {
		.weapon-item {
			font-size: medium;
		}
	}

	:global(.mobile) .text {
		height: 30%;
	}
	:global(.mobile) .counter .text {
		height: unset;
		margin-bottom: -1rem;
	}
	:global(.mobile) .weapon-item {
		font-size: small;
	}
</style>
