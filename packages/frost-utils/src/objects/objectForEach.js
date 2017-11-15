export function objectForEach(obj, cb, ctx) {
    for (const name in obj) {
        if (obj.hasOwnProperty(name)) {
            cb.call(ctx, obj[name], name, obj);
        }
    }
}
