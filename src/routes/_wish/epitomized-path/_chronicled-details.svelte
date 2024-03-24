<script>
	import { json, t } from 'svelte-i18n';
	import { cookie } from '$lib/helpers/dataAPI/api-cookie';
	import { activeBanner, assets, bannerList, chronicledCourse } from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';
	import { get5StarItem } from '$lib/helpers/gacha/itemdrop-base';
	import InventoryItem from '../../_inventory/_inventory-item.svelte';

	const { characters, weapons, region, stdver } = $bannerList[$activeBanner];
	const featuredChar = get5StarItem({
		banner: 'chronicled',
		rateupItem: [...characters['5star']],
		type: 'character',
		region,
		stdver
	});
	const featuredWp = get5StarItem({
		banner: 'chronicled',
		rateupItem: [...weapons['5star']],
		type: 'weapon',
		region,
		stdver
	});

	const featuredList = [
		{ type: 'character', list: featuredChar },
		{ type: 'weapon', list: featuredWp }
	];

	let activeTab = cookie.get('chronTab') || 'rules';
	$: cookie.set('chronTab', activeTab);
	const switchTab = (target) => {
		if (activeTab === target) return;
		activeTab = target;
		playSfx('shopsubnav');
	};
</script>

<div class="wrapper">
	<nav class="nav-item-list" style="--bg-active: url('{$assets['shop-nav-bg.webp']}')">
		{#each ['rules', 'details'] as nav}
			<button
				class="nav-link-item"
				class:active={nav === activeTab}
				on:click={() => switchTab(nav)}
			>
				<div class="border">{$t(`epitomizedPath.${nav}`)}</div>
			</button>
		{/each}
	</nav>

	<!-- Details List -->
	{#if activeTab === 'details'}
		<div class="list">
			<div class="scrollable">
				{#each featuredList as { type, list }}
					<h2>
						<span>{$t(type)}</span>
						{#if $chronicledCourse.type === type}
							<span style="margin-left: auto;">
								{$t('epitomizedPath.setFor')}<i class="gi-arrow-up" />
							</span>
						{/if}
					</h2>
					<div class="row">
						{#each list as { name, weaponType, type, vision }}
							{@const localName = type === 'weapon' ? $t(name) : $t(`${name}.name`)}
							<div class="col">
								<InventoryItem
									noStars
									itemdata={{ name, weaponType, localName, rarity: 5, type, vision }}
								/>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<!-- Description -->
	{:else}
		<div class="list">
			<div class="scrollable">
				{#each $json('epitomizedPath.chronicledRules') as article}
					<p>· {@html article}</p>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Nav */
	nav.nav-item-list {
		display: flex;
		justify-content: center;
		border-top: 1px solid #d2c69c;
		border-bottom: 1px solid #d2c69c;
		width: 100%;
		background-image: linear-gradient(
			to right,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 0.5) 15%,
			rgba(0, 0, 0, 0.5),
			rgba(0, 0, 0, 0.5) 85%,
			rgba(0, 0, 0, 0)
		);
	}
	:global(.mobile) nav.nav-item-list {
		flex-wrap: nowrap;
	}

	.nav-link-item {
		color: #d2c69c;
		position: relative;
		aspect-ratio: 720/125;
		width: 50%;
		flex-basis: 50%;
		font-size: calc(0.03 * var(--modal-height));
	}

	.nav-link-item .border {
		width: 100%;
		aspect-ratio: 669/122;
		background-repeat: no-repeat;
		background-size: contain;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		padding: 0 10%;
		transition: all 0.2s;
	}

	.nav-link-item.active .border,
	.nav-link-item:hover .border {
		color: var(--text-color);
		background-image: var(--bg-active);
	}
	/* End Nav */

	.list,
	.wrapper,
	.scrollable {
		width: 100%;
		height: 100%;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
	}

	.list {
		padding-top: 2%;
		text-align: left;
		color: #ab9075;
	}
	.scrollable {
		overflow: auto;
		padding: 0 2%;
		height: calc(0.8 * var(--modal-height));
	}

	h2 {
		display: flex;
		align-items: center;
		white-space: nowrap;
		background-color: #ddcfb5;
		color: #8f7859;
		padding: 3% 6.5% 3% 2%;
		font-size: calc(0.027 * var(--modal-height));
		line-height: 0;
		margin-top: 5%;
		position: relative;
	}

	h2 i::before {
		color: #f19200;
		font-size: calc(0.04 * var(--modal-height));
		position: absolute;
		right: 1%;
		top: 0;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		margin-top: 1%;
	}
	.col {
		width: 25%;
		flex-basis: 25%;
		transform: scale(0.9);
		pointer-events: none;
	}

	p :global(span) {
		color: #ea930e;
	}
</style>
