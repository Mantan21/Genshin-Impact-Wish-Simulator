<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import positionToStyle from '$lib/helpers/cssPosition';
	import { getName } from '$lib/helpers/nameText';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import Icon from '$lib/components/utility/Icon.svelte';
	import ShareScreenshot from '$lib/components/utility/ShareScreenshot.svelte';
	import { animeoff, assets } from '$lib/store/stores';

	export let preview = false;
	export let list = [];
	let clientHeight;

	const sortByType = (a, b) => {
		if (a.type > b.type) return 1;
		if (b.type > a.type) return -1;
		return 0;
	};

	const sortByName = (a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	};

	let sortedWish = [];
	const getList = (preview, previewlist) => {
		if (preview) {
			sortedWish = previewlist;
			return;
		}

		const item = (star) =>
			list
				.filter(({ rarity }) => rarity === star)
				.sort(sortByName)
				.sort((a, b) => b.isNew - a.isNew)
				.sort(sortByType);
		const threeStar = list.filter(({ rarity }) => rarity === 3);
		sortedWish = [...item(5), ...item(4), ...threeStar];
	};

	$: getList(preview, list);

	let container;
	let encoded;

	onMount(async () => {
		const itemBox = container.querySelectorAll('.item-box, .shadow');
		itemBox.forEach((el) => {
			if ($animeoff) return el.classList.remove('animate');
			el.addEventListener('animationend', () => el.classList.remove('animate'));
		});

		OverlayScrollbars(container, {
			sizeAutoCapable: false,
			className: 'os-theme-light',
			scrollbars: { visibility: 'hidden' }
		});
		if (preview) return;
		playSfx('resultList');

		const data = sortedWish
			.map(({ name, rarity, type, isNew, fateType, stelaFortuna, outfit }) => {
				return `${name}/${rarity}/${type}/${+isNew}/${fateType}/${+stelaFortuna}/${outfit}`;
			})
			.join('|');
		encoded = btoa(data);
	});

	const dispatch = createEventDispatcher();
	const closeHandle = () => {
		dispatch('wishEnd');
	};
</script>

<svg viewBox="0 0 151.000000 656.000000" height="0" width="0" style="position: absolute;">
	<clipPath
		id="wishframe"
		transform="scale(0.00066225165562914 0.00015455950540958)"
		clipPathUnits="objectBoundingBox"
	>
		<path
			d="M734 6419 c-25 -29 -100 -76 -199 -127 -125 -64 -165 -117 -165 -217
			0 -22 -3 -50 -6 -63 -9 -33 -83 -72 -155 -82 -68 -10 -79 -19 -79 -67 0 -24
			-7 -37 -32 -54 -18 -12 -43 -34 -55 -48 l-22 -26 -1 -2502 c0 -1542 4 -2503 9
			-2503 5 0 13 -9 16 -20 4 -11 23 -28 43 -38 32 -15 37 -22 40 -57 4 -49 23
			-65 76 -65 47 0 113 -28 140 -58 12 -14 21 -45 26 -90 13 -117 54 -164 215
			-250 55 -28 114 -66 132 -82 18 -17 35 -30 39 -30 4 0 23 15 44 34 21 19 80
			56 131 82 153 79 197 131 210 252 4 39 13 70 25 84 27 30 93 58 140 58 53 0
			72 16 76 65 3 35 8 42 40 57 20 10 39 27 43 38 3 11 11 20 16 20 5 0 9 961 9
			2503 l-1 2502 -22 26 c-12 14 -37 36 -54 48 -26 17 -33 30 -33 54 0 48 -11 57
			-79 67 -72 10 -146 49 -155 82 -3 13 -6 41 -6 63 0 100 -40 153 -165 217 -106
			54 -153 84 -191 119 l-30 29 -20 -21z"
		/>
	</clipPath>
</svg>

