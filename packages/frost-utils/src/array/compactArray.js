export function compactArray(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el != null) {
            result.push(el);
        }
    }
    return result;
}
