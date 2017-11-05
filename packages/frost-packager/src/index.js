import { resolve, relative, isAbsolute, dirname } from 'path';
import { eachOfSeries } from 'async';
import { camelCase } from 'lodash';
import { get as getRoot } from 'app-root-dir';
import { rollup } from 'rollup';
import fileExists from 'file-exists';
import meow from 'meow';
import chalk from 'chalk';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import jsonPlugin from 'rollup-plugin-json';
import yamlPlugin from 'rollup-plugin-yaml';

import getTranspilers from './transpilers';
import getBanner from './banner';

const Root = getRoot();
const pkg = require(resolve(Root, 'package.json'));

let cache;

const command = meow(
  `
	Usage
		$ frost-package

	Options
		--input-node
		--input-web
		--input-binary
		--output-folder

		-t, --transpiler
		-x, --minified
		-m, --sourcemap
		--target-unstable

		-v, --verbose
		-q, --quiet
`,
  {
    default: {
      inputNode: null,
      inputWeb: null,
      inputBinary: null,
      outputFolder: null,
      transpiler: 'babel',
      minified: false,
      sourcemap: true,
      targetUnstable: false,
      verbose: false,
      quiet: false,
    },

    alias: {
      t: 'transpiler',
      x: 'minified',
      m: 'sourcemap',
      v: 'verbose',
      q: 'quiet',
    },
  },
);

const verbose = command.flags.verbose;
const quiet = command.flags.quiet;
const targetUnstable = command.flags.targetUnstable;

if (verbose) {
  console.log('Flags:', command.flags);
}

const binaryConfig = pkg.bin;
let binaryOutput = null;
if (binaryConfig) {
  for (const name in binaryConfig) {
    binaryOutput = binaryConfig[name];
    break;
  }
}

const outputMatrix = {
  'node-classic-commonjs': pkg['main'] || null,
  'node-classic-esmodule': pkg['module'] || pkg['jsnext:main'] || null,
  'node-es2015-commonjs': pkg['main:es2015'] || null,
  'node-es2015-esmodule': pkg['es2015'] || pkg['module:es2015'] || null,
  'node-modern-commonjs': pkg['main:modern'] || null,
  'node-modern-esmodule': pkg['module:modern'] || null,
  'web-classic-esmodule': pkg['web'] || pkg['browser'] || null,
  'web-es2015-module': pkg['web:es2015'] || pkg['browser:es2015'] || null,
  'webpack-modern-esmodule': pkg['web:modern'] || pkg['browser:modern'] || null,
  'binary-binary-commonjs': binaryOutput || null,
};
