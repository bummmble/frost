'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var meow = _interopDefault(require('meow'));
var chalk = _interopDefault(require('chalk'));
var updateNotifier = _interopDefault(require('update-notifier'));
var cosmiconfig = _interopDefault(require('cosmiconfig'));
var appRootDir = require('app-root-dir');
var lodash = require('lodash');
var path = require('path');
var webpack = _interopDefault(require('webpack'));
var fsExtra = require('fs-extra');
var fs = require('fs');
var ExtractCssChunks = _interopDefault(require('extract-css-chunks-webpack-plugin'));
var builtinModules = _interopDefault(require('builtin-modules'));
var loaderUtils = require('loader-utils');
var CaseSensitivePathsPlugin = _interopDefault(require('case-sensitive-paths-webpack-plugin'));
var StatsPlugin = _interopDefault(require('stats-webpack-plugin'));
var webpackBundleAnalyzer = require('webpack-bundle-analyzer');
var ServiceWorkerPlugin = _interopDefault(require('serviceworker-webpack-plugin'));
var BabiliMinifyPlugin = _interopDefault(require('babel-minify-webpack-plugin'));
var UglifyPlugin = _interopDefault(require('uglifyjs-webpack-plugin'));
var SriPlugin = _interopDefault(require('webpack-subresource-integrity'));
var ora = _interopDefault(require('ora'));
var webpackDevMiddleware = _interopDefault(require('webpack-dev-middleware'));
var webpackHotMiddleware = _interopDefault(require('webpack-hot-middleware'));
var webpackHotServerMiddleware = _interopDefault(require('webpack-hot-server-middleware'));
var express = _interopDefault(require('express'));

var defaults = {
  entry: {
    client: 'client/index.js',
    server: 'server/index.js',
  },

  output: {
    client: 'build/client',
    server: 'build/server',
    public: '/static/',
  },

  files: {
    babel: /\.(js|mjs|jsx)$/,
    styles: /\.(css|sss|pcss)$/,
    images: /\.(jpg|png|gif)$/,
    fonts: /\.(eot|svg|otf|ttf|woff|woff2)$/,
    video: /\.(mp4|webm)$/,
  },

  cacheLoader: {},
  hmr: true,
  postcss: true,
  sourceMaps: false,
  compression: {
    type: 'babili',
    babiliClientOptions: {},

    // Basic compression for server, we don't want dead code
    babiliServerOptions: {
      booleans: false,
      deadcode: true,
      flipComparisons: false,
      mangle: false,
      mergeVars: false,
    },
    uglifyOptions: {
      compress: {
        // Only risky for some rare floating point operations
        unsafe_math: true,
        // Optimize expressions like Array.prototype.map.call into [].map.call
        unsafe_proto: true,
        // Good for chrome perf
        keep_infinity: true,
        // Try hard to export less code
        passes: 2,
      },
      output: {
        // Fix for problematic code like emojis
        ascii_only: true,
        // Remove all the comments!
        comments: false,
      },
    },
  },
  locale: {},
  images: {
    progressive: true,
    optimizationLevel: 7,
    interlaced: false,
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
  },
  babel: {
    presets: [],
    plugins: []
  },
  prettier: {},
  eslint: {},
  performance: {},
  pwa: {},
  verbose: true,
};

const Root = appRootDir.get();
const resolveFor = [
  'entry.client',
  'entry.server',
  'entry.clientVendor',
  'output.server',
  'output.client',
];

const configLoader = cosmiconfig('frost', {
  stopDir: Root,
});

const configPromise = configLoader
  .load(Root)
  .then(results => {
    const merged = lodash.defaultsDeep(results.config, defaults);
    return resolvePaths(merged);
  })
  .catch(error => {
    throw new Error(`Error parsing frost-config file: ${error}`);
  });

const getConfig = async flags => {
  return await configPromise.then(config => {
    for (const key in flags) {
      lodash.set(config, key, flags[key]);
    }
    return config;
  });
};

const resolvePaths = config => {
  resolveFor.forEach(loc => {
    if (lodash.get(config, loc) != null) {
      lodash.set(config, loc, path.resolve(Root, lodash.get(config, loc)));
    }
  });
  return config;
};

