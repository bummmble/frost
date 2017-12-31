import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import AutoDllPlugin from 'autodll-webpack-plugin';

import { resolve } from 'path';

export default function clientCompiler(env = 'development') {
    const isDev = env === 'development';
    const isProd = env === 'production';

    return {
        name: 'client',
        target: 'web',
        devtool: isDev ? 'eval' : 'source-map',
        entry: {
            main: isDev ? [
                'react-hot-loader/patch',
                'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo-false',
            ].concat([resolve(__dirname, '../../src/client/index.js')])
            : [resolve(__dirname, '../../src/client/index.js')],
            vendor: ['react', 'redux', 'react-redux']
        },
        output: {
            filename: isDev ? '[name].js' : '[name].[chunkhash].js',
            chunkFilename: isDev ? '[name].js' : '[name].[chunkhash].js',
            path: resolve(__dirname, '../../build/client'),
            publicPath: '/static/',
            crossOriginLoading: 'anonymous'
        },
        module: {
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: ExtractCssChunks.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: false,
                                    localIdentName: '[name]__[local]--[hash:base64:5]'
                                }
                            },
                            'postcss-loader'
                        ]
                    })
                }
            ]
        },
        plugins: [
            new ExtractCssChunks(),
            new AutoDllPlugin({
                context: resolve(__dirname, '../..'),
                filename: isDev ? '[name].js' : '[name].[chunkhash].js',
                entry: {
                    vendor: [
                        'react',
                        'react-dom',
                        'react-redux',
                        'redux'
                    ]
                }
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'app',
                async: 'vendor-async',
                children: 3,
                minChunks: 3
            }),

            isDev ? new WriteFilePlugin() : null,
            isDev ? new webpack.HotModuleReplacementPlugin() : null,
            isDev ? new webpack.NoEmitOnErrorsPlugin() : null,

            isProd ? new webpack.HashedModuleIdsPlugin() : null,
            isProd ? new StatsPlugin('stats.json') : null
        ].filter(Boolean)
    }
}
