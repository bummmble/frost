import webpack from 'webpack';
import WebpackMd5Hash from 'webpack-md5-hash';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { resolve } from 'path';

import {
    configureEntry,
    configureOutput,
    configurePerformance,
    configureDevtool,
    configureLoaders
} from './helpers';
import { createHappyPlugin } from './plugins';
import { filterOutKeys } from '../utils';

export default function BaseCompiler(props, config) {
    const { isProd, isDev, isServer, isClient } = props;
    const env = isProd ? 'production' : 'development';
    const target = isServer ? 'server' : 'client';
    const babelEnv = `${env}-${target}`;

    const devtool = configureDevtool(isProd, config);
    const performance = configurePerformance(isDev, isServer, config);
    const loaders = configureLoaders(isDev, isServer, babelEnv, config);

    const useHappyPack = config.webpack.useHappyPack;
    const HappyPlugin = useHappyPack
        ? config.styles.extract !== 'none' && !isServer
            ? createHappyPlugin(filterOutKeys(loaders, ['styles']))
            : createHappyPlugin(loaders)
        : [];

    return {
        context: config.root,
        devtool,
        performance,
        entry: configureEntry(isDev, isServer, config),
        output: configureOutput(isDev, isServer, config),
        module: {
            rules: [
                {
                    test: config.files.babel,
                    exclude: /node_modules/,
                    use: useHappyPack
                        ? 'happypack/loader?id=js'
                        : loaders.js
                },
                {
                    test: config.files.styles,
                    exclude: /node_modules/,
                    use: useHappyPack && (isServer || config.styles.extract === 'none')
                        ? 'happypack/loader?id=styles'
                        : loaders.style
                },
                config.useElm ? {
                    test: config.files.elm,
                    use: useHappyPack
                        ? 'happypack/loader?id=elm'
                        : loaders.elm
                } : false,
                config.useTypescript ? {
                    test: config.files.typescript,
                    use: useHappyPack
                        ? 'happypack/loader?id=ts'
                        : loaders.ts
                } : false,
                config.useRust ? {
                    test: config.files.rust,
                    use: useHappyPack
                        ? 'happypack/loader?id=rust'
                        : loaders.rust
                }
            ].filter(Boolean)
        },

        plugins: [
            ...HappyPlugin,

            new WebpackMd5Hash(),
            isDev ? new webpack.NamedModulesPlugin() : null,
            isDev ? new webpack.NoEmitOnErrorsPlugin() : null,

            isProd ? new webpack.HashedModuleIdsPlugin() : null,
            isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
            isProd ? new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                defaultSizes: isServer ? 'parsed' : 'gziped',
                logLevel: 'silent',
                openAnalyzer: false,
                reportFilename: 'report.html'
            }) : null
        ]
    };
}
