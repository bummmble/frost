import { get as getAppRoot } from 'app-root-dir';
import { resolve as resolvePath } from 'path';
import browserlist from 'browserslist';
import envPreset, { isPluginRequired } from 'babel-preset-env';
import getTargets from 'babel-preset-env/lib/targets-parser';
import envPlugins from 'babel-preset-env/data/plugins.json';

import minifyPreset from 'babel-preset-minify';
import deadCodeEliminationPlugin from 'babel-plugin-minify-dead-code-elimination';
import dynamicImportSyntaxPlugin from 'babel-plugin-syntax-dynamic-import';
import dynamicImportRollupNode from 'babel-plugin-dynamic-import-node';
import dynamicImportRollupPlugin from 'babel-plugin-dynamic-import-webpack';
import dynamicImportUniversalWebpack from 'babel-plugin-universal-import';

import fastAsyncPlugin from 'babel-plugin-fast-async';
import classPropertiesPlugin from 'babel-plugin-transform-class-properties';
import objectRestSpreadPlugin from 'babel-plugin-transform-object-rest-spread';
import lodashPlugin from 'babel-plugin-lodash';
import transformRuntimePlugin from 'babel-plugin-transform-runtime';

import parseJSX from 'babel-plugin-syntax-jsx';
import transformReactJSX from 'babel-plugin-transform-react-jsx';
import transformReactJSXSource from 'babel-plugin-transform-react-jsx-source';
import transformReactJSXSelf from 'babel-plugin-transform-react-jsx-self';
import transformRemovePropTypes from 'babel-plugin-transform-react-remove-prop-types';
import reactIntlPlugin from 'babel-plugin-react-intl';
import reactInlineElementsPlugin from 'babel-plugin-transform-react-inline-elements';
import reactConstantElements from 'babel-plugin-transform-react-constant-elements';

const defaults = {
  debug: false,
  /* One of the following:
     * 'node/'nodejs'/'script'/'binary'
     * 'node8'
     * 'currrent'/'test'
     * 'browser'/'web'
     * 'library'
     * 'es2015'
     * 'modern'
     * {}
     */
  target: 'nodejs',
  env: 'auto',
  modules: 'auto',
  imports: 'auto',
  useBuiltIns: true,
  jsxPragma: 'React.createElement',
  rewriteAsync: 'promises',
  looseMode: true,
  specMode: false,
  optimizeModules: ['lodash', 'async', 'rambda', 'recompose'],
  sourceMaps: true,
  compression: false,
  comments: false,
  minified: false,
};

const modernTarget = {
  node: '8.2.0',
  electron: '1.6',
  browsers: [
    'Safari >= 10.1',
    'iOS >= 10.3',
    'Edge >= 15',
    'Chrome >= 59',
    'ChromeAndroid >= 59',
    'Firefox >= 53',
  ],
};

