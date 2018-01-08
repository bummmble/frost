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

    const providedPlugins = config.webpack.plugins.server.length > 0
        ? createProvidedPlugin('server', config.webpack)
        : [];

    const serverPlugins = [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),

        ...providedPlugins
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
