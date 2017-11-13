import webpack from 'webpack';
import { resolve } from 'path';
import { get as getRoot } from 'app-root-dir';
import { Logger } from 'frost-shared';
import { objectRemoveEmpty } from 'frost-utils';
import chalk from 'chalk';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';

import { configureCompiler, buildEntryAndOutput } from './helpers/compiler';
import { getExternals } from './helpers/externals';
import cacheHash from './helpers/hash';
import PluginManager from './plugins/Manager';

const Root = getRoot();
const pkg = require(resolve(Root, 'package.json'));

export default (target, env = 'development', config = {}) => {
    console.log(config);
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
  const devtool = config.sourceMaps ? 'source-map' : false;
  const loaderCache = resolve(Root, cacheHash('loader', pkg, target, env));
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
    context: Root,
    performance: config.performance
      ? {
          maxEntrypointSize: 1000000,
          maxAssetSize: isClient ? 300000 : Infinity,
          hints: isDev || isServer ? false : 'warning',
        }
      : {},
    externals: isServer ? getExternals([vendorEntry, mainEntry]) : undefined,
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
      path: isServer ? serverOutput : clientOutput,
      crossOriginLoading: 'anonymous',
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
