import webpack from 'webpack';
import { resolve, join } from 'path';
import { get as getRoot } from 'app-root-dir';
import { Logger } from './logger';
import { objectRemoveEmpty } from 'frost-utils';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';

import { configureCompiler, buildEntryAndOutput } from './helpers/compiler';
import { getExternals } from './helpers/externals';
import cacheHash from './helpers/hash';
import PluginManager from './plugins/Manager';

const Root = getRoot();
const pkg = require(resolve(Root, 'package.json'));

export default (target, env = 'development', config) => {
  if (!config) {
    throw new Error(`Frost Webpack Compiler needs a configuration object`);
  }

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

  const prefix = chalk.bold(target.toUpperCase());
  const babelEnv = `frost-${env}-${target}`;
  const devtool = config.sourceMaps ? 'source-map' : false;
  const loaderCache = resolve(Root, cacheHash('loader', pkg, target, env));
  const cacheLoader = config.cacheLoader === 'cache-loader'
    ? {
        loader: 'cache-loader',
        options: {
          cacheDirectory: loaderCache,
        },
      }
    : null;

  const threadLoader = config.threadLoader ? {
    loader: 'thread-loader',
    options: {
        poolTimeout: 10000,
        name: 'frost-pool'
    }
  } : null;

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

  let supportedLanguages;
  if (config.locale.supported) {
    supportedLanguages = (() => {
        const languages = new Set();
        for (const entry of config.locale.supported) {
            languages.add(entry.split('-')[0]);
        }
        return Array.from(languages.keys());
    })();
  }

  const LeanExpression = new RegExp(`\\b${config.locale.supported.join('\\b|\\b')}\\b`);
  const ReactExpression = new RegExp(`\\b${supportedLanguages.join('\\b|\\b')}\\b`);

  const plugins = PluginManager(
    env,
    webpackTarget,
    isDev,
    isProd,
    isServer,
    hasVendor,
    hasHmr,
    babelEnv,
    Root,
    LeanExpression,
    ReactExpression,
    config
  );

  console.log(Logger.info(chalk.underline(`${prefix} Configuration`)));
  console.log(`→ Environment: ${Logger.info(env)}`);
  console.log(`→ Webpack Target: ${Logger.info(webpackTarget)}`);

  if (config.verbose) {
    console.log(`→ Babel Environment: ${Logger.info(babelEnv)}`);
    console.log(`→ Enable Source Maps: ${Logger.info(devtool)}`);
    console.log(`→ Use Cache Loader: ${Logger.info(config.sourceMaps)}`);
    console.log(`→ Bundle Compression: ${Logger.info(config.compression.type)}`);
    console.log(`→ Default Locale: ${Logger.info(config.locale.default)}`);
    console.log(`→ Supported Locales ${Logger.info(config.locale.supported)}`);
    console.log(`→ Supported Languages: ${Logger.info(supportedLanguages)}`);

  }

  return {
    name,
    devtool,
    target: webpackTarget,
    context: Root,
    performance: config.performance
      ? {
          maxEntrypointSize: 1000000,
          maxAssetSize: isClient ? 300000 : Infinity,
          hints: isDev || isServer ? false : 'warning',
        }
      : {},
    externals: isServer ? getExternals(false, [vendorEntry, mainEntry]) : undefined,
    entry: objectRemoveEmpty({
      vendor: hasVendor
        ? [hasVendor && hasHmr ? hmrMiddleware : null, vendorEntry].filter(
            Boolean
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
      publicPath: config.output.public,
      path: isServer ? serverOutput : clientOutput,
      // Tells webpack to include comments in bundles with info about the
      // contained modules. This can be very helpful during development
      pathinfo: isDev,

      // Enables cross-origin-loading without credentials, useful for CDNs
      crossOriginLoading: 'anonymous',
    },

    module: {
      rules: [
        {
          test: config.files.babel,
          loader: 'source-map-loader',
          enforce: 'pre',
          options: {
            quiet: true,
          },
          exclude: [
            // These packages point to sources that do not exists
            /intl-/,
            /zen-observable-ts/
          ]
        },
        {
          test: config.files.babel,
          exclude: /node_modules/,
          use: [
            threadLoader,
            {
                loader: 'babel-loader',
                options: {
                    forceEnv: babelEnv
                }
            }
          ].fillter(Boolean)
        },
        {
          test: config.files.styles,
          use: isClient
            ? ExtractCssChunks.extract({
                use: [
                  threadLoader,
                  cacheLoader,
                  {
                    loader: 'css-loader',
                    options: cssLoaderOptions,
                  },
                  postcssLoaderOptions,
                ].filter(Boolean),
              })
            : [
                threadLoader,
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

        {
            test: /manifest.json$/,
            use: [
                {
                    loader: 'file-loader'
                },

                {
                    loader: 'manifest-loader'
                }
            ]
        }
      ],
    },

    resolveLoader: {
        alias: {
            'manifest-loader': join(__dirname, './loaders/manifest')
        }
    },

    plugins: [...plugins],
  };
};
