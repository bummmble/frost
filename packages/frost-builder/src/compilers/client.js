import webpack from 'webpack';
import BabiliMinifyPlugin from 'babel-minify-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import UglifyPlugin from 'uglifyjs-webpack-plugin';

import BaseCompiler from './base';

export default function ClientCompiler(props, config) {
    const base = BaseCompiler(props, config);
    const { isDev, isProd } = props;
    base.name = 'client';
    base.entry.main = config.entry.client;
    base.output.path = config.output.client;

    base.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
        filename: 'manifest.js'
    }));

    if (isDev) {
        if (config.useHmr) {
            base.plugins.push(new webpack.HotModuleReplacementPlugin());
        }
    }

    if (isProd) {
        base.plugins.push(new StatsPlugin('stats.json'));

        if (config.compression && config.compression.kind) {
            if (config.compression.kind === 'babili') {
                base.plugins.push(new BabiliMinifyPlugin({}));
            }

            if (config.compression.kind === 'uglify') {
                base.plugins.push(new UglifyPlugin({}));
            }
        }
    }

    return base;
}
