import chars from '$lib/setup/characters.json';
import weapons from '$lib/setup/weapons.json';
import wishSetup from '$lib/setup/wish-setup.json';
import { beginnerRoll, beginnerAlreadyGuaranteed, nextGuaranteed, nextWeaponGuaranteed } from '$lib/store/localstore';
import { showBeginner } from '$lib/store/stores';
import prob from './prob';

const weap3 = Object.keys(weapons.star3).map((name) => ({type: 'weapon', rarity: 3, name}));
const weap4 = Object.keys(weapons.star4).map((name) => ({type: 'weapon', rarity: 4, name}));
const stdChar4 = Object.keys(chars.star4).filter((name) => {
  if (!chars.star4[name].limited) return { type: 'character', rarity: 4, name }
});
const stdWeap5 = Object.keys(weapons.star5).filter((name) => {
  if (!weapons.star5[name].limited) return { type: 'weapon', rarity: 5, name }
});

const rand = (array) => array[Math.floor(Math.random() * array.length)]

const get3Star = () => rand(weap3);

const get4Star = (opt = 'withCharacter') => {
  let items = stdChar4;
  const itemType = rand(['weap', 'char']);
  if (opt === 'noCharacter' || itemType === 'weap') items = weap4;
  return rand(items);
}

const get5Star = (opt = 'complete') => {
  let items = [];
  const char = wishSetup.banner.standard.characters.map((name) => ({type: 'character', rarity: 5, name}))
  const itemType = rand(['weap', 'char']);

  if (itemType === 'weap' || opt === 'noCharacter') items = stdWeap5
  if (itemType === 'char' || opt === 'noWeapon') items = char
  return rand(items);
}

const beginnerWish = (rarity) => {
  const rateup = wishSetup.banner.beginner.character.name;
  const rollCount = beginnerRoll.get() || 0;
  beginnerRoll.set(rollCount + 1)

  if (rollCount === 19 ) { // If roll count 20
    beginnerAlreadyGuaranteed.set('yes')
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

    if (beginnerAlreadyGuaranteed.get() === 'yes') return get4Star(); // if already get Noelle, no more guaranteed

    const rng = prob(item);
    if (rng.name === 'rateup') {
      // guaranteed probability
      beginnerAlreadyGuaranteed.set('yes')
      return stdChar4.find((c) => c.name === rateup)
    }

    // get Random item
    const result = get4Star();
    if (result.name === rateup) beginnerAlreadyGuaranteed.set('yes')
    return result;
  }
  return null;
}

const limitedWish = (rarity) => {
  const { character, rateup } = wishSetup.banner.limited

  if (rarity === 3) return get3Star();
  if (rarity === 4) {
    const resultType = rand(['rateup', 'std']);
    if (resultType === 'std') return get4Star();

    // If rate up character
    let chars = rateup.map((name) => ({ type: 'character', rarity: 4, name }));
    return rand(chars);
  }

  if (rarity === 5) {
    // Guaranteed
    const limitedResult = { type: 'character', rarity: 5, name: character.name, limited: true };
    if (nextGuaranteed.get() === 'yes') {
      nextGuaranteed.set('no')
      return limitedResult;
    }

    // not guaranteed
    const resultType = rand(['limited', 'std']);
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
  const weaponName = rand(weap);
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

  if (!result) return { type: null, rarity: 0, mame: null };
  result.time = time
  return result;
}

export default getWishItem;