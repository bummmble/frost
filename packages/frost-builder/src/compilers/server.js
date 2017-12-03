import webpack from 'webpack';
import BaseCompiler from './base';

export default function ServerCompiler(props, config) {
    const base = BaseCompiler(props, config);

    base.name = 'server';
    base.target = 'node';
    base.entry.main = config.entry.server;
    base.output.path = config.output.server;

    base.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }));

    return base;
}