const configureCompiler = (target, env) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isDev = env === 'development';
  const isProd = env === 'production';
  const name = isServer ? 'server' : 'client';
  const webpackTarget = isServer ? 'node' : 'web';

  return {
    isClient,
    isServer,
    isDev,
    isProd,
    name,
    webpackTarget,
  };
};

const buildEntryAndOutput = ({ entry, output, hmr }, isServer, isDev) => {
  const mainEntry = isServer ? entry.server : entry.client;
  const vendorEntry = isServer ? entry.serverVendor : entry.clientVendor;
  const hasMain = fs.existsSync(mainEntry);
  const hasVendor = fs.existsSync(vendorEntry);
  const clientOutput = output.client;
  const serverOutput = output.server;

  const hmrMiddleware =
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true&noInfo=true&overlay=false';
  const hasHmr = !isServer && isDev && hmr;
  return {
    mainEntry,
    vendorEntry,
    hasMain,
    hasVendor,
    clientOutput,
    serverOutput,
    hmrMiddleware,
    hasHmr,
  };
};

const removeEmptyKeys = obj => {
  const res = {};
  for (const key in obj) {
    if (!(obj[key] === null || obj[key].length === 0)) {
      res[key] = obj[key];
    }
  }
  return res;
};

const each = async (arr, fn) => {
  for (const item of arr) {
    await fn(item);
  }
};

const promisify = fn => {
  if (typeof fn !== 'function') {
    throw new Error(
      `Argument passed must be a function. Received ${typeof fn}`,
    );
  }

  return (...args) => {
    return new Promise((resolve$$1, reject) => {
      const cb = (err, ...args) => {
        if (err) {
          reject(err);
        } else {
          const data = args.length >= 1 ? args[0] : args;
          resolve$$1(data);
        }
      };

      fn(...[...args, cb]);
    });
  };
};

const infoColor = chalk.rgb(135, 206, 250); //info
const successColor = chalk.rgb(102, 205, 170); //success
const warningColor = chalk.rgb(255, 165, 0); //warning
const dotindex = c => {
  const m = /\.[^.]*$/.exec(c);
  return m ? m.index + 1 : c.length;
};

const Logger = {
  success: msg => successColor(msg),
  info: msg => infoColor(msg),
  warning: msg => warningColor(msg),
  error: msg => chalk.red(msg),
  clearConsole: () => {
    process.stdout.write(
      process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H',
    );
  },
  table: (inputRows, config = {}) => {
    const align = config.align;
    const stringLength = config.stringLength;
    const dotsizes = inputRows.reduce((acc, row) => {
      row.forEach((c, index) => {
        const n = dotindex(c);
        if (!acc[index] || n > acc[index]) {
          acc[index] = n;
        }
      });
      return acc;
    }, []);

    const rows = inputRows.map(row => {
      return row.map((column, index) => {
        const c = String(column);
        if (align[index] === '.') {
          const idx = dotindex(c);
          const size =
            dotsizes[index] + (/\./.test(c) ? 1 : 2) - (stringLength(c) - idx);
          return c + Array(size).join(' ');
        }
        return c;
      });
    });

    const sizes = rows.reduce((acc, row) => {
      row.forEach((c, index) => {
        const n = stringLength(c);
        if (!acc[index] || n > acc[index]) {
          acc[index] = n;
        }
      });
      return acc;
    }, []);

    return rows
      .map(row => {
        return row
          .map((c, index) => {
            const n = sizes[index] - stringLength(c) || 0;
            const s = Array(Math.max(n + 1, 1)).join(' ');
            if (align[index] === 'r' || align[index] === '.') {
              return s + c;
            }
            if (align[index] === 'c') {
              return (
                Array(Math.ceil(n / 2 + 1)).join(' ') +
                c +
                Array(Math.floor(n / 2 + 1)).join(' ')
              );
            }
            return c + s;
          })
          .join(' ')
          .replace(/\s+$/, '');
      })
      .join('\n');
  },
};

const root = 'node_modules';

