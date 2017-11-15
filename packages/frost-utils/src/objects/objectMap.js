export function objectMap(obj, cb, ctx) {
    if (!obj) return null;

    const result = {};
    for (const name in obj) {
        if (obj.hasOwnProperty(name)) {
            result[name] = cb.call(ctx, obj[name], name, obj);
        }
    }
    return result;
}
