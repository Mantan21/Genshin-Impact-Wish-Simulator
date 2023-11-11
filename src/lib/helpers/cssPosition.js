export const positionToStyle = (position) => {
	if (!position) return '';
	const cssProps = ['width', 'height', 'top', 'bottom', 'left', 'right'];
	const keyToChange = ['w', 'h', 't', 'b', 'l', 'r'];
	const style = Object.keys(position).map((key) => {
		const index = keyToChange.findIndex((v) => v === key);
		const css = key.replace(key, cssProps[index]);
		return `${css}:${position[key]}%`;
	});
	return style.join(';');
};

export const calculatePosition = ({ x, y, scale } = {}, { h = 0, w = 0 } = {}) => {
	const X = !x ? '' : (x / 100) * w;
	const Y = !y ? '' : (y / 100) * h;
	const SCALE = scale || 1;

	const varX = !X ? '' : `--translate-x:${X}px;`;
	const varY = !Y ? '' : `--translate-y:${Y}px;`;
	const varScale = !SCALE ? '' : `--scale:${SCALE};`;
	return `${varX}${varY}${varScale}`;
};
