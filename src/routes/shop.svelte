<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';
	import Icon from '$lib/utility/Icon.svelte';
	import ShopNavbar from '$lib/shop/ShopNavbar.svelte';
	import ShopHeader from '$lib/shop/ShopHeader.svelte';
	import ExchangePopup from '$lib/shop/ExchangePopup.svelte';
	import PaymentPopup from '$lib/shop/PaymentPopup.svelte';

	const rand = (array) => array[Math.floor(Math.random() * array.length)];
	let audio;
	let activeShop = 'genesis';
	let activeFateShop = 'starglitter';
	let showNavbar = true;
	let showNavbarButton = false;
	let columnWidth = '';

	let activeGenesisIndexforPopup; // undefined
	let showPaymentPopup = false; //false
	let showExchangePopup = false;
	let itemToBuy;

	onMount(() => {
		audio = document.querySelector('#button-sfx');
	});

	const buttonCLick = () => {
		audio.src = '/assets/sfx/button-click.ogg';
		audio.play();
	};
	const selectShop = (e) => {
		const { selected } = e.detail;
		activeShop = selected;
		buttonCLick();
		if ($viewportWidth < 500) showNavbar = false;
	};

	$: if (!$mobileMode) {
		if ($viewportWidth < 745) {
			showNavbar = false;
			showNavbarButton = true;
		} else {
			showNavbar = true;
			showNavbarButton = false;
		}
	} else {
		showNavbar = true;
		showNavbarButton = false;
	}

	$: if ($viewportWidth < 400) {
		columnWidth = `width: ${(44 / 100) * $viewportWidth}px; height:${
			(44 / 100) * $viewportWidth
		}px`;
	}
	$: if ($mobileMode) {
		columnWidth = `width: ${(37 / 100) * $viewportHeight - 0.1}px; height:${
			(37 / 100) * $viewportHeight
		}px`;
	}

	const genesisList = [
		{ qty: 60, price: 0.99 },
		{ qty: 300, price: 4.99 },
		{ qty: 980, price: 14.99 },
		{ qty: 1980, price: 29.99 },
		{ qty: 3280, price: 49.99 },
		{ qty: 6480, price: 99.99 }
	];

	const genesisButtonClick = () => {
		audio.src = '/assets/sfx/genesis-click.ogg';
		audio.play();
	};
	const selectGenesis = (i) => {
		activeGenesisIndexforPopup = i;
		showPaymentPopup = true;
		genesisButtonClick();
	};
	const handleClosePaymentPopup = () => {
		showPaymentPopup = false;
		genesisButtonClick();
	};

	const openExchangePopup = (fate) => {
		showExchangePopup = true;
		itemToBuy = fate;
		buttonCLick();
	};

	const handleCloseExchangePopup = () => {
		showExchangePopup = false;
		buttonCLick();
	};

	const paimonNavClick = (shop) => {
		activeFateShop = shop;
		buttonCLick();
	};
</script>

