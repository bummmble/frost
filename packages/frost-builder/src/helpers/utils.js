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

export const promisify = fn => {
	if (typeof fn !== 'function') {
		throw new Error(`Argument passed must be a function. Received ${typeof fn}`);
	}

	return (...args) => {
		return new Promise((resolve, reject) => {
			const cb = (err, ...args) => {
				if (err) {
					reject(err);
				} else {
					const data = args.length >= 1 ? args[0] : args;
					resolve(data);
				}
			};

			fn(...[...args, cb]);
		});
	};
};
