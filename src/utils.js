export const isType = (item, type) => typeof item === type;
export const isString = item => isType(item, 'string');
export const isBoolean = item => isType(item, 'boolean');
export const isObject = item => isType(item, 'function');
export const isFunction = item => isType(item, 'function');
