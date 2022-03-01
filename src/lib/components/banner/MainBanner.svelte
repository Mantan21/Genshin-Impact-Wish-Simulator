<script>
	import {
		acquaint,
		intertwined,
		isAcquaintUsed,
		bannerList,
		bannerActive,
		stardust,
		starglitter,
		backsound,
		patchVersion,
		bannerPhase,
		unlimitedFates
	} from '$lib/store/stores';
	import { fly } from 'svelte/transition';
	import { APP_TITLE } from '$lib/env';
	import Wish, { roll } from '$lib/functions/wish/wish';
	import { localBalance } from '$lib/store/localstore';
	import playSfx from '$lib/functions/audio';

	// Components
	import Obtained from '$lib/components/utility/Obtained.svelte';
	import WishResult from './parts/WishResult.svelte';
	import Header from './parts/Header.svelte';
	import Footer from './parts/Footer.svelte';
	import Meteor from './parts/Meteor.svelte';
	import BannerItem from './BannerItem.svelte';

	let showWish = false;
	let showMeteor = false;
	let showObtainedMilestone = false;
	let singleMeteor = true;
	let meteorStar = 3;
	let skipSplashOneByOne = false;
	let showConvertPopup = false;
	let rollCount = 0;
	let wishResult = [];
	let WishFunction;

	$: nowBanner = $bannerList[$bannerActive];
	$: bannerToRoll = nowBanner.type;
	$: balance = $isAcquaintUsed ? $acquaint : $intertwined;

	// Load Wish Configuration When changing banner Version
	const preloadWish = (version, phase) => {
		if (!version || !phase) return;
		WishFunction = Wish.init(version, phase);
	};
	$: preloadWish($patchVersion, $bannerPhase);

	// ============================================ //
	const getIndexOfEventBanner = () => {
		const events = $bannerList.filter(({ type }) => type === 'events');
		const index = events.findIndex(({ character }) => character.name === nowBanner.character.name);
		return index;
	};

	const doRoll = async (count, bannerToRoll) => {
		rollCount = count;
		const tmp = [];

		const balanceNeededToRoll = bannerToRoll === 'beginner' && count > 1 ? 8 : count;
		const indexOfEventBanner = bannerToRoll === 'events' ? getIndexOfEventBanner() : 0;

		if (balance < balanceNeededToRoll && !$unlimitedFates) return (showConvertPopup = true);
		for (let i = 0; i < count; i++) {
			const result = await roll(bannerToRoll, indexOfEventBanner, WishFunction);
			tmp.push(result);
		}

		wishResult = tmp;
		handleMeteorAnimation();
		if ($unlimitedFates) return;
		updateMilestones();
		updateFatesBalance(bannerToRoll);
	};

	const updateFatesBalance = (banner) => {
		const isAcquaint = ['beginner', 'standard'].includes(banner);
		const funds = isAcquaint ? acquaint : intertwined;
		funds.update((n) => {
			const afterUpdate = n - (banner === 'beginner' && rollCount > 1 ? 8 : rollCount);
			localBalance.set(isAcquaint ? 'acquaint' : 'intertwined', afterUpdate);
			return afterUpdate;
		});
	};

	const updateMilestones = () => {
		const update = (type) => {
			const qty = wishResult.reduce((prev, { fateQty, fateType }) => {
				return prev + (fateType === type ? fateQty : 0);
			}, 0);

			const milestone = type === 'stardust' ? stardust : starglitter;
			milestone.update((n) => {
				const afterUpdate = n + qty;
				localBalance.set(type, afterUpdate);
				return afterUpdate;
			});
		};

		update('starglitter');
		update('stardust');
	};

	const countMilestone = (fate) => {
		return wishResult.reduce((a, { fateType, fateQty }) => {
			return a + (fateType === fate ? fateQty : 0);
		}, 0);
	};

	const handleMeteorAnimation = () => {
		backsound.set(false);
		const star = wishResult.map(({ rarity }) => rarity);
		singleMeteor = star.length === 1;
		meteorStar = 3;
		if (star.includes(4)) meteorStar = 4;
		if (star.includes(5)) meteorStar = 5;
		showMeteor = true;
	};

	const cancelExchange = () => {
		showConvertPopup = false;
		playSfx();
	};

	const confirmPopup = () => {
		doRoll(rollCount, bannerToRoll);
		showConvertPopup = false;
		playSfx();
	};

	const showSplashResult = () => {
		showMeteor = false;
		showWish = true;
	};

	const skiped = () => {
		if (rollCount > 8) skipSplashOneByOne = true;
		showMeteor = false;
		showWish = true;
	};

	let stardustObtained = 0;
	let starglitterObtained = 0;

	const checkObtained = () => {
		skipSplashOneByOne = false;
		if ($unlimitedFates) {
			showWish = false;
			return backsound.set(true);
		}

		stardustObtained = countMilestone('stardust');
		starglitterObtained = countMilestone('starglitter');
		if (stardust < 1 && starglitter < 1) backsound.set(true);
		else showObtainedMilestone = true;
		showWish = false;
	};

	const closeMilestone = () => {
		showObtainedMilestone = false;
		playSfx('close');
		backsound.set(true);
	};
</script>

<svelte:head>
	<title>{APP_TITLE}</title>
</svelte:head>

{#if showObtainedMilestone}
	<Obtained
		items={{ starglitter: starglitterObtained, stardust: stardustObtained }}
		on:close={closeMilestone}
	/>
{/if}
{#if showWish}
	<WishResult list={wishResult} on:wishEnd={checkObtained} {skipSplashOneByOne} />
{/if}

<section>
	<div class="col top">
		<Header />
	</div>

	<Meteor
		{showMeteor}
		{singleMeteor}
		{meteorStar}
		{showConvertPopup}
		{rollCount}
		on:cancelPopup={cancelExchange}
		on:confirmPopup={confirmPopup}
		on:endAnimation={showSplashResult}
		on:skiped={skiped}
	/>
	<div class="col banner">
		<div class="item">
			<BannerItem />
		</div>
		<div class="col button" in:fly={{ y: 20, duration: 1000 }}>
			<Footer
				on:multiRoll={() => doRoll(10, bannerToRoll)}
				on:singleRoll={() => doRoll(1, bannerToRoll)}
			/>
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		overflow: hidden;
		background-image: url('/assets/images/background/wish-background.webp');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}

	.top,
	.banner,
	.button,
	.item {
		display: block;
		width: 100%;
	}

	.top {
		min-height: 70px;
	}
	.banner,
	.item {
		height: 100%;
	}
	.item {
		position: relative;
	}
	.banner {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.button {
		height: 120px;
	}

	/* Mobile */
	:global(.mobile) section {
		flex-direction: row;
	}
	:global(.mobile) .top {
		height: 100%;
		width: min-content;
	}
	:global(.mobile) .banner {
		width: 120%;
		margin-left: -20px;
	}
	:global(.mobile) .button {
		height: 50px;
		margin-bottom: 0.2rem;
	}
</style>