const BuiltIns = new Set(builtinModules);
const Modules = new Set();
const Binaries = new Set();
const nodePackages = fs.readdirSync(root).filter(
  dirname => dirname.charAt(0) !== '.',
);
nodePackages.forEach(pkg => {
  let json;
  try {
    json = fsExtra.readJsonSync(path.resolve(root, pkg, 'package.json'));
  } catch (error) {}

  if (json.module || json.style || json['jsnext:main']) {
    Modules.add(pkg);
  }

  // Config for Node-Pre-Gyp
  // See https://www.npmjs.com/package/node-pre-gyp
  if (json.binary != null) {
    Binaries.add(pkg);
  }
});

const Problematic = new Set([
  // 'intl' is included in one block. No reason to bundle everything
  'intl',

  // 'mime-db' for mime-types. Naturally very large
  'mime-db',

  // 'encoding' uses dynamic iconv loading
  'encoding',

  // Native code helper
  'node-gyp',
  'node-pre-gyp',

  // These modules use dynamic requires which do not play well with Webpacj
  'ajv',
  'colors',
  'express',
  'jsdom',
]);

console.log('ESM:', Modules);
console.log('Binaries:', Binaries);
console.log('Problematic:', Problematic);

const isLoaderSpecific = req => {
  return !!/\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|swf|css|scss|sass|sss|less)$/.exec(
    req,
  );
};

var getExternals = () => {
  return (context, req, cb) => {
    const basename = req.split('/')[0];

    // Externalize builtins
    if (BuiltIns.has(basename)) {
      return cb(null, `commonjs ${req}`);
    }

    // Externalize binaries
    if (Binaries.has(basename)) {
      return cb(null, `commonjs ${req}`);
    }

    // Externalize problematic commonjs
    if (Problematic.has(basename)) {
      return cb(null, `commonjs ${req}`);
    }

    // Ignore inline files
    if (basename.charAt(0) === '.') {
      return cb();
    }

    // Inline all modules
    if (Modules.has(basename)) {
      return cb();
    }

    // Inline modules that need a webpack env
    if (isLoaderSpecific(req)) {
      return cb();
    }

    return cb(null, `commonjs ${req}`);
  };
};

const hashType = 'sha256';
const digestType = 'base62';
const digestLength = 4;

const generateHash = pkg => {
  return loaderUtils.getHashDigest(JSON.stringify(pkg), hashType, digestType, digestLength);
};

var cacheHash = (type, pkg, target, env) => {
  const hash = generateHash(pkg);
  return `.cache/${type}-${hash}-${target}-${env}`;
};

class MissingModules {
  constructor(path$$1) {
    this.path = path$$1;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      const missing = compilation.missingDependencies;
      const path$$1 = this.path;
      if (missing.some(file => file.indexOf(path$$1) !== -1)) {
        compilation.contextDependencies.push(path$$1);
      }
      cb();
    });
  }
}

/** This is a slightly more modern approach to hashing than the
 *  'webpack-md5-hash'. For some reason the SHA256 Version does not always
 *  work as intended and creates different hashes for the same content, hurting
 *  our caching strategies. This is simply a replacement of the md5 with the
 *  loader-utils implementation which also supports short generated hashes using
 *  base62 encoding instead of hex
 */

const compareModules = (a, b) => {
  if (a.resource < b.resource) {
    return -1;
  }
  if (a.resource > b.resource) {
    return 1;
  }
  return 0;
};

const getSource = module => {
  const source = module._source || {};
  return source._value || '';
};

const concatenateSource = (result, source) => result + source;
const hashType$1 = 'sha256';
const digestType$1 = 'base62';
const digestLength$1 = 8;

class ChunkHash {
  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('chunk-hash', (chunk, chunkHash) => {
        const source = chunk
          .mapModules(module => module)
          .sort(compareModules)
          .map(getSource)
          .reduce(concatenateSource, '');
        const hash = loaderUtils.getHashDigest(source, hashType$1, digestType$1, digestLength$1);

        chunkHash.digest = function() {
          return hash;
        };
      });
    });
  }
}

const Root$2 = appRootDir.get();

class Progress {
  constructor({ prefix }) {
    this.prefix = prefix;
  }

