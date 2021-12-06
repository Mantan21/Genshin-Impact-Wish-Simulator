const base4StarChance = [5.10, 5.10, 5.10, 5.10, 5.10, 5.10, 5.10, 5.10, 56.10, 100, 100];
const base5StarCharBanner = [];
const base5StarWeaponBanner = [];


// Character base
for (let i = 0; i < 72; i++) base5StarCharBanner.push(0.6);
// Character Banner's hard pity 73 - 90
for (let i = 0; i < 17; i++) {
  const probability = 0.6 + 6 * i;
  base5StarCharBanner.push(probability)
}
base5StarCharBanner.push(100); // guaranteed at pity 90


// Weapon Base
for (let w = 0; w < 61; w++) base5StarWeaponBanner.push(0.7);
// Weapon Banner's hard pity 62 - 80
for (let w = 0; w < 12; w++) {
  const probability = 0.7 + 7 * w;
  base5StarWeaponBanner.push(probability)
}
base5StarWeaponBanner.push(81.2); // 74
base5StarWeaponBanner.push(84.7); // 75
base5StarWeaponBanner.push(88.2); // 76
base5StarWeaponBanner.push(91.7); // 77
base5StarWeaponBanner.push(95.2); // 78
base5StarWeaponBanner.push(98.7); // 79
base5StarWeaponBanner.push(100); // guaranteed at pity 80;

export { base4StarChance, base5StarCharBanner, base5StarWeaponBanner };