<script>
	import { onMount } from 'svelte';
	import { bannerActive, showWish, wishes, backsound } from '$lib/store/stores';
	import roll from '$lib/functions/roll';
	import Icon from '$lib/utility/Icon.svelte';

	$: fateType =
		$bannerActive === 'beginner' || $bannerActive === 'standard' ? 'acquaint' : 'intertwined';

	let audio;
	let v3star;
	let v4starSingle;
	let v4star;
	let v5starSingle;
	let v5star;
	let showOutput = false;

	const showOutputHandle = (rarity, rolltype = 'tenroll') => {
		showOutput = true;
		if (rolltype === 'single') {
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
		}

		// Multiple Roll
		if (rarity === 5) {
			v5star.style.display = 'unset';
			return v5star.play();
		}
		if (rarity === 4) {
			v4star.style.display = 'unset';
			return v4star.play();
		}
	};

	const singleRoll = () => {
		backsound.set(false);
		audio.currentTime = 0;
		audio.play();
		const wish = roll($bannerActive);
		wishes.set([wish]);
		showOutputHandle(wish.rarity, 'single');
	};

	const tenRoll = () => {
		backsound.set(false);
		audio.currentTime = 0;
		audio.play();
		const wishStar = [];
		const wishOutput = [];
		for (let i = 0; i < 10; i++) {
			const wish = roll($bannerActive);
			wishStar.push(wish.rarity);
			wishOutput.push(wish);
		}

		console.log(wishStar);
		wishes.set(wishOutput);
		if (wishStar.includes(5)) return showOutputHandle(5);
		if (wishStar.includes(4)) return showOutputHandle(4);
		return showOutputHandle(3);
	};

	onMount(() => {
		[v3star, v4starSingle, v4star, v5starSingle, v5star].forEach((video) => {
			video.addEventListener('ended', () => {
				showOutput = false;
				video.style.display = 'none';
				showWish.set(true);
			});
		});
	});
</script>

<audio bind:this={audio}>
	<source src="./assets/sfx/roll-button-click.ogg" type="audio/ogg" />
</audio>

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
		transition: all 0.2s;
	}

	button:active {
		transform: scale(0.95);
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
