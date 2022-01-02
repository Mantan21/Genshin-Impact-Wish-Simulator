<script>
	import OverlayScrollbars from 'overlayscrollbars';
	import {
		bannerList,
		bannerPhase,
		fatePoint,
		fatepointCounterActive,
		patchVersion,
		showFatepointCounter,
		viewportWidth
	} from '$lib/store/stores';
	import { fade } from 'svelte/transition';
	import { getName } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';
	import { localFatePoint } from '$lib/store/localstore';

	import FatepointTribal from './FatepointTribal.svelte';
	import InventoryItem from '$lib/inventory/InventoryItem.svelte';
	import PopUp from '$lib/utility/PopUp.svelte';

	$: half = $viewportWidth < 500;

	$: weapons = $bannerList.find(({ type }) => type === 'weapon').weapons;

	let weaponHeight;
	$: itemWidth = (60 / 100) * weaponHeight;
	$: itemStyle = `width: ${itemWidth}px; height:${itemWidth + 20}px`;

	let showCancelConfirmation = false;

	/**
	 * Weapon Target
	 */
	let targetActive = null;
	const select = (i) => {
		playSfx();
		targetActive = i;
	};

	const setCourse = () => {
		if (targetActive === null) return;
		const localFate = localFatePoint.init($patchVersion, $bannerPhase, targetActive);
		localFate.set(0);
		playSfx();
		handleClose();
	};

	const cancelCourse = () => {
		showCancelConfirmation = true;
		playSfx();
	};

	const confirmCancel = () => {
		const localFate = localFatePoint.init($patchVersion, $bannerPhase, targetActive);
		targetActive = null;
		fatepointCounterActive.set(false);
		fatePoint.set(0);
		localFate.remove();
		handleClose();
		showCancelConfirmation = false;
		return;
	};

	const checkSelected = () => {
		const localFate = localFatePoint.init($patchVersion, $bannerPhase, targetActive);
		const selected = localFate.getSelected();
		if (selected === null) return;
		targetActive = selected;
		fatepointCounterActive.set(true);
		fatePoint.set(localFatePoint.getPoint());
		return;
	};

	let content;
	$: if ($showFatepointCounter) {
		// eslint-disable-next-line no-undef
		if (globalThis.window) {
			OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
			checkSelected();
		}
	} else {
		fatepointCounterActive.set(false);
	}

	/**
	 *
	 */

	const handleClose = () => {
		showFatepointCounter.set(false);
	};
</script>

<PopUp
	show={showCancelConfirmation}
	on:confirm={confirmCancel}
	on:cancel={() => {
		showCancelConfirmation = false;
	}}
>
	<div
		class="pop-up"
		style="display: flex; width:100%; height:100%; justify-content: center; align-items:center;"
	>
		<div>
			Do you wish to cancel your curent Course ?
			<br />
			<span style="font-size: smaller; padding: 2rem">
				Cancelation will reset your accumulated Fate Points
			</span>
		</div>
	</div>
</PopUp>

