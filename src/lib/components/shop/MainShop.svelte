<script>
	import { fade } from 'svelte/transition';
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';
	import { copy } from '$lib/functions/nameText';
	import playSfx from '$lib/functions/audio';
	import { APP_TITLE } from '$lib/env';

	// Components
	import Icon from '$lib/components/utility/Icon.svelte';
	import ShopNavbar from './ShopNavbar.svelte';
	import ShopHeader from './ShopHeader.svelte';
	import ExchangePopup from './ExchangePopup.svelte';
	import PaymentPopup from './PaymentPopup.svelte';
	import PopUp from '$lib/components/utility/PopUp.svelte';
	import Obtained from '$lib/components/utility/Obtained.svelte';

	const random = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	let bg;
	let activeShop = 'genesis';
	let activeFateShop = 'starglitter';
	let showNavbar = true;
	let showNavbarButton = false;
	let columnWidth = '';

	let activeGenesisIndexforPopup; // undefined
	let showPaymentPopup = false; //false
	let showExchangePopup = false;
	let itemToBuy;

	let showObtained = false;
	let obtainedItems = {};

	let showCryptoPopup = false;
	let showToast = false;

	const copyHandle = (text) => {
		playSfx();
		copy(text);
		showToast = true;
		const t = setTimeout(() => {
			showToast = false;
			clearTimeout(t);
		}, 2000);
	};

	const selectShop = (e) => {
		const { selected } = e.detail;
		activeShop = selected;
		playSfx();
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

	const selectGenesis = (i) => {
		activeGenesisIndexforPopup = i;
		showPaymentPopup = true;
		playSfx('exchange');
	};
	const handleClosePopup = () => {
		showPaymentPopup = false;
		showExchangePopup = false;
	};

	const openExchangePopup = (fate) => {
		showExchangePopup = true;
		itemToBuy = fate;
		playSfx();
	};

	const handleConfirmPopup = (e) => {
		showExchangePopup = false;
		showPaymentPopup = false;
		const { status, item } = e.detail;
		if (status === 'failed') return;
		obtainedItems[item.itemToBuy] = item.value;
		showObtained = true;
	};

	const handleCloseObtained = () => {
		showObtained = false;
		obtainedItems = {};
		playSfx('close');
	};

	const paimonNavClick = (shop) => {
		activeFateShop = shop;
		playSfx('exchange');
	};
</script>

<svelte:head>
	{#if activeShop === 'genesis'}
		<title>Buy Genesis Crystal | {APP_TITLE}</title>
	{:else}
		<title>Paimon's Bargains | {APP_TITLE}</title>
	{/if}
</svelte:head>

<!-- Obtained Items -->
{#if showObtained}
	<Obtained items={obtainedItems} on:close={handleCloseObtained} />
{/if}
<!-- Obtained Items End -->

<!-- Genesisn Pop up -->
{#if showPaymentPopup}
	<PaymentPopup
		show={showPaymentPopup}
		price={genesisList[activeGenesisIndexforPopup].price}
		qty={genesisList[activeGenesisIndexforPopup].qty}
		on:confirm={handleConfirmPopup}
		on:cancel={handleClosePopup}
	/>
{/if}
<!-- Genesis Pop Up End -->

<!-- Fates Popup -->
<ExchangePopup
	show={showExchangePopup}
	fundType={activeFateShop}
	{itemToBuy}
	on:cancel={handleClosePopup}
	on:confirm={handleConfirmPopup}
/>
<!-- Fates Popup End -->

<!-- Crypto Donate -->
<PopUp
	button="confirm"
	show={showCryptoPopup}
	title="Support With Crypto"
	on:confirm={() => {
		showCryptoPopup = false;
	}}
>
	<div class="popup-donate">
		<div class="pop-item">
			<div class="icon">
				<img src="/assets/images/utility/donate-ethereum.png" alt="Ethereum" />
			</div>
			<div class="address">
				<span> Ethereum ( erc20 ) </span>
				<input type="text" value="0x4320025BAD621c03b906A84c531B10480A465184" disabled />
			</div>
			<div class="copy">
				<button on:click={() => copyHandle('0x4320025BAD621c03b906A84c531B10480A465184')}
					><i class="gi-copy" /></button
				>
			</div>
		</div>

		<div class="pop-item">
			<div class="icon">
				<img src="/assets/images/utility/donate-bnb.png" alt="Binance Coin" />
			</div>
			<div class="address">
				<span> Binance Coin ( bep20 )</span>
				<input type="text" value="0x4320025BAD621c03b906A84c531B10480A465184" disabled />
			</div>
			<div class="copy">
				<button on:click={() => copyHandle('0x4320025BAD621c03b906A84c531B10480A465184')}>
					<i class="gi-copy" />
				</button>
			</div>
		</div>

		<div class="pop-item">
			<div class="icon">
				<img src="/assets/images/utility/donate-solana.png" alt="Solana" />
			</div>
			<div class="address">
				<span> Solana </span>
				<input type="text" value="4nFhLoPqpx71xPqgN2zhvoWtmgogzoDkEBzNKqjnpm2a" disabled />
			</div>
			<div class="copy">
				<button on:click={() => copyHandle('4nFhLoPqpx71xPqgN2zhvoWtmgogzoDkEBzNKqjnpm2a')}>
					<i class="gi-copy" />
				</button>
			</div>
		</div>

		{#if showToast}
			<div class="toast">Address Copied</div>
		{/if}
	</div>
</PopUp>
<!-- Crypto Donate -->
<section>
	<img
		class="bg"
		src="/assets/images/background/bg{random(1, 16)}.webp"
		alt="background"
		bind:this={bg}
	/>
	<div class="container">
		<ShopNavbar
			show={showNavbar}
			on:select={selectShop}
			on:close={() => {
				showNavbar = false;
				playSfx();
			}}
		/>
		<div class="items-container">
			<ShopHeader
				{activeShop}
				{showNavbar}
				{showNavbarButton}
				on:showNavbar={({ detail }) => {
					showNavbar = detail.showNavbar;
					playSfx();
				}}
			/>

			<div class="item-body" in:fade={{ duration: 300 }}>
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

					<!-- Donate -->
				{:else if activeShop === 'donate'}
					<div class="item-list donate">
						<div class="list-body">
							<div class="column" style={columnWidth}>
								<a class="content kofi" href="https://ko-fi.com/mantan21" target="_blank">
									<div
										style="display: flex;justify-content: center; align-items: center; width: 100%; height: 100%"
									>
										<div class="donate-icon">
											<img src="/assets/images/utility/donate-kofi.png" alt="Ko-fi Icon" />
											<img
												src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png"
												alt="paypal"
											/>
										</div>
									</div>
									<span> Support me on Ko-fi </span>
								</a>
							</div>
							<div class="column" style={columnWidth}>
								<a class="content saweria" href="https://saweria.co/mantan21" target="_blank">
									<div
										style="display: flex;justify-content: center; align-items: center; width: 100%; height: 100%"
									>
										<div class="donate-icon">
											{#each ['ovo', 'gopay', 'dana', 'linkaja'] as im}
												<img src="/assets/images/utility/donate-{im}.png" alt="{im} icon" />
											{/each}
										</div>
									</div>
									<span> Support me on Saweria </span>
								</a>
							</div>
							<div class="column" style={columnWidth}>
								<button
									class="content crypto"
									on:click={() => {
										showCryptoPopup = true;
									}}
								>
									<div
										style="display: flex;justify-content: center; align-items: center; width: 100%; height: 100%"
									>
										<div class="donate-icon">
											{#each ['btc', 'ethereum', 'bnb', 'solana'] as im}
												<img src="/assets/images/utility/donate-{im}.png" alt="{im} icon" />
											{/each}
										</div>
									</div>
									<span> Support me with Crypto </span>
								</button>
							</div>
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
		/* background: linear-gradient(135deg, rgb(112, 31, 164), transparent 45%),
			linear-gradient(225deg, rgb(223, 220, 116), transparent 60%),
			linear-gradient(315deg, rgb(242, 79, 202), rgb(80, 148, 215) 25%, rgb(175, 28, 181));
		background-size: cover; */
		background-color: var(--text-color);
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
		z-index: +1;
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
		z-index: +2;
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
		margin: 15px 0;
		overflow-y: auto;
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
	button:not(.nav-link-item):active {
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
		border-radius: 0.5rem;
		overflow: hidden;
		text-align: center;
		background-color: #596982;
	}

	.paimon-bargains .content picture {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: -10%;
		align-items: center;
		position: relative;
		background-image: url('/assets/images/utility/5star-bg.webp');
		background-size: cover;
		border-bottom-right-radius: 1.4rem;
		overflow: hidden;
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
		height: 20%;
		color: #fff;
		-webkit-text-stroke: 0.02rem black;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Donate */
	.toast {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background-color: rgba(173, 128, 65, 0.8);
		color: #fff;
		font-size: 0.75rem;
	}

	.popup-donate .pop-item {
		display: flex;
		align-items: center;
		width: 100%;
		margin: 1rem 0;
	}

	.popup-donate .icon,
	.popup-donate .copy {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
		margin: 0.2rem;
	}
	.popup-donate img {
		height: 3rem;
		margin: 0;
	}
	.address {
		padding: 0 0 0 1rem;
		display: flex;
		flex-direction: column;
		text-align: left;
		width: 100%;
	}
	.address span {
		font-size: 0.8rem;
	}

	.popup-donate button {
		background-color: #383b40;
		color: #fff;
		transition: all 0.2s;
		border-radius: 100%;
		width: 3rem;
		height: 3rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
	}
	.popup-donate button:hover {
		background-color: #ccc;
		color: #000;
	}

	.donate .content {
		background-color: rgba(255, 255, 255, 0.8);
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 1rem;
		padding: 1rem;
		text-align: center;
	}

	.donate .column,
	.paimon-bargains .column {
		padding: 0.4rem;
	}

	.donate-icon {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	.donate img {
		height: 1.5rem;
		margin: 0.2rem 0.5rem;
	}
	.donate span {
		padding: 0.5rem;
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
