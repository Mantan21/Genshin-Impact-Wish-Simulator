import { base4StarChance, base5StarChance } from '$lib/setup/probability';
import { pity4star, pity5star } from '$lib/store/localstore';

const prob = (items) => {
  let chances = [];
  for (let i = 0; i < items.length; i++) {
    chances[i] = items[i].chance + (chances[i - 1] || 0);
  }
  const random = Math.random() * chances[chances.length - 1];
  const result = items[chances.findIndex((chance) => chance > random)];
  return result;
};

const roll = () => {
  const pity4 = pity4star.get();
  const pity5 = pity5star.get();
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
  if (result.rarity === 5) {
    pity4star.set(pity4 + 1);
    pity5star.set(0);
  } else if (result.rarity === 4) {
    pity4star.set(0);
    pity5star.set(pity5 + 1);
  } else {
    pity4star.set(pity4 + 1);
    pity5star.set(pity5 + 1);
  }
  return result;
};


export default roll;
