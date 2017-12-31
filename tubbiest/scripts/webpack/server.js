import { readdirSync } from 'fs-extra';
import { resolve } from 'path';
import webpack from 'webpack';

const res = path => resolve(__dirname, path);

const externals = readdirSync(res('../../node_modules'))
    .filter(x => !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(x))
    .reduce((acc, curr) => {
        acc[curr] = `commonjs ${curr}`;
        return acc;
    }, {});

export default function serverCompiler(env = 'development') {
    const isDev = env === 'development';
    const isProd = env === 'production';

    return {
        name: 'server',
        target: 'node',
        devtool: isDev ? 'eval' : 'source-map',
        entry: [res('../../src/server/render.js')],
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
            path: res('../../build/server'),
            publicPath: '/static/',
            crossOriginLoading: 'anonymous',
            libraryTarget: 'commonjs2'
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
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'css-loader/locals',
                            options: {
                                minimize: false,
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        },
                        'postcss-loader'
                    ]
                }
            ]
        },
        plugins: [
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ]
    }
}
