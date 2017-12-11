'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cosmiconfig = _interopDefault(require('cosmiconfig'));
var appRootDir = require('app-root-dir');
var path = require('path');
var jsome = _interopDefault(require('jsome'));
var frostUtils = require('frost-utils');
var webpack = _interopDefault(require('webpack'));
var webpackDevMiddleware = _interopDefault(require('webpack-dev-middleware'));
var webpackHotMiddleware = _interopDefault(require('webpack-hot-middleware'));
var webpackHotServerMiddleware = _interopDefault(require('webpack-hot-server-middleware'));
var getPort = _interopDefault(require('get-port'));
var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var fsExtra = require('fs-extra');
var frostExpress = require('frost-express');
var EventEmitter = _interopDefault(require('events'));
var chalk = _interopDefault(require('chalk'));
var ServiceWorkerPlugin = _interopDefault(require('serviceworker-webpack-plugin'));
var BabiliMinifyPlugin = _interopDefault(require('babel-minify-webpack-plugin'));
var StatsPlugin = _interopDefault(require('stats-webpack-plugin'));
var UglifyPlugin = _interopDefault(require('uglifyjs-webpack-plugin'));
var HappyPack = _interopDefault(require('happypack'));
var ExtractTextPlugin = _interopDefault(require('extract-text-webpack-plugin'));
var ExtractCssChunks = _interopDefault(require('extract-css-chunks-webpack-plugin'));
var CaseSensitivePathsPlugin = _interopDefault(require('case-sensitive-paths-webpack-plugin'));
var webpackBundleAnalyzer = require('webpack-bundle-analyzer');
var loaderUtils = require('loader-utils');
var ora = _interopDefault(require('ora'));
var builtinModules = _interopDefault(require('builtin-modules'));
var resolvePkg = _interopDefault(require('resolve-pkg'));

var Schema = {
  mode: {
    type: 'string',
    defaults: 'universal'
  },

  entry: {
    client: {
      type: 'path',
      defaults: 'client/index.js'
    },

    server: {
      type: 'path',
      defaults: 'server/index.js'
    },

    vendor: {
      type: 'array',
      defaults: []
    }
  },

  output: {
    client: {
      type: 'path',
      defaults: 'build/client'
    },

    server: {
      type: 'path',
      defaults: 'build/server'
    },

    public: {
      type: 'url',
      defaults: '/static/'
    }
  },

  files: {
    babel: {
      type: 'regex',
      defaults: /\.(js|mjs|jsx)$/,
    },

    styles: {
      type: 'regex',
      defaults: /\.(css|sss|pcss|less|sass|scss|styl|stylus)$/,
    },

    images: {
      type: 'regex',
      defaults: /\.(jpg|png|gif|webp)$/
    },

    fonts: {
      type: 'regex',
      defaults: /\.(eot|svg|otf|ttf|woff|woff2)$/
    },

    video: {
      type: 'regex',
      defaults: /\.(mp4|webm)$/
    },

    graphql: {
      type: 'regex',
      defaults: /\.(graphql|gql)$/
    }
  },

  build: {
    useHmr: {
        type: 'boolean',
        defaults: true
    },

    sourceMaps: {
        type: 'boolean',
        defaults: false
    },

    css: {
        postcss: {
            type: 'object-or-bool',
            defaults: true
        },

        cssLoader: {
            type: 'object-or-bool',
            defaults: false
        },

        preprocessor: {
            type: 'string',
            defaults: 'none'
        },

        extract: {
            type: 'string',
            defaults: 'chunks'
        }
    },

    compression: {
        kind: {
            type: 'string',
            defaults: 'babili'
        },

        babiliClientOptions: {
            type: 'object',
            defaults: {}
        },

        babiliServerOptions: {
            type: 'object',
            defaults: {}
        },

        uglifyOptions: {
            type: 'object',
            defaults: {}
        }
    },

    performance: {
        type: 'object-or-bool',
        defaults: false
    },

    images: {
        type: 'object',
        defaults: {}
    }
  },

  serverOptions: {
    useHttps: {
      type: 'boolean',
      defaults: false
    },

    keyPath: {
      type: 'path',
      defaults: 'localhost.key'
    },

    certPath: {
      type: 'path',
      defaults: 'localhost.cert'
    }
  },

  pwa: {
    hasServiceWorker: {
        type: 'boolean',
        defaults: false
    },

    workerEntry: {
        type: 'path',
        defaults: 'client/sw.js'
    }
  },

  verbose: {
    type: 'boolean',
    defaults: false
  },

  renderers: {
    type: 'array',
    defaults: []
  },

  sequence: {
    type: 'array',
    defaults: []
  }
};

