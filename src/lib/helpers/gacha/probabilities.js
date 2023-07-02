export const rates = ({
	currentPity = 0,
	maxPity = 90,
	baseRate = 0.6,
	rateIncreasedAt = 74
} = {}) => {
	if (currentPity < rateIncreasedAt) return baseRate;

	if (currentPity >= maxPity) return 100;

	const rateIncreasedBy = (100 - baseRate) / (maxPity + 1 - rateIncreasedAt);
	const rateBeforeCurrentPity = (currentPity + 1 - rateIncreasedAt) * rateIncreasedBy;
	const increasedRate = rateBeforeCurrentPity + baseRate;
	return increasedRate;
};

// Random Item by probability
export const prob = (items) => {
	let chances = [];
	for (let i = 0; i < items.length; i++) {
		chances[i] = items[i].chance + (chances[i - 1] || 0);
	}
	const random = Math.random() * chances[chances.length - 1];
	const result = items[chances.findIndex((chance) => chance > random)];
	return result;
};