{#if !preview}
	<button class="close" on:click={closeHandle}>
		<i class="gi-close" />
	</button>
{/if}

<div class="scroll" bind:this={container}>
	<div class="container" class:animate={!preview}>
		<div class="wishlist" bind:clientHeight style="--card-height: {clientHeight}px">
			{#each sortedWish as { name, rarity, weaponType, type, vision, wishBoxPosition, stelaFortuna, isNew, fateType, fateQty, outfit, outfitOffset }, i (i)}
				<div class="item-box" class:animate={!preview} style="animation-delay: {0.5 + i * 0.1}s">
					<div
						id="wish{i}"
						class="item star{rarity} {type}"
						on:click|preventDefault={() => playSfx()}
					>
						{#if isNew}
							<div class="new">{$t('wish.result.new')}</div>
						{/if}
						<div class="item-body">
							<div
								class="item-content"
								style="background-image: url({$assets['resultcard-bg.svg']})"
							>
								<div class="pic">
									{#if type === 'weapon'}
										<img
											src={$assets[name]}
											alt={name}
											class="wishpic {weaponType}-item"
											style={positionToStyle(wishBoxPosition)}
											on:error={(e) => e.target.remove()}
											crossorigin="anonymous"
										/>
									{:else}
										<img
											src={$assets[`splash-art/${outfit || name}`]}
											alt={name}
											class="wishpic"
											on:error={(e) => e.target.remove()}
											crossorigin="anonymous"
											style={positionToStyle(outfitOffset || wishBoxPosition)}
										/>
									{/if}

									<div class="info">
										<div class="icon" style="width: 100%;">
											{#if type === 'weapon'}
												<img
													src={$assets[`${weaponType}-white.svg`]}
													alt="{weaponType} icon"
													style="width: 73%; height: auto"
												/>
											{:else if isNew}
												<img
													src={$assets[`icon-${vision}.svg`]}
													alt="Vision {vision}"
													class="{vision} filter-drop vision"
													style="height: calc(15 / 100 * var(--card-height))"
												/>
											{/if}
										</div>

										{#if (isNew && type === 'character') || type === 'weapon'}
											<div class="star">
												{#each Array(rarity) as _, i}
													<div class="i gi-star" />
												{/each}
											</div>
										{/if}

										{#if type === 'character' && fateType}
											<div class="masterless {fateType}">
												<Icon type={fateType} width="80%" />
												<span>{fateQty}</span>
											</div>
										{/if}

										{#if stelaFortuna}
											<div class="stella stella{rarity}">
												<img
													src={$assets[`stella-fortuna-${rarity}star.webp`]}
													alt="Stella Formula"
												/>
											</div>
										{/if}
									</div>

									{#if type === 'character' && fateType}
										<div class="cover" />
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="shadows" style="--card-height: {clientHeight}px">
			{#each sortedWish as { rarity, type, fateType }, i}
				<div
					class="shadow shadow{rarity}"
					class:animate={!preview}
					style="animation-delay: {0.5 + i * 0.1}s"
				>
					{#if fateType && type === 'character'}
						<span class="convertion"> {$t('wish.result.convertion')} </span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

{#if !preview}
	<div class="share">
		<ShareScreenshot encodedData={encoded} page="wishlist" item={getName(sortedWish[0].name)} />
	</div>
{/if}

<style>
	.scroll {
		width: 100%;
		height: 100%;
		display: block;
	}
	.container {
		width: 100% !important;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.container.animate::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #fff;
		opacity: 1;
		animation: reveal forwards 1s 1;
		pointer-events: none;
	}

	.close {
		position: fixed;
		top: 15px;
		right: 3%;
		z-index: 10;
		opacity: 0;
		animation: fadeIn forwards 1s 1;
	}
	:global(.mobile) .close {
		top: 0.3rem;
		right: 6%;
	}

	/* Wish List */
	.wishlist,
	.shadows {
		display: block;
		height: 40vw;
		max-height: 60vh;
		min-height: 40vh;
		width: 100%;
		padding: 0 20px;
		white-space: nowrap;
		text-align: center;
	}

	:global(.mobile) .wishlist,
	:global(.mobile) .shadows {
		min-height: 70vh;
	}

	:global(.mobile) .wishlist,
	:global(.mobile) .shadows {
		max-height: 72.5vh;
	}

	.item,
	.shadow {
		height: 100%;
		aspect-ratio: 7/30;
		border-radius: 100%;
		filter: drop-shadow(0px 0px 6px rgb(101, 187, 246));
		position: relative;
	}

	.item {
		transition: all 0.2s;
		will-change: transform;
	}
	.item:hover,
	.item.hover {
		transform: scale(1.04);
		/* z-index: +10; */
	}
	.item:hover .cover,
	.item.hover .cover {
		background-color: rgba(0, 0, 0, 0);
	}

	.shadow5,
	.shadow4,
	.item.star4,
	.item.star5 {
		filter: unset;
	}

	.item-box {
		height: 100%;
		display: inline-block;
	}
	.shadows {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: -1;
	}

	.item-box.animate,
	.shadow.animate {
		opacity: 0;
		animation: wishReveal forwards 0.4s 1;
		pointer-events: none;
	}

	.shadow {
		display: inline-block;
		height: 100%;
		border-radius: 100%;
	}
	.shadow span {
		position: absolute;
		left: 50%;
		bottom: -5%;
		color: #fff;
		transform: translateX(-50%);
		-webkit-text-stroke: 0.3px #000;
	}

	.shadow.shadow5 {
		box-shadow: 0 0 4rem rgba(255, 255, 255, 0.5), 0 0 1rem rgb(249, 170, 2),
			0 0 1.4rem rgb(249, 170, 2), 0 0 2rem rgb(249, 121, 2);
		background-color: rgb(249, 170, 2);
		filter: unset;
	}
	.star5 .item-body {
		background-image: linear-gradient(
			to bottom,
			rgb(249, 170, 2),
			rgb(255, 255, 255),
			rgb(249, 170, 2)
		);
	}

	.shadow.shadow4 {
		box-shadow: 0 0 4rem rgba(255, 255, 255, 0.6), 0 0 1rem rgb(138, 3, 161),
			0 0 1.4rem rgb(217, 0, 255), 0 0 2rem rgb(29, 4, 255);
		background-color: rgb(185, 18, 214);
	}
	.star4 .item-body {
		background-image: linear-gradient(
			to bottom,
			rgb(196, 77, 218),
			rgb(255, 255, 255),
			rgb(196, 77, 218)
		);
	}

	.new {
		position: absolute;
		z-index: 10;
		display: block;
		top: 3%;
		left: 80%;
		transform: translateX(-50%);
		padding: 0 0.4rem;
		border-radius: calc(2 / 100 * var(--card-height)) 0;
		color: #fffa66;
		background-color: #c3882a;
		border: 1px solid #fffa66;
		font-size: calc(3 / 100 * var(--card-height));
	}

	.convertion {
		font-size: calc(3 / 100 * var(--card-height));
	}

	.cover {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		transition: all 0.2s;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.item-body {
		height: 100%;
		clip-path: url(#wishframe);
		margin: 0 0.5px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: linear-gradient(to bottom, #aac8f1, #fff, #aac8f1);
	}

	.item-content {
		width: 97%;
		height: 99%;
		clip-path: url(#wishframe);
		background-size: cover;
		background-position: center center;
	}

	.pic {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.pic::after {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50%;
		background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
	}
	.pic img.wishpic {
		position: absolute;
		top: 75%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 180%;
	}

	.weapon .pic img.wishpic {
		top: 50%;
		height: 97%;
		filter: drop-shadow(0.2rem 0.2rem 0.05rem rgb(0, 0, 0));
	}
	.pic > .wishpic.catalyst-item {
		height: 30% !important;
	}

	.stella {
		margin-top: 10%;
	}
	.stella,
	.masterless {
		width: 65%;
		border-radius: 10%;
		overflow: hidden;
		display: block;
		position: relative;
		box-shadow: 0 0 7px rgba(255, 255, 255, 0.7), 0 0 14px rgba(255, 255, 255, 0.5),
			0 0 21px rgba(255, 255, 255, 0.2), 0 0 42px rgba(255, 255, 255, 1);
	}
	.stella::after,
	.masterless span {
		width: 100%;
		font-size: calc(3 / 100 * var(--card-height));
		content: '1';
		display: block;
		position: absolute;
		left: 0;
		bottom: 0;
		color: #fff;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.stella img,
	.masterless img {
		width: 80%;
		height: auto;
	}

	.stella5,
	.starglitter {
		background-image: linear-gradient(to top, #ca8937, #a47853);
	}

	.stella4 {
		background-image: linear-gradient(to top, #a47ab9, #7e78a9);
	}

	.info {
		position: absolute;
		bottom: 10%;
		left: 0;
		width: 100%;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.info .gi-star {
		color: #f7cf33;
		display: inline-block;
		font-size: calc(3.5 / 100 * var(--card-height));
	}

	.share {
		display: flex;
		width: 100%;
		text-align: right;
		justify-content: flex-end;
		align-items: center;
		position: absolute;
		bottom: 5%;
		right: 8%;
		color: #fff;
		font-size: 0.8rem;
		z-index: 999;
	}
	.share span {
		display: flex;
		align-items: center;
	}

	@keyframes wishReveal {
		0% {
			transform: translateX(150%);
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes reveal {
		20% {
			opacity: 1;
		}
		99% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
