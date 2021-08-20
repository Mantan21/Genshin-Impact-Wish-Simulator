import chars from '$lib/setup/characters.json';
import weapons from '$lib/setup/weapons.json';
import wishSetup from '$lib/setup/wish-setup.json';
import { beginnerRoll, beginnerGuaranteed, nextGuaranteed, nextWeaponGuaranteed } from '$lib/store/localstore';
import { showBeginner } from '$lib/store/stores';
import prob from './prob';

const char4 = Object.keys(chars.star4).map((name) => ({type: 'character', rarity: 4, name}));
const weap3 = Object.keys(weapons.star3).map((name) => ({type: 'weapon', rarity: 3, name}));
const weap4 = Object.keys(weapons.star4).map((name) => ({type: 'weapon', rarity: 4, name}));
const weap5 = Object.keys(weapons.star5).map((name) => ({type: 'weapon', rarity: 5, name}));

const get3Star = () => {
  const random = Math.floor(Math.random() * weap3.length);
  return weap3[random];
}

const get4Star = (opt = 'withCharacter') => {
  const items = opt === 'noCharacter' ? weap4 : [...weap4, ...char4];
  const random = Math.floor(Math.random() * items.length);
  return items[random];
}

const get5Star = (opt = 'complete') => {
  const char = wishSetup.banner.standard.characters.map((name) => ({type: 'character', rarity: 5, name}))
  let items;
  if (opt === 'noWeapon') items = char 
  else if (opt === 'noCharacter') items = weap5
  else items = [...weap5, ...char]

  const random = Math.floor(Math.random() * items.length);
  return items[random];
}

const beginnerWish = (rarity) => {
  const rateup = wishSetup.banner.beginner.character.name;
  const rollCount = beginnerRoll.get() || 0;
  beginnerRoll.set(rollCount + 1)

  if (rollCount === 19 ) { // If roll count 20
    beginnerGuaranteed.set('yes')
    showBeginner.set(false);
    return  { type: 'character', rarity: 4, name: rateup }
  }
  if (rarity === 3) return get3Star();
  if (rarity === 5) return get5Star();

  if(rarity === 4) {
    const item = [
      {
        name: 'rateup',
        chance: 25,
      },
      {
        name: 'other',
        chance: 75,
      }
    ];

    if (beginnerGuaranteed.get() === 'yes') return get4Star(); // if already get Noelle, no more guaranteed

    const rng = prob(item);
    if (rng.name === 'rateup') {
      // guaranteed probability
      beginnerGuaranteed.set('yes')
      return char4.find((c) => c.name === rateup)
    }

    // get Random item
    const result = get4Star();
    if (result.name === rateup) beginnerGuaranteed.set('yes')
    return result;
  }
  return null;
}

const limitedWish = (rarity) => {
  const { character, rateup } = wishSetup.banner.limited

  if (rarity === 3) return get3Star();
  if (rarity === 4) {
    const item = ['rateup', 'std'];
    const resultType = item[Math.floor(Math.random() * item.length)];
    if (resultType === 'std') return get4Star();

    // If rate up character
    let chars = rateup.map((name) => ({ type: 'character', rarity: 4, name }));
    return chars[Math.floor(Math.random() * chars.length)]
  }

  if (rarity === 5) {
    // Guaranteed
    const limitedResult = { type: 'character', rarity: 5, name: character.name, limited: true };
    if (nextGuaranteed.get() === 'yes') {
      nextGuaranteed.set('no')
      return limitedResult;
    }

    // not guaranteed
    const item = ['limited', 'std'];
    const resultType = item[Math.floor(Math.random() * item.length)];
    if (resultType === 'std') {
      nextGuaranteed.set('yes')
      return get5Star('noWeapon');
    }

    // win 50: 50
    nextGuaranteed.set('no')
    return limitedResult;
  }
}

const standardWish = (rarity) => {
  if (rarity === 3) return get3Star();
  if (rarity === 4) return get4Star();
  if (rarity === 5) return get5Star();
  return null;
};

const weaponWish = (rarity) => {
  const { weapons } = wishSetup.banner;
  const weap = weapons.map(({ name }) => name);

  if (rarity === 3) return get3Star();
  if (rarity === 4) return get4Star('noCharacter');
  if (rarity === 5) {  
  const weaponName = weap[Math.floor(Math.random() * weap.length)]
  const weaponResultGuaranteed = { type: 'weapon', rarity: 5, name: weaponName };
  if (nextWeaponGuaranteed.get() === 'yes') return weaponResultGuaranteed;

    const item = [
      {type: 'featured', chance: 75},
      {type: 'std', chance: 25},
    ]
    const { type } = prob(item);
    if (type === 'std') {
      const result = get5Star('noCharacter')
      if (weap.includes(result.name)) nextWeaponGuaranteed.set('no');
      return result;
    }

    // Win Weapon
    nextWeaponGuaranteed.set('no');
    return weaponResultGuaranteed;
  }
}

const getWishItem = (banner, rarity) => {
  let result
  const date = new Date();
  const time  = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  if (banner === 'beginner') result = beginnerWish(rarity);
  if (banner === 'limited') result = limitedWish(rarity);
  if (banner === 'standard') result = standardWish(rarity);
  if (banner === 'weapon') result = weaponWish(rarity);

  result.time = time
  return result;
}

export default getWishItem;