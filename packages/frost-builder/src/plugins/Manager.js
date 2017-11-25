/**
  * The manager exists as a way to manage the various webpack plugins
  * between the various different build environments
  *
 */

import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ServiceWorkerPlugin from 'serviceworker-webpack-plugin';
import BabiliMinifyPlugin from 'babel-minify-webpack-plugin';
import UglifyPlugin from 'uglifyjs-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';
import HardSourcePlugin from 'hard-source-webpack-plugin';
import AutoDllPlugin from 'autodll-webpack-plugin';
import { Plugin as ShakePlugin } from 'webpack-common-shake';

import MissingModules from './MissingModules';
import ChunkHashPlugin from './ChunkHash';
import Progress from './Progress';
import Templates from './Templates';

const basePlugins = (env, webpackTarget, isDev, isProd, babelEnv, LeanExpression, ReactExpression, { verbose, cacheLoader }) => {
  return [
    new webpack.ContextReplacementPlugin(/lean-intl\/locale-data/, LeanExpression),
    new webpack.ContextReplacementPlugin(/react-intl\/locale-data/, ReactExpression),

    new webpack.DefinePlugin({
      // These need to be kept separate to allow for usage with
      // libraries like dotenv
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(webpackTarget),
      'process.env.BABEL_ENV': JSON.stringify(babelEnv)
    }),

    // Improves OS Compat
    // See: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
    new CaseSensitivePathsPlugin(),

    // Performs rebuild automatically when new dependencies are installed
    // Not sure why this is not the default behavior.
    new MissingModules(),

    // Since the majority of projects are still based on CommonJS Modules
    // Tree shaking is incredibly important.
    // See https://github.com/indutny/webpack-common-shake
    new ShakePlugin(),
    // Enables our custom progress plugin for a better Developer Experience
    process.stdout.isTTY && verbose
      ? new Progress({
          prefix: 'frost',
        })
      : null,


    // Provides an intermediate caching step for webpack modules. This
    // makes the second+ build significantly faster. We use either this or
    // cache loader depending on the cacheLoader config string. While it is
    // possible to use both in conjunction, it occurs too much start up
    // build time.
    // See: https://github.com/mzgoddard/hard-source-webpack-plugin
    isDev && cacheLoader === 'hard-source' ? new HardSourcePlugin() : null,

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
    isProd ? new ChunkHashPlugin() : null,


    isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
  ].filter(Boolean);
};

const clientPlugins = (
  isDev,
  isProd,
  hasVendor,
  hasHmr,
  Root,
  { compression, pwa, sourceMaps, mode, templates, autoDll }
) => {
  const temps = isProd && mode === 'static' ? Templates(templates) : null;

  return [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
      filename: 'manifest.js',
    }),

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

    // AutoDLL plugin to help optimize code that changes less frequently
    // in builds by extracting them to a separate bundle in advance
    // See: http://github.com/asfktz/autodll-webpack-plugin
    autoDll.use ? new AutoDllPlugin({
        context: Root,
        filename: isDev ? '[name].js' : '[name].[chunkhash].js',
        entry: autoDll.entries
    }) : null,


    // Let the server side renderer know about our client assets
    // https://github.com/FormidableLabs/webpack-stats-plugin
    isProd ? new StatsPlugin('stats.json') : null,
    isProd
      ? new BundleAnalyzerPlugin({
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

  ]
  .concat(temps)
  .filter(Boolean)
};

const serverPlugins = (isDev, isProd, { compression }) => {
  return [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    isProd
      ? new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          defaultSizes: 'parsed',
          logLevel: 'silent',
          openAnalyzer: false,
          reportFilename: 'report.html',
        })
      : null,
    isProd ? new BabiliMinifyPlugin(compression.babiliServerOptions) : null,
  ].filter(Boolean);
};

export default (
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
) => {
  const base = basePlugins(env, webpackTarget, isDev, isProd, babelEnv, LeanExpression, ReactExpression, config);
  const plugins = isServer
    ? base.concat(...serverPlugins(isDev, isProd, config))
    : base.concat(...clientPlugins(isDev, isProd, hasVendor, hasHmr, Root, config));
  return plugins;
};
