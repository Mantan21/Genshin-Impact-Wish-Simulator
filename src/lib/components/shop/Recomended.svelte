<script>
	import { fly } from 'svelte/transition';
	import { patchVersion } from '$lib/store/stores';
	import { outfits } from '$lib/data/outfits.json';
	import TopNavParent from './parts/_top-nav-parent.svelte';
	import TopNavItem from './parts/_top-nav-item.svelte';
	import playSfx from '$lib/functions/audio';
	import Icon from '../utility/Icon.svelte';
	import Button from '../utility/Button.svelte';
	import { getName } from '$lib/functions/nameText';

	const outfitsForThisVersion = outfits.find(({ version, price, promoPrice }) => {
		return $patchVersion === `${version}` && promoPrice && promoPrice !== price;
	});
	const { name, price, promoPrice, description } = outfitsForThisVersion || {};

	const outfitsPromo = !!outfitsForThisVersion;
	let activeItem = outfitsPromo ? 'outfit' : 'welkin';
	let contentWidth;

	const handleRecomendClick = ({ detail }) => {
		playSfx('exchange');
		activeItem = detail.selected;
	};
</script>

<TopNavParent>
	{#if outfitsPromo}
		<TopNavItem
			name="outfit"
			active={activeItem === 'outfit'}
			on:click={(e) => handleRecomendClick(e)}
		>
			Character Outfits
		</TopNavItem>
	{/if}

	<TopNavItem
		on:click={(e) => handleRecomendClick(e)}
		name="welkin"
		active={activeItem === 'welkin'}
	>
		Blessing of the Welkin Moon
	</TopNavItem>
</TopNavParent>

<div class="container">
	<div class="content-item" bind:clientHeight={contentWidth}>
		{#if activeItem === 'outfit'}
			<div
				class="card outfit"
				style="font-size:{(3.5 / 100) * contentWidth}px"
				in:fly={{ x: 50, duration: 1000 }}
			>
				<img
					class="outfit-art"
					src="/assets/images/characters/outfit/splash-art/{name}.webp"
					alt={getName(name)}
				/>

				<div class="remaining">Limited Time Offer</div>
				<div class="details">
					<div class="name">{getName(name)}</div>
					<div class="price">
						<Icon type="genesis" style="margin-right:-1%; width: 10%" />
						<span class="dicount"> {promoPrice} </span>

						<del class="real-price"> {price} </del>
					</div>
				</div>

				<div class="frame" style="padding-right:{(5 / 100) * contentWidth}px;">
					<div class="description">
						<div class="title">New Character Outfits</div>
						<span class="name">{getName(name)}</span>
						<p>
							{description}
						</p>
					</div>
					<div class="purchase-button">
						<Button text="Purchase" type="confirm" />
					</div>
				</div>
			</div>
		{:else}
			<div
				class="card"
				style="font-size:{(3.5 / 100) * contentWidth}px"
				in:fly={{ x: 50, duration: 1000 }}
			>
				<img src="/assets/images/utility/welkin-card.webp" alt="Welkin of the Blessing Moon" />

				<div class="remaining">
					Days remaining: <strong>30</strong>
					<span>(Already Claimed today)</span>
				</div>
				<div class="frame" style="padding-right:{(5 / 100) * contentWidth}px;">
					<div class="parent-amount">
						<span>Instantly Get</span>
						<span class="amount" style="width:{(30 / 100) * contentWidth}px;">
							32000
							<Icon type="genesis" style="margin-bottom:-5%; width: 20%" />
						</span>
					</div>
					<div class="parent-amount">
						<span>Daily Gift</span>
						<span class="amount" style="width:{(30 / 100) * contentWidth}px;">
							8000
							<Icon type="primogem" style="margin-bottom:-5%; width: 20%" />
						</span>
					</div>

					<!-- Button -->
					<div class="purchase-button">
						<div class="caption" style="font-size:{(3 / 100) * contentWidth}px; margin-bottom:3%">
							Obtain a total <strong>32000</strong> Genesis Crystal and
							<strong> 240000</strong> Primogems across 30 days
						</div>
						<Button text="Purchase" type="confirm" />
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		width: 100%;
		padding: 1rem 0;
	}

	.content-item,
	.card,
	img {
		display: block;
		width: 100%;
	}

	:global(.mobile) .content-item,
	:global(.mobile) .card {
		max-width: 100%;
		width: fit-content;
		height: 75vh;
	}

	.card {
		position: relative;
		background-color: #f7f3eb;
		max-width: 55rem;
		max-height: 75vh;
		aspect-ratio: 1000/561;
		border-radius: 1rem;
		overflow: hidden;
	}

	.remaining {
		width: 35%;
		position: absolute;
		top: 2%;
		left: 2%;
		color: #b3c4e3;
		font-size: 85%;
	}
	.remaining span {
		color: #ffc107;
	}

	.frame {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-top: 10%;
		z-index: +3;
	}

	.parent-amount {
		margin: 2% 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.parent-amount span {
		display: block;
		text-align: right;
	}
	.parent-amount span:not(.amount),
	.purchase-button {
		color: #787b84;
	}
	.amount {
		padding: 5% 8%;
		background-color: #8e9cc0;
		color: #fff;
		border-radius: 2rem;
		margin-top: 5%;
		border: 0.1rem solid #fff;
		outline: 0.135rem solid #8e9cc0;
	}

	.purchase-button {
		width: 50%;
		text-align: right;
		margin-top: auto;
		margin-bottom: 2%;
	}

	/* Outfits */
	img.outfit-art {
		position: absolute;
		top: -16.5%;
		left: -31%;
		width: 130%;
	}

	.outfit {
		position: relative;
	}
	.outfit::after {
		width: 100%;
		height: 100%;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		background-image: linear-gradient(
			65deg,
			rgba(247, 243, 235, 0) 40%,
			rgba(247, 243, 235, 0.8) 70%
		);
		background-size: cover;
		z-index: +2;
	}

	.outfit .frame {
		padding-top: 2%;
	}
	.outfit .remaining {
		color: #7fb6d5;
	}

	.description {
		width: 50%;
		text-align: right;
		color: #787b84;
	}
	.title {
		display: block;
		margin-left: auto;
		width: 80%;
		color: #3c4b5e;
		font-size: 200%;
		line-height: 120%;
	}
	span.name {
		color: #3c4b5e;
		font-weight: bold;
		display: block;
		margin: 5% 0;
	}

	.details {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		padding-bottom: 5%;
		padding-left: 3%;
	}
	.details .name {
		font-size: 220%;
		width: 40%;
		line-height: 120%;
		margin-top: auto;
		color: #fff;
		-webkit-text-stroke: 0.4px #000;
		text-shadow: 0 0 25px #787b84;
	}

	.price {
		position: relative;
		color: #fff;
		margin-top: 5%;
		text-shadow: 0 0 25px #787b84;
	}
	.dicount {
		font-size: 300%;
		-webkit-text-stroke: 0.4px #000;
	}

	.real-price {
		position: absolute;
		left: 52%;
		bottom: 0;
		transform: translateY(-50%);
		color: #fff;
		background-color: #88ba59;
		padding: 0.1rem 1rem 0.1rem 0.7rem;
		border-bottom-left-radius: 1rem;
		border-top-left-radius: 1rem;
		border-bottom-right-radius: 2rem;
	}
</style>
