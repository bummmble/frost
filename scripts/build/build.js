const { rollup } = require('rollup');
const commonJS = require('rollup-plugin-commonjs');

const bundles = require('./bundles');

function getOutputFile(bundle, build) {
    let output;
    if (bundle.name === 'frost-builder' && build === 'cli') {
        output = bundle.path + '/bin/frost.js'
        return output;
    }
    if (build === 'cjs') {
        output = bundle.path + '/dist/index.cjs.js';
    }
    if (build === 'es') {
        output = bundle.path + '/dist/index.es.js';
    }

    return output;
}

function getInput(bundle, build) {
    if (build === 'cli') {
        return `${bundle.path}/src/cli.js`;
    }
    return `${bundle.path}/src/index.js`;
}

function getFormat(build) {
    let format;
    if (build === 'cli' || build === 'cjs') {
        format = 'cjs';
    }
    if (build === 'es') {
        format = 'es';
    }
    return format;
}


function createBundle(bundle, build) {
    const outputFile = getOutputFile(bundle, build);
    const input = getInput(bundle, build);
    const format = getFormat(build);

    return rollup({
        input,
        external(dependency) {
            if (dependency === input) {
                return false;
            }
        },
    })
    .then(({ write }) => write({
        dest: outputFile,
        format
    }))
    .then(() => console.log(`${bundle.name} built in ${format} format`))
    .catch(err => {
        console.error(err);
    })
}

(() => {
  const promises = [];
  for (const bundle of bundles) {
    for (const build of bundle.builds) {
      promises.push(() => createBundle(bundle, build));
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
