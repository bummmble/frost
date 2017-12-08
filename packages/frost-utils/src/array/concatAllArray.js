export function concatAllArray(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];;
        if (Array.isArray(val)) {
            Array.prototype.push.apply(res, val);
        }
    }
    return res;
}
