export const promisify = fn => {
  if (typeof fn !== 'function') {
    throw new Error(
      `Expected argument to be a function. Receved: ${typeof fn}`
    );
  }

  return (...args) => {
    return new Promise((resolve, reject) => {
      const cb = (err, ...args) => {
        if (err) {
          reject(err);
        } else {
          const data = args.length >= 1 ? args[0] : args;
          resolve(data);
        }
      };

      fn(...[...args, cb]);
    });
  };
};

export const each = async (arr, fn) => {
  for (const item of arr) {
    await fn(item);
  }
};
