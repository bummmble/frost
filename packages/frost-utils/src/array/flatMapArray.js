export function flatMapArray(arr, fn) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const res = fn.call(arr, arr[i], i);
        if (Array.isArray(res)) {
            Array.prototype.push.apply(result, res);
        }
    }
    return result;
}