export default function buildPreset(context, opts = {}) {
  const presets = [];
  const plugins = [];
  const options = { ...defaults, ...opts };

  // reset env value when set as 'auto'
  if (opts.env === 'auto') {
    opts.env = null;
  }

  // Handle other possible env settings
  const envValue =
    opts.env || process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
  const isProd = /\bproduction\b/.test(envValue);

  if (options.debug) {
    console.log('Environment:', envValue);
    console.log('Is Production:', isProd);
  }

  // auto select test target
  if (envValue === 'test' && options.target == null) {
    options.target = 'test';
  }

  let buildBinary =
    options.target === 'node' ||
    options.target === 'node8' ||
    options.target === 'nodejs' ||
    options.target === 'script' ||
    options.target === 'binary';
  let buildCurrent = options.target === 'current' || options.target === 'test';
  let buildBrowserList =
    options.target === 'browser' || options.target === 'web';
  let buildLibrary =
    options.target === 'library' ||
    options.target === 'es2015' ||
    options.target === 'modern';
  let buildCustom = typeof options.target === 'object';
  let envTargets = {};

  if (buildBinary) {
    // Last stable NodeJs (LTS) - first LTS of 6.x.x was 6.9.0
    // https://nodejs.org/en/blog/release/v6.9.0
    // Expected LTS for v8.0.0 is October 2017. https://github.com/nodejs/LTS
    // This is allowed already when setting target to 'node8'
    envTargets.node = options.target === 'node8' ? '8.0.0' : '6.9.0';
  } else if (buildCurrent) {
    // Scripts that are directly used can be transpiled for current node
    envTargets.node = 'current';
  } else if (buildBrowserList) {
    // https://github.com/babel/babel-preset-env/issues/149
    // Until this issue is fixed, the preset can't use auto config
    // detection for browserlist in babel-preset-env. This is schedueled
    // for v2.0 of babel-preset-env. In the mean time browserlist is used to
    // query its config and pass over that data again to babel-preset-env to pass
    // it to browserlist internally
    const autoBrowsers = browserlist(null, {
      env: isProd ? 'production' : 'development',
    });
    envTargets.browsers = autoBrowsers;
  } else if (buildLibrary) {
    if (options.target === 'modern') {
      envTargets = modernTarget;
    } else {
      // Undefined results into 'latest' which supports a wide-range
      envTargets = undefined;
    }
  } else if (buildCustom) {
    envTargets = options.target;
  }

  const additionalExcludes = [];

  // Exclude all es2015 features which are supported by the default es2015 babel preset
  // This targets all es2015 capable browsers and engines
  if (options.target === 'es2015') {
    additionalExcludes.push(
      'check-es2015-constants',
      'transform-es2015-template-literals',
      'transform-es2015-literals',
      'transform-es2015-function-name',
      'transform-es2015-block-scoped-functions',
      'transform-es2015-classes',
      'transform-es2015-object-super',
      'transform-es2015-shorthand-properties'
    );
  }

  if (options.debug) {
    if (options.target === 'es2015') {
      console.log('Environment type: es2015 capable');
    } else {
      console.log(`Environment Targets: ${envTargets}`);
    }
  }

  // autoDetect modules based on target
  if (options.modules == null || options.modules === 'auto') {
    if (buildCurrent || buildBinary) {
      options.modules = 'commonjs';
    } else if (buildLibrary || buildBrowserList) {
      // Libraries should be published as ESModules for tree shaking
      // browsers usually will use something like webpack which itself benefits
      // from ESModules
      options.modules = false;
    } else {
      options.modules = 'commonjs';
    }
  }

  // Autodetect of imports based on target
  if (options.imports == null || options.imports == 'auto') {
    if (buildCurrent || buildBinary) {
      options.imports = 'rollup-nodejs';
    } else if (buildLibrary || buildCustom) {
      options.imports = 'rollup-webpack';
    } else if (buildBrowserList) {
      options.imports = 'webpack';
    } else {
      options.imports = null;
    }
  }

  // Automatic chunkNames require webpack comments
  if (options.imports === 'webpack') {
    options.comments = true;
  }

  // Ask Babel whether we want to use transform-async based on current targets,
  // otherwise we assume it works without transpilation
  const requiresAsync = isPluginRequired(
    getTargets(envTargets),
    envPlugins['transform-async-to-generator']
  );
  if (!requiresAsync) {
    options.rewriteAsync = null;
  }

  // Use basic compression for libraries and full on binaries
  if (options.compression) {
    if (isProd && buildBinary) {
      presets.push(minifyPreset);
    } else {
      // apply basic compression for normal non-min builds.
      presets.push([
        minifyPreset,
        {
          booleans: false,
          infinity: false,
          mangle: false,
          flipComparisons: false,
          simplify: false,
          keepFnName: true,
        },
      ]);
    }
  } else {
    plugins.push(deadCodeEliminationPlugin);
  }

  presets.push([
    envPreset,
    {
      modules: options.modules,
      useBuiltIns: options.useBuiltIns,
      loose: options.loose,
      spec: options.spec,
      exclude: [
        'transform-regenerator',
        'transform-async-to-generator',
        ...additionalExcludes,
      ],
      targets: envTargets,
    },
  ]);

  plugins.push(dynamicImportSyntaxPlugin);

  if (options.imports === 'rollup-nodejs') {
    plugins.push(dynamicImportRollupNode);
  } else if (options.imports === 'rollup-webpack') {
    plugins.push(dynamicImportRollupPlugin);
  } else if (options.imports === 'webpack') {
    plugins.push(dynamicImportUniversalWebpack);
  }

  plugins.push([lodashPlugin, { id: options.optimizeModules }]);

  if (options.rewriteAsync === 'promises') {
    plugins.push([fastAsyncPlugin, { useRuntimeModule: true }]);
  }

  plugins.push(classPropertiesPlugin);
  plugins.push([
    objectRestSpreadPlugin,
    {
      useBuiltIns: options.useBuiltIns,
    },
  ]);

  plugins.push(parseJSX);
  plugins.push([
    transformReactJSX,
    {
      useBuiltIns: options.useBuiltIns,
      pragma: options.jsxPragma,
    },
  ]);

  if (!isProd) {
    plugins.push(transformReactJSXSource);
    plugins.push(transformReactJSXSelf);
  }

  if (isProd) {
    plugins.push([
      transformRemovePropTypes,
      {
        mode: 'remove',
        removeImport: true,
      },
    ]);

    plugins.push(reactIntlPlugin);
    plugins.push(reactInlineElementsPlugin);
    plugins.push(reactConstantElements);
  }

  plugins.push([
    transformRuntimePlugin,
    {
      helpers: true,
      regenerator: false,
      polyfill: false,
      useBuiltIns: options.useBuiltIns,
      useESModules: options.modules === false,
    },
  ]);

  return {
    comments: options.comments,
    compact: true,
    minified: options.minified,
    sourceMaps: options.sourceMaps,
    presets,
    plugins,
  };
}
