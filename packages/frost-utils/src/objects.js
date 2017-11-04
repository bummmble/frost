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

export const emptyObject = {};
