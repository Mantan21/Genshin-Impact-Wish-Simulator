<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import {
		bannerActive,
		bannerList,
		mobileMode,
		pageActive,
		stardust,
		starglitter,
		isAcquaintUsed,
		acquaint,
		intertwined,
		unlimitedFates,
		patchVersion,
		assets
	} from '$lib/store/stores';
	import Icon from '$lib/components/utility/Icon.svelte';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import browserState from '$lib/helpers/browserState';
	import { outfits } from '$lib/data/outfits.json';

	import NoticeMark from '$lib/components/utility/NoticeMark.svelte';
	import ButtonGeneral from '$lib/components/utility/ButtonGeneral.svelte';

	$: fateQty = $isAcquaintUsed ? $acquaint : $intertwined;
	$: fateType = $isAcquaintUsed ? 'acquaint' : 'intertwined';
	$: activeBanner = $bannerList[$bannerActive];
	$: bannerActiveType = activeBanner.type + (isNaN(activeBanner.index) ? '' : activeBanner.index);
	$: multiRollPrice = bannerActiveType === 'beginner' ? 8 : 10;

	let openedNotices = [];
	$: check = outfits.filter(({ version }) => version?.toString() === $patchVersion) || [];
	$: outfitsPromo = check.length > 0;
	$: check.forEach(({ version }) => {
		const v = version.toString();
		if (openedNotices.includes(v)) return;
		openedNotices = [...openedNotices, `outfits-${v}`, `recomended-${v}`];
		return;
	});

	const changePage = (page) => {
		pageActive.set(page);
		browserState.set(page);
		if (['inventory', 'history'].includes(page)) return playSfx(page);
		if (page === 'shop') return playSfx('shopopen');
		return playSfx();
	};

	const dispatch = createEventDispatcher();
	const handleSingleRollClick = () => {
		playSfx('roll');
		dispatch('singleRoll');
	};
	const handleMultiRollClick = () => {
		playSfx('roll');
		dispatch('multiRoll');
	};

	let EpitomizedButton;
	onMount(async () => {
		EpitomizedButton = (await import('$lib/components/wish/epitomizedPath/EpitomizedButton.svelte'))
			.default;
	});
</script>

<div id="footer" style="width: 100%; height: 100%">
	<div class="footer-info">
		{#if !$mobileMode}
			<svelte:component this={EpitomizedButton} />
			<div class="wish">
				<div class="starglitter">
					<Icon type="starglitter" />
					<span> {$starglitter} </span>
				</div>
				<div class="stardust">
					<Icon type="stardust" />
					<span> {$stardust} </span>
				</div>
			</div>
		{/if}
	</div>

	<div class="row">
		<div class="left menu-button">
			<ButtonGeneral on:click={() => changePage('shop')}>
				{#if outfitsPromo}
					<NoticeMark name={openedNotices} style="transform: translateX(70%) translateY(-80%)" />
				{/if}
				{$t('shop.text')}
			</ButtonGeneral>

			<ButtonGeneral on:click={() => changePage('inventory')}>
				{$t('inventory.text')}
			</ButtonGeneral>
			<ButtonGeneral on:click={() => changePage('history')}>
				{$t('history.text')}
			</ButtonGeneral>
		</div>
		<div class="right roll-button">
			{#if bannerActiveType !== 'beginner'}
				<button
					class="single wish-button"
					on:click={handleSingleRollClick}
					style="background-image: url({$assets['button.webp']})"
				>
					<div class="top">{$t('wish.rollButton', { values: { count: '×1' } })}</div>
					<div class="bottom">
						<Icon type={fateType} />
						<span style="margin-left: 7px" class:red={fateQty < 1 && !$unlimitedFates}> x 1 </span>
					</div>
				</button>
			{/if}

			<button
				class="ten wish-button"
				on:click={handleMultiRollClick}
				style="background-image: url({$assets['button.webp']})"
			>
				{#if bannerActiveType === 'beginner'}
					<span class="discount">-20%</span>
				{/if}
				<div class="top">{$t('wish.rollButton', { values: { count: '×10' } })}</div>
				<div class="bottom">
					<Icon type={fateType} />
					<span style="margin-left: 7px" class:red={fateQty < 10 && !$unlimitedFates}>
						x {multiRollPrice}
					</span>
				</div>
			</button>
		</div>
	</div>
</div>

<style>
	#footer {
		position: relative;
	}

	.red {
		color: #de2f22 !important;
	}

	.footer-info {
		position: absolute;
		left: 5%;
		bottom: 75%;
		align-items: center;
		display: flex;
		flex-direction: column;
		pointer-events: none;
	}

	.wish > div {
		display: inline-flex;
		align-items: center;
		margin-right: 5px;
		padding: 2px 20px 2px 2px;
		font-size: 0.9rem;
	}
	.wish span {
		margin-left: 10px;
		color: #fff;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
	}

	.wish-button {
		transform: scale(1);
		transition: all 0.2s;
		color: #4a5265;
		text-decoration: none;
		position: relative;
	}

	.wish-button:active {
		filter: brightness(85%);
	}
	button:active {
		transform: scale(0.95);
	}

	.row {
		width: 100%;
		height: 100%;
		padding: 0 5%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.roll-button {
		text-align: right;
	}

	.roll-button button {
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		width: 230px;
		aspect-ratio: 355/88;
		margin: 0 5px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #a49a90;
		transition: all 0.2s;
	}
	.roll-button button .bottom {
		display: flex;
		align-items: center;
	}

	.discount {
		background-color: #8ab958;
		position: absolute;
		z-index: +2;
		left: 15%;
		top: -5%;
		border-radius: 20px;
		color: #fff;
		transform: scale(0.8) translateX(-50%);
		padding: 0.2rem 0.5rem;
	}

	@media screen and (min-width: 750px) {
		.discount {
			font-size: 0.7rem;
		}
		.roll-button {
			white-space: nowrap;
		}
	}

	/* mobile */
	:global(.mobile) .row {
		padding: 1rem 0;
		align-items: flex-end;
	}

	:global(.mobile .menu-button) {
		padding-left: 1%;
		white-space: nowrap;
	}
	:global(.mobile) .roll-button {
		margin-right: 40px !important;
		white-space: nowrap;
	}
	:global(.mobile) .roll-button button {
		font-size: 0.75rem;
	}
	:global(.mobile) .roll-button :global(img) {
		transform: scale(0.7);
	}
	:global(.mobile) .bottom {
		margin-top: -3px;
	}

	/* Media Query */

	@media screen and (max-width: 925px) {
		button {
			padding: 2px 15px;
			margin: 2px 5px;
		}

		.roll-button button {
			width: 175px;
			margin: 0;
		}
		.roll-button :global(img) {
			transform: scale(0.8);
		}
	}

	@media screen and (max-width: 700px) {
		.roll-button {
			width: 100%;
		}
	}
	@media screen and (max-width: 550px) {
		.menu-button {
			width: 100%;
		}
		.roll-button {
			width: auto;
		}
	}

	@media screen and (max-width: 400px) {
		.roll-button button {
			width: 140px;
			margin: 0;
		}
		.roll-button :global(img) {
			transform: scale(0.7);
		}
		.roll-button .bottom {
			margin-top: -3px;
		}
	}
</style>