const Root = appRootDir.get();

const configError = ({ key, value, type }) =>
  `Frost: The config for ${key} is of the wrong type. Frost expected a ${type} but received ${typeof value}`;

function validateConfig(config, schema) {
  return Object.keys(schema).reduce((acc, curr) => {
    const structure = schema[curr];
    const value = config[curr] || {};

    if (!structure.type) {
      acc[curr] = validateConfig(value, structure);
    } else {
      if (config[curr]) {
        acc[curr] = processEntry(curr, value, structure);
      } else {
        acc[curr] = structure.defaults;
      }
    }

    return acc
  }, {})
}

/* eslint-disable no-unused-vars */

function processEntry(key, value, { type, defaults }) {
  const props = { key, value, type };
  let parsed;

  switch (type) {
    case 'string':
    case 'url':
      if (typeof value !== 'string') {
        throw new Error(configError(props))
      }
      return value

    case 'object-or-bool':
        if (typeof value !== 'object' && typeof value !== 'boolean') {
            throw new Error(configError(props));
        }

        if (typeof value === 'object') {
            return value;
        } else if (typeof value === 'boolean') {
            if (value == true) {
                return defaults;
            }
            return false;
        }

    case 'number':
      parsed = parseFloat(value, 10);
      if (isNaN(parsed)) {
        throw new Error(configError(props))
      }
      return parsed

    case 'array':
      if (!Array.isArray(value)) {
        throw new Error(configError(props))
      }
      return value

    case 'boolean':
      return !!value

    case 'regex':
      if (value.constructor !== RegExp) {
        throw new Error(configError(props))
      }
      return value

    case 'path':
      if (typeof value !== 'string') {
        throw new Error(configError(props))
      }
      return path.resolve(Root, value)

    default:
      throw new Error(`Frost: Received an entry in config that is not supported. Found the following Entry \n\n ${key}: ${value}`)
  }
}

/* eslint-enable no-unused-vars */
function setFlags(flags, config) {
  for (const key in flags) {
    config[key] = flags[key];
  }

  return config
}

async function loadConfig(prefix = 'frost', flags = {}) {
  const loader = cosmiconfig(prefix, {
    rcExtensions: true,
    stopDir: Root
  });

  const result = await loader.load(Root);
  const root = path.relative(Root, result.filepath);
  const config = validateConfig(setFlags(flags, result.config), Schema);
  config.root = Root;

  return { config, root }
}

const emitter = new EventEmitter();

function onEvent(name, fn) {
    emitter.on(name, fn);
    return emitter;
}

function emitEvent(name, data) {
    emitter.emit(name, data);
    return emitter;
}

const ExportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
const WebpackStacks = /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm;
const isSyntaxError = msg => msg.includes('Syntax Error');

const isMultiStats = stats => stats.stats;

function getCompileTime(stats) {
    if (isMultiStats(stats)) {
        return stats.stats.reduce((time, stats) => {
            return Math.max(time, getCompileTime(stats));
        }, 0);
    }
    return stats.endTime - stats.startTime;
}

function formatWebpackMessage(message, isError) {
    let lines = message.split('\n');

    // Removes extra newline
    if (lines.length > 2 && lines[1] === '') {
        lines.splice(1, 1);
    }

    // Remove webpack-loader notation from filenames
    // as seeing ./~/babel-loader!./src/index.js is
    // annoying
    if (lines[0].lastIndexOf('!') !== -1) {
        lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }

    // Remove webpack entry points from messages as it
    // is often misleading for anything but syntax errors
    lines = lines.filter(line => line.indexOf(' @ ') !== 0);

    // lines[0] is a filename
    // lines[1] is the error message
    if (!lines[0] || !lines[1]) {
        return lines.join('\n');
    }

    // Cleans syntax error
    if (lines[1].indexOf('Module build failed: ') === 0) {
        lines[1] = lines[1].replace(
            'Module build failed: SyntaxError',
            'Syntax Error'
        );
    }

    // Cleans export errors
    if (lines[1].match(ExportError)) {
        lines[1] = lines[1].replace(
            ExportError,
            "$1 '$4' does not contain an export named '$3'."
        );
    }

    message = lines.join('\n');

    // Strip internal stacks because they are generally useless
    // with the exception of some stacks containing 'webpack:'. For
    message = message.replace(
        WebpackStacks,
        ''
    );

    return message.trim();
}

