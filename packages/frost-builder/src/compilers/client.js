import webpack from 'webpack';
import ServiceWorkerPlugin from 'serviceworker-webpack-plugin';
import BabiliMinifyPlugin from 'babel-minify-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import UglifyPlugin from 'uglifyjs-webpack-plugin';

import BaseCompiler from './base';

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

export default function ClientCompiler(props, config) {
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