  apply(compiler) {
    let spinner = null;
    let last = null;
    const prefix = this.prefix ? this.prefix + ' ' : '';

    function display(message) {
      if (message !== '') {
        spinner.text = prefix + message;
        spinner.render();
      } else {
        spinner.succeed(prefix + 'Done!');
      }
    }

    function moduleDone(module) {
      let index;
      let id = last;

      index = id.lastIndexOf(' ');
      id = index === -1 ? id : id.slice(index + 1, id.length);

      index = id.lastIndexOf('!');
      id = index === -1 ? id : id.slice(index + 1, id.length);

      index = id.indexOf('?');
      id = index === -1 ? id : id.slice(0, index);

      id = path.relative(Root$2, id).replace(/^node_modules\//, '~/');

      if (id.startsWith('"') && id.endsWith('"')) {
        id = id.slice(1, -1);
      }

      if (id.includes('|')) return;
      if (id.startsWith('..')) return;
      if (/^[a-zA-Z0-9\-_/~\.]{0,50}$/.test(id)) {
        display(`Building Modules ${id}...`);
      }
    }

    compiler.plugin('compilation', compilation => {
      if (compilation.compiler.isChild()) return;

      spinner = ora({ interval: 16 });
      spinner.start();

      display(0, 'compiling');

      compilation.plugin('build-module', module => {
        last = module.identifier();
      });
      compilation.plugin('failed-module', moduleDone);
      compilation.plugin('success-module', moduleDone);

      const syncHooks = {
        seal: 'Sealing',
        optimize: 'Optimizing',
        'optimize-modules-basic': 'Optimizing Modules',
        'optimize-chunks-basic': 'Optimizing chunks',
        'optimize-chunk-modules': 'Optimizing chunk modules',
        'optimize-module-order': 'Optimizing module order',
        'optimize-module-ids': 'Optimizing module ids',
        'optimize-chunk-order': 'Optimizing chunk order',
        'optimizing-chunk-ids': 'Optimizing chunk ids',
        'before-hash': 'Hashing',
        'before-module-assets': 'Processing module assets',
        'before-chunk-assets': 'Processing chunk assets',
        record: 'Recording',
      };

      Object.keys(syncHooks).forEach(name => {
        let pass = 0;
        const message = syncHooks[name];
        compilation.plugin(name, () => {
          if (pass++ > 0) {
            display(message + ` [pass ${pass}]`);
          } else {
            display(message);
          }
        });
      });

      compilation.plugin('optimize-tree', (chunks, modules, cb) => {
        display('Optimizing tree');
        cb();
      });

      compilation.plugin('additional-assets', cb => {
        display('Processing assets');
        cb();
      });

      compilation.plugin('optimize-chunk-assets', (chunks, cb) => {
        display('Optimizing chunk assets');
        cb();
      });

      compilation.plugin('optimize-assets', (assets, cb) => {
        display('Optimizing assets');
        cb();
      });
    });

    compiler.plugin('emit', (compilation, cb) => {
      display('Emitting');
      cb();
    });

    compiler.plugin('done', () => {
      display('');
    });
  }
}

const basePlugins = (env, webpackTarget, isDev, isProd) => {
  return [
    new webpack.DefinePlugin({
      // These need to be kept separate to allow for usage with
      // libraries like dotenv
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(webpackTarget),
    }),

    // Improves OS Compat
    // See: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
    new CaseSensitivePathsPlugin(),
    new MissingModules(),

    process.stdout.isTTY
      ? new Progress({
          prefix: 'frost',
        })
      : null,

    isDev ? new webpack.NamedModulesPlugin() : null,
    isDev ? new webpack.NoEmitOnErrorsPlugin() : null,

    // Generates IDs that preserve over builds
    // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
    isProd ? new webpack.HashedModuleIdsPlugin() : null,

    // This is used to guarentee that our generated [chunkhash]'s are different ONLY
    // if the content for the respective chunks have changed. This allows for maximization
    // of a long-term browser caching strategy for the client bundle, avoiding cases
    // where browsers end up having to download all of the chunks again even though
    // only one or two may have changed
    isProd ? new ChunkHash() : null,
    isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
  ].filter(Boolean);
};

const clientPlugins = (
  isDev,
  isProd,
  hasVendor,
  hasHmr,
  { compression, pwa, sourceMaps },
) => {
  return [
    hasVendor
      ? new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          children: true,
          minChunks: 2,
          async: true,
        })
      : null,
    new ExtractCssChunks({
      filename: isDev ? '[name].css' : '[name]-[contenthash:base62:8].css',
    }),