<svelte:head>
	{#if activeShop === 'genesis'}
		<title>Buy Genesis Crystal | Wish Simulator</title>
	{:else}
		<title>Paimon's Bargains | Wish Simulator</title>
	{/if}
</svelte:head>

<!-- Genesisn Pop up -->
{#if showPaymentPopup}
	<PaymentPopup
		show={showPaymentPopup}
		price={genesisList[activeGenesisIndexforPopup].price}
		qty={genesisList[activeGenesisIndexforPopup].qty}
		on:confirm={handleClosePaymentPopup}
		on:cancel={handleClosePaymentPopup}
	/>
{/if}
<!-- Genesis Pop Up End -->

<!-- Fates Popup -->
<ExchangePopup
	show={showExchangePopup}
	fundType={activeFateShop}
	{itemToBuy}
	on:cancel={handleCloseExchangePopup}
	on:confirm={handleCloseExchangePopup}
/>
<!-- Fates Popup End -->

<section>
	<img class="bg" src="/assets/images/utility/bg{rand([1, 2, 3, 4, 5, 6])}.webp" alt="background" />
	<div class="container">
		<ShopNavbar
			show={showNavbar}
			on:select={selectShop}
			on:close={() => {
				showNavbar = false;
				buttonCLick();
			}}
		/>
		<div class="items-container">
			<ShopHeader
				{activeShop}
				{showNavbar}
				{showNavbarButton}
				on:showNavbar={({ detail }) => {
					showNavbar = detail.showNavbar;
					buttonCLick();
				}}
			/>

			<div class="item-body" transition:fade={{ duration: 300 }}>
				{#if activeShop === 'genesis'}
					<div class="item-list genesis">
						<div class="list-body">
							{#each genesisList as { qty }, i}
								<div class="column" style={columnWidth}>
									<button class="content" on:click={() => selectGenesis(i)}>
										<img src="/assets/images/utility/genesis-{qty}.webp" alt="genesis {qty}" />
									</button>
								</div>
							{/each}
						</div>
					</div>

					<!-- PAIMON BARGAINS -->
				{:else if activeShop === 'paimon-bargains'}
					<div class="nav-item-list">
						<button
							class="nav-link-item"
							class:active={activeFateShop === 'starglitter'}
							on:click={() => paimonNavClick('starglitter')}
						>
							<div class="border">
								<i class="gi-primo-star left" />
								<i class="gi-primo-star right" />
								Starglitter Exchange
							</div>
						</button>
						<button
							class="nav-link-item"
							class:active={activeFateShop === 'stardust'}
							on:click={() => paimonNavClick('stardust')}
						>
							<div class="border">
								<i class="gi-primo-star left" />
								<i class="gi-primo-star right" />
								Stardust Exchange
							</div>
						</button>
						<button
							class="nav-link-item"
							class:active={activeFateShop === 'primogem'}
							on:click={() => paimonNavClick('primogem')}
						>
							<div class="border">
								<i class="gi-primo-star left" />
								<i class="gi-primo-star right" />
								Exchange with Primogem
							</div>
						</button>
					</div>

					<div class="item-list paimon-bargains">
						<div class="list-body">
							{#each ['intertwined', 'acquaint'] as fate, i}
								<button class="column" style={columnWidth} on:click={() => openExchangePopup(fate)}>
									<div class="content">
										<picture>
											<Icon type={fate} width="60%" />
											<span> {fate} Fate </span>
										</picture>
										<div class="price">
											{#if activeFateShop === 'starglitter'}
												<Icon type="starglitter" width="15%" />
												<span style="margin-left: 5px">5</span>
											{/if}
											{#if activeFateShop === 'stardust'}
												<Icon type="stardust" width="15%" />
												<span style="margin-left: 5px">125</span>
											{/if}
											{#if activeFateShop === 'primogem'}
												<Icon type="primogem" width="15%" />
												<span style="margin-left: 5px">160</span>
											{/if}
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		width: 100vw;
		height: 100vh;
		display: block;
		position: relative;
		font-size: 1rem;
	}
	:global(.mobile) section {
		font-size: 0.8rem;
	}
	.bg {
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(1.1);
		filter: blur(10px);
		-webkit-filter: blur(10px);
		z-index: -1;
	}

	section::after {
		position: absolute;
		content: '';
		display: block;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		z-index: -1;
	}

	.container {
		display: flex;
		padding: 0 3%;
		position: relative;
		width: 100%;
		height: 100%;
	}
	:global(.mobile) .container {
		padding: 0 2%;
	}

	/*  */
	.border i {
		font-size: 2rem;
		display: inline-block;
		margin-right: 10px;
	}
	:global(.mobile) .border i {
		font-size: 1.5rem;
	}

	.gi-primo-star {
		right: -1.3rem;
		font-size: 1.3rem;
	}
	:global(.mobile) .gi-primo-star {
		right: -1rem;
		font-size: 1rem;
	}

	.items-container {
		width: 100%;
	}

	/*  */
	.nav-item-list {
		display: flex;
		border-top: 1px solid #d2c69c;
		border-bottom: 1px solid #d2c69c;
		width: fit-content;
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0)
		);
	}
	.nav-link-item {
		color: #d2c69c;
		position: relative;
		padding: 0 3px;
		transition: all 0.2s;
	}
	.nav-link-item.active .border,
	.nav-link-item:hover .border {
		color: #40475a;
	}
	:global(.mobile) .nav-link-item .border {
		font-size: 0.8rem;
		padding: 3px 12px;
	}
	.nav-link-item .border {
		padding: 5px 20px;
		border: 2px solid transparent;
		position: relative;
		z-index: +1;
		border-radius: 6px;
		transition: all 0.2s;
	}

	.nav-link-item.active::after,
	.nav-link-item:hover::after {
		background-color: #ede5d8;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		content: '';
		display: block;
		width: 100%;
		height: 120%;
		border-radius: 6px;
		transition: all 0.2s;
	}
	.nav-link-item.active .border {
		border: 2px solid #c1b198;
	}
	.nav-link-item .border i {
		display: none;
	}
	.nav-link-item.active .border i {
		position: absolute;
		display: unset;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		color: #c1b198;
	}
	.nav-link-item.active .border i.left {
		left: 0.1em;
		right: unset;
	}
	.nav-link-item.active .border i.right {
		right: 0.1em;
		margin-right: 0;
	}

	/* List */
	.item-list {
		height: calc(100vh - 155px);
		overflow-y: auto;
		margin: 15px 0;
	}
	:global(.mobile) .item-list {
		height: calc(100vh - 90px);
		margin: 5px 0 0;
		padding: 0;
	}
	:global(.mobile) .item-list.genesis {
		height: calc(100vh - 60px);
	}
	.list-body {
		display: flex;
		flex-wrap: wrap;
	}
	.column {
		width: 10vh;
		height: 10vh;
		min-width: 190px;
		min-height: 190px;
		margin: 0.4rem;
		display: block;
	}
	button {
		transition: all 0.2s;
		transform: scale(1);
	}
	button:active {
		transform: scale(0.95);
	}

	.genesis .column img,
	.genesis .column button {
		width: 100%;
		transition: all 0.2s;
	}
	.genesis .column button:hover img,
	.paimon-bargains button:hover {
		filter: drop-shadow(0 0 5px #d2c69c);
	}

	.paimon-bargains .content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background-image: url('/assets/images/utility/shop-item-bg.webp');
		background-size: cover;
		border-radius: 10px;
		overflow: hidden;
		text-align: center;
	}

	.paimon-bargains .content picture {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: -10%;
		align-items: center;
		position: relative;
	}
	.content picture span {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		color: #fff;
		transform: scale(0.9);
		-webkit-text-stroke: 0.2px black;
		text-transform: capitalize;
	}
	.paimon-bargains .content .price {
		width: 100%;
		height: 25%;
		background-color: #596982;
		color: #fff;
		padding: 0.5rem;
		-webkit-text-stroke: 0.2px black;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media screen and (max-width: 890px) {
		.column {
			min-width: 150px;
			min-height: 150px;
		}

		:global(.mobile) .column {
			min-width: 130px;
			min-height: 130px;
		}
	}
	@media screen and (max-width: 400px) {
		.list-body {
			justify-content: space-between;
		}
		.column {
			min-width: 100px;
			min-height: 100px;
		}
		.nav-link-item {
			font-size: 0.8rem;
		}
	}
</style>