function formatFromJson(json) {
    const errors = json.errors.map(message => formatWebpackMessage(message, true));
    const warnings = json.warnings.map(message => formatWebpackMessage(message, false));
    const results = { errors, warnings };

    if (results.errors.some(isSyntaxError)) {
        // If syntax errors exist, just show those
        results.errors = results.errors.filter(isSyntaxError);
    }
    return results;
}

function formatWebpackOutput(stats, target) {
    const { errors, warnings } = formatFromJson(stats.toJson({}));
    const isSuccessful = !errors.length && !warnings.length;

    if (isSuccessful) {
        console.log(chalk.green(`${target} compiled successfully`));
    }

    if (errors.length) {
        console.log(chalk.red(`${target} failed to compile`));
        console.log(errors.join('\n\n'));
        throw new Error(`Failed to compile`);
    }

    if (warnings.length && !errors.length) {
        console.log(chalk.yellow(`${target} compiled with warnings`));
        console.log(warnings.join('\n\n'));
    }

    const compileTime = getCompileTime(stats);
    console.log(chalk.cyan(`${target} Compiled in ${compileTime}ms`));

    return true;
}

const Status = {
    Initializing: 0,
    Building: 1,
    Finished: 2
};

function webpackPromise(compiler) {
    emitEvent(`before-webpack-${compiler.options.name}-compilation`);
    return new Promise((resolve$$1, reject) => {
        compiler.plugin('done', stats => {
            emitEvent('after-webpack-compilation', stats);
            resolve$$1(stats);
        });

        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
        });
    });
}

class Builder {
    constructor() {
        this.compilers = [];
        this.status = Status.Initializing;
    }

    async build(compilers, env, target) {
        if (this.status === Status.Finished && env === 'development') {
            // Only run dev build once
            return this;
        }
        this.status = Status.Building;
        emitEvent('before-webpack-build', compilers);

        await this.buildWebpack(compilers, env, target);

        this.status = Status.Finished;
        emitEvent('after-webpack-build');

        return this;
    }

    async buildWebpack(compilers, env, target) {
        const cache = {};

        this.compilers = compilers.map(config => {
            const compiler = webpack(config);
            compiler.cache = cache;
            return compiler;
        });

        await frostUtils.each(this.compilers,  async compiler => {
            target ? compiler.options.name : target + compiler.options.name;
            const stats = await webpackPromise(compiler);
            formatWebpackOutput(stats, target);
        });

        return true;
    }

    startDev(multiCompiler, target = '') {
        emitEvent('before-dev-server-start', multiCompiler);
        return new Promise((resolve$$1, reject) => {
            multiCompiler.plugin('invalid', () => {
                console.log(target + 'Dev Server Compiling');
            });

            multiCompiler.plugin('done', stats => {
                emitEvent('after-dev-server-build', stats);
                return resolve$$1(stats);
            });
        });
    }
}

function getCerts(serverOptions) {
    let key;
    let cert;

    if (fsExtra.existsSync(serverOptions.key) && fsExtra.existsSync(serverOptions.cert)) {
        key = fsExtra.readFileSync(serverOptions.key);
        cert = fsExtra.readFileSync(serverOptions.cert);
        return { key, cert };
    } else {
        throw new Error('Frost: No certs found for https');
    }
}

class Renderer {
    constructor(config) {
        this.config = config;
        this.builder = new Builder();
    }

    getProps(env, target) {
        return {
            isDev: env === 'development',
            isProd: env === 'production',
            isClient: target === 'client',
            isServer: target === 'server',
            webpackTarget: target === 'client' ? 'web' : 'node'
        };
    }

