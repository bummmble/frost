'use strict';

const { rollup } = require('rollup');
const builtinModules = require('builtin-modules');
const args = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const babel = require('rollup-plugin-babel');
const external = Object.keys(pkg.dependencies).concat(builtinModules);

function getFormatAndName() {
    if (args.es) {
        return { format: 'es', name: 'index.es.js' };
    }
    return { format: 'cjs', name: 'index.cjs.js' };
}

function build() {
    const { name, format } = getFormatAndName();
    return rollup({
        entry: 'src/index.js',
        external,
        plugins: [babel()]
    })
    .then(({ write }) => write({
        dest: `dist/${name}`,
        format
    }))
    .then(() => console.log(`Frost Builder built in format ${format}`))
    .catch(err => console.error(err));
}

build();