    hasHmr ? new webpack.HotModuleReplacementPlugin() : null,

    // Let the server side renderer know about our client assets
    // https://github.com/FormidableLabs/webpack-stats-plugin
    isProd ? new StatsPlugin('stats.json') : null,
    isProd
      ? new webpackBundleAnalyzer.BundleAnalyzerPlugin({
          analyzerMode: 'static',
          defaultSizes: 'gzip',
          logLevel: 'silent',
          openAnalyzer: false,
          reportFilename: 'report.html',
        })
      : null,

    // Subresource Integrity is a security feature that allows browsers to verify
    // that the files they fetch are delivered without manipulation
    // https://www.npmjs.com/package/webpack-subresource-integrity
    isProd
      ? new SriPlugin({
          hashFuncNames: ['sha256', 'sha512'],
          enabled: true,
        })
      : null,

    isProd && compression.type === 'babili'
      ? new BabiliMinifyPlugin(compression.babiliClientOptions)
      : null,

    isProd && compression.type === 'uglify'
      ? new UglifyPlugin({
          sourcemap: sourceMaps,
          parallel: true,
          cache: true,
          uglifyOptions: compression.uglifyOptions,
        })
      : null,

    pwa.hasServiceWorker
      ? new ServiceWorkerPlugin({
          entry: pwa.serviceWorkerEntry,
          exclude: ['*hot-update', '**/*.map', '**/stats.json'],
        })
      : null,
  ].filter(Boolean);
};

const serverPlugins = (isDev, isProd, { compression }) => {
  return [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    isProd
      ? new webpackBundleAnalyzer.BundleAnalyzerPlugin({
          analyzerMode: 'static',
          defaultSizes: 'parsed',
          logLevel: 'silent',
          openAnalyzer: false,
          reportFilename: 'report.html',
        })
      : null,
    isProd ? new BabiliMinifyPlugin(compression.babiliServerOptions) : null,
  ].filter(Boolean)
};

var PluginManager = (
  env,
  webpackTarget,
  isDev,
  isProd,
  isServer,
  hasVendor,
  hasHmr,
  config,
) => {
  const base = basePlugins(env, webpackTarget, isDev, isProd);
  const plugins = isServer
    ? base.concat(...serverPlugins(isDev, isProd, config))
    : base.concat(...clientPlugins(isDev, isProd, hasVendor, hasHmr, config));
  return plugins;
};

const Root$1 = appRootDir.get();
const pkg$1 = require(path.resolve(Root$1, 'package.json'));