    async listen(server, middleware) {
        let Server;

        if (!server) {
            server = frostExpress.createExpressServer({
                afterSecurity: [],
                beforeFallback: middleware ? [...middleware] : [],
                enableNonce: false
            });
        }

        const serverOptions = this.config.serverOptions;
        const isHttps = serverOptions.useHttps ? true : false;
        if (isHttps) {
            const options = getCerts(serverOptions);
            Server = https.createServer(options, server);
        } else {
            Server = http.createServer(server);
        }

        const port = await getPort({ port: 8000 });
        Server.listen(port, () => {
            console.log(`Frost is listening to a server on Port: ${port}`);
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

const HashType = 'sha256';
const DigestType = 'base62';
const DigestLength = 8;

function compareModules(a, b) {
    if (a.resource < b.resource) {
        return -1;
    }
    if (a.resource > b.resource) {
        return 1;
    }
    return 0;
}

function getSource(module) {
    const source = module._source || {};
    return source._value || '';
}

function concatenateSource(result, source) {
    return result + source;
}

class ChunkHash {
    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            compilation.plugin('chunk-hash', (chunk, chunkHash) => {
                const source = chunk
                    .mapModules(module => module)
                    .sort(compareModules)
                    .map(getSource)
                    .reduce(concatenateSource, '');
                const hash = loaderUtils.getHashDigest(source, HashType, DigestType, DigestLength);

                chunkHash.digest = function() {
                    return hash;
                };
            });
        });
    }
}

class MissingModules {
    constructor(path$$1) {
        this.path = path$$1;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, cb) => {
            const path$$1 = this.path;
            const missing = compilation.missingDependencies;
            if (missing.some(file => !file.includes(path$$1))) {
                compilation.contextDependencies.push(path$$1);
            }

            cb();
        });
    }
}

const Root$1 = appRootDir.get();

class Progress {
    constructor({ prefix }) {
        this.prefix = prefix;
    }

    apply(compiler) {
        let last = null;
        let spinner = null;
        const prefix = this.prefix ? this.prefix + ' ' : 'frost ';

        function display(message) {
            if (message !== '') {
                spinner.text = prefix + message;
                spinner.render();
            } else {
                spinner.succeed(prefix, + 'Done!');
            }
        }

        function moduleDone() {
            let index;
            let id = last;

            index = id.lastIndexOf(' ');
            id = index === -1 ? id : id.slice(index + 1, id.length);

            index = id.lastIndexOf('!');
            id = index === -1 ? id : id.slice(index + 1, id.length);

            index = id.indexOf('?');
            id = index === -1 ? id : id.slice(0, index);

            id = path.relative(Root$1, id).replace(/^node_modules\//, '~/');

            if (id.startsWith('"') && id.endsWith('"')) {
                id = id.slice(1, -1);
            }

            if (id.includes('|') || id.startsWith('..')) {
                return;
            }

            if (/^[a-zA-Z0-9\-_/~\.]{0,50}$/.test(id)) {
                display(`Building Modules ${id}...`);
            }
        }

        compiler.plugin('compilation', compilation => {
            if (compilation.compiler.isChild()) {
                return;
            }

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
                record: 'Recording'
            };

            Object.keys(syncHooks).forEach(name => {
                let pass = 0;
                const message = syncHooks[name];
                compilation.plugin(name, () => {
                    if (pass++ > 0) {
                        display(`${message}  [pass ${pass}]`);
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
                display('optimizing assets');
                cb();
            });
        });

        compiler.plugin('emit', (compilation, cb) => {
            display('Emitting');
            cb();
        });

        compiler.plugin('done', () => display(''));
    }
}

function loadStyles({ isServer, isClient }, { build }) {
    const { sourceMaps, css } = build;

    let postcssLoader;
    if (css.postcss) {
        postcssLoader = { loader: 'postcss-loader' };
        if (typeof css.postcss === 'object') {
            postcssLoader.options = build.postcss;
        }
    }


    let cssLoaderOptions = {
        modules: true,
        localIdentName: '[local]-[hash:base62:8]',
        minimize: css.postcss ? false : true
    };

    if (css.cssLoader && typeof css.cssLoader === 'object') {
        cssLoaderOptions = css.cssLoader;
    }

    const cssLoader = isClient ? {
        loader: 'css-loader',
        options: cssLoaderOptions
    } : {
        loader: 'css-loader/locals',
        options: cssLoaderOptions
    };

    const sassLoader = css.preprocessor === 'sass' || css.preprocessor === 'scss'
        ? { loader: 'sass-loader' }
        : false;
    const lessLoader = css.preprocessor === 'less'
        ? { loader: 'less-loader' }
        : false;
    const stylusLoader = css.preprocessor === 'stylus'
        ? { loader: 'stylus-loader' }
        : false;

    const loaders = [postcssLoader, sassLoader, lessLoader, stylusLoader].filter(Boolean);

    if (css.extract && isClient) {
        if (css.extract === 'text') {
            return ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    cssLoader,
                    ...loaders
                ]
            });
        } else if (css.extract === 'chunks') {
            return ExtractCssChunks.extract({
                use: [
                    cssLoader,
                    ...loaders
                ]
            });
        }
    }

