<script>
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import { APP_TITLE } from '$lib/env';
	import { viewportWidth, viewportHeight, assets } from '$lib/store/stores';
	import Icon from '$lib/components/utility/Icon.svelte';
	import {} from '$lib/helpers/outfit';

	let isError;
	let data = {
		rarity: 0,
		name: 'No Name',
		stelaFortuna: false,
		fateType: '',
		fateQty: 0,
		vision: ''
	};

	$: title = $t(`${data.name}.name`);
	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	const getData = (decoded) => {
		const splited = decoded.split('/');
		if (splited.length < 6) return { name: 'No Name' };
		let [name, rarity, vision, stelaFortuna, fateQty, fateType, outfit] = splited;
		outfit = ['undefined', 'NaN'].includes(outfit) ? null : outfit;
		stelaFortuna = stelaFortuna === '1';
		rarity = parseInt(rarity, 10);
		fateType = fateType !== 'undefined' ? fateType : false;
		return { name, rarity, vision, stelaFortuna, fateQty, fateType, outfit };
	};

	const resolveData = () => {
		try {
			const url = new URL(window.location.href);
			const searchParams = new URLSearchParams(url.search);
			const encoded = searchParams.get('a');
			if (encoded) {
				const decoded = atob(encoded);
				data = getData(decoded);
				if (data.name !== 'No Name' || data.rarity) return;
			}
			throw new Error('No Data to show');
		} catch (e) {
			isError = true;
			window.location.replace('/');
		}
	};

	onMount(resolveData);
</script>

<svelte:head>
	<title>
		{title} | {$t('title', { default: APP_TITLE })}
	</title>

	<meta name="title" content={APP_TITLE} />
	<meta property="og:title" content={APP_TITLE} />
	<meta property="twitter:title" content={APP_TITLE} />

	<!-- <meta
		name="twitter:image:src"
		content="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/chars?a={encoded}"
	/>
	<meta
		property="twitter:image"
		content="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/chars?a={encoded}"
	/>
	<meta
		property="og:image"
		content="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/chars?a={encoded}"
	/>
	<link
		rel="fluid-icon"
		href="https://mini.s-shot.ru/896x414/JPEG/896/?{HOST}/screen/chars?a={encoded}"
		title={APP_TITLE}
	/> -->
</svelte:head>

{#if isError}
	<div class="error">
		<h1>You're going to unresolved page, redirecting to index ...</h1>
	</div>
{:else}
	<div class="wish-result" style="background-image: url('{$assets['splash-background.webp']}');">
		<div class="container">
			{#if data.name !== 'No Name'}
				<div class="splatter" style={splatterStyle}>
					<img
						src={$assets[`splash-art/${data.outfit || data.name}`]}
						alt={data.name}
						class="splash-art"
					/>

					<div class="info">
						<i class="elemen gi-{data.vision} {data.vision} filter-drop icon-gradient" />
						<div class="name">
							<div class="text">
								{title}
							</div>
							<div class="star">
								{#each Array(data.rarity) as _, i (i)}
									<i class="gi-star" />
								{/each}
							</div>
						</div>

						<div class="bonus">
							{#if data.stelaFortuna}
								<div class="stella stella{data.rarity}">
									<img
										src={$assets[`stella-fortuna-${data.rarity}star.webp`]}
										alt="Stella Formula"
									/>
								</div>
							{/if}

							{#if data.fateType}
								<div class="masterless starglitter">
									<Icon type="starglitter" width="80%" />
									<span> {data.fateQty} </span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.error {
		width: 100vw;
		height: 100vh;
		display: flex;
		background-color: #fff;
		justify-content: center;
		align-items: center;
	}

	.wish-result {
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		background-size: cover;
	}

	.container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.splatter {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.splash-art {
		height: 120%;
	}

	.info,
	.starfate {
		position: fixed;
		top: 60%;
		z-index: 10;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		width: 1100px;
		max-width: 95%;
	}
	.info {
		left: 50%;
		transform: translate(-50%, -50%);
	}

	:global(.mobile) .info {
		max-width: 83%;
	}

	.info i.elemen {
		font-size: 5.2em;
		margin-right: -7px;
		margin-top: -5px;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		z-index: -2;
	}

	.name {
		position: relative;
		z-index: +2;
		width: 100%;
	}

	.name .text {
		max-width: 38%;
		font-size: 2.5em;
		line-height: 1.2em;
		color: #fff;
		-webkit-text-stroke: 0.015em #000;
	}

	.gi-star {
		color: #f7cf33;
		font-size: 1.525em;
		display: inline-block;
	}

	.bonus {
		position: absolute;
		display: flex;
		bottom: -25vh;
		left: 50%;
		transform: translateX(-50%);
	}
	.stella,
	.bonus .masterless {
		width: 3.5rem;
		border-radius: 10%;
		overflow: hidden;
		display: block;
		text-align: center;
		position: relative;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
		padding-bottom: 0.5rem;
		box-shadow: 0 0 7px rgba(255, 255, 255, 0.5), 0 0 14px rgba(255, 255, 255, 0.3),
			0 0 30px rgba(255, 255, 255, 0.2);
	}
	.stella::after,
	.bonus .masterless span {
		width: 100%;
		font-size: 0.6rem;
		content: '1';
		display: block;
		position: absolute;
		left: 0;
		bottom: 0;
		color: #fff;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.stella img,
	.bonus .masterless img {
		width: 80%;
		height: auto;
	}

	.stella5,
	.bonus .starglitter {
		background-image: linear-gradient(to top, #ca8937, #a47853);
	}

	.stella4 {
		background-image: linear-gradient(to top, #a47ab9, #7e78a9);
	}
</style>
