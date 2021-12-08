<script>
	import BannerButton from '$lib/banner/BannerButton.svelte';
	import MyFund from '$lib/utility/MyFund.svelte';
	import setup from '$lib/setup/wish-setup.json';
	import previous from '$lib/setup/previous.json';
	import playSfx from '$lib/functions/audio';
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
		pageActive,
		isAcquaintUsed,
		bannerList
	} from '$lib/store/stores';

	let { beginner, limited, weapons, standard } = setup.banner;
	let limitedChar = limited.character;
	$: if ($patchVersion !== '0.0') {
		const { banner } = previous.data.filter(({ version }) => version === $patchVersion)[0];
		({ limited, weapons } = banner[$bannerVersion - 1]);
		limitedChar = limited.character;
	}

	let list;
	$: {
		list = $showBeginner ? [{ type: 'beginner', character: beginner.character }] : [];
		if (limitedChar.length) {
			limitedChar.forEach((character) => list.push({ type: 'limited', character }));
		} else list.push({ type: 'limited', character: limitedChar });
		list.push({ type: 'weapon', weapons: weapons.featured });
		list.push({ type: 'standard', character: standard.character });

		bannerList.set(list);
	}

	const buttonClick = (banner) => {
		bannerActive.set(banner);
		playSfx('changebanner');
	};

	const previousClick = () => {
		pageActive.set('previous-banner');
		playSfx('popup');
	};
</script>

<div id="header">
	<div class="top">
		<h1 class="wish-title">
			<img src="/assets/images/utility/brand.svg" alt="Brand" />
			<span>{$bannerList[$bannerActive] ? $bannerList[$bannerActive].type : 0} Wish </span>
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

			<button class="close" on:click={previousClick}>
				<i class="gi-close" />
			</button>
		</div>
	</div>

	<div class="banner-button">
		<div class="bg">
			<img src="/assets/images/utility/brand.svg" alt="Brand" />
		</div>

		{#each $bannerList as { type, character, weapons }, i}
			<BannerButton
				{type}
				character={character || ''}
				weapon={weapons || []}
				active={$bannerActive === i}
				on:click={() => buttonClick(i)}
			/>
		{/each}
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
		padding-top: 3.5rem;
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