    return [cssLoader, ...loaders];
}

const LoaderPool = HappyPack.ThreadPool({ size: 5 });


function BaseCompiler(props, config) {
  const { isDev, isProd, isClient, isServer, webpackTarget } = props;
  const devtool = config.build.sourceMaps ? 'source-map' : false;
  const performance = config.build.performance && config.build.performance === true ? {
    maxEntryPointSize: 1000000,
    maxAssetSize: isClient ? 300000 : Infinity,
    hints: isDev || isServer ? false : 'warning'
  } : config.build.performance;

  const styles = loadStyles(props, config);
  let extractPlugin;

  if (config.build.css.extract && isClient) {
    if (config.build.css.extract === 'text') {
        extractPlugin = new ExtractTextPlugin({});
    } else if (config.build.css.extract === 'chunks') {
        extractPlugin = new ExtractCssChunks({});
    }
  }

  console.log(`→ Webpack Target: ${webpackTarget}`);
  if (config.verbose) {
    console.log(`→ Enable Source Maps: ${devtool}`);
    console.log(`→ Bundle Compression: ${config.build.compression.kind}`);
  }

  return {
    target: webpackTarget,
    devtool,
    performance,
    entry: {
      main: null,
    },

    output: {
      libraryTarget: isServer ? 'commonjs2': 'var',
      filename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
      publicPath: config.output.public,
      path: isServer ? config.output.server : config.output.client,
      // Tells webpack to include comments in bundles with info about the
      // contained modules. This can be very helpful during development
      pathinfo: isDev,

      // Enables cross-origin-loading without credentials, useful for CDNs
      crossOriginLoading: 'anonymous'
    },

    module: {
      rules: [
        {
          test: config.files.babel,
          exclude: /node_modules/,
          use: 'happypack/loader?id=js'
        },

        {
            test: config.files.styles,
            use: 'happypack/loaders?id=styles'
        },

        {
          test: config.files.fonts,
          use: 'happypack/loaders?id=fonts'
        },

        {
          test: config.files.images,
          use: 'happypack/loaders?id=images'
        },

        {
          test: config.files.video,
          use: 'happypack/loaders?id=videos'
        }
      ]
    },

    plugins: [
      new HappyPack({
        id: 'js',
        loaders: [
            { loader: 'babel-loader' }
        ],
        threadPool: LoaderPool
      }),

      new HappyPack({
        id: 'styles',
        loaders: styles
      }),

      new HappyPack({
        id: 'fonts',
        loaders: [
            {
                loader: 'file-loader',
                options: {
                    name: isProd ? 'file-[hash:base62:8].[ext]' : '[path][name].[ext]',
                    emitFile: isClient
                }
            }
        ],
        threadPool: LoaderPool
      }),

      new HappyPack({
        id: 'videos',
        loaders: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ],
        threadPool: LoaderPool
      }),

      new HappyPack({
        id: 'images',
        loaders: [
            { loader: 'file-loader' },
            { loader: 'image-webpack-loader' }
        ],
        threadPool: LoaderPool
      }),

      // Enables custom Progress plugin for better DX
      process.stdout.isTTY && config.verbose ? new Progress({ prefix: 'frost' }) : null,

      extractPlugin,
      // Improves OS Compat
      // See: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),
      new MissingModules(`${config.root}/node_modules`),

      isDev ? new webpack.NamedModulesPlugin() : null,
      isDev ? new webpack.NoEmitOnErrorsPlugin() : null,

      // Generates IDs that preserve over builds
      // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
      isProd ? new webpack.HashedModuleIdsPlugin() : null,

      // Hoists statics
      isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,

      // This is used to guarentee that our generated [chunkhash]'s are different ONLY
      // if the content for the respective chunks have changed. This allows for maximization
      // of a long-term browser caching strategy for the client bundle, avoiding cases
      // where browsers end up having to download all of the chunks again even though
      // only one or two may have changed
      isProd ? new ChunkHash() : null,

      isProd ? new webpackBundleAnalyzer.BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: isServer ? 'parsed' : 'gziped',
        logLevel: 'silent',
        openAnalyzer: false,
        reportFilename: 'report.html'
      }) : null
    ].filter(Boolean)
  }
}

