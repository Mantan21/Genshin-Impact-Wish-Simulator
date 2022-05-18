<script>
	import { fade } from 'svelte/transition';
	import { isLoaded, showBeginner, mobileMode, isMobile, viewportHeight } from '$lib/store/stores';
	import { beginnerRoll } from '$lib/store/localstore';
	import { onMount } from 'svelte';

	const start = 0;
	const end = 110;
	let current = -1;

	const progressLoader = () => {
		const a = performance.getEntriesByType('navigation')[0];
		const estimatedTime = -(a.loadEventEnd - a.connectStart);
		const duration = parseInt((estimatedTime / 1000) % 60) * 100;
		animateValue(duration);
	};

	function animateValue(duration) {
		const range = end - start;
		current = start;
		const increment = end > start ? 1 : -1;
		const stepTime = Math.abs(Math.floor(duration / range));

		let timer = setInterval(() => {
			current += increment;
			if (current === end) {
				clearInterval(timer);
			}
		}, stepTime);
	}

	const show = (progress, loaded) => {
		if (progress < end) return true;
		if (!loaded) return true;
		return false;
	};

	onMount(() => {
		if (beginnerRoll.get() > 19) showBeginner.set(false);
		progressLoader();
	});
</script>

{#if show(current, $isLoaded)}
	<div class="loader" out:fade={{ duration: 500, delay: 1000 }} style="height: {$viewportHeight}px">
		<div class="content">
			<div class="progress">
				<div class="icon">
					<i class="gi-pyro" />
					<i class="gi-hydro" />
					<i class="gi-anemo" />
					<i class="gi-electro" />
					<i class="gi-dendro" />
					<i class="gi-cryo" />
					<i class="gi-geo" />
				</div>
				<div class="blend">
					<div class="unfilled" />
					<div class="filled animate" style="width:{current}%" />
				</div>
			</div>

			{#if current < 0}
				<div class="text connecting" transition:fade>Connecting</div>
			{:else}
				<div class="text" in:fade>{current > 99 ? 100 : current}%</div>
			{/if}

			{#if $isMobile && !$mobileMode}
				<div class="rotate">
					<i class="gi-rotate-phone" />
					<span>Rotate for better experience </span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32px;
		color: #666666;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #fff;
		z-index: 9999;
	}

	.content {
		display: block;
		text-align: center;
	}

	.text {
		font-size: 1rem;
		height: 1.5rem;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.text.connecting::after {
		content: '..';
		display: inline-block;
		animation: dot 4s linear infinite;
	}

	.progress {
		width: max-content;
		position: relative;
	}
	.blend {
		mix-blend-mode: lighten;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.rotate {
		position: fixed;
		width: 100%;
		left: 50%;
		bottom: 20%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #000;
	}
	.rotate span {
		font-size: 0.8rem;
		margin-top: 1rem;
	}

	.rotate i {
		animation: rotatePhone 1s infinite alternate;
		transform-origin: center;
		line-height: 1rem;
	}

	.unfilled,
	.filled {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
	}

	.unfilled {
		width: 100%;
		background-color: #f7f7f7;
	}
	.filled {
		background-color: #666666;
	}

	@keyframes dot {
		0% {
			content: '';
		}
		33% {
			content: '.';
		}
		66% {
			content: '..';
		}
		100% {
			content: '...';
		}
	}

	@keyframes rotatePhone {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-90deg);
		}
	}
</style>
