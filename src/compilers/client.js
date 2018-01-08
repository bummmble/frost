import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';
import BabiliMinifyPlugin from 'babel-minify-webpack-plugin';
import UglifyPlugin from 'uglifyjs-webpack-plugin';
import ServiceWorkerPlugin from 'serviceworker-webpack-plugin';

import { resolve } from 'path';

import BaseCompiler from './base';
import { createExtractPlugin, createProvidedPlugin } from './plugins';

export default function ClientCompiler(env = 'development', config) {
    const isDev = env === 'development';
    const isProd = env === 'production';
    const base = BaseCompiler({
        isDev,
        isProd,
        isServer: false,
        isClient: true
    }, config);

    const hasVendors = config.entry.vendor.length > 0;

    const clientPlugins = [
        config.styles.extract !== 'none'
            ? createExtractPlugin(isDev, config)
            : null,

        hasVendors ? new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: isDev ? '[name].js' : '[name].[chunkhash].js',
            minChunks({ resource }) {
                return (
                    resource && /\.js$/.test(resource) &&
                    resource.indexOf(resolve(config.root, 'node_modules')) === 0
                )
            }
        }) : null,

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest.js',
            minChunks: Infinity,
            filename: 'manifest.js'
        }),

        hasVendors ? new webpack.optimize.CommonsChunkPlugin({
            name: 'main',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        }) : null,

        config.pwa.hasServiceWorker ? new ServiceWorkerPlugin({
            entry: config.pwa.workerEntry,
            exclude: ['*hot-update', '**/*.map', '**/stats.json']
        }) : null,

        isDev && config.webpack.useHmr
            ? new webpack.HotModuleReplacementPlugin()
            : null,

        isProd ? new StatsPlugin('stats.json') : null,
        isProd && config.compression.kind === 'babili'
            ? new BabiliMinifyPlugin(config.compression.babiliClientOptions)
            : null,
        isProd && config.compression.kind === 'uglify'
            ? new UglifyPlugin({
                sourceMap: !!config.sourceMaps,
                cache: true,
                parallel: true,
                uglifyOptions: config.compression.uglifyOptions
              })
            : null,

        config.webpack.plugins.client.length > 0
            ? (...createProvidedPlugin('client', config.webpack))
            : null,
    ];

    const compiler = {
        ...base,
        name: 'client',
        target: 'web',
        externals: config.useRust ? {
            'fs': true,
            'path': true
        } : '',
        plugins: [
            ...base.plugins,
            ...clientPlugins
        ].filter(Boolean)
    };

    return compiler;
}