function buildCommonChunks(base) {
    const possibleVendor = [
        '/regenerator-runtime/',
        '/es6-promise/',
        '/babel-runtime/',
        '/raf-polyfill/',
        '/lodash/'
    ];

    base.plugins.unshift(new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        minChunks({ context, request }) {
            if (context && possibleVendor.some(vendor => context.includes(vendor))) {
                return true;
            }

            return (
                /node_modules/.test(context) &&
                // Do not externalize the request if it is a css file
                !/\.(css|less|scss|sass|styl|stylus|pcss)$/.test(request)
            );
        }
    }));
}

function ClientCompiler(props, config) {
    const base = BaseCompiler(props, config);
    const { isDev, isProd } = props;
    base.name = 'client';
    base.entry.main = config.entry.client;
    base.output.path = config.output.client;

    if (config.entry.vendor.length > 0) {
        base.entry.vendor = config.entry.vendor;
        buildCommonChunks(base);
    }

    base.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
        filename: 'manifest.js'
    }));

    if (config.pwa && config.pwa.hasServiceWorker) {
        base.plugins.push(new ServiceWorkerPlugin({
            entry: config.pwa.workerEntry,
            exclude: ['*hot-update', '**/*.map', '**/stats.json']
        }));
    }

    if (isDev) {
        if (config.build.useHmr) {
            base.plugins.push(new webpack.HotModuleReplacementPlugin());
        }
    }

    if (isProd) {
        base.plugins.push(new StatsPlugin('stats.json'));

        if (config.build.compression && config.build.compression.kind) {
            if (config.build.compression.kind === 'babili') {
                base.plugins.push(new BabiliMinifyPlugin(config.build.compression.babiliClientOptions));
            }

            if (config.build.compression.kind === 'uglify') {
                base.plugins.push(new UglifyPlugin(config.build.compression.uglifyOptions));
            }
        }
    }

    return base;
}

const BuiltIns = new Set(builtinModules);
const WebpackRequired = new Set([
    // These are required for universal imports to work properly
    'react-universal-component',
    'webpack-flush-chunks',
    'babel-plugin-universal-import'
]);

const Problematic = new Set([
    // These are things that are generally large or have problematic
    // commonJS functionality
    'intl',
    'mime-db',
    'encoding',
    'ajv',
    'colors',
    'jsdom'
]);

const BundleCache = {};
const ExternalsCache = {};

function isLoaderFile(req) {
    if (req.charAt(0) === '!') {
        return true;
    }

    return Boolean(
       /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|css|scss|sass|sss|less|zip)$/.exec(req)
    );
}



function shouldBeBundled(base) {
    if (base in BundleCache) {
        return BundleCache[base];
    }

    let resolved;
    try {
        resolved = resolvePkg(base);
    } catch (err) {
        return null;
    }

    const result = resolved ? shouldBeBundled(resolved) : null;
    BundleCache[base] = result;
    return result;
}

function isExternalRequest(req) {
    if (req.charAt(0) === '.') {
        return false;
    }

    if (isLoaderFile(req)) {
        return false;
    }

    const match = (/^((@[a-zA-Z0-9-_]+\/)?[a-zA-Z0-9_-]+)\/?/).exec(req);
    const basename = match ? match[1] : null;

    if (basename == null || Problematic.has(basename) || BuiltIns.has(basename)) {
        return true;
    }
    if (WebpackRequired.has(basename)) {
        return false;
    }

    const bundle = shouldBeBundled(basename);
    if (bundle != null) {
        return !bundle;
    }
    return false;
}

function getExternals(entries) {
    const Entries = new Set(entries);
    return (ctx, req, cb) => {
        if (Entries.has(req)) {
            return cb();
        }

        let isExternal = ExternalsCache[req];
        if (isExternal == null) {
            isExternal = isExternalRequest(req);
            ExternalsCache[req] = isExternal;
        }

        return isExternal ? cb(null, `commonjs ${req}`) : cb();
    }
}

