import webpack from 'webpack';
import { resolve } from 'path';

export function createBasicCommons(isDev, { root }) {
    return new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: isDev ? '[name].js' : '[name].[chunkhash].js',
        minChunks({ resource }) {
            return (
                resource && /\.js$/.test(resource) &&
                resource.indexOf(resolve(root, 'node_modules')) === 0
            );
        }
    });
}

export function createAsyncCommons() {
    return new webpack.optimize.CommonsChunkPlugin({
        name: 'main',
        async: 'vendor-async',
        children: true,
        minChunks: 3
    });
}

export function createCommonChunks(isDev, config) {
    const plugins = [];
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
        filename: 'manifest.js'
    }));

    if (config.entry.vendor.length > 0) {
        plugins.unshift(createBasicCommons(isDev, config));
        plugins.push(createAsyncCommons());
    }

    return plugins;
}
