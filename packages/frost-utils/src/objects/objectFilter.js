export function objectFilter(obj, cb, ctx) {
  if (!obj) return null;

  const result = {};
  for (const name in obj) {
    if (obj.hasOwnProperty(name) && cb.call(ctx, obj[name], name, obj)) {
      result[name] = obj[name];
    }
  }
  return result;
}
