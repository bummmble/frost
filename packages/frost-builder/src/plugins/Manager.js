import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ServiceWorkerPlugin from 'serviceworker-webpack-plugin';
import BabiliMinifyPlugin from 'babel-minify-webpack-plugin';
import UglifyPlugin from 'uglifyjs-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';

import MissingModules from './MissingModules';
import ChunkHashPlugin from './ChunkHash';
import Progress from './Progress';

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
    isProd ? new ChunkHashPlugin() : null,
    isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
  ].filter(Boolean);
};

const clientPlugins = (
  isDev,
  isProd,
  hasVendor,
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
  ].filter(Boolean);
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
  ];
};

export default (
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
