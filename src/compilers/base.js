import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { resolve } from 'path';

import { configureEntry, configureOutput } from './helpers/destinations';

export default function BaseCompiler(props, config) {
    const { isProd, isDev, isServer, isClient } = props;
    const env = isProd ? 'production' : 'development';
    const target = isServer ? 'server' : 'client';
    const babelEnv = `${env}-${target}`;

    return {
        context: config.root,
        entry: configureEntry(isDev, isServer, config),
        output: configureOutput(isDev, isServer, config)
    };
}
