export const removeEmptyKeys = obj => {
	const res = {};
	for (const key in obj) {
		if (!(obj[key] === null || obj[key].length === 0)) {
			res[key] = obj[key];
		}
	}
	return res;
};

export const each = async (arr, fn) => {
	for (const item of arr) {
		await fn(item);
	}
};

