<script>
	import { t, json } from 'svelte-i18n';
	import { APP_TITLE } from '$lib/env';
	import Ads from '../../utility/Iklan.svelte';

	export let bannerType;
	export let tplVersion = 'v1';
	export let bannerName = '';
	export let data = [];

	const item5Star = ['events', 'weapons'].includes(bannerType)
		? data.find(({ rarity }) => rarity === 5).items
		: '';
	const item4Star = ['events', 'weapons'].includes(bannerType)
		? data.find(({ rarity }) => rarity === 4).items
		: '';

	const charNameAndTitle = (name, vision) => {
		const element = `(${$t(vision)})`;
		return `"${$t(`${name}.title`)}" ${$t(`${name}.name`)} ${$t(element)}`;
	};

	const highlightBannerName = (bannerName, { vision }) => {
		const splited = bannerName.split(' ');
		const divClass = vision || 'epitome';
		return `<span class="custom ${divClass}-flat"> ${splited[0]} </span> ${splited
			.slice(1)
			.join(' ')}`;
	};

	const getFeaturedChars = ({ name, vision }) => {
		return `<span class="custom ${vision}-flat">
			"${$t(`${name}.title`)}" ${$t(`${name}.name`)} (${$t(item5Star[0].vision)})
		</span>`;
	};

	const getFeaturedWeapon = ({ name, type }) => {
		return `<span class="weapon"> ${$t(name)} (${$t(type)})</span>`;
	};

	const getDelimiter = (arr, i) => {
		if (i > arr.length - 2) return '';
		if (i > arr.length - 3) return '&';
		return ',';
	};

	const getRateupChars = (items) => {
		const translated = items.map(({ name, vision }, i) => {
			return `<span class="custom ${vision}-flat"> ${charNameAndTitle(name, vision)}</span>
			${getDelimiter(item4Star, i)}`;
		});
		return translated.join('');
	};

	const getRateupWeapons = (items) => {
		const translated = items.map(({ name, type }, i) => {
			return `<span class="stardust"> ${$t(name)} (${$t(type)})</span>
			${getDelimiter(item4Star, i)} `;
		});
		return translated.join('');
	};

	const valuesToToChange = {
		starglitter: `<span class="starglitter"> ${$t('shop.item.starglitter')}</span>`,
		stardust: `<span class="stardust"> ${$t('shop.item.stardust')}</span>`,
		stellaFortuna: `<span class="stardust"> ${$t('wish.stellaFortuna')}</span>`
	};

	const duplicateDetails = (star) => {
		return $t(`details.duplicate.text`, {
			values: {
				rarity: star,
				constBonus: star === 5 ? '×10' : '×2',
				fullConstBonus: star === 5 ? '×25' : '×5',
				...valuesToToChange
			}
		});
	};

	const convertion = (star) => {
		return $t(`details.convertion.${star}`, {
			values: valuesToToChange
		});
	};
</script>

<svelte:head>
	<title>
		{bannerName.replace('&nbsp;', ' ')} | {$t('title', { default: APP_TITLE })}
	</title>
</svelte:head>

<div class="description" class:v2={tplVersion === 'v2'}>
	{#if tplVersion === 'v2'}
		<h2><span>{$t('details.wishDetails')} </span> <span class="line" /></h2>
	{/if}

	<Ads type="banner" />

	{#if bannerType === 'beginner'}
		<h3>{$t('details.beginnerInfo')}</h3>
	{:else if ['events', 'weapons'].includes(bannerType)}
		<h3>{$t('details.limited')}</h3>
	{:else}
		<h3>{$t('details.permanent')}</h3>
	{/if}

	{#if bannerType === 'beginner'}
		{#each data[0].items as { name, vision }, x}
			{#each $json('details.beginner') as text}
				<p>
					{@html $t(text, {
						values: {
							character: ` <span class="custom ${vision}-flat"> ${charNameAndTitle(
								name,
								vision
							)} </span> `,
							...valuesToToChange
						}
					})}
				</p>
			{/each}
		{/each}
	{:else if bannerType === 'standard'}
		{#each $json('details.standard') as text}
			<p>
				{@html $t(text, {
					values: { bannerName: highlightBannerName(bannerName, { vision: 'std' }) }
				})}
			</p>
		{/each}
	{:else if bannerType === 'events'}
		{#each $json('details.events') as text}
			<p>
				{@html $t(text, {
					values: {
						bannerName: highlightBannerName(bannerName, { ...item5Star[0] }),
						featuredCharacter: getFeaturedChars({ ...item5Star[0] }),
						rateupCharacters: getRateupChars(item4Star)
					}
				})}
			</p>
		{/each}
	{:else if bannerType === 'weapons'}
		{#each $json('details.weapons') as text}
			<p>
				{@html $t(text, {
					values: {
						bannerName: highlightBannerName(bannerName, { ...item5Star[0] }),
						featuredWeapon1: getFeaturedWeapon({ ...item5Star[0] }),
						featuredWeapon2: getFeaturedWeapon({ ...item5Star[1] }),
						rateupWeapons: getRateupWeapons(item4Star)
					}
				})}
			</p>
		{/each}
	{/if}

	<p>
		{#if ['weapons', 'standard'].includes(bannerType)}
			{@html convertion('fiveStar')}
		{/if}
		{@html convertion('fourStar')}
		{@html convertion('threeStar')}
	</p>

	<br />
	<p>{@html $t('details.duplicate.heading')}</p>
	{#if bannerType !== 'weapons'} <p>{@html duplicateDetails(5)}</p> {/if}
	<p>{@html duplicateDetails(4)}</p>

	{#if ['events', 'weapons'].includes(bannerType)}
		<p>{$t('details.alert', { values: { wishName: $t(`wish.banner.${bannerType}`) } })}</p>
	{/if}
	<Ads type="banner" />
</div>

<style>
	p :global(span):not(.custom) {
		color: #cf5e47;
	}

	p :global(span.invocation) {
		color: #ef7c1aff;
	}

	p :global(span.starglitter) {
		color: #c37b4d;
	}
	p :global(span.stardust) {
		color: #a256e1;
	}
	p :global(span.wish) {
		color: #debd6c;
	}
	p :global(span.electro-flat) {
		color: #ca82fc;
	}
	p :global(span.std-flat) {
		color: #757acdff;
	}

	p :global(span .weapon) {
		color: #bd6932;
	}

	p {
		font-size: 150%;
		line-height: 170%;
		margin: 1rem 0;
	}

	.v2 p {
		font-size: calc(0.017 * var(--content-width));
	}

	h2 {
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
		display: flex;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		color: #fff;
		background-color: #a28052;
		vertical-align: middle;
	}

	.v2 h3 {
		background-color: #6f778a;
		font-size: calc(0.015 * var(--content-width));
	}
</style>
