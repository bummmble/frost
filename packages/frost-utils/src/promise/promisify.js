export function promisify(fn) {
  if (typeof fn !== 'function') {
    throw new Error(
      `Error in frost-utils: Promisify. Promisify received an argument that was not a function. Receievd: ${typeof fn}`
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
}
