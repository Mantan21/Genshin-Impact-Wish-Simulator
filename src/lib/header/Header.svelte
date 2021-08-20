<script>
	import BannerButton from '$lib/banner/BannerButton.svelte';
	import Icon from '$lib/utility/Icon.svelte';
	import setup from '$lib/setup/wish-setup.json';
	import { bannerActive, mobileMode } from '$lib/store/stores';

	const { beginner, limited, weapons, standard } = setup.banner;

	let showBeginner = true;
	const acquaint = 80;
	const intertwined = 102;
	const stardust = 200;
	const starglitter = 30;
</script>

<div id="header">
	<div class="top">
		<h1 class="wish-title">
			<img src="./assets/images/utility/brand.svg" alt="Brand" />
			<span>{$bannerActive} Wish </span>
		</h1>
		<div class="budget">
			<div class="fates">
				{#if $mobileMode}
					<button class="starglitter">
						<Icon
							type="starglitter"
							height="80%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
						/>
						{starglitter}
					</button>
					<button class="stardust">
						<Icon
							type="stardust"
							height="80%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
						/>
						{stardust}
					</button>
				{/if}

				<button class="primogem">
					<Icon
						type="primogem"
						height="80%"
						width="auto"
						style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
					/>
					3200
					<i class="gi-plus" />
				</button>
				<button class="fate">
					{#if $bannerActive === 'beginner' || $bannerActive === 'standard'}
						<Icon
							height="70%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
							type="acquaint"
						/>
						{acquaint}
					{:else}
						<Icon
							height="70%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
							type="intertwined"
						/>
						{intertwined}
					{/if}
				</button>
			</div>

			<button class="close">
				<i class="gi-close" />
			</button>
		</div>
	</div>

	<div class="banner-button">
		<div class="bg">
			<img src="./assets/images/utility/brand.svg" alt="Brand" />
		</div>
		{#if showBeginner}
			<BannerButton
				type="beginner"
				character={beginner.character}
				active={$bannerActive === 'beginner'}
				on:click={() => bannerActive.set('beginner')}
			/>
		{/if}
		<BannerButton
			type="limited"
			character={limited.character}
			active={$bannerActive === 'limited'}
			on:click={() => bannerActive.set('limited')}
		/>
		<BannerButton
			type="weapon"
			weaponID={weapons}
			active={$bannerActive === 'weapon'}
			on:click={() => bannerActive.set('weapon')}
		/>
		<BannerButton
			type="standard"
			character={standard.character}
			active={$bannerActive === 'standard'}
			on:click={() => bannerActive.set('standard')}
		/>
	</div>
</div>

<style>
	#header {
		position: relative;
		display: block;
		width: 100%;
		padding: 30px 2%;
	}

	.bg {
		display: none;
	}
	.top {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: relative;
		z-index: +100;
		pointer-events: none;
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
	}

	button {
		display: inline-block;
		max-width: 112px;
		height: 25px;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		position: relative;
		margin: 0 8px;
	}

	.fates button {
		padding: 0 15px 0 30px;
	}

	.gi-plus {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 18px;
		height: 18px;
		color: #000;
		background-color: #fff;
		border-radius: 100%;
		position: absolute;
		right: 3px;
		top: 50%;
		font-size: 0.8rem;
		transform: translateY(-50%);
	}
	.primogem {
		padding-right: 30px !important;
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
		button {
			height: 20px;
			margin: 0 3px;
		}
		.close {
			width: 30px;
			height: 30px;
			margin: 3px;
		}
	}
	@media screen and (max-width: 400px) {
		button {
			max-width: 80px;
		}
		.primogem {
			margin-bottom: 2px;
			padding: 0 30px;
		}
		.fate {
			padding: 0 10px 0 30px;
		}

		.gi-plus {
			right: 2px;
			transform: translateY(-50%) scale(0.9);
		}
	}
</style>
