const isType = (o, type) => typeof o === type;

export const isString = o => isType(o, 'string');
export const isNumber = o => isType(o, 'number');
export const isObject = o => isType(o, 'object');
export const isFunction = o => isType(o, 'function');
export const isUndefined = o => isType(o, 'undefined');
export const isBoolean = o => isType(o, 'boolean');
export const isNull = o => o === null;
export const isNullOrUndefined = o => isUndefined(o) || isNull(o);
export const isStringOrNumber = o => isString(o) || isNumber(o);
export const isArray = Array.isArray;

export const isEmpty = value => {
	if (isArray(value)) {
		return value.length === 0;
	} else if (isObject(value)) {
		if (value) {
			for (const key in value) {
				return false;
			}
		}
		return true;
	} else {
		return !value;
	}
};

export const isIterable = value => {
	if (isUndefined(Symbol)) {
		return false;
	}
	return value[Symbol.iterator];
};
