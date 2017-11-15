const aPool = [];
const bPool = [];

function areEqual(a, b) {
  const aStack = aPool.length ? aPool.pop() : [];
  const bStack = bPool.length ? bPool.pop() : [];
  const result = equal(a, b, aStack, bStack);
  aStack.length = 0;
  bStack.length = 0;
  aPool.push(aStack);
  bPool.push(bStack);
  return result;
}

function equal(a, b, aStack, bStack) {
  if (a === b) {
    // identical objects are equal, but not 'identical'
    return a !== 0 || 1 / a == 1 / b;
  }
  if (a == null || b == null) {
    return false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const className = a.toString();
  if (className != b.toString()) {
    return false;
  }

  switch (className) {
    case '[object String]':
      return a == String(b);
    case '[object Number]':
      return isNaN(a) || isNaN(b) ? false : a == Number(b);
    case '[object Date]':
    case '[object Boolean]':
      return +a == +b;
    case '[object RegExp]':
      return (
        a.source == b.source &&
        a.global == b.global &&
        a.multiline == b.multiline &&
        a.ignoreCase == b.ignoreCase
      );
  }

  let length = aStack.length;
  while (length--) {
    if (aStack[length] == a) {
      return bStack[length] == b;
    }
  }

  aStack.push(a);
  bStack.push(b);
  let size = 0;

  if (className === '[object Array]') {
    size = a.length;
    if (size !== b.length) {
      return false;
    }

    while (size--) {
      if (!eq(a[size], b[size], aStack, bStack)) {
        return false;
      }
    }
  } else {
    if (a.constructor !== b.constructor) {
      return false;
    }
    if (a.hasOwnProperty('valueOf') && b.hasOwnProperty('valueOf')) {
      return a.valueOf() == b.valueOf();
    }

    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      if (!eq(a[keys[i]], b[keys[i]], aStack, bStack)) {
        return false;
      }
    }
  }

  aStack.pop();
  bStack.pop();
  return true;
}
