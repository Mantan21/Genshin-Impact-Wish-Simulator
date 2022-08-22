<script>
	import playSfx from '$lib/helpers/audio';
	import { copy } from '$lib/helpers/nameText';
	import PopUp from '../utility/PopUp.svelte';
	import ColumnParent from './parts/_column-parent.svelte';
	import Column from './parts/_column.svelte';

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
</script>

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
				<img src="/images/utility/donate-ethereum.png" alt="Ethereum" />
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
				<img src="/images/utility/donate-bnb.png" alt="Binance Coin" />
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
				<img src="/images/utility/donate-solana.png" alt="Solana" />
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
<ColumnParent>
	<Column>
		<a class="content kofi" href="https://ko-fi.com/mantan21" target="_blank">
			<div
				style="display: flex;justify-content: center; align-items: center; width: 100%; height: 100%"
			>
				<div class="donate-icon">
					<img src="/images/utility/donate-kofi.png" alt="Ko-fi Icon" />
					<img src="/images/utility/paypal.png" alt="paypal" />
				</div>
			</div>
			<span> Support me on Ko-fi </span>
		</a>
	</Column>

	<!-- Donaate By Saweria -->
	<Column style="padding: 0.4rem;">
		<a class="content saweria" href="https://saweria.co/mantan21" target="_blank">
			<div
				style="display: flex;justify-content: center; align-items: center; width: 100%; height: 100%"
			>
				<div class="donate-icon">
					<img src="/images/utility/sociabuzz.png" alt="icon" />
					<span style="font-size: 80%; color:darkblue">Global & Local Payment</span>
				</div>
			</div>
			<span> Support me on SociaBuzz </span>
		</a>
	</Column>

	<!-- Donate By Crypto -->
	<Column style="padding: 0.4rem;">
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
						<img src="/images/utility/donate-{im}.png" alt="{im} icon" />
					{/each}
				</div>
			</div>
			<span> Support me with Crypto </span>
		</button>
	</Column>
</ColumnParent>

<style>
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

	.content {
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
		transition: transform 0.1s;
	}

	.content:active {
		transform: scale(0.95);
	}

	.donate-icon {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	img {
		height: 1.5rem;
		margin: 0.2rem 0.5rem;
	}
	span {
		padding: 0.5rem;
	}
</style>
