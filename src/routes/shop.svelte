<script context="module">
	import Icon from '$lib/utility/Icon.svelte';
	import ShopNavbar from '$lib/utility/ShopNavbar.svelte';

	export const prerender = true;
</script>

<script>
	import { fly } from 'svelte/transition';
	import { mobileMode, viewportHeight, viewportWidth } from '$lib/store/stores';

	const rand = (array) => array[Math.floor(Math.random() * array.length)];
	let activeShop;
	let activeFateShop = 'starglitter';
	let showNavbar = true;
	let showNavbarButton = false;
	let columnWidth = '';

	const selectShop = (e) => {
		const { selected } = e.detail;
		activeShop = selected;
		console.log(activeShop);
		if ($viewportWidth < 500) showNavbar = false;
	};

	$: console.log(!mobileMode);

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
		columnWidth = `width: ${(30 / 100) * $viewportHeight - 0.1}px; height:${
			(30 / 100) * $viewportHeight
		}px`;
	}
</script>

<section>
	<img class="bg" src="/assets/images/utility/bg{rand([1, 2, 3, 4, 5, 6])}.webp" alt="background" />
	<div class="container">
		<ShopNavbar
			on:select={selectShop}
			on:close={() => {
				showNavbar = false;
			}}
			show={showNavbar}
		/>
		<div class="items-container">
			<div class="item-header" transition:fly={{ y: -20 }}>
				<div class="info" style="display: flex; align-items: center">
					{#if showNavbarButton}
						<button
							class="toggle"
							on:click={() => {
								showNavbar = !showNavbar;
							}}
						>
							<span />
						</button>
					{/if}
					<span> Refresed at 300 days </span>
				</div>
				<div class="fates">
					<button class="stardust">
						<Icon
							type="stardust"
							height="80%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
						/>
						300
					</button>
					<button class="starglitter">
						<Icon
							type="starglitter"
							height="80%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
						/>
						200
					</button>
					<button class="primogem">
						<Icon
							type="primogem"
							height="80%"
							width="auto"
							style="position: absolute; left: 5px;top: 50%; transform: translateY(-50%);"
						/>
						3200
					</button>
					<a href="/" class="close">
						<i class="gi-close" />
					</a>
				</div>
			</div>

			<div class="item-body">
				<div class="nav-item-list">
					<button
						class="nav-link-item"
						class:active={activeFateShop === 'starglitter'}
						on:click={() => {
							activeFateShop = 'starglitter';
						}}
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
						on:click={() => {
							activeFateShop = 'stardust';
						}}
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
						on:click={() => {
							activeFateShop = 'primogem';
						}}
					>
						<div class="border">
							<i class="gi-primo-star left" />
							<i class="gi-primo-star right" />
							Exchange with Primogem
						</div>
					</button>
				</div>

				<div class="item-list">
					<div class="list-body">
						{#each Array(12) as _, i}
							<div class="column" style={columnWidth}>ok</div>
						{/each}
					</div>
				</div>
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

	.toggle {
		display: inline-block;
		width: 40px;
		height: 40px;
		border: 1px solid #d2c69c;
		margin-right: 5px;
		position: relative;
	}

	.toggle span {
		display: block;
		width: 60%;
		height: 2px;
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		background-color: #d2c69c;
	}
	.toggle span::after,
	.toggle span::before {
		display: block;
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		content: '';
		background-color: #d2c69c;
	}
	.toggle span::before {
		top: -300%;
	}
	.toggle span::after {
		bottom: -300%;
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
	.item-header {
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #d2c69c;
	}
	:global(.mobile) .item-header {
		height: 40px;
	}

	.fates {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.fates button {
		padding: 0 15px 0 30px;
		display: inline-block;
		max-width: 112px;
		height: 25px;
		position: relative;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
		color: #fff;
		vertical-align: middle;
		text-align: center;
		margin: 0 8px;
	}
	.fates .close {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 0rem;
		width: 35px;
		height: 35px;
		color: rgba(0, 0, 0, 0.7);
		background-color: #fff;
		border: 3.5px solid #abbcc6;
		padding: 0;
		border-radius: 100%;
		text-decoration: none;
	}
	:global(.mobile) .fates .close {
		width: 28px;
		height: 28px;
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
		background-color: #fff;
		margin: 0.3rem;
		display: block;
	}

	@media screen and (max-width: 890px) {
		.fates button {
			height: 20px;
			margin: 0 3px;
		}
		.close {
			width: 30px;
			height: 30px;
			margin: 3px;
		}
		.column {
			min-width: 150px;
			min-height: 150px;
		}

		:global(.mobile) .column {
			min-width: 105px;
			min-height: 105px;
		}
	}
	@media screen and (max-width: 500px) {
		.item-header {
			flex-direction: column;
			justify-content: center;
		}
		.info {
			width: 100%;
		}
		.fates .close {
			position: fixed;
			top: 2%;
			right: 5%;
		}
	}
	@media screen and (max-width: 400px) {
		.fates button {
			max-width: 80px;
		}
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
