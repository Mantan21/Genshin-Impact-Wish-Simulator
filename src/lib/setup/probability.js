const base4StarChance = [5.10, 5.10, 5.10, 5.10, 5.10, 5.10, 5.10, 5.10, 56.10, 100, 100];
const base5StarChance = [];

for (let i = 0; i < 72; i++) base5StarChance.push(0.6); // 1-73

// soft pity 74 - 89
for (let i = 0; i< 17; i++) {
  const probability = 0.6 + 6 * i;
  base5StarChance.push(probability)
}
base5StarChance.push(100); // 90

export { base4StarChance, base5StarChance };