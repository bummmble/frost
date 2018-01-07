import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { resolve } from 'path';

import { filterOutKeys } from '../utils';
import { configureEntry, configureOutput } from './helpers/dests';
import createLoaders from './helpers/loaders';
import createHappyPlugins from './plugins/happy';

export default function BaseCompiler(props, config) {
    const { isProd, isDev, isServer, isClient } = props;
    const env = isProd ? 'production' : 'development';
    const target = isServer ? 'server': 'client';
    const babelEnv= `${env}-${target}`;

    const loaders = createLoaders(isServer, babelEnv, config);
    const happyPacks = config.webpack.useHappyPack
        ? config.styles.extract && !isServer
            ? createHappyPlugins(filterOutKeys(loaders, ['styles']))
            : createHappyPlugins(loaders)
        : [];


    return {
        context: config.root,
        entry: configureEntry(isDev, isServer, config),
        output: configureOutput(isDev, isServer, config),
        module: {
            rules: [
                config.sourceMaps ? {
                    test: config.files.babel,
                    loader: 'source-map-loader',
                    enforce: 'pre',
                    options: { quiet: true },
                    exclude: [/intl-/, /apollo-/, /react-apollo/, /zen-observable-ts/]
                } : {},
                {
                    test: config.files.babel,
                    exclude: /node_modules/,
                    use: config.webpack.useHappyPack
                        ? 'happypack/loader?id=js'
                        : loaders.js
                },
                {
                    test: config.files.styles,
                    exclude: /node_modules/,
                    use: config.webpack.useHappyPack
                        ? 'happypack/loaders/id=styles'
                        : loaders.styles
                },
                config.useElm ? {
                    test: config.files.elm,
                    use: config.webpack.useHappyPack
                        ? 'happypack/loader?id=elm'
                        : loaders.elm
                } : {},
                config.useRust ? {
                    test: config.files.rust,
                    use: config.webpack.useHappyPack
                        ? 'happypack/loader?id=rust'
                        : loaders.rust
                } : {},
                config.useTypescript ? {
                    test: config.files.typescript,
                    use: config.webpack.useHappyPack
                        ? 'happypkac/loader?id=ts'
                        : loaders.ts
                } : {},
                {
                    test: config.files.fonts,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: config.files.videos,
                    loader: 'file-loader',
                    options: {
                        name: 'videos/[name].[hash:7].[ext]'
                    }
                }
            ].filter(Boolean)
        },

        plugins: [
            new CaseSensitivePathsPlugin(),
            ...happyPacks,

            isDev ? new webpack.NamedModulesPlugin() : null,
            isDev ? new webpack.NoEmitOnErrorsPlugin() : null,

            isProd ? new webpack.HashedModuleIdsPlugin() : null,
            isProd new webpack.optimize.ModuleModuleConcatenationPlugin() : null,
            isProd new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                defaultSizes: isServer ? 'parsed' : 'gziped',
                logLevel: 'silent',
                openAnalyzer: false,
                reportFilename: 'report.html'
            }) : null
        ].filter(Boolean)
    };
}
