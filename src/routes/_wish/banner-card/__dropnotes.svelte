<script>
	import { t } from 'svelte-i18n';

	export let element = '';
	export let banner = '';
</script>

<div class="dropNotes" class:chronicle={banner === 'chronicled'}>
	<div class="scrollable">
		<div class="set card-stroke">
			{#if banner === 'beginner'}
				{$t('wish.banner.beginnerSet', { values: { character: $t('noelle.name') } })}
			{:else}
				{$t('wish.banner.probIncreased')}
			{/if}
		</div>
		<div class="desc bg-{element}" style="opacity: 90%;">
			<div class="icon">
				<i class="gi-primo-star" />
			</div>
			<div class="text">
				{$t('wish.banner.wishDescription')}
			</div>
		</div>
		<div class="note card-stroke">
			{#if banner !== 'chronicled'}
				{#if banner.match('character')}
					{$t('wish.banner.eventNote')}
				{/if}
				{#if banner === 'standard'}
					{$t('wish.banner.standardNote')}
				{/if}

				{#if banner === 'beginner'}
					{$t('wish.banner.beginnerNote')}
				{:else}
					{$t('wish.banner.viewDetails')}
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.dropNotes {
		position: relative;
	}
	.dropNotes.chronicle .scrollable {
		max-height: calc(22 / 100 * var(--content-height));
		overflow: auto;
	}

	.dropNotes::after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		height: 100%;
		width: calc(0.55 / 100 * var(--content-width));
		left: calc(-3.045 / 100 * var(--content-width));
		background-color: #565654;
	}

	.set {
		font-size: calc(2.2 / 100 * var(--content-width));
		line-height: 110%;
	}

	.desc {
		color: #fff;
		min-height: calc(9 / 100 * var(--content-height));
		display: flex;
		align-items: center;
		margin: calc(0.7 / 100 * var(--content-width)) 0;
	}
	.desc.bg-beginner {
		background-color: rgba(224, 85, 94, 0.85);
	}
	.desc.bg-standard {
		background-color: rgba(101, 107, 202, 0.9);
	}
	:global(.old) .desc.bg-standard {
		background-color: rgba(48, 143, 148, 0.9);
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: calc(1 / 100 * var(--content-width));
		font-size: calc(1.1 / 100 * var(--content-width));
	}

	.desc .text {
		width: calc(34 / 100 * var(--content-width));
		padding: calc(0.3 / 100 * var(--content-width));
	}
</style>
