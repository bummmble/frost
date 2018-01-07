export function configureEntry(isDev, isServer, config) {
    const mainEntry = isServer ? config.entry.server : config.entry.client;
    const entry = { main: [mainEntry] };

    if (!isServer && isDev && config.webpack.useHmr) {
        entry.main = [
            ...entry.main,
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo-false'
        ];
    }

    return entry;
}

export function configureOutput(isDev, isServer, config) {
    return {
        libraryTarget: isServer ? 'commonjs2' : 'var',
        filename: isDev || isServer ? '[name].js' : '[name].[chunkhash].js',
        chunkFilename: isDev || isServer ? '[name].js' : '[name].[chunkhash].js',
        publicPath: config.output.public,
        path: isServer ? config.output.server : config.output.client,
        pathinfo: isDev,
        crossOriginLoading: 'anonymous'
    };
}
