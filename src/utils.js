export async function sleepFor(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function each(tasks, fn) {
    return tasks.reduce((promise, task) => promise.then(() => {
        return fn(task);
    }), Promise.resolve());
}

export function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            const cb = (err, ...args) => {
                if (err) {
                    return reject(err);
                } else {
                    const data = args.length >= 1 ? args[0] : args;
                    resolve(data);
                }
            };

            fn(...[...args, cb]);
        });
    }
}

export function filterOutKeys(obj, keys) {
    return Object,keys(obj).reduce((acc, curr) => {
        if (!keys.includes(curr)) {
            acc[curr] = obj[curr];
        }
        return acc;
    }, {});
}
