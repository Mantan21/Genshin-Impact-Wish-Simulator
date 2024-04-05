<script>
	import { t, json, locale } from 'svelte-i18n';
	import { customData, isCustomBanner } from '$lib/store/app-stores';
	import { highlightBannerName } from '$lib/helpers/nameText';
	import { regionElement } from '$lib/helpers/gacha/itemdrop-base';

	export let tplVersion = 'v1';
	export let bannerType;
	export let bannerName = '';
	export let rateup;
	export let weapons;
	export let character;
	export let drop5star = [];
	export let region = null;

	$: isSpecial = $locale.toLocaleLowerCase().match(/ja|cn/);

	const charNameAndTitle = (name, vision) => {
		const element = `(${$t(vision)})`;
		if (isSpecial) return `「${$t(`${name}.title`)}·${$t(`${name}.name`)} ${element}」`;
		return `"${$t(`${name}.title`)}" ${$t(`${name}.name`)} ${element}`;
	};

	const getFeaturedChars = ({ name, vision }) => {
		const isCustom = $isCustomBanner;
		const charTitle = !isCustom ? $t(`${name}.title`) : $customData.charTitle;
		const charName = !isCustom ? $t(`${name}.name`) : name;
		const nameTitle = isSpecial ? `${charTitle}·${charName}` : `"${charTitle}" ${charName} `;
		return `<span class="custom ${vision}-flat"> ${nameTitle}(${$t(vision)}) </span>`;
	};

	const getFeaturedWeapon = ({ name, weaponType }) => {
		const nameTitle = isSpecial
			? `${$t(weaponType)}·${$t(name)}`
			: `${$t(name)} (${$t(weaponType)})`;
		return `<span class="weapon">${nameTitle}</span>`;
	};

	const getDelimiter = (arr, i) => {
		if (i > arr.length - 2) return '';
		if (i > arr.length - 3) return isSpecial ? '、' : '&';
		return isSpecial ? '、' : ',';
	};

	const getRateupChars = (items) => {
		const translated = items.map(({ name, vision }, i) => {
			return `<span class="custom ${vision}-flat"> ${charNameAndTitle(name, vision)}</span>
			${getDelimiter(rateup, i)}`;
		});
		return translated.join('');
	};

	const getRateupWeapons = (items) => {
		const translated = items.map(({ name, weaponType }, i) => {
			const nameTitle = isSpecial
				? `「${$t(weaponType)}·${$t(name)}」`
				: `${$t(name)} (${$t(weaponType)})`;
			return `<span class="stardust">${nameTitle}</span>${getDelimiter(rateup, i)} `;
		});
		return translated.join('');
	};

	const getRateupChron = (itemType) => {
		const list = drop5star.filter(({ type }) => type === itemType);
		const getItem = itemType === 'weapon' ? getFeaturedWeapon : getFeaturedChars;
		const arrayString = list.map(({ name, weaponType: type, vision }) => {
			return getItem({ name, type, vision });
		});
		const str = arrayString.join(',');
		return str;
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

<div class="description" class:v2={tplVersion === 'v2'}>
	{#if tplVersion === 'v2'}
		<h2>
			<span>{$t('details.wishDetails')} </span> <span class="line" />
		</h2>
	{/if}

	{#if bannerType === 'beginner'}
		<h3>{$t('details.beginnerInfo')}</h3>
	{:else if bannerType.match(/event|chronicled/)}
		<h3>{$t('details.limited')}</h3>
	{:else}
		<h3>{$t('details.permanent')}</h3>
	{/if}

	<!-- Beginner Wish Description -->
	{#if bannerType === 'beginner'}
		{@const { name, vision } = character}
		{#each $json('details.beginner') as text}
			<p>
				{@html $t(text, {
					values: {
						character: `<span class="custom ${vision}-flat">
              ${charNameAndTitle(name, vision)}
            </span> `,
						...valuesToToChange
					}
				})}
			</p>
		{/each}

		<!-- Standard Wish Description -->
	{:else if bannerType === 'standard'}
		{#each $json('details.standard') as text}
			<p>
				{@html $t(text, {
					values: { bannerName: highlightBannerName(bannerName, 'standard') }
				})}
			</p>
		{/each}

		<!-- Character Wish Description -->
	{:else if bannerType === 'character-event'}
		{#each $json('details.events') as text}
			<p>
				{@html $t(text, {
					values: {
						bannerName: highlightBannerName(bannerName, character.vision),
						featuredCharacter: getFeaturedChars(character),
						rateupCharacters: getRateupChars(rateup)
					}
				})}
			</p>
		{/each}

		<!-- Weapon Wish Description -->
	{:else if bannerType === 'weapon-event'}
		{#each $json('details.weapons') as text}
			<p>
				{@html $t(text, {
					values: {
						bannerName: highlightBannerName(bannerName, 'epitome'),
						featuredWeapon1: getFeaturedWeapon(weapons[0]),
						featuredWeapon2: getFeaturedWeapon(weapons[1]),
						rateupWeapons: getRateupWeapons(rateup)
					}
				})}
			</p>
		{/each}

		<!-- Chronicled Wish Description -->
	{:else if bannerType === 'chronicled'}
		{#each $json('details.chronicled') as text}
			<p>
				{@html $t(text, {
					values: {
						bannerName: highlightBannerName(bannerName, regionElement(region)),
						featuredCharacter: getRateupChron('character'),
						featuredWeapon: getRateupChron('weapon')
					}
				})}
			</p>
		{/each}
	{/if}

	<p>
		{#if bannerType.match(/(weapon|standard|chronicled)/)}
			{@html convertion('fiveStar')}
		{/if}
		{@html convertion('fourStar')}
		{@html convertion('threeStar')}
	</p>

	<p>{@html $t('details.duplicate.heading')}</p>
	{#if bannerType !== 'weapon-event'} <p>{@html duplicateDetails(5)}</p> {/if}
	<p>{@html duplicateDetails(4)}</p>

	{#if bannerType.match('event')}
		<p>{$t('details.alert', { values: { wishName: $t(`wish.banner.${bannerType}`) } })}</p>
	{/if}
</div>

<style>
	p :global(span):not([class*='-flat']) {
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