var compiler = (target, env = 'development', config = {}) => {
  const {
    isClient,
    isServer,
    isDev,
    isProd,
    name,
    webpackTarget,
  } = configureCompiler(target, env);

  const {
    mainEntry,
    vendorEntry,
    hasMain,
    hasVendor,
    serverOutput,
    clientOutput,
    hasHmr,
    hmrMiddleware,
  } = buildEntryAndOutput(config, isServer, isDev);

  /* const DefaultLocale = config.locale.default;
  const SupportedLocales = config.locale.supported;

  const SupportedLanguages = (() => {
    const languages = new Set();
    for (const lang of SupportedLocales) {
      languages.add(lang.split('-')[0]);
    }
    return Array.from(languages.keys());
  })(); */

  const prefix = chalk.bold(target.toUpperCase());
  const devtool = config.sourceMaps ? 'source-map' : false;
  const loaderCache = path.resolve(Root$1, cacheHash('loader', pkg$1, target, env));
  const cacheLoader = config.cacheLoader
    ? {
        loader: 'cache-loader',
        options: {
          cacheDirectory: loaderCache,
        },
      }
    : null;

  const cssLoaderOptions = {
    modules: true,
    localIdentName: '[local]-[hash:base62:8]',
    minimize: false,
    sourceMap: config.sourceMaps,
  };

  const postcssLoaderOptions = config.postcss
    ? {
        loader: 'postcss-loader',
        query: {
          sourceMap: config.sourceMaps,
        },
      }
    : null;

  const plugins = PluginManager(
    env,
    webpackTarget,
    isDev,
    isProd,
    isServer,
    hasVendor,
    hasHmr,
    config
  );

  console.log(Logger.info(chalk.underline(`${prefix} Configuration`)));
  console.log(`→ Environment: ${Logger.info(env)}`);
  console.log(`→ Webpack Target: ${Logger.info(webpackTarget)}`);

  if (config.verbose) {
    console.log(`→ Enable Source Maps: ${Logger.info(devtool)}`);
    console.log(`→ Use Cache Loader: ${Logger.info(config.sourceMaps)}`);
  }

  return {
    name,
    devtool,
    target: webpackTarget,
    context: Root$1,
    performance: config.performance || {},
    externals: isServer ? getExternals(Root$1) : undefined,
    entry: removeEmptyKeys({
      vendors: hasVendor
        ? [hasVendor && hasHmr ? hmrMiddleware : null, vendorEntry].filter(
            Boolean,
          )
        : null,
      main: hasMain
        ? [hasMain && hasHmr ? hmrMiddleware : null, mainEntry].filter(Boolean)
        : null,
    }),

    output: {
      libraryTarget: isServer ? 'commonjs2' : 'var',
      filename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
      path: isServer ? serverOutput : clientOutput,
      crossOriginLoading: 'anonymous'
    },

    module: {
      rules: [
        config.eslint
          ? {
              test: config.files.babel,
              include: [config.entry.client, config.entry.server],
              enforce: 'pre',
              use: {
                loader: 'eslint-loader',
              },
            }
          : {},
        {
          test: config.files.babel,
          loader: 'source-map-loader',
          enforce: 'pre',
          options: {
            quiet: true,
          },
        },
        {
          test: config.files.babel,
          use: [
            cacheLoader,
            {
              loader: 'babel-loader',
              options: config.babel,
            },
          ].filter(Boolean),
        },
        {
          test: config.files.styles,
          use: isClient
            ? ExtractCssChunks.extract({
                use: [
                  cacheLoader,
                  {
                    loader: 'css-loader',
                    options: cssLoaderOptions,
                  },
                  postcssLoaderOptions,
                ].filter(Boolean),
              })
            : [
                cacheLoader,
                {
                  loader: 'css-loader/locals',
                  options: cssLoaderOptions,
                },
                postcssLoaderOptions,
              ].filter(Boolean),
        },
        {
          test: config.files.fonts,
          loader: 'file-loader',
          options: {
            name: isProd ? 'file-[hash:base62:8].[ext]' : '[path][name].[ext]',
            emitFile: isClient,
          },
        },
        {
          test: config.files.images,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: config.images,
            },
          ],
        },
        {
          test: config.files.video,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        },
      ],
    },
    plugins: [...plugins],
  };
};

const formatRaw = (message, isError) => {
  let lines = message.split('\n');

  if (lines.length > 2 && lines[1] === '') {
    lines.splice(1, 1);
  }
  if (lines[0].lastIndexOf('!') !== -1) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }

  lines = lines.filter(line => lines.indexOf(' @ ') !== 0);
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }

  message = lines.join('\n');
  return message.trim();
};

const formatWebpack = json => {
  const errors = json.errors.map(message => formatRaw(message, true));
  const warnings = json.warnings.map(message => formatRaw(message, false));
  return { errors, warnings };
};

const isMultiStats = stats => stats.stats;
const getCompileTime = stats => {
  if (isMultiStats(stats)) {
    return stats.stats
      .reduce((time, stats) => {
        return Math.max(time, getCompileTime(stats))
      }, 0);
  }
  return stats.endTime - stats.startTime;
};

var formatOutput = (error, stats, target) => {
  if (error) {
    const msg = `Fatal error while compiling ${target}. Error: ${error}`;
    console.log(chalk.red(msg));
    return Promise.reject(msg);
  }

  const raw = stats.toJson({});
  const { errors, warnings } = formatWebpack(raw);

  const isSuccessful = !errors.length && !warnings.length;
  if (isSuccessful) {
    console.log(chalk.green(`Compiled ${target} successfully`));
  }

  if (errors.length) {
    console.log(chalk.red(`Failed to compile ${target}`));
    console.log(errors.join('\n\n'));
    return Promise.reject(`Failed to compile ${target}`);
  }

  if (warnings.length && !errors.length) {
    console.log(chalk.yellow(`Compiled ${target} with warnings`));
    console.log(warnings.join('\n\n'));
  }

  const compileTime = getCompileTime(stats);
  console.log(chalk.green(`${target} compiled in: ${compileTime}ms`));
  return Promise.resolve(true);
};

