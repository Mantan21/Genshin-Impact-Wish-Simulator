<script>
	import { bannerActive } from '$lib/stores';
	import Icon from '$lib/utility/Icon.svelte';
	import { base4StarChance, base5StarChance } from '$lib/setup/probability';
	import { onMount } from 'svelte';

	$: fateType =
		$bannerActive === 'beginner' || $bannerActive === 'standard' ? 'acquaint' : 'intertwined';

	let pity4star = 0;
	let pity5star = 0;

	let v3star;
	let v4starSingle;
	let v4star;
	let v5starSingle;
	let v5star;
	let showOutput = false;

	const prob = (items) => {
		let chances = [];
		for (let i = 0; i < items.length; i++) {
			chances[i] = items[i].chance + (chances[i - 1] || 0);
		}
		const random = Math.random() * chances[chances.length - 1];
		const result = items[chances.findIndex((chance) => chance > random)];
		return result;
	};

	const roll = () => {
		const chance5star = base5StarChance[pity5star];
		let chance4star = base4StarChance[pity4star];
		let chance3star = 100 - base4StarChance[pity4star] - base5StarChance[pity5star];

		if (chance3star < 0 && pity5star > 89) chance4star = 0;
		if (chance3star < 0) chance3star = 0;

		const item = [
			{
				rarity: 3,
				chance: chance3star
			},
			{
				rarity: 4,
				chance: chance4star
			},
			{
				rarity: 5,
				chance: chance5star
			}
		];
		const result = prob(item);
		if (result.rarity === 5) {
			pity4star++;
			pity5star = 0;
		} else if (result.rarity === 4) {
			pity4star = 0;
			pity5star++;
		} else {
			pity4star++;
			pity5star++;
		}
		return result;
	};

	const showOutputHandle = (rarity) => {
		showOutput = true;
		if (rarity === 5) {
			v5starSingle.style.display = 'unset';
			return v5starSingle.play();
		}
		if (rarity === 4) {
			v4starSingle.style.display = 'unset';
			return v4starSingle.play();
		}
		v3star.style.display = 'unset';
		return v3star.play();
	};

	const singleRoll = () => {
		const wish = roll();
		console.log(wish, pity4star, pity5star);
		showOutputHandle(wish.rarity);
	};

	const tenRoll = () => {
		const wishStar = [];
		for (let i = 0; i < 10; i++) {
			const wish = roll();
			wishStar.push(wish.rarity);
		}

		console.log(wishStar);
		if (wishStar.includes(5)) return showOutputHandle(5);
		if (wishStar.includes(4)) return showOutputHandle(4);
		return showOutputHandle(3);
	};

	onMount(() => {
		[v3star, v4starSingle, v4star, v5starSingle, v5star].forEach((video) => {
			video.addEventListener('ended', () => {
				showOutput = false;
				video.style.display = 'none';
			});
		});
	});
</script>

<div class="wish-output" class:show={showOutput}>
	<div class="video">
		<video bind:this={v3star} preload="auto">
			<source src="./assets/videos/3star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v4starSingle} preload="auto">
			<source src="./assets/videos/4star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v4star} preload="auto">
			<source src="./assets/videos/4star.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v5starSingle} preload="auto">
			<source src="./assets/videos/5star-single.webm" type="video/webm" />
			<track kind="captions" />
		</video>
		<video bind:this={v5star} preload="auto">
			<source src="./assets/videos/5star.webm" type="video/webm" />
			<track kind="captions" />
		</video>
	</div>
</div>

<button class="single" on:click={singleRoll}>
	<div class="top">Wish x1</div>
	<div class="bottom">
		<Icon type={fateType} />
		<span style="margin-left: 7px"> x 1</span>
	</div>
</button>

<button class="ten" on:click={tenRoll}>
	<div class="top">Wish x10</div>
	<div class="bottom">
		<Icon type={fateType} />
		<span style="margin-left: 7px"> x 10</span>
	</div>
</button>

<style>
	.wish-output {
		position: fixed;
		z-index: 998;
		display: none;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
	.wish-output.show {
		display: block;
	}
	.video {
		position: relative;
		width: 100vw;
		height: 100vh;
	}
	video {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 100%;
		min-height: 100%;
		width: auto;
		height: auto;
	}

	/* Button */
	button {
		background-image: url('./assets/images/utility/button.svg');
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		width: 230px;
		height: 60px;
		margin: 0 5px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #a49a90;
	}

	button .bottom {
		display: flex;
		align-items: center;
	}

	:global(.mobile) button {
		width: 150px;
		height: 35px;
		margin: 0;
		font-size: 0.75rem;
	}
	:global(.mobile .right img, .mobile .wish img) {
		transform: scale(0.7);
	}
	:global(.mobile) .bottom {
		margin-top: -3px;
	}

	@media screen and (max-width: 900px) {
		button {
			width: 180px;
			height: 40px;
			margin: 0;
		}
		:global(.right img, .wish img) {
			transform: scale(0.8);
		}
	}
	@media screen and (max-width: 400px) {
		button {
			width: 140px;
			height: 30px;
			margin: 0;
		}
		:global(.right img, .wish img) {
			transform: scale(0.7);
		}
		.bottom {
			margin-top: -3px;
		}
	}
</style>
