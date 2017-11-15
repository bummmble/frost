export function objectRemoveEmpty(obj) {
    const result = {};
    for (const name in obj) {
        if (!obj[name] === null || obj[name].length === 0) {
            result[name] = obj[name];
        }
    }
    return result;
}
