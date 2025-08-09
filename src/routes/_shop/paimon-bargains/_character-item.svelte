<script>
	import { getDetails } from '$lib/helpers/gacha/itemdrop-base';
	import { assets } from '$lib/store/app-stores';

	export let name;
	const { vision } = getDetails(name);
</script>

<div class="frame-content" style="--bg:url({$assets[`character-shop-frame.webp`]})">
	<div class="face bg-{vision}">
		<img src={$assets[`face/${name}`]} alt={name} />
	</div>
	<div class="frame" />
</div>

<style>
	.frame-content {
		aspect-ratio: 256/311;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.frame {
		width: 100%;
		height: 100%;
		background-image: var(--bg);
		background-size: contain;
		position: absolute;
		top: 0;
		left: 0;
	}

	.face {
		width: 75%;
		aspect-ratio: 200/270;
		display: flex;
		align-items: flex-end;
	}

	.face img {
		width: 100%;
		height: 100%;
	}
</style>

