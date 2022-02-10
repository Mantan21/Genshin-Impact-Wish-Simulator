<script>
	import { fly } from 'svelte/transition';
	import BannerButton from '$lib/components/banner/parts/BannerButton.svelte';
	import MyFund from '$lib/components/utility/MyFund.svelte';
	import FatepointButton from '../fatepoint/FatepointButton.svelte';
	import FatepointPopup from '../fatepoint/FatepointPopup.svelte';
	import playSfx from '$lib/functions/audio';
	import browserState from '$lib/functions/browserState';
	import {
		acquaint,
		bannerActive,
		intertwined,
		mobileMode,
		primogem,
		stardust,
		starglitter,
		pageActive,
		isAcquaintUsed,
		bannerList
	} from '$lib/store/stores';

	const inTransition = (node, args) => {
		return args.mobile
			? fly(node, { x: -20, duration: 1000 })
			: fly(node, { y: -20, duration: 1000 });
	};

	const buttonClick = (banner) => {
		bannerActive.set(banner);
		playSfx('changebanner');
	};

	const previousClick = () => {
		browserState.set('previous');
		pageActive.set('previous-banner');
		playSfx('popup');
	};
</script>

<FatepointPopup />

<div id="header">
	<div class="top" in:fly={{ y: -20, duration: 800 }}>
		<h1 class="wish-title">
			<img src="/assets/images/utility/brand.svg" alt="Brand" />
			<span>{$bannerList[$bannerActive]?.type || ''} Wish </span>
		</h1>
		<div class="budget">
			<div class="fates">
				{#if $mobileMode}
					<MyFund type="starglitter">
						{$starglitter}
					</MyFund>
					<MyFund type="stardust">
						{$stardust}
					</MyFund>
				{/if}

				<MyFund type="primogem">
					{$primogem}
				</MyFund>
				{#if $isAcquaintUsed}
					<MyFund type="acquaint">
						{$acquaint}
					</MyFund>
				{:else}
					<MyFund type="intertwined">
						{$intertwined}
					</MyFund>
				{/if}
			</div>

			<button class="close" on:click={previousClick} title="Change Banner">
				<i class="gi-close" />
			</button>
		</div>
	</div>

	<div class="banner-button" in:inTransition={{ mobile: $mobileMode }}>
		<div class="bg">
			<img src="/assets/images/utility/brand.svg" alt="Brand" />
		</div>

		{#each $bannerList as { type, character, weapons }, i}
			<BannerButton
				{type}
				character={character || ''}
				weapons={weapons || []}
				active={$bannerActive === i}
				on:click={() => buttonClick(i)}
			/>
		{/each}

		{#if $mobileMode}
			<FatepointButton />
		{/if}
	</div>
</div>

<style>
	#header {
		position: relative;
		display: block;
		width: 100%;
		padding: 30px 2%;
		z-index: 5;
	}

	.bg {
		display: none;
	}
	.top {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: relative;
	}

	.wish-title {
		color: #fff;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		text-align: left;
	}

	.wish-title img {
		width: 30px;
		margin-right: 15px;
	}

	.budget {
		text-align: right;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		line-height: 0;
		overflow: hidden;
		border-radius: 50px;
	}

	.banner-button {
		text-align: center;
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 10;
	}

	/* mobile */

	:global(.mobile #header) {
		padding: 0 !important;
		height: 100vh;
	}

	:global(.mobile) .close {
		width: 2rem;
		height: 2rem;
	}
	:global(.mobile) .top {
		position: fixed;
		top: 0;
		right: 2%;
		width: calc(100% - 100px);
		display: flex;
		justify-content: space-between;
	}

	:global(.mobile) .wish-title img {
		display: none;
	}

	:global(.mobile) .banner-button {
		flex-direction: column;
		align-items: center;
		width: 120px;
		margin-top: 0;
		height: 100%;
		justify-content: flex-start;
		padding-top: 2.5rem;
		z-index: -10;
	}

	:global(.mobile) .bg {
		display: block;
		position: absolute;
		top: 0;
		left: 50%;
		width: 40px;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: -1;
		transform: translateX(-50%);
		text-align: center;
		border: solid rgba(207, 186, 143, 0.5);
		border-width: 0 2px;
	}
	.bg > img {
		width: 60%;
		margin-top: 3px;
	}

	@media screen and (min-width: 975px) {
		.banner-button {
			position: absolute;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			margin-top: 0;
		}
	}

	@media screen and (max-width: 900px) {
		.close {
			width: 2.5rem;
			height: 2.5rem;
			margin: 3px;
		}
	}
</style>
