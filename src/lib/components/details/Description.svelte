<script>
	import { t } from 'svelte-i18n';
	import { APP_TITLE } from '$lib/env';
	import Ads from '../utility/Iklan.svelte';

	export let bannerType;
	export let bannerName = '';
	export let data = [];

	const item5Star = ['events', 'weapons'].includes(bannerType)
		? data.find(({ rarity }) => rarity === 5).items
		: '';
	const item4Star = ['events', 'weapons'].includes(bannerType)
		? data.find(({ rarity }) => rarity === 4).items
		: '';

	const charNameAndTitle = (name, vision) => {
		const element = `(${$t(`character.vision.${vision}`)})`;
		return `"${$t(`character.title.${name}`)}" ${$t(`character.name.${name}`)} ${element}`;
	};

	const highlightBannerName = (bannerName, { vision }) => {
		const splited = bannerName.split(' ');
		return `<span class=${vision}> ${splited[0]} </span> ${splited.slice(1).join(' ')}`;
	};

	const getFeaturedChars = ({ name, vision }) => {
		return `<span class=${vision}>
			"${$t(`character.title.${name}`)}" ${$t(`character.name.${name}`)} (${item5Star[0].vision})
		</span>`;
	};

	const getFeaturedWeapon = ({ name, type }) => {
		return `<span class="geo"> ${$t(`weapon.name.${name}`)} (${$t(`weapon.${type}`)})</span>`;
	};

	const getDelimiter = (arr, i) => {
		if (i > arr.length - 2) return '';
		if (i > arr.length - 3) return '&';
		return ',';
	};

	const getRateupChars = (items) => {
		const translated = items.map(({ name, vision }, i) => {
			return `<span class=${vision}> ${charNameAndTitle(name, vision)}</span>
			${getDelimiter(item4Star, i)}`;
		});
		return translated.join('');
	};

	const getRateupWeapons = (items) => {
		const translated = items.map(({ name, type }, i) => {
			return `<span> ${$t(`weapon.name.${name}`)} (${$t(`weapon.${type}`)})</span>
			${getDelimiter(item4Star, i)} `;
		});
		return translated.join('');
	};

	const valuesToToChange = {
		starglitter: '<span class="starglitter"> Masterless Starglitter</span>',
		stardust: '<span class="stardust"> Masterless Stardust</span>',
		stellaFortuna: '<span class="stardust"> Stella Fortuna</span>'
	};

	const duplicateDetails = (star) => {
		console.log(star);
		return $t(`details.duplicate.text`, {
			values: {
				rarity: star,
				constBonus: star === 5 ? 'x10' : 'x2',
				fullConstBonus: star === 5 ? 'x25' : 'x5',
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
		{bannerName} | {$t('site.title', { default: APP_TITLE })}
	</title>
</svelte:head>

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
		{#each $t('details.beginner') as text}
			<p>
				{@html $t(text, {
					values: {
						character: ` <span class=${vision}> ${charNameAndTitle(name, vision)} </span> `,
						...valuesToToChange
					}
				})}
			</p>
		{/each}
	{/each}
{:else if bannerType === 'standard'}
	{#each $t('details.standard') as text}
		<p>{@html text}</p>
	{/each}
{:else if bannerType === 'events'}
	{#each $t('details.events') as text}
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
	{#each $t('details.weapons') as text}
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
	{#if ['weapons, standard'].includes(bannerType)}
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

<style>
	p :global(span) {
		color: #cf5e47;
	}

	p :global(span.invocation) {
		color: #cba885;
	}

	p :global(span.starglitter) {
		color: #c37b4d;
	}
	p :global(span.stardust) {
		color: #a256e1;
	}

	p :global(span.hydro) {
		color: #06bbff;
	}
	p :global(span.geo),
	p :global(span.wish) {
		color: #f9aa02;
	}
	p :global(span.pyro) {
		color: #fe6606;
	}
	p :global(span.anemo) {
		color: #369396;
	}
	p :global(span.electro),
	p :global(span.std) {
		color: #ca82fc;
	}
	p :global(span.cryo) {
		color: #4682b4;
	}

	p {
		font-size: 1.2rem;
		margin: 1rem 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		color: #fff;
		background-color: #a28052;
		vertical-align: middle;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
