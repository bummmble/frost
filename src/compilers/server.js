import webpack from 'webpack';

import BaseCompiler from './base';
import { configureExternals } from './helpers';
import { createProvidedPlugin } from './plugins';

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
        }),

        config.webpack.plugins.server.length > 0
            ? (...createProvidedPlugin('server', config.webpack))
            : null
    ];

    const compiler = {
        ...base,
        name: 'server',
        target: 'node',
        externals: configureExternals(config),
        plugins: [
            ...base.plugins,
            ...serverPlugins
        ].filter(Boolean)
    };

    return compiler;
}
