import { base4StarChance, base5StarChance } from '$lib/setup/probability';
import { pity4star, pity5star } from '$lib/store/localstore';
import prob from './prob';
import getWishItem from './getWishItem';

const roll = (banner) => {
  const pity4 = pity4star.get(banner);
  const pity5 = pity5star.get(banner);
  
  const chance5star = base5StarChance[pity5];
  let chance4star = base4StarChance[pity4];
  let chance3star = 100 - base4StarChance[pity4] - base5StarChance[pity5];
  
  if (chance3star < 0 && pity5 > 89) chance4star = 0;
  if (chance3star < 0) chance3star = 0;
  
  const item = [
    {
      rarity: 3,
      chance: chance3star
    },
    {
      rarity: 4,
      chance: chance4star
    },
    {
      rarity: 5,
      chance: chance5star
    }
  ];
  
  const result = prob(item);
  let pity = 1;
  if (result.rarity === 5) {
    pity4star.set(banner, pity4 + 1);
    pity5star.set(banner, 0);
    pity = pity5 + 1;
  } else if (result.rarity === 4) {
    pity4star.set(banner, 0);
    pity5star.set(banner, pity5 + 1);
    pity = pity4 + 1;
  } else {
    pity4star.set(banner, pity4 + 1);
    pity5star.set(banner, pity5 + 1);
  }

  const wishResult = getWishItem(banner, result.rarity)
  wishResult.pity = pity;
  console.log(wishResult)
  return wishResult;

}

export default roll;
