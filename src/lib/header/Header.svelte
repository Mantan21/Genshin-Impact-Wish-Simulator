<script>
	import BannerButton from '$lib/banner/BannerButton.svelte';
	import Icon from '$lib/utility/Icon.svelte';
	import setup from '$lib/setup/wish-setup.json';
	import { bannerActive } from '$lib/stores';

	const { beginner, limited, weapons, standard } = setup.banner;

	let showBeginner = true;
	const acquaint = 80;
	const intertwined = 102;
</script>

<div id="header">
	<div class="top">
		<div class="wish-title">
			<img src="./assets/images/utility/brand.svg" alt="Brand" />
			<span>{$bannerActive} Wish </span>
		</div>
		<div class="budget">
			<div class="fates">
				<button class="primogem">
					<Icon
						type="primogem"
						height="20px"
						width="auto"
						style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
					/>
					3200
					<i class="gi-plus" />
				</button>
				<button class="fate">
					{#if $bannerActive === 'beginner' || $bannerActive === 'standard'}
						<Icon
							height="20px"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
							type="acquaint"
						/>
						{acquaint}
					{:else}
						<Icon
							height="20px"
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
		display: inline-block;
		padding: 4px;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
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
		font-size: 0.95rem;
		margin: 0 8px;
	}

	.gi-plus {
		display: inline-block;
		font-size: 0.8em;
		padding: 1px;
		width: 18px;
		height: 18px;
		color: #000;
		background-color: #fff;
		border-radius: 100%;
		position: absolute;
		right: 3px;
		top: 50%;
		transform: translateY(-50%);
	}
	.primogem {
		padding: 0 35px;
	}
	.fate {
		padding: 0 15px 0 35px;
	}

	.banner-button {
		text-align: center;
		display: flex;
		justify-content: center;
		margin-top: 20px;
		position: relative;
		z-index: 10;
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
</style>
