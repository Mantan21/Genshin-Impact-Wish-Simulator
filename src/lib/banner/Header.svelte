<script>
	import BannerButton from '$lib/banner/BannerButton.svelte';
	import MyFund from '$lib/utility/MyFund.svelte';
	import setup from '$lib/setup/wish-setup.json';
	import previous from '$lib/setup/previous.json';
	import {
		patchVersion,
		bannerVersion,
		acquaint,
		bannerActive,
		intertwined,
		mobileMode,
		primogem,
		showBeginner,
		stardust,
		starglitter,
		pageActive
	} from '$lib/store/stores';

	let { beginner, limited, weapons, standard } = setup.banner;
	$: if ($patchVersion !== '0.0') {
		const { banner } = previous.data.filter(({ version }) => version === $patchVersion)[0];
		({ limited, weapons } = banner[$bannerVersion - 1]);
	}

	let audio;
	const buttonClick = (bannerType) => {
		bannerActive.set(bannerType);
		audio.currentTime = 0;
		audio.play();
	};
</script>

<audio bind:this={audio}>
	<source src="/assets/sfx/banner-button-click.ogg" type="audio/ogg" />
</audio>

<div id="header">
	<div class="top">
		<h1 class="wish-title">
			<img src="/assets/images/utility/brand.svg" alt="Brand" />
			<span>{$bannerActive} Wish </span>
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
				{#if $bannerActive === 'beginner' || $bannerActive === 'standard'}
					<MyFund type="acquaint">
						{$acquaint}
					</MyFund>
				{:else}
					<MyFund type="intertwined">
						{$intertwined}
					</MyFund>
				{/if}
			</div>

			<button class="close" on:click={() => pageActive.set('previous-banner')}>
				<i class="gi-close" />
			</button>
		</div>
	</div>

	<div class="banner-button">
		<div class="bg">
			<img src="/assets/images/utility/brand.svg" alt="Brand" />
		</div>
		{#if $showBeginner}
			<BannerButton
				type="beginner"
				character={beginner.character}
				active={$bannerActive === 'beginner'}
				on:click={() => buttonClick('beginner')}
			/>
		{/if}
		<BannerButton
			type="limited"
			character={limited.character}
			active={$bannerActive === 'limited'}
			on:click={() => buttonClick('limited')}
		/>
		<BannerButton
			type="weapon"
			weaponID={weapons.featured}
			active={$bannerActive === 'weapon'}
			on:click={() => buttonClick('weapon')}
		/>
		<BannerButton
			type="standard"
			character={standard.character}
			active={$bannerActive === 'standard'}
			on:click={() => buttonClick('standard')}
		/>
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

	.bg,
	audio {
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
		margin-top: 20px;
		position: relative;
		z-index: 10;
	}

	/* mobile */

	:global(.mobile #header) {
		padding: 0 !important;
		height: 100vh;
	}
	:global(.mobile) .top {
		position: fixed;
		top: 0;
		right: 0;
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
		padding-top: 50px;
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

	@media screen and (min-width: 1100px) {
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
			width: 30px;
			height: 30px;
			margin: 3px;
		}
	}
</style>
