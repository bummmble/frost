import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

export default function BaseCompiler(props, config) {
    const { isDev, isProd, isClient, isServer, webpackTarget } = props;

    const devtool = config.build.sourceMaps ? 'source-map' : false;

    return {
        target: webpackTarget,
        devtool,
        entry: {
            main: null,
        },

        output: {
            libraryTarget: isServer ? 'commonjs2': 'var',
            filename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
            chunkFilename: isDev || isServer ? '[name].js' : '[name]-[chunkhash].js',
            publicPath: config.output.public,
            path: isServer ? config.output.server : config.output.client,
            // Tells webpack to include comments in bundles with info about the
            // contained modules. This can be very helpful during development
            pathinfo: isDev,

            // Enables cross-origin-loading without credentials, useful for CDNs
            crossOriginLoading: 'anonymous'
        },

        module: {
            rules: [
                {
                    test: config.files.babel,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },

                {
                    test: config.files.fonts,
                    loader: 'file-loader',
                    options: {
                        name: isProd ? 'file-[hash:base62:8].[ext]' : '[path][name].[ext]',
                        emitFile: isClient
                    }
                },

                {
                    test: config.files.images,
                    use: [
                        'file-loader',
                        {
                            loader: 'image-webpack-loader'
                        }
                    ]
                },

                {
                    test: config.files.video,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000
                        }
                    }
                }
            ]
        },

        plugins: [
            // Improves OS Compat
            // See: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
            new CaseSensitivePathsPlugin(),

            isDev ? new webpack.NamedModulesPlugin() : null,
            isDev ? new webpack.NoEmitOnErorsPlugin() : null,

            // Generates IDs that preserve over builds
            // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
            isProd ? new webpack.HashedModuleIdsPlugin() : null,

            // Hoists statics
            isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,

            isProd ? new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                defaultSizes: isServer ? 'parsed' : 'gziped',
                logLevel: 'silent',
                openAnalyzer: false,
                reportFilename: 'report.html'
            }) : null
        ].filter(Boolean)
    }
}
