<script>
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { patchVersion } from '$lib/store/stores';
	import { outfits } from '$lib/data/outfits.json';
	import { noticeMark } from '$lib/functions/noticeMark';
	import NoticeMark from '../utility/NoticeMark.svelte';

	export let show;
	let activeShop = 'genesis';

	$: check = outfits.filter(({ version }) => version.toString() === $patchVersion);
	$: outfitsPromo = check.length > 0;

	const dispatch = createEventDispatcher();
	const handleClick = (shop) => {
		activeShop = shop;
		dispatch('select', { selected: shop });
		if (['outfits', 'recomended'].includes(shop) && outfitsPromo) {
			return noticeMark.openNotice(`${shop}-${$patchVersion}`);
		}
	};
	const handleClose = () => dispatch('close');
</script>

{#if show}
	<div class="bg" on:click={handleClose} transition:fly={{ x: -10, duration: 100 }} />
	<div class="navbar" transition:fly={{ x: -100, duration: 200 }}>
		<div class="top">Shop</div>
		<div class="nav-item">
			<a
				href="#recomended"
				class="link"
				class:active={activeShop === 'recomended'}
				on:click|preventDefault={() => handleClick('recomended')}
			>
				{#if outfitsPromo}
					<NoticeMark name="recomended-{$patchVersion}" />
				{/if}
				<i class="gi-primo-star" />
				<i class="gi-caret-up" />
				<div class="border"><i class="gi-recomended" /> Recomended</div>
			</a>
			<a
				href="#outfits"
				class="link"
				class:active={activeShop === 'outfits'}
				on:click|preventDefault={() => handleClick('outfits')}
			>
				{#if outfitsPromo}
					<NoticeMark name="outfits-{$patchVersion}" />
				{/if}
				<i class="gi-primo-star" />
				<i class="gi-caret-up" />
				<div class="border"><i class="gi-outfit" /> Character Outfits</div>
			</a>
			<a
				href="#paimon"
				class="link"
				class:active={activeShop === 'paimon-bargains'}
				on:click|preventDefault={() => handleClick('paimon-bargains')}
			>
				<i class="gi-primo-star" />
				<i class="gi-caret-up" />
				<div class="border"><i class="gi-paimon-bargains" /> Paimon's Bargains</div>
			</a>
			<a
				href="#genesis"
				class="link"
				class:active={activeShop === 'genesis'}
				on:click|preventDefault={() => handleClick('genesis')}
			>
				<i class="gi-primo-star" />
				<i class="gi-caret-up" />
				<div class="border"><i class="gi-genesis" /> Crystal Top-Up</div>
			</a>
			<a
				href="#donate"
				class="link"
				class:active={activeShop === 'donate'}
				on:click|preventDefault={() => handleClick('donate')}
			>
				<i class="gi-primo-star" />
				<i class="gi-caret-up" />
				<div class="border"><i class="gi-companion" /> Donate</div>
			</a>
		</div>
	</div>
{/if}

<style>
	.navbar {
		width: 280px;
		height: 100%;
		display: block;
		background-color: rgba(75, 82, 101, 0.8);
		border-right: 1px solid #d2c69c;
		border-left: 1px solid #d2c69c;
		color: #d2c69c;
		margin-right: 3%;
	}
	:global(.mobile) .navbar {
		width: 190px;
	}

	.top {
		font-size: 1.5rem;
		width: 100%;
		height: 80px;
		background-color: #3b4255;
		padding: 0 20px 20px;
		display: flex;
		align-items: flex-end;
	}
	:global(.mobile) .top {
		height: 50px;
		font-size: 1.2rem;
		padding: 0 20px 10px;
		margin-bottom: -10px;
	}

	.nav-item {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		color: #f0e4d4;
	}

	.link {
		position: relative;
		transition: all 0.2s;
		text-decoration: none;
		color: #ededed;
		padding: 2px;
	}
	:global(.mobile) .link {
		padding: 1px;
	}
	.link:not(.active) > i {
		display: none;
	}
	.link .border {
		padding: 0px 10px;
		border: 2px solid transparent;
		display: flex !important;
		align-items: center;
	}
	:global(.mobile) .link .border {
		padding: 2px 7px;
	}
	.border i {
		font-size: 2rem;
		display: inline-block;
		margin-right: 10px;
	}
	:global(.mobile) .border i {
		font-size: 1.4rem;
	}
	.link.active,
	.link:hover {
		background-color: #ede5d8;
		color: #40475a;
		border-radius: 2px;
	}
	.link.active > i {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: #ede5d8;
	}
	.gi-caret-up {
		left: -1.5rem;
		font-size: 2rem;
		transform: translateY(-50%) rotate(90deg) !important;
	}
	:global(.mobile) .gi-caret-up {
		left: -1rem;
		font-size: 1rem;
	}
	.link.active .border {
		display: block;
		border: 2px solid #c1b198;
		border-radius: 2px;
	}
	.gi-primo-star {
		right: -1.3rem;
		font-size: 1.3rem;
	}
	:global(.mobile) .gi-primo-star {
		right: -1rem;
		font-size: 1rem;
	}
	@media screen and (max-width: 400px) {
		.navbar {
			position: fixed;
			top: 0;
			left: 0;
			width: 200px;
			background-color: rgba(75, 82, 101, 1);
			z-index: 10;
		}
		.bg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(75, 82, 101, 0.8);
			z-index: 8;
		}
	}
</style>
