export function memoizeString(cb) {
  const cache = {};
  return str => {
    if (!cache.hasOwnProperty(str)) {
      cache[str] = cb.call(this, str);
    }
    return cache[str];
  };
}
