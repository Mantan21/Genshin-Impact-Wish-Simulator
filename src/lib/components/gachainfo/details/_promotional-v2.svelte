<script>
	import { t } from 'svelte-i18n';
	import { getName } from '$lib/helpers/nameText';
	import { assets } from '$lib/store/stores';

	export let data = { featured: [], items: [], banner: '' };
	const { featured, items, banner } = data;
</script>

{#if ['events', 'weapons'].includes(banner)}
	<h2><span> {$t('details.increasedRate')} </span> <span class="line" /></h2>

	<h3 class="star5">
		<div class="star">
			{#each Array(5) as i} <i class="gi-star" /> {/each}
		</div>
		<span>
			{$t('details.percentageDrop', {
				values: { rarity: 5, percentage: banner === 'weapons' ? '75.000%' : '50.000%' }
			})}
		</span>
	</h3>

	<div class="row">
		{#if banner === 'events'}
			<div class="name">
				<span class="{featured[0].vision}-flat">
					{$t(`${featured[0].name}.name`)}
				</span>
			</div>
			<div class="pic">
				<div class="pic-item">
					<picture class="star5" style="background-image:url('{$assets['5star-bg.webp']}');">
						<i class="gi-{featured[0].vision} {featured[0].vision} icon-gradient filter-drop" />
						<img
							crossorigin="anonymous"
							src={$assets[`face/${featured[0].name}`]}
							alt={getName(featured[0].name)}
							on:error={(e) => e.target.remove()}
						/>
					</picture>
					<span class="stars">
						{#each Array(5) as i}
							<i class="gi-star" />
						{/each}
					</span>
					<caption>Lv.1</caption>
				</div>
			</div>
		{:else}
			<div class="name">
				{#each items[0].items as { name }}
					<span style="color: #bd6932;">{$t(name)}</span>
				{/each}
			</div>
			<div class="pic">
				{#each items[0].items as { name, type }}
					<div class="pic-item">
						<picture class="star5" style="background-image:url('{$assets['5star-bg.webp']}')">
							<img
								src={$assets[name]}
								alt={getName(name)}
								class={type}
								crossorigin="anonymous"
								on:error={(e) => e.target.remove()}
							/>
						</picture>
						<span class="stars">
							{#each Array(5) as i}
								<i class="gi-star" />
							{/each}
						</span>
						<caption>Lv.1</caption>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<h3 class="star4">
		<div class="star">
			{#each Array(4) as i} <i class="gi-star" /> {/each}
		</div>
		<i class="gi-star" style="color: transparent;" />
		<span>
			{$t('details.percentageDrop', {
				values: { rarity: 4, percentage: banner === 'weapons' ? '75.000%' : '50.000%' }
			})}
		</span>
	</h3>

	<div class="row">
		<div class="name">
			{#each items[1].items as { name, vision }}
				<span class="{vision || 'wanderlust'}-flat"
					>{$t(`${name}${banner === 'events' ? '.name' : ''}`)}</span
				>
			{/each}
		</div>

		<div class="pic">
			{#if banner === 'events'}
				{#each items[1].items as { name, vision }}
					<div class="pic-item">
						<picture class="star4" style="background-image:url('{$assets['4star-bg.webp']}')">
							<i class="gi-{vision} {vision} icon-gradient filter-drop" />
							<img
								src={$assets[`face/${name}`]}
								alt={getName(name)}
								crossorigin="anonymous"
								on:error={(e) => e.target.remove()}
							/>
						</picture>
						<span class="stars">
							{#each Array(4) as i}
								<i class="gi-star" />
							{/each}
						</span>
						<caption>Lv.1</caption>
					</div>
				{/each}
			{:else}
				{#each items[1].items as { name, type }}
					<div class="pic-item">
						<picture class="star4" style="background-image:url('{$assets['4star-bg.webp']}')">
							<img
								src={$assets[name]}
								alt={getName(name)}
								class={type}
								crossorigin="anonymous"
								on:error={(e) => e.target.remove()}
							/>
						</picture>
						<span class="stars">
							{#each Array(4) as i}
								<i class="gi-star" />
							{/each}
						</span>
						<caption>Lv.1</caption>
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style>
	.beginner :global(span) {
		color: #cba885;
	}

	.gi-star {
		color: #feca33;
	}

	h2 {
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
		display: flex;
	}

	h2 span {
		color: var(--text-color);
		width: fit-content;
		white-space: nowrap;
		padding-right: 1rem;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		font-size: calc(0.014 * var(--content-width));
		color: #fff;
		display: flex;
		align-items: center;
		line-height: 0;
		padding: 0.5% 1%;
	}
	h3 span {
		padding-left: 2rem;
		color: #fff;
	}
	h3.star5 {
		background-color: #cfb383;
	}
	h3.star4 {
		background-color: #b5a8c9;
	}

	.row {
		display: flex;
		width: 100%;
	}
	.name {
		flex-basis: 35%;
		padding: 1.5%;
	}
	.name span {
		font-size: calc(0.014 * var(--content-width));
		display: block;
		padding: 1% 0;
	}
	.pic {
		flex-basis: 65%;
		padding-bottom: 1%;
	}

	.pic-item {
		margin: 2% 1.5% 0 0;
		padding-bottom: 4%;
		display: inline-block;
		position: relative;
		background-color: #fff;
		border-radius: 4%;
		overflow: hidden;
	}

	picture {
		height: calc(0.095 * var(--content-width));
		display: block;
		aspect-ratio: 1/1;
		background-size: cover;
		position: relative;
		overflow: hidden;
		border-bottom-right-radius: 20%;
	}

	img {
		width: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}

	img.claymore {
		transform: rotate(18deg) scale(1.15) translateX(-0.7em);
	}

	img.bow {
		transform: rotate(10deg) scale(1.25) translate(-0.5em, 0em);
	}

	img.polearm {
		transform: rotate(10deg) scale(1.5) translate(-12%, 12%);
		height: 200%;
	}

	img.sword {
		transform: rotate(10deg) scale(1.2) translateY(-1em) translate(-0.2em, 0.5em);
	}

	.stars {
		position: absolute;
		bottom: 10%;
		left: 50%;
		font-size: calc(0.015 * var(--content-width));
		transform: translateX(-50%);
	}

	picture i {
		position: absolute;
		z-index: +1;
		top: 0;
		left: 0;
		font-size: 1.3rem;
	}

	caption {
		font-size: calc(0.013 * var(--content-width));
		display: block;
		width: 100%;
		text-align: center;
		position: absolute;
		padding: 3%;
	}
</style>
