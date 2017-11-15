export function objectSome(obj, cb, ctx) {
  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      if (cb.call(ctx, obj[name], name, obj)) {
        return true;
      }
    }
  }
  return false;
}
