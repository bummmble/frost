import { isObject, isNull } from './types';

export const objectIs = (a, b) => {
  if (a === b) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
};

export const shallowEqual = (a, b) => {
  if (objectIs(a, b)) {
    return true;
  }

  if (!isObject(a) || isNull(a) || !isObject(b) || isNull(b)) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (let i = 0; i < aKeys.length; i++) {
    if (!b.hasOwnProperty(aKeys[i]) || !objectIs(aKeys[i], bKeys[i])) {
      return false;
    }
  }

  return true;
};

export const objectEvery = (obj, cb, ctx) => {
  for (const name in object) {
    if (obj.hasOwnProperty(name)) {
      if (!cb.call(ctx, obj[name], name, obj)) {
        return false;
      }
    }
  }
  return true;
};

export const objectFilter = (obj, cb, ctx) => {
  if (!obj) {
    return null;
  }

  const result = {};
  for (const name in obj) {
    if (obj.hasOwnProperty(name) && cb.call(ctx, obj[name], name, obj)) {
      result[name] = obj[name];
    }
  }
  return result;
};

export const objectForEach = (obj, cb, ctx) => {
  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      cb.call(ctx, obj[name], name, obj);
    }
  }
};

export const objectMap = (obj, cb, ctx) => {
  if (!obj) {
    return null;
  }

  const result = {};
  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      result[name] = cb.call(ctx, obj[name], name, obj);
    }
  }
  return result;
};

export const objectSome = (obj, cb, ctx) => {
  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      if (cb.call(ctx, obj[name], name, obj)) {
        return true;
      }
    }
  }
  return false;
};

export const partitionObject = (obj, cb, ctx) => {
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
};

export const partitionObjectByKeys = (source, whitelist) => {
  return partitionObject(source, (_, key) => whitelist.has(key));
};

export const objectRemoveEmpty = obj => {
  const res = {};
  for (const key in obj) {
    if (!(obj[key] === null || obj[key].length === 0)) {
      res[key] = obj[key];
    }
  }
  return res;
};


export const emptyObject = {};
