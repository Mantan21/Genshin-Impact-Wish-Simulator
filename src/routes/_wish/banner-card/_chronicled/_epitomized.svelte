<script>
	import { getContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { assets } from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';
	import EpitomizedIcon from '../../epitomized-path/_icon.svelte';

	export let courseData = {};
	let selected, type, point;
	$: ({ type, weaponType, selected, point } = courseData);
	$: src = type === 'weapon' ? $assets[selected] : $assets[`face/${selected}`];

	const openModal = getContext('handleEpitomizedModal');
	const openDetail = () => {
		playSfx();
		openModal();
	};
</script>

<div class="courseActive">
	<button class="box" on:click={openDetail}>
		<div class="icon" class:active={point > 0}>
			<EpitomizedIcon blank responsive steps="1" {point} />
			<picture class="{type} {weaponType}">
				<img {src} alt="Item Icon" />
			</picture>
		</div>

		<div class="point">
			<div class="frame">
				<span> {$t('epitomizedPath.fatePoint')}:</span>
				<div class="number"><span>{point || 0}</span>/1</div>
				<i class="gi-refresh" />
			</div>
		</div>
	</button>
</div>

<style>
	.courseActive {
		margin-top: auto;
		width: 100%;
		height: calc(0.125 * var(--content-width));
		margin-bottom: 2.75%;
	}
	.box {
		height: inherit;
		position: relative;
	}
	.icon {
		height: 100%;
		aspect-ratio: 1/1;
		position: relative;
		z-index: +1;
	}
	.icon:not(.active)::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(1.05);
		border-radius: 100%;
		border: calc(0.002 * var(--content-width)) solid #edd8ab;
	}
	picture {
		height: 60%;
		aspect-ratio: 1/1;
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 100%;
		overflow: hidden;
	}
	img {
		width: 100%;
	}
	.weapon:not(.catalyst) img {
		transform: translate(-5%, -10%) rotate(13deg);
	}

	/* Point */
	.point {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translate(10%, -50%);
		aspect-ratio: 708/156;
		width: calc(0.3 * var(--content-width));
		font-size: calc(0.02 * var(--content-width));
		background-color: #ece5db;
		color: var(--text-color);
		filter: drop-shadow(0 0 calc(0.002 * var(--content-width)) rgba(179, 140, 81, 1));
	}

	.point .frame {
		height: 100%;
		width: 100%;
		display: flex;
		padding-right: 2%;
		align-items: center;
		justify-content: flex-end;
		line-height: 0;
		position: relative;
	}

	.frame::before {
		content: '';
		position: absolute;
		top: 50%;
		width: 100%;
		height: 100%;
		right: -3%;
		border-radius: 2rem;
		background-color: #ece5db;
		transform: translateY(-50%);
		z-index: -1;
	}
	.frame::after {
		content: '';
		opacity: 0.4;
		position: absolute;
		top: 50%;
		right: -1.5%;
		width: 100%;
		height: 90%;
		transform: translateY(-50%) rotate(180deg);
		background-size: contain;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsQAAACcCAMAAABPyU0CAAAAOVBMVEUAAADTu4vUvI7Uuo3TvI7TvI7UvI7TvozTu43TvI7Su47Pv4/fv43TvI7Tu43SvIzVuo3UvI/TvI7Io+VzAAAAEnRSTlMAQL9goL/eIHDvsBAQkIBQML8hIpUyAAADO0lEQVR42uzd22oCMRSG0dixM2oVZb//wzaOhzoWerjzh7VAxfuPkExibD9ZF7yg97YgYvKImHj/jHho8FJWIiadiIknYuKJmHgiJp6IiSdi4omYeL9G/FYLIublrOqZiAkjYuL9JeJVgxwiJp6IiSdi4omYeCImnoiJJ2LiiZh4IiaeiIknYuKJmHgiJp6IiSdi4omYeCImnoiJJ2LiiZh4Iibet4inrYjJ8hzxfqwaPxrkeI74ULWdGgR5injo3zcNkiwjnsaqdYMoy4jXVaPJBGEWEQ+uDyTQImKTCRI9RrwxmSDRQ8TTaDJBoh7x46quQZyviCerOjL1cg3EZLtHPG0NxGS6RzwYiAl1j9ijCVLdIj4aiEl1i3hns45U14in/mmzjkzXiIeq9waRrhG/WdYRq0dsNkG2Xq/ZBNkuEe/8so5cl4jHqlODTHPEJzsdBJsjHqp2DULNEa9NiQk2Rzy6fo1gPeL5bd8gVO/Xuo5s54iPtjpIdo54U3VokOoc8cHDCZKdI95VHRuk6hH7lw6y9YidnCDbHLHDxCTrEc8viCVi4omYeCImnoiJJ2LiecRGPBETz7Yz8eYDQO6wIpmjmMT7bO8OU1oHwgCKpiCtIdDHy/4XKxOjOFUQ//XCOWu4hJkk34yf4sk7xpMcO0HZiPhmUJQyI/vkOTyFPMdYkXdE/GpnR9gR8W3f1wWijoiX1agoXSNii2LSXDxD3nvEmzfFdJ1THf+tJ8g6I361niDrjHhzpShZI+JzPXFfoOgj4su+r7Z2JI2ID6sZJaI+I77b2hH1GfG2+h+TphGxRzFpI2KPYtJGxKe7UTuSvkS8rb49UzQi/nD3rpii6VjX676/LBAzRXzZ7e3omSIeRwteLSiImSPeVgsKcuaIl3+7NxTUPEQ8jnld/VhMymPE29WymJgR8eTm6zMx3yJ2gwc1IiZPxOSJmDwRkydi8kRMnojJEzF5IiZPxOSJmDwRkydi8kRMnojJEzF5IiZPxOSJmDwRkydi8n6KeOJSJZ7OZZ+ImB4Rk/drxLMXEfN0Lt9u+hIxMSImT8TkiZg8EZMnYvJETJ6IyftzxPCEREyeiMl7iPgNPx9ffAKGWGIAAAAASUVORK5CYII=');
		background-repeat: no-repeat;
	}

	.number {
		margin: 0 5% 0 2%;
	}
	.number span {
		color: #f08f00;
	}
</style>
