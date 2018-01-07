import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { resolve } from 'path';

import { configureEntry, configureOutput, configurePerformance, configureDevtool }from './helpers';

export default function BaseCompiler(props, config) {
    const { isProd, isDev, isServer, isClient } = props;
    const env = isProd ? 'production' : 'development';
    const target = isServer ? 'server' : 'client';
    const babelEnv = `${env}-${target}`;

    const devtool = configureDevtool(isProd, config);
    const performance = configurePerformance(isDev, isServer, config);

    return {
        context: config.root,
        devtool,
        performance,
        entry: configureEntry(isDev, isServer, config),
        output: configureOutput(isDev, isServer, config)
    };
}
