const flatten = (arr, res) => {
	let length = arr.length;
	let i = 0;

	while (length--) {
		const current = arr[i++];
		if (Array.isArray(current)) {
			flatten(current, res);
		} else {
			res.push(current);
		}
 	}
};

export const flattenArray = arr => {
	const res = [];
	flatten(arr, res);
	return res;
};