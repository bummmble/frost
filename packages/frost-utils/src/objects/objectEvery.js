export function objectEvery(obj, cb, ctx) {
    for (const name in obj) {
        if (obj.hasOwnProperty(name)) {
            if (!cb.call(ctx, obj[name], name, obj)) {
                return false;
            }
        }
    }
    return true;
}
