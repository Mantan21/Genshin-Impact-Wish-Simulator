const base4StarChance = [5.18, 4.88, 4.68, 5.67, 6.78, 4.6, 6.13, 12.28, 41.29, 100, 100];
const base5StarChance = [0.6];

for (let i = 0; i < 4; i++) base5StarChance.push(1.11); // 2-5
for (let i = 0; i < 5; i++) base5StarChance.push(0.44); // 6-10
for (let i = 0; i < 5; i++) base5StarChance.push(0.47); // 11-15
for (let i = 0; i < 5; i++) base5StarChance.push(0.42); // 16-20
for (let i = 0; i < 5; i++) base5StarChance.push(0.6); // 21-25
for (let i = 0; i < 5; i++) base5StarChance.push(0.57); // 26-30
for (let i = 0; i < 10; i++) base5StarChance.push(0.51); // 31-40
for (let i = 0; i < 10; i++) base5StarChance.push(1.57); // 41-50
for (let i = 0; i < 10; i++) base5StarChance.push(.31); // 51-60
for (let i = 0; i < 10; i++) base5StarChance.push(1.14); // 61-70
for (let i = 0; i < 3; i++) base5StarChance.push(1.8); // 71-73
base5StarChance.push(7.14); // 74
base5StarChance.push(13.9); // 75
base5StarChance.push(19.45); // 76
base5StarChance.push(25.51); // 77
base5StarChance.push(31.13); // 78
base5StarChance.push(37.2); // 79
base5StarChance.push(41.84); // 80
base5StarChance.push(49.5); // 81
for (let i = 0; i < 4; i++) base5StarChance.push(71.5); // 82-85
for (let i = 0; i < 4; i++) base5StarChance.push(80.78); // 86-89
base5StarChance.push(100); // 90


export { base4StarChance, base5StarChance };