const removePromise = promisify(fsExtra.remove);

const buildClient = (config = {}) => {
  const webpackConfig = compiler('client', 'production', config);
  return new Promise((resolve$$1, reject) => {
    webpack(webpackConfig, (error, stats) => {
      return resolve$$1(formatOutput(error, stats, 'client'));
    });
  });
};

const buildServer = (config = {}) => {
  const webpackConfig = compiler('server', 'production', config);
  return new Promise(resolve$$1 => {
    webpack(webpackConfig, (error, stats) => {
      return resolve$$1(formatOutput(error, stats, 'server'));
    });
  });
};

const cleanClient = (config = {}) => {
  return removePromise(config.output.client);
};

const cleanServer = (config = {}) => {
  return removePromise(config.output.server);
};

//import { createExpressServer } from '../../../frost-server/src/index';
const create = (config = {}) => {
  const clientConfig = compiler('client', 'development', config);
  const serverConfig = compiler('server', 'development', config);
  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers[0];

  const devMiddleware = webpackDevMiddleware(multiCompiler, {
    publicPath: config.output.public,
    quiet: true,
    noInfo: true,
  });
  const hotMiddleware = webpackHotMiddleware(clientCompiler);
  const hotServerMiddleware = webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: {
      outputPath: config.output.client,
    },
  });

  return {
    middleware: [devMiddleware, hotMiddleware, hotServerMiddleware],
    multiCompiler,
  };
};

const connect = (server, multiCompiler) => {
  let serverIsStarted = false;
  multiCompiler.plugin('invalid', () => {
    console.log('Frost dev server compiling');
  });

  multiCompiler.plugin('done', stats => {
    formatOutput(false, stats);
    if (!stats.hasErrors() && !serverIsStarted) {
      serverIsStarted = true;
      server.listen(process.env.SERVER_PORT, () => {
        console.log(
          `Frost dev server started at port ${process.env.SERVER_PORT}`,
        );
      });
    }
  });
};

const start = (config = {}) => {
  const { middleware, multiCompiler } = create(config);
  const server = express();
  server.use(...middleware);

  connect(server, multiCompiler);
};

const pkg = require('../package.json');
const appPkg = require(Root + '/package.json');
const appInfo = `running on ${Logger.info(appPkg.name)}-${Logger.info(
  appPkg.version,
)}`;

console.log(
  chalk.bold(`Frost ${chalk.magenta(`v ${pkg.version}`)} ${appInfo}`),
);

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60,
}).notify();

const cli = meow(
  `
	Usage:
		$ frost <command>

  Options:
    --verbose, -v       Extensive messages to help with debugging
    --quiet, -q         Silences all but important messages

	Commands:
    dev                 Starts a dev server
    build               Builds production versions of both client and server
		build:client        Builds a production version of the client
    build:server        Builds a production version of the server
    clean:              Cleans the output directories
`,
  {
    alias: {
      v: 'verbose',
      q: 'quiet',
    },
  },
);

const input = cli.input;
const flags = cli.flags;
const tasks = [
  { task: 'dev', commands: [cleanClient, cleanServer, start] },
  {
    task: 'build',
    commands: [cleanClient, cleanServer, buildClient, buildServer],
  },
  { task: 'build:client', commands: [cleanClient, buildClient] },
  { task: 'build:server', commands: [cleanServer, buildServer] },
  { task: 'clean', commands: [cleanServer, cleanClient] },
];

// Prevent deprecation messages
if (!flags.verbose) {
  process.noDeprecation = true;
}

function execute(commands, config) {
  return each(commands, item => item(config));
}

async function executeTasks() {
  const config = await getConfig(flags);
  for (const name of input) {
    for (const task of tasks) {
      if (task.task === name) {
        try {
          await execute(task.commands, config);
        } catch (error) {
          console.error(
            Logger.error(`Failed to execute task ${name}. Error ${error}`),
          );
          console.error(error);
          process.exit(1);
        }
      }
    }
  }
}

if (input.length > 0) {
  process.nextTick(executeTasks);
} else {
  command.showHelp();
}
