import webpack from 'webpack';
import BaseCompiler from './base';

export default function ServerCompiler(props, config) {
    const base = BaseCompiler(props, config);
    const { isDev, isProd } = props;

    base.name = 'server';
    base.target = 'node';
    base.entry.main = config.entry.server;
    base.output.path = config.output.server;

    base.module.rules.push({
        test: config.files.styles,
        use: {
            loader: 'css-loader/locals'
        }
    });

    base.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }));

    return base;
}
