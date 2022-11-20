const base4StarChance = [5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 56.1, 100, 100];
const base4StarWeapon = [6, 6, 6, 6, 6, 6, 6, 6, 62, 100, 100];
const base5StarCharBanner = [];
const base5StarWeaponBanner = [];

// Character base
for (let i = 0; i < 73; i++) base5StarCharBanner.push(0.6);
// Character Banner's hard pity 74 - 90
for (let i = 1; i < 17; i++) {
	const probability = 0.6 + 6 * i;
	base5StarCharBanner.push(probability);
}
base5StarCharBanner.push(100); // guaranteed at pity 90

// Weapon Base
for (let w = 0; w < 62; w++) base5StarWeaponBanner.push(0.7);
// Weapon Banner's hard pity 63 - 80
for (let w = 1; w < 12; w++) {
	const probability = 0.7 + 7 * w;
	base5StarWeaponBanner.push(probability);
}
base5StarWeaponBanner.push(81.2); // 74
base5StarWeaponBanner.push(84.7); // 75
base5StarWeaponBanner.push(88.2); // 76
base5StarWeaponBanner.push(91.7); // 77
base5StarWeaponBanner.push(95.2); // 78
base5StarWeaponBanner.push(98.7); // 79
base5StarWeaponBanner.push(100); // guaranteed at pity 80;

// Get Item by probability
const prob = (items) => {
	let chances = [];
	for (let i = 0; i < items.length; i++) {
		chances[i] = items[i].chance + (chances[i - 1] || 0);
	}
	const random = Math.random() * chances[chances.length - 1];
	const result = items[chances.findIndex((chance) => chance > random)];
	return result;
};

export default prob;
export { base4StarChance, base4StarWeapon, base5StarCharBanner, base5StarWeaponBanner };
