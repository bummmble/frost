const bundles = require('./bundles');

(() => {
    const promises = [];
    for (const bundle of bundles) {
        for (const build of bundle.builds) {
            promises.push(
                () => createBundle(bundle, build)
            );
        }
    }

    return runWaterfall(promises)
        .then(() => {
            console.log('built!');
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
})();

function runWaterfall(factories) {
    if (factories.length === 0) {
        return Promise.resolve();
    }

    const head = factories[0];
    const tail = factories.slice(1);
    const nextFactory = head;
    const nextPromise = nextFactory();
    if (!nextPromise || typeof nextPromise.then !== 'function') {
        throw new Error('run waterfall received something besides a promise');
    }

    return nextPromise.then(() => {
        return runWaterfall(tail);
    });
}
