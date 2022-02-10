const browserState = {
	set(page) {
		history.pushState({ page }, null, null);
	},
	back() {
		history.back();
	}
};

export default browserState;
