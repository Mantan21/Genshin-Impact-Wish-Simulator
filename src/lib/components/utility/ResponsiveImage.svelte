<script>
	export let src = '';
	export let alt = '';
	export let wrapperClass;

	const splitSrc = src.split('.');
	const source = splitSrc.slice(0, -1).join();
</script>

<div class="wrapper {wrapperClass}" style="min-height: 100px; width: 100%;">
	<div style="position: relative; width: 100%;">
		<div style="position: relative; overflow: hidden;">
			<picture>
				<source media="(min-width: 900px)" srcset={src} />
				<source media="(min-width: 500px)" srcset="/g{source}-800.webp" />
				<img src="/g{source}-400.webp" {alt} />
			</picture>
		</div>
	</div>
</div>

<style>
	picture,
	img {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
