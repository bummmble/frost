'use strict';

const { rollup } = require('rollup');
const exec = require('rollup-plugin-exec');
const builtinModules = require('builtin-modules');
const args = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies).concat(builtinModules);

const removePromise = promisify(remove);

function getFormat() {
    let format;
    if (args.cli || args.cjs) {
        format = 'cjs';
    } else {
        format = 'es';
    }
    return format;
}

function getOutput() {
    let output;
    if (args.cli) {
        output = 'bin/frost'
    } else if (args.cjs) {
        output = 'dist/index.cjs.js';
    } else if (args.es) {
        output = 'dist/index.es.js';
    }
    return output;
}

async function build() {
    const format = getFormat();
    const dest = getOutput();

    return rollup({
        entry: args.cli ? 'src/cli.js' : 'src/index.js',
        external,
        plugins: args.cli ? [exec()] : []
    })
    .then(({ write }) => write({
        dest,
        format,
        banner: args.cli ? '#!/usr/bin/env node\n' : ''
    }))
    .then(() => console.log('Frost-builder built!'))
    .catch(err => console.error(err));
}

build();
