import webpack from 'webpack';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { get as getRoot } from 'app-root-dir';
import chalk from 'chalk';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';

import { removeEmptyKeys } from './helpers/utils';
import getExternals from './helpers/externals';
import PluginManager from './plugins/Manager';

const Root = getRoot();

export default (target, env = 'development', config = {}) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isDev = env === 'development';
  const isProd = env === 'production';
  const name = isServer ? 'server' : 'client';
  const webpackTarget = isServer ? 'node' : 'web';

  const mainEntry = isServer ? entry.server : entry.client;
  const vendorEntry = isServer ? entry.serverVendor : entry.clientVendor;
  const hasMain = existsSync(mainEntry);
  const hasVendor = existsSync(vendorEntry);
  const clientOutput = config.output.client;
  const serverOutput = config.output.server;

  const prefix = chalk.bold(target.toUpperCase());
  const devtool = config.sourceMaps ? 'source-map' : null;

  const cssLoaderOptions = {
    modules: true,
    localIdentName: '[local]-[hash:base62:8]',
    minimize: false,
    sourceMap: config.sourceMaps,
  };

  const plugins = PluginManager(env, webpackTarget, isDev, isProd, isServer);

  return {
    name,
    devtool,
    target: webpackTarget,
    context: Root,
    performance: config.performance || {},
    externals: isServer ? getExternals(Root) : undefined,
    entry: removeEmptyKeys({
      vendors: hasVendor ? [vendorEntry].filter(Boolean) : null,
      main: hasMain ? [mainEntry].filter(Boolean) : null,
    }),

    output: {
      libraryTarget: isServer ? 'commonjs2' : 'var',
      filename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
      path: isServer ? serverOutput : clientOutput,
    },

    modules: {
      rules: [
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
          use: {
            loader: 'babel-loader',
            options: config.babel,
          },
        },
        {
          test: config.files.styles,
          use: isClient
            ? ExtractCssChunks.extract({
                use: {
                  loader: 'css-loader',
                  options: cssLoaderOptions,
                },
              })
            : {
                loader: 'css-loader/locals',
                options: cssLoaderOptions,
              },
        },
        {
          test: config.files.fonts,
          loader: 'file-loader',
          options: {
            name: isProd ? 'file-[hash:base62:8].[ext]' : '[path][name].[ext]',
            emitFile: isClient,
          },
        },
      ],
    },
    plugins: [...plugins],
  };
};
