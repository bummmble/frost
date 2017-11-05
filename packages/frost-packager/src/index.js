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

const outputFolder = command.flags.outputFolder;
if (outputFolder) {
  outputMatrix['node-classic-commonjs'] = `${outputFolder}/node.classic.commonjs.js`;
  outputMatrix['node-classic-esmdule'] = `${outputFolder}/node.classic.esmodule.js`;
  outputMatrix['node-es2015-commonjs'] = `${outputFolder}/node.es2015.commonjs.js`;
  outputMatrix['node-es2015-esmodule'] = `${outputFolder}/node.es2015.esmodule.js`;
  outputMatrix['node-modern-commonjs'] = `${outputFolder}/node.modern.commonjs.js`;
  outputMatrix['node-modern-esmodule'] = `${outputFolder}/node.modern.esmodule.js`;
  outputMatrix['web-classic-esmodule'] = `${outputFolder}/web.classic.esmodule.js`;
  outputMatrix['web-es2015-esmodule'] = `${outputFolder}/web.es2015.esmodule.js`;
  outputMatrix['web-modern-esmodule'] = `${outputFolder}/web.modern.esmodule.js`;
};

const rollupFormats = {
  commonjs: 'cjs',
  esmodule: 'es'
};

const name = pkg.name || camelCase(pkg.name);
const banner = getBanner(pkg);
const targets = {};
const formats = ['esmodule', 'commonjs'];

if (command.flags.inputNode) {
  targets.node = [command.flags.inputNode];
} else {
  targets.node= [
    'src/node/public.js',
    'src/node/export.js',
    'src/node.js',
    'src/server/public.js',
    'src/server/export.js',
    'src/server.js',
    'src/public.js',
    'src/export.js',
    'src/index.js'
  ];
}

if (command.flags.inputWeb) {
  targets.web = [command.flags.inputWeb];
} else {
  targets.web = [
    'src/web/public.js',
    'src/web/export.js',
    'src/web.js',
    'src/browser/public.js',
    'src/browser/export.js',
    'src/browser.js',
    'src/client/public.js',
    'src/client/export.js',
    'src/client.js',
    'client/index.js'
  ];
}

if (command.flags.inputBinary) {
  targets.binary = [command.flags.inputBinary];
} else {
  targets.binary = [
    'src/binary.js',
    'src/script.js',
    'src/cli.js'
  ];
}

try {
  eachOfSeries(targets, (envInputs, targetId, envCallback) => {
    const input = lookupBest(envInputs);
    if (input) {
      eachOfSeries(formats, (format, formatIndex, formatCallback) => {
        const transpilers = getTranspilers(command.flags.transpiler, {
          minified: command.flags.minified,
          presets: [],
          plugins: [],
          targetUnstable
        });

        eachOfSeries(transpilers, (currentTranspiler, transpilerId, variantCallback) => {
          const outputFile = outputMatrix[`${targetId}-${transpilerId}-${format}`];
          if (outputFile) {
            return bundleTo({ input, targetId, transpilerId, currentTranspiler, format, outputFile, variantCallback });
          } else {
            return variantCallback(null);
          }
        }, formatCallback);
      }, envCallback);
    } else {
      envCallback(null);
    }
  })
} catch (error) {
  console.error(error);
  process.exit(1);
}

function lookupBest(candidates) {
  const filtered = candidates.filter(fileExists.sync);
  return filtered[0];
}

function bundleTo({ input, targetId, transpilerId, currentTranspiler, format, outputFile, variantCallback}) {
  const prefix = 'process.env.';
  const env = {
    [`${prefix}NAME`]: JSON.stringify(pkg.name),
    [`${prefix}VERSION`]: JSON.stringify(pkg.version),
    [`${prefix}TARGET`]: JSON.stringify(targetId)
  };

  return rollup({
    input,
    cache,
    onwarn: error => console.warn(chalk.red(` - ${error.message}`)),
    external(dependency) {
      if (dependency == input) {
        return false;
      }
      if (isAbsolute(dependency)) {
        const relativePath = relative(Root, dependency);
        return Boolean(/node_modules/.exec(relativePath));
      }

      return dependency.charAt(0) !== '.';
    },
    plguins: [
      nodeResolve({
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
        jsnext: true,
        module: true,
        main: true
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      yamlPlugin(),
      jsonPlugin(),
      currentTranspiler,
    ].filter(Boolean)
  })
  .then(({ write }) => write({
    format: rollupFormats[format],
    name,
    banner: transpilerId === 'binary' ? `#!/usr/bin/env node\n\n${banner}` : '',
    sourcemap: command.flags.sourcemap,
    file: outputFile
  }))
  .then(() => variantCallback(null))
  .catch(err => {
    console.error(err);
    variantCallback(`Error during bundling ${format}: ${error}`);
  })
}