{#if $showFatepointCounter}
	<section class="popup" transition:fade={{ duration: 80 }}>
		<div class="popup-content">
			<img
				src="/assets/images/utility/fatepointbook{half ? '-half' : ''}.webp"
				alt="Fatepoint Background"
			/>
			<button
				class="close"
				on:click={() => {
					handleClose();
					playSfx('close');
				}}
			>
				<i class="gi-close" />
			</button>
			<div class="container">
				{#if !half}
					<div class="description">
						<div class="content" bind:this={content}>
							<p>
								"Epitomized Path" is a wish mechanic in "Epitome Invocation." Travelers can chart a
								course towards a specific 5-star promotional weapon they hope to obtain.
							</p>
							<p>
								· Once you have charted a course towards your chosen weapon, you will obtain 1 Fate
								Point upon <span>
									receiving a 5-star weapon that is not the one that you chose
								</span>. You can obtain a maximum of 2 Fate Points.
							</p>
							<p>
								· Once you've reached the maximum amount of Fate Points, the next 5-star weapon you
								choose will be the one you have chosen through "Epitomized Path".
							</p>
							<p>
								· When you obtain the chosen weapon in Epitome Invocation through Epitomized Path,
								<span> the accumulated Fate Points will be cleared </span>.
							</p>
							<p>
								· If you do not use Epitomized Path to obtain a weapon, you will not accumulate Fate
								Points.
							</p>
							<p>
								· The charted course towards a certain weapon can be changed or cancelled. However,
								after doing so, any current Fate Points will be cleared.
							</p>
							<p>
								· At the end of the current period of Epitome Invocation, any current Fate Points
								will be cleared.
							</p>
						</div>
					</div>
				{/if}
				<div class="selector" class:counter={$fatepointCounterActive}>
					<div class="bg">
						<FatepointTribal mode={$fatepointCounterActive ? 'counter' : 'bg'} />
					</div>
					<div class="top">Select Weapon</div>
					<div class="weapon-item">
						<div class="weapon-list" bind:clientHeight={weaponHeight}>
							{#if $fatepointCounterActive}
								<button class="weapon-content" style={itemStyle}>
									<InventoryItem
										name={weapons[targetActive].name}
										weaponType={weapons[targetActive].type}
										type="weapon"
										rarity={5}
										width={itemWidth}
									/>
								</button>
							{:else}
								{#each weapons as { name, type }, i}
									<button
										class="weapon-content"
										class:active={targetActive === i}
										style={itemStyle}
										on:click={() => select(i)}
									>
										<InventoryItem
											{name}
											weaponType={type}
											type="weapon"
											rarity={5}
											width={itemWidth}
										/>
									</button>
								{/each}
							{/if}
						</div>
						<div class="text">
							<div>
								{#if $fatepointCounterActive}
									Fate Points : <span>{$fatePoint}</span>/2
								{:else if targetActive === null}
									Select Weapon
								{:else}
									Chart Course of <span> {getName(weapons[targetActive].name)} </span>
								{/if}
							</div>
						</div>
					</div>
					<div class="button">
						{#if $fatepointCounterActive}
							<button on:click={cancelCourse}>
								<i class="gi-times" /> Cancel Course
							</button>
						{:else}
							<button on:click={setCourse}>
								<i class="gi-circle-o" /> Chart Course
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(2px);
	}

	.popup-content {
		width: 1000px;
		max-width: 90%;
		min-width: 250px;
		text-align: center;
		position: relative;
	}

	:global(.mobile) .popup-content {
		max-width: 150vh;
	}

	.popup-content img {
		position: relative;
		width: 100%;
	}

	.close {
		position: absolute;
		top: 1.5rem;
		right: -0.2rem;
		z-index: +10;
	}
	.gi-close {
		font-size: 1.3rem;
		background-color: transparent;
		color: #383b40;
	}
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
	}
	.container > div {
		flex-basis: 50%;
		flex-grow: 1;
		padding: 3% 7%;
	}
	.container .content {
		width: 100%;
		height: 82%;
		overflow: hidden;
		margin: 22% 0 0;
		text-align: left;
		color: #aa8e77;
	}

	.selector {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: #383b40;
	}
	.selector,
	.selector > div {
		position: relative;
		padding: 5%;
	}
	.selector .bg {
		position: absolute;
		width: 90%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.counter.selector .bg {
		width: 110%;
		top: 48%;
	}

	.top {
		font-size: 2rem;
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
		margin: 10% 5%;
		width: 100%;
		height: 75%;
		font-size: small;
		position: relative;
	}
	.counter .weapon-content {
		transform: scale(0.75);
	}
	:global(.mobile) .weapon-content {
		font-size: xx-small;
	}

	.weapon-content.active::after,
	.weapon-content.active::before {
		position: absolute;
		right: 0;
		top: 0;
	}

	.weapon-content.active::after {
		display: block;
		content: '';
		width: 100%;
		height: calc(100% - 0.4rem);
		border: solid #bed634;
		border-width: 0.2rem 0;
		border-radius: 0.5rem;
	}
	.weapon-content.active::before {
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
		border-top-right-radius: 0.5rem;
	}

	.text {
		margin-top: auto;
		height: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	span {
		color: #f0b164;
	}

	.counter .text {
		height: unset;
		margin-bottom: -1rem;
	}

	.button button {
		border-radius: 40px;
		color: white;
		background-color: #4a5265;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 3rem 5px 5px;
		transition: all 0.2s;
	}

	:global(.mobile) .button button {
		padding: 0.2rem 2rem 0.2rem 0;
	}
	button i {
		width: 2rem;
		height: 2rem;
		background-color: #353533;
		border-radius: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
		margin-right: 2rem;
	}
	.button button:hover {
		background-color: rgb(51, 57, 71);
	}

	.gi-times {
		color: #3f9ad1;
	}
	.gi-circle-o {
		color: #ffc107;
	}

	@media screen and (max-width: 800px) and (min-width: 500px) {
		.top {
			font-size: 1rem;
		}
		.weapon-item {
			font-size: medium;
		}
	}

	:global(.mobile) .top {
		font-size: medium;
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
