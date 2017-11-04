const hypenPattern = /-(.)/g;
const uppercasePattern = /([A-Z])/g;

export const camelize = string => {
	return string.replace(hypenPattern, (_, character) => {
		return character.toUpperCase();
	});
}

export const hyphenate = string => {
	return string.replace(uppercasePattern, '-$1').toLowerCase();
};

export const memoizeString = cb => {
	const cache = {};
	return string => {
		if (!cache.hasOwnProperty(string)) {
			cache[string] = cb.call(this, string);
		}
		return cache[string];
	}
}