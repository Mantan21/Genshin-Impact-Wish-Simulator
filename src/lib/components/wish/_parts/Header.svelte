<script>
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import { t } from 'svelte-i18n';
	import { browser } from '$app/environment';

	import BannerButton from '$lib/components/wish/_parts/BannerButton.svelte';
	import MyFund from '$lib/components/utility/MyFund.svelte';
	import MainMenu from '$lib/components/menu/MainMenu.svelte';
	import EpitomizedButton from '../epitomizedPath/EpitomizedButton.svelte';
	import EpitomizedModal from '../epitomizedPath/EpitomizedModal.svelte';

	import { API_KEY, CHATROOM } from '$lib/env';
	import { playSfx } from '$lib/helpers/audio/audio.svelte';
	import browserState from '$lib/helpers/browserState';
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
		bannerList,
		unlimitedFates,
		viewportHeight,
		assets,
		isPWA,
		isMobile
	} from '$lib/store/stores';

	$: headerHeightstyle = $mobileMode ? `height: ${$viewportHeight}px` : '';

	const inTransition = (node, args) => {
		return args.mobile
			? fly(node, { x: -20, duration: 1000 })
			: fly(node, { y: -20, duration: 1000 });
	};

	const buttonClick = (banner) => {
		if ($bannerActive === banner) return;
		bannerActive.set(banner);
		playSfx('changebanner');
	};

	const previousClick = () => {
		browserState.set('previous');
		pageActive.set('previous-banner');
		playSfx('prevbanner');
	};

	let showMenu = false;
	const handleMenu = () => {
		playSfx(!showMenu ? 'click' : 'close');
		showMenu = !showMenu;
	};

	const chatToggle = getContext('chatToggle');

	$: fullscreen = browser ? $viewportHeight === window.screen.height : false;
	const handleFullscreen = () => {
		if (!fullscreen) {
			const body = document.body;
			if (body.requestFullscreen) return body.requestFullscreen();
			if (body.webkitRequestFullscreen) return body.webkitRequestFullscreen();
			if (body.msRequestFullscreen) return body?.msRequestFullscreen();
		} else {
			if (document.exitFullscreen) return document?.exitFullscreen();
			if (document.webkitExitFullscreen) return document?.webkitExitFullscreen();
			if (document.msExitFullscreen) return document?.msExitFullscreen();
		}
	};
</script>

<EpitomizedModal />

{#if showMenu}
	<MainMenu on:close={handleMenu} />
{/if}

<div id="header" style={headerHeightstyle}>
	<div class="top" in:fly={{ y: -20, duration: 800 }}>
		<h1 class="wish-title">
			<img src={$assets['brand.png']} alt="Brand" crossorigin="anonymous" />
			<span> {$t('wish.wishTitle')} </span>
			<button class="help" on:click={handleMenu} title="Setting" aria-label="Setting">
				<i class="gi-help" />
			</button>
			{#if CHATROOM && API_KEY}
				<button class="chat" on:click={chatToggle} title="Chats" aria-label="Chats">
					<i class="gi-chat" />
				</button>
			{/if}
			{#if !$isPWA || !$isMobile}
				<button
					class="fullscreen"
					on:click={handleFullscreen}
					title="FullScreen"
					aria-label="Fullscreen"
				>
					<i class="gi-{!fullscreen ? 'fullscreen' : 'shrink'}" />
				</button>
			{/if}
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
					{$unlimitedFates ? '∞' : $primogem}
				</MyFund>
				{#if $isAcquaintUsed}
					<MyFund type="acquaint">
						{$unlimitedFates ? '∞' : $acquaint}
					</MyFund>
				{:else}
					<MyFund type="intertwined">
						{$unlimitedFates ? '∞' : $intertwined}
					</MyFund>
				{/if}
			</div>

			<button class="close" on:click={previousClick} title="Change Banner">
				<i class="gi-close" />
			</button>
		</div>
	</div>

	<div class="banner-button" in:inTransition={{ mobile: $mobileMode }}>
		<div class="bg" style={headerHeightstyle}>
			<img src={$assets['brand.png']} alt="Brand" crossorigin="anonymous" />
		</div>

		{#each $bannerList as { type, character, weapons }, i}
			<BannerButton
				{type}
				index={i}
				bannerData={character || weapons || {}}
				active={$bannerActive === i}
				on:click={() => buttonClick(i)}
			/>
		{/each}

		{#if $mobileMode}
			<EpitomizedButton />
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

	h1 button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		margin-left: 0.7rem;
		line-height: 0;
		transition: all 0.2s;
	}

	h1 button:hover {
		background-color: var(--tertiary-color);
		color: #3a4156;
	}

	.help {
		border-radius: 50px;
		border: 0.15rem solid #fff;
		width: 1.7rem;
		height: 1.7rem;
	}

	.fullscreen,
	.chat {
		border-color: transparent;
		transform: scale(1.3);
		width: 1.3rem;
		height: 1.3rem;
	}

	.chat {
		border-radius: 100%;
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
		font-size: 110%;
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

	.banner-button {
		text-align: center;
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 10;
	}

	/* mobile */

	:global(.mobile) #header {
		padding: 0 !important;
	}

	:global(.mobile) .top {
		position: fixed;
		top: 0;
		right: 2%;
		width: calc(100% - 100px);
		display: flex;
		justify-content: space-between;
		padding-right: 4%;
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
		:global(main):not(.mobile) .banner-button {
			position: absolute;
			max-width: 50%;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			margin-top: 0;
		}
	}
</style>
