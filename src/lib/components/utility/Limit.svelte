<script>
	import { browser } from '$app/env';
	import Iklan from './Iklan.svelte';

	const random = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	let redirect = false;
	let timer = 1;
	const timeOut = setTimeout(() => {
		redirect = true;
		clearTimeout(timeOut);
	}, 7000);

	const interval = setInterval(() => {
		timer -= 1;
		if (timer < 1) clearInterval(interval);
	}, 1000);

	const site = 'https://wishsimulator-genshin.vercel.app';
	const { pathname, search } = browser ? window.location : { search: '', pathname: '' };
	$: if (redirect && browser) window.location.replace(`${site}${pathname}${search}`);
</script>

<svelte:head>
	<title>Genshin Impact Wish Simulator</title>
	<Iklan head />
</svelte:head>

<section>
	<img class="bg" src="/assets/images/background/bg{random(1, 16)}.webp" alt="background" />
	<div class="container">
		<i class="gi-primo-star top-left" />
		<i class="gi-primo-star top-right" />
		<i class="gi-primo-star bottom-left" />
		<i class="gi-primo-star bottom-right" />
		<i class="gi-inazuma icon-bg" />
		<h1>Under Maintenance</h1>
		<h2>The App has been temporarily moved to</h2>

		<h1>
			<a href="{site}{pathname}{search}">
				{site}
			</a>
		</h1>
		<h2>Don't worry, We'll back in <b>Soon</b></h2>

		<p>redirecting in {timer} seconds</p>

		<Iklan type="banner" />
	</div>
</section>

<style>
	:global(body) {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}
	a {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	section {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		position: relative;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.bg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 110%;
		height: 110%;
		object-fit: cover;
		filter: blur(5px);
	}

	.container {
		position: relative;
		z-index: +1;
		width: 80%;
		height: 70%;
		background-color: #ece6de;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.gi-primo-star {
		color: #fdf0ac;
		font-size: 1.5rem;
		display: inline-block;
		position: absolute;
		filter: drop-shadow(0 0 7px rgba(227, 149, 48, 0.9));
	}
	.top-left {
		top: -0.8rem;
		left: -0.5rem;
		transform: rotate(-45deg);
	}
	.top-right {
		top: -0.8rem;
		right: -0.5rem;
		transform: rotate(45deg);
	}
	.bottom-left {
		bottom: -0.8rem;
		left: -0.5rem;
		transform: rotate(-135deg);
	}
	.bottom-right {
		bottom: -0.8rem;
		right: -0.5rem;
		transform: rotate(135deg);
	}
	.icon-bg {
		font-size: 17em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #e4dcce;
		z-index: -1;
	}

	h1 {
		font-size: 2rem;
	}
	h2 {
		font-size: 1.2rem;
		padding: 0.6rem 0;
	}
	p {
		font-size: 1rem;
	}

	a {
		border-radius: 40px;
		color: white;
		background-color: #4a5265;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 4rem 5px 4rem;
		transition: all 0.2s;
		margin-top: 1rem;
	}

	a:hover {
		background-color: rgb(51, 57, 71);
	}
</style>
