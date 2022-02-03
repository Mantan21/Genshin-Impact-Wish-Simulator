<script>
	import {
		acquaint,
		intertwined,
		isAcquaintUsed,
		bannerList,
		bannerActive,
		stardust,
		starglitter,
		backsound
	} from '$lib/store/stores';
	import { APP_TITLE } from '$lib/env';
	import roll from '$lib/functions/wish/roll';
	import playSfx from '$lib/functions/audio';
	import { localBalance } from '$lib/store/localstore';

	// Components
	import Header from './parts/Header.svelte';
	import Footer from './parts/Footer.svelte';
	import Meteor from './parts/Meteor.svelte';
	import Obtained from '$lib/components/utility/Obtained.svelte';
	import BannerItem from './BannerItem.svelte';
	import WishResult from './WishResult.svelte';

	let showWish = false;
	let showMeteor = false;
	let showObtainedMilestone = false;
	let singleMeteor = true;
	let meteorStar = 3;
	let showConvertPopup = false;
	let rollCount = 0;
	let wishResult = [];

	$: activeBanner = $bannerList[$bannerActive];
	$: bannerActiveType = activeBanner
		? activeBanner.type + (isNaN(activeBanner.index) ? '' : activeBanner.index)
		: 'beginner';
	$: balance = $isAcquaintUsed ? $acquaint : $intertwined;

	const doRoll = async (count) => {
		rollCount = count;
		const bannerToRoll = bannerActiveType;
		const balanceNeededToRoll = bannerToRoll === 'beginner' && count > 1 ? 8 : rollCount;
		wishResult = [];
		if (balance < balanceNeededToRoll) {
			showConvertPopup = true;
			return;
		}
		for (let i = 0; i < rollCount; i++) {
			const result = await roll(bannerActiveType);
			wishResult.push(result);
			updateMilestones(result.fateType, result.fateQty);
		}
		handleMeteorAnimation();
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

	const updateMilestones = (type, qty) => {
		if (!type && !qty) return;
		const milestone = type === 'stardust' ? stardust : starglitter;
		milestone.update((n) => {
			const afterUpdate = n + qty;
			localBalance.set(type, afterUpdate);
			return afterUpdate;
		});
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
		doRoll(rollCount);
		showConvertPopup = false;
		playSfx();
	};

	const showSplashResult = () => {
		showMeteor = false;
		showWish = true;
	};

	let stardustObtained = 0;
	let starglitterObtained = 0;

	const checkObtained = () => {
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
	<WishResult list={wishResult} on:wishEnd={checkObtained} />
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
	/>
	<div class="col banner">
		<div class="item">
			<BannerItem />
		</div>
		<div class="col button">
			<Footer on:multiRoll={() => doRoll(10)} on:singleRoll={() => doRoll(1)} />
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