function ServerCompiler(props, config) {
    const base = BaseCompiler(props, config);

    base.name = 'server';
    base.target = 'node';
    base.entry.main = config.entry.server;
    base.output.path = config.output.server;
    base.externals = getExternals(config.entry.server);

    base.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }));

    return base;
}

const CommandMap = {
    'client': 'renderClient',
    'server': 'renderServer',
    'universal': 'renderUniversal',
    'dev': 'devServer'
};

class FrostRenderer extends Renderer {
    constructor(config) {
        super(config);
        this.name = 'frost';
    }

    async build(env, command) {
        await this[CommandMap[command]](env);
        return this;
    }

    async renderClient(env) {
        const compiler = this.createClientCompiler(env);
        await this.builder.build([compiler], env, 'frost');
        return this;
    }

    async renderServer(env) {
        const compiler = this.createServerCompiler(env);
        await this.builder.build([compiler], env, 'frost');
        return this;
    }

    async renderUniversal(env) {
        await this.builder.build(this.createMultiCompiler(env), env, 'frost');
        return this;
    }

    async devServer() {
        const output = this.config.output;
        const multiCompiler = webpack(this.createMultiCompiler('development'));
        const client = multiCompiler.compilers[0];

        const devMiddleware = webpackDevMiddleware(multiCompiler, {
            publicPath: output.public,
            quiet: true,
            noInfo: true
        });
        const hotMiddleware = webpackHotMiddleware(client);
        const hotSeverMiddleware = webpackHotServerMiddleware(multiCompiler, {
            serverRendererOptions: {
                outputPath: output.client
            }
        });

        const middleware = [devMiddleware, hotMiddleware, hotSeverMiddleware];
        await this.builder.startDev(multiCompiler, 'frost');
        this.listen(null, middleware);
        return this;
    }

    createClientCompiler(env) {
        const props = this.getProps(env, 'client');
        const compiler = ClientCompiler(props, this.config);
        return compiler;
    }

    createServerCompiler(env) {
        const props = this.getProps(env, 'server');
        const compiler = ServerCompiler(props, this.config);
        return compiler;
    }

    createMultiCompiler(env) {
        const multiCompiler = [this.createClientCompiler(env), this.createServerCompiler(env)];
        return multiCompiler;
    }
}

class Frost {
    constructor(config, renderers = []) {
        this.config = config;
        // Allow this to be extendable later
        this.renderers = this.prepareRenderers(renderers);
    }

    async run(env, command) {
        emitEvent('beforeRun', command);
        console.log(this.renderers);
        const keys = this.renderers.keys();
        try {
            await frostUtils.each(keys, async key => {
                const renderer = this.renderers.get(key);
                await renderer.build(env, command);
            });
        } catch (err) {
            throw new Error(err);
        }

        return this;
    }

    async runOne(env, renderer, command) {
        emitEvent('beforeRunOne', renderer, command);
        await this.renderers.get(renderer).build(env, command);
        return this;
    }

    async runSequence(sequence) {
        emitEvent('beforeSequence', sequence);
        await frostUtils.each(sequence, async item => {
            const { env, renderer, command } = item;
            await this.renderers.get(renderer).build(env, command);
        });

        return this;
    }

    prepareRenderers(renderers) {
        const Renderers = new Map();

        if (!renderers.length > 0 && !this.config.renderers) {
            Renderers.set('frost', new FrostRenderer(this.config));
        }

        if (this.config.renderers && this.config.renderers.length > 0) {
            renderers = renderers.concat(this.config.renderers);
        }

        renderers.forEach(renderer => {
            if (renderer.charAt(0) === '.') {
                const r = require(path.resolve(config.root, renderer));
                const name = renderer.slice(renderer.lastIndexOf('/'), renderer.length);
                const instance = new r(this.config);
                Renderers.set(name, instance);
            } else if (renderer === 'frost') {
                const instance = new FrostRenderer(this.config);
                Renderers.set('frost', instance);
            } else {
                const r = require.resolve(renderer);
                const instance = new r(this.config);
                Renderers.set(renderer, instance);
            }
        });

        return Renderers;
    }
}

exports.loadConfig = loadConfig;
exports.Frost = Frost;
exports.BaseCompiler = BaseCompiler;
exports.ClientCompiler = ClientCompiler;
exports.ServerCompiler = ServerCompiler;
exports.emitEvent = emitEvent;
exports.onEvent = onEvent;
exports.Builder = Builder;
exports.Renderer = Renderer;
