import { objectForEach } from './objectForEach';

export function partitonObject(obj, cb, ctx) {
  const first = {};
  const second = {};
  objectForEach(obj, (value, key) => {
    if (cb.call(ctx, value, key, obj)) {
      first[key] = value;
    } else {
      second[key] = value;
    }
  });

  return [first, second];
}
