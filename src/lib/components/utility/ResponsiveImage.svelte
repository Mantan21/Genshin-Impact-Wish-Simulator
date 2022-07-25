<script>
	export let src = '';
	export let alt = '';
	export let wrapperClass;

	const splitSrc = src.split('.');
	const source = splitSrc.slice(0, -1).join();
</script>

<div class="wrapper {wrapperClass}" style="min-height: 100px; width: 100%;">
	<div class="s-A5q0eY9StNhG loaded" style="position: relative; width: 100%;">
		<div style="position: relative; overflow: hidden;">
			<picture>
				<source
					type="image/webp"
					srcset=" /g{source}-400.webp 375w, /g{source}-800.webp 768w, g{src}"
					sizes="(max-width: 800px) 768px, 800px"
				/>
				<img src="/g{src}" {alt} />
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
