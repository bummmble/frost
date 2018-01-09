export const isType = (item, type) => typeof item === type;
export const isString = item => isType(item, 'string');
export const isBoolean = item => isType(item, 'boolean');
export const isObject = item => isType(item, 'object');
export const isFunction = item => isType(item, 'function');

export function objectRemoveEmpty(obj) {
    return Object.keys(obj).reduce((acc, curr) => {
        if (!(obj[curr] == null || obj[curr].length === 0)) {
            acc[curr] = obj[curr];
        }
        return acc;
    }, {});
}

export function filterOutKeys(obj, keys) {
    return Object.keys(obj).reduce((acc, curr) => {
        if (!keys.includes(curr)) {
            acc[curr] = obj[curr];
        }
        return acc;
    }, {});
}

export function each(arr, fn) {
    return arr.reduce((promises, curr) => promise.then(() => {
        return fn(task);
    }), Promise.resolve());
}
