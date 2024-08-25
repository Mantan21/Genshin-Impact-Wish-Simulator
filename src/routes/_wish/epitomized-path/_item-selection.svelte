<script>
	import { getContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import {
		chronicledCourse as chCourse,
		course as wpCourse,
		bannerList,
		activeBanner,
		activeVersion
	} from '$lib/store/app-stores';
	import { getCharDetails, getWpDetails } from '$lib/helpers/gacha/itemdrop-base';
	import { playSfx } from '$lib/helpers/audio/audio';
	import hotkeys from 'hotkeys-js';

	import ButtonModal from '$lib/components/ButtonModal.svelte';
	import FatepointSVG from './_svg-background.svelte';
	import InventoryItem from '../../_inventory/_inventory-item.svelte';

	const { featured = [], type: bannerType } = $bannerList[$activeBanner];
	const featuredWp = featured.map(({ name }) => getWpDetails(name));
	const isChronicled = bannerType.match('chronicled');

	const getChronicledData = (course) => {
		if (bannerType.match('weapon')) return null;
		const { selected, type } = course;
		if (type === 'weapon') return getWpDetails(selected);
		return getCharDetails(selected);
	};

	$: ({ point, type: itemType } = isChronicled ? $chCourse : $wpCourse);
	$: selectedData = featuredWp[$wpCourse.selected] || getChronicledData($chCourse);
	$: hasCourse = !!selectedData?.name;
	$: steps = $activeVersion.patch >= 5.0 ? 1 : 2;

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
		if (hasCourse || isChronicled) return;

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

<div class="item-picker" class:counter={hasCourse} class:isChronicled>
	<div class="bg">
		<FatepointSVG flat={!hasCourse} {point} steps={isChronicled ? 1 : steps} />
	</div>

	{#if !isChronicled}
		<h2 class="top card-stroke">{$t('epitomizedPath.selectWeapon')}</h2>
	{:else if hasCourse}
		<h2 class="top">{$t('epitomizedPath.setFor')}</h2>
		<div class="note">{$t('epitomizedPath.dropType', { values: { itemType: $t(itemType) } })}</div>
	{:else}
		<h2 class="top float">{$t('epitomizedPath.notSetYet')}</h2>
	{/if}

	<!--  -->
	<div class="item-wrapper">
		<div class="item-row">
			{#if hasCourse}
				{@const { name, weaponType } = selectedData || {}}
				{@const isWp = !!weaponType || bannerType.match('weapon')}
				{@const localName = isWp ? $t(name) : $t(`${name}.name`)}
				{@const type = isWp ? 'weapon' : 'character'}
				<div class="item-col">
					<button style="pointer-events: none; transform: scale(.9)">
						<InventoryItem noStars itemdata={{ name, weaponType, localName, rarity: 5, type }} />
					</button>
				</div>
			{:else}
				{#each featuredWp as { name, weaponType }, i}
					<div class="item-col" class:active={targetActive === i} on:click={() => select(i)}>
						<button>
							<InventoryItem
								noStars
								itemdata={{ name, weaponType, localName: $t(name), rarity: 5, type: 'weapon' }}
							/>
						</button>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Weapon Epitomized -->
		{#if !isChronicled}
			<div class="text card-stroke">
				<div>
					{#if hasCourse}
						{$t('epitomizedPath.fatePoint')} : <span>{$wpCourse.point}</span>/{steps}
					{:else if targetActive === null}
						{$t('epitomizedPath.selectWeapon')}
					{:else}
						{@html $t('epitomizedPath.chartCourseOf', {
							values: { target: `<span> ${$t(featuredWp[targetActive].name)} </span>` }
						})}
					{/if}
				</div>
			</div>

			<!-- Chronicled Epitomized -->
		{:else if hasCourse}
			<div class="text card-stroke">
				<div>
					{$t('epitomizedPath.fatePoint')} : <span>{point}</span>/1
				</div>
			</div>
		{/if}
	</div>

	<div class="button">
		{#if hasCourse}
			<ButtonModal on:click={cancelCourse} type="cancel">
				{$t('epitomizedPath.cancelCourse')}
			</ButtonModal>
		{:else if !isChronicled}
			<ButtonModal on:click={() => setCourse(targetActive)} disabled={targetActive === null}>
				{$t('epitomizedPath.chartCourse')}
			</ButtonModal>
		{/if}
	</div>
</div>

<style>
	.item-picker {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: #383b40;
	}
	.item-picker,
	.item-picker > div {
		position: relative;
		padding: 5%;
	}
	.item-picker .bg {
		position: absolute;
		width: 100%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.counter.item-picker .bg {
		width: 85%;
		top: 47%;
	}

	h2.top {
		font-size: calc(4.75 / 100 * var(--modal-height));
		margin-bottom: calc(4 / 100 * var(--modal-height));
		display: block;
		position: relative;
	}

	h2.float.top {
		color: #aa9077;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 75%;
		transform: translate(-50%, -50%);
	}
	.note {
		font-size: calc(2.75 / 100 * var(--modal-height));
		padding: 0 !important;
		position: absolute !important;
		top: 15%;
		left: 50%;
		width: 75%;
		color: #ea930e;
		transform: translateX(-50%);
	}

	.item-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: solid #dcd8cd;
		border-width: 3px 0;
		font-size: x-large;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
	.isChronicled .item-wrapper,
	.counter .item-wrapper {
		border: none;
	}

	.item-row {
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
	.isChronicled .item-row {
		background-color: transparent;
	}
	.counter .item-row {
		background-color: transparent;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	@media screen and (min-width: 800px) {
		main:not(.mobile) .counter .item-row {
			top: 47%;
		}
	}

	.item-col {
		display: inline-block;
		padding: 5%;
		width: 45%;
	}
	@media screen and (max-width: 800px) {
		.item-picker:not(.isChronicled) .item-col {
			transform: translateY(2.5%);
		}
	}

	.item-col button {
		font-size: small;
		aspect-ratio: 8.75 / 10;
		position: relative;
		width: 100%;
	}

	.item-col.active button::after,
	.item-col.active button::before {
		position: absolute;
		right: 0;
		top: 0;
	}

	.item-col.active button::after {
		display: block;
		content: '';
		width: 100%;
		height: calc(100% - 0.4rem);
		border: solid #bed634;
		border-width: 0.2rem 0;
		border-radius: 0.3rem;
	}
	.item-col.active button::before {
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
		font-size: calc(0.045 * var(--modal-height));
	}

	.counter .text {
		height: unset;
		margin-bottom: -1rem;
	}

	.text :global(span) {
		color: #ea930e;
	}
</style>
