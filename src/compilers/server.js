import webpack from 'webpack';

import BaseCompiler from './base';

export default function ServerCompiler(env = 'development', config) {
    const isDev = env === 'development';
    const isProd = env === 'production';
    const base = BaseCompiler({
        isDev,
        isProd,
        isClient: false,
        isServer: true
    }, config);

    const serverPlugins = [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ];

    const compiler = {
        ...base,
        name: 'server',
        target: 'node',
        plugins: [
            ...base.plugins,
            ...serverPlugins
        ].filter(Boolean)
    };

    return compiler;
}
