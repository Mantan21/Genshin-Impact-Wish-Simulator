<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { APP_TITLE } from '$lib/env';
	import { viewportWidth, viewportHeight } from '$lib/store/stores';
	import { getName } from '$lib/functions/nameText';

	import Icon from '$lib/components/utility/Icon.svelte';

	let data = {
		rarity: 0,
		name: '',
		stelaFortuna: false,
		fateType: '',
		fateQty: 0,
		vision: ''
	};

	$: splatterWidth = $viewportHeight > $viewportWidth ? $viewportWidth : $viewportHeight;
	$: splatterStyle = `width: ${splatterWidth}px; height: ${splatterWidth}px`;

	const getData = (decoded) => {
		console.log(decoded);
		let [name, rarity, vision, stelaFortuna, fateQty, fateType] = decoded.split('/');
		stelaFortuna = stelaFortuna === '1';
		rarity = parseInt(rarity, 10);
		fateType = fateType !== 'undefined' ? fateType : false;
		data = { name, rarity, vision, stelaFortuna, fateQty, fateType };
	};

	const encoded = $page.query.get('a');
	onMount(() => {
		try {
			if (encoded) {
				let decoded = atob(encoded);
				return getData(decoded);
			}
			window.location.href = '/';
		} catch (e) {
			window.location.href = '/';
		}
	});
</script>

<title> Character Result | {APP_TITLE} </title>

<div class="wish-result">
	<div class="container">
		<div class="splatter" style={splatterStyle}>
			<img
				src="/assets/images/characters/splash-art/{data.rarity}star/{data.name}.webp"
				alt={data.name}
				class="splash-art"
			/>

			<div class="info">
				<i class="elemen gi-{data.vision}" />
				<div class="name">
					<div class="text">
						{getName(data.name)}
					</div>
					<div class="star">
						{#each Array(data.rarity) as _, i (i)}
							<i class="gi-star" style={`animation-delay: ${2.3 + i * 0.15}s`} />
						{/each}
					</div>
				</div>

				<div class="bonus">
					{#if data.stelaFortuna}
						<div class="stella stella{data.rarity}">
							<img
								src="/assets/images/utility/stella-fortuna-{data.rarity}star.webp"
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

				<!-- <Share page="chars" /> -->
			</div>
		</div>
	</div>
</div>

<style>
	.wish-result {
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		background-image: url('/assets/images/background/splash-background.webp');
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
		-webkit-text-stroke: 0.2px #000;
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
