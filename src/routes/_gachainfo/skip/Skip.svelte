<script>
    import { getContext, setContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { afterUpdate } from 'svelte';
	import OverlayScrollbars from 'overlayscrollbars';
	import {
		activeBanner,
		bannerList,
		assets,
        preloadVersion,
		activeVersion,
		primogem,
		intertwined,
		genesis, history,
		inventory,
		shop,
		pull_roll,
		resetStore,
		details
	} from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';
    import updates from '$lib/data/updates.json';
	import { storageLocal, buttons } from '$lib/helpers/dataAPI/api-localstore';
	import { setBalance } from '$lib/helpers/gacha/historyUtils';
	import { userCurrencies } from '$lib/helpers/currencies';
	import { user } from '$lib/store/authStore.js';
	
	import Title from '../_title.svelte';
	import List from './_list.svelte';
	import PromotionalV2 from './_promotional-v2.svelte';

    import ButtonModal from '$lib/components/ButtonModal.svelte';

	export let tplVersion = 'v2';

	let {
		bannerName,
		stdver,
		region,
		type: banner,
		character = '',
		characters: ch = {},
		weapons: wp = {},
		featured = [],
		rateup = []
	} = $bannerList[$activeBanner];
	
	// Get Droplist
	const { patch: version, phase: activePhase } = $activeVersion;

    let processedUpdates = [...updates.data].reverse();

    let latestIndex = processedUpdates.findIndex(item => Number(item.patch) === Number(version));
    let newPatchIndex = latestIndex + 1;

    let patch = processedUpdates[newPatchIndex]?.patch ?? version;

    console.log("Patch:", patch)

    if (patch !== undefined || patch == Number(patch)){
        patch = patch.toFixed(1);
    }

    let phase = 1;
	let bossFought = false;

    const navigate = getContext('navigate');
	const skipBanner = () => {
        playSfx();
		setBalance($bannerList, { primos: $primogem, fates: $intertwined, crysts: $genesis }, "end");
		// If select the same banner with the active one, change nothing just back to index
        console.log("Skipping to:", patch, phase); // Debug log
		const { patch: version, phase: activePhase } = $activeVersion;
		navigate('index');
		if (activePhase === phase && version === patch) return;

		buttons.set($bannerList, { history: $history, inventory: $inventory, shop: $shop, pull_roll: $pull_roll, details: $details });
		
		userCurrencies.currReplenish($user?.group, bannerName);
		storageLocal.set('exchanges', 0);
		storageLocal.set('expenses', 0);


		resetStore();
		// Select a banner
		preloadVersion.set({ patch, phase });
	};

	const noPromo = banner.match(/(standard|beginner)/);
	let activeContent = noPromo ? 2 : 1;

	// Click Handler
	const select = (selected) => {
		if (activeContent === selected) return;
		activeContent = selected;
		playSfx();
	};

	let scrollable;
	afterUpdate(() => {
		OverlayScrollbars(scrollable, { sizeAutoCapable: false, className: 'os-theme-light' });
	});

	function wasFought(event){
		bossFought = event.detail;
	}
</script>

<svelte:head>
	<title>
		{$t('New Character')}
	</title>
</svelte:head>

{#if tplVersion === 'v2'}
<Title type="banner" />
	<nav style="background-image: url({$assets['book-select-bg.webp']});">
		<div class="nav-item" class:active={activeContent === 1}>
			<button on:click={() => select(1)}>
				{$t('skip.promotional')}
			</button>
		</div>
		<div class="nav-item" class:active={activeContent === 2}>
			<button on:click={() => select(2)}> {$t('skip.boss')} </button>
		</div>
	</nav>

	<div class="content" bind:this={scrollable}>
		<div class="wrapper">
			{#if activeContent === 1}
				<PromotionalV2
				/>
			{:else if activeContent === 2}
				<List on:didFight={wasFought}/>
			{/if}
		</div>
	</div>
{:else}
	<PromotionalV2 />
	<List on:didFight={wasFought}/>
{/if}

<br>
<div align="center">
	<div class="tooltip-wrapper">
    	{#each [...updates.data].reverse() as { patch }, i (i)}
	    	{#if i === newPatchIndex}
            	<ButtonModal on:click={() => skipBanner( updates.patch, 1 )} disabled={!bossFought}>Skip</ButtonModal>
	    	{/if}
    	{/each}
		{#if !bossFought}
		<span class="tooltip">You need to fight the boss first!</span>
		{/if}
	</div>
</div>

<style>
	nav {
		width: 100%;
		line-height: 0;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		background-size: cover;
		background-position: center center;
	}

	.nav-item {
		width: 33.33333%;
		padding: 0;
		display: flex;
		justify-content: center;
	}
	.nav-item button {
		font-size: calc(0.017 * var(--content-width));
		width: 100%;
		aspect-ratio: 557/86;
		opacity: 0.8;
		background-size: contain;
		background-position: center center;
		background-repeat: no-repeat;
		transition: all 0.2s;
	}

	.nav-item.active button,
	.nav-item button:hover {
		background-image: url('data:image/webp;base64,UklGRuwEAABXRUJQVlA4WAoAAAAQAAAAKwEAMAAAQUxQSH0BAAABgEJt27LmxeauzSsanUymO0T63H0N6lgmcmhzadT5xtzd/T//j8MXnxgRE0A5ipSB2B8Hxt9YQCkippplLg5IblnDpDQYB2WwlIV8GxXbchb6c1Sc61loz1BxpmVhvUfFnTW/EvuGgAphw16SR1XvYxyYj71VOVWNvceh+T5WlUPZwEccnJ+DZVmkvpc4PF980kzGWBygMWOGxnAcouHGNM8nRj49RNS0HgfpehOR+xsl326qicRhGqkxHeHkyNTxjZPvjhCPEz60GQfq5iNSHn+R8schhftAyscpUk4XBZwIi34eJ7zf/oSTJ0drFCfRtsJpASXCdCGZr1ByZSYqnUFJsIyIDCcYOTEQERWM8wjhxwvSqH0OIXPtlFm/jY9tPWUV267QcWUTZ6MC7xU2rrwFlGuBax8Z+64Cyl1qXORRwS8apZS35RYVtxZiqDtDxZmOhf4cFed6FvJtVGzLWZQGUTFbyoI0yxwiuGUNMRUpA7E/Dox/sYBSlAsAVlA4IEgDAABwFgCdASosATEAPlEmj0WjoiEiopgMUHAKCWcDyE4D3GgalpKNufSrTlG6/4HRwJ8fjMWOtzhg+/VupDXbutNKQ127r8B56ZwFQ0KiDO8f0bRALDyOFanPFD4UOCQPNucJgeVzmh7Eh4LW6YT48bBMV2Es6oWg3d2YoQ6gIIRBFYaFdZWyQeYHIohg0eTISZK7lrVPFXMm2OrTYBjpg9tTtGrF9Zpzg9Fz4RBo+TAtMNiXrDT+xCkRtAK9oAD++yyqMfJtYdJKgf2vrcNlZHq/DVUvFH6ZJK7IOrgZ93A5P1phmNx49/vcI1iLQR9fGhKNUXTL0BqDOaHlBCl+VeBjr5Zggy4F8iMxYUff5SqgwW7UGC3OsK1jAYPYAqsJZv+1VVCYIUm2D37147bJNVKgvZBTq2chCN1Q7ZymeKwhMqwPaLP9Bs/8Trz57hxOj9pWfEwugAuH63BuUK/uCQS0YebG3AgduCPvf8/1bX3mfizRuMODha1URGbCF2vE7tF/53tI8Nnw+lyx1RkqXhdrYn3PtomSCdgaRN8cvcR8Jk1J4dZppG0OuT1ikz2KPR1aFxONss8Ad/2W3WsZmVYOMV7LKM0uWE9deCoJfspH6el+zVaVfZoAoJgp7a8GTl0AiloTgFbahcJ93vIuQ26q68eP2Uy6kfDLbTLOH/VpMm3PnlLJid+keLuErU5yXjN0qFQu83BL58NQoaeO8CYWuhtPbaSTcmEsg3Cc4eurv3LEhLLj6MC1z8mQ0BrsXYp/SHIuU3LfAmf0rtMi5fXrBDFYB9Cqqgl/Dx3GqXlykoqZ7JN4O9P8E4VkZzUbpndg1ileL9220RAgFWZOwDNnoaj86MTL/lJltaA+0CuOfTWj5ir10bx/JG+Kt/xa78WiNULXV9LbCKhOIDJze8+lKVY2OrCV6rbDCfcyz60+srrneBxx1sL4HwowjVYf0ZRr/Le9qcLeqHv71USrK5Ih7iKYdwDC/RHvM0/VVOFCjU1mpAfJU9z5Ob6TnCMSDQ5EuXAOWkQxyxAqn8UhVw5xm/9ZpWEBfMfhcbI3W2k6z4fuh/SEiAAAABtCZhqluII+AYbJsmRLyfzH6eMYZVEUkAgH4EaAAAA=');
		color: #fff;
	}

	.nav-item.active button {
		opacity: 1;
	}

	button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

	.content {
		height: 100%;
	}

	.tooltip-wrapper {
    	position: relative;
    	display: inline-block;
	}

	.tooltip {
    	visibility: hidden;
    	background-color: rgba(162, 128, 82, 0.9);
    	color: #fff;
    	text-align: center;
    	padding: 5px;
    	border-radius: 5px;
    	position: absolute;
    	bottom: 120%;
    	left: 50%;
    	transform: translateX(-50%);
    	white-space: nowrap;
    	opacity: 0;
    	transition: opacity 0.3s;
	}

	.tooltip-wrapper:hover .tooltip {
    	visibility: visible;
    	opacity: 1;
	}
</style>
