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

export const compactArray = arr => {
	const res = [];
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i];
		if (el != null) {
			res.push(el);
		}
	}
	return res;
};

export const concatAllArray = arr => {
	const res = [];
	for (let i = 0; i < arr.length; i++) {
		const value = arr[i];
		if (Array.isArray(value)) {
			res.push(value);
		}
	}
	return res;
};

export const uniqueArrayElements = arr => {
	return Array.from(new Set(arr).values());
};

export const flatMapArray = (arr, fn) => {
	const res = [];
	for (let i = 0; i < arr.length; i++) {
		const result = fn.call(arr, arr[i], i);
		if (Array.isArray(result)) {
			res.push(result);
		} 
	}
	return res;
};

export const groupArray = (arr, fn) => {
	const res = {};
	for (let i = 0; i < arr.length; i++) {
		const result = fn.call(arr, arr[i], i);
		if (!res[result]) {
			res[result] = [];
		}
		res[result].push(arr[i]);
	}
	return res;
};


