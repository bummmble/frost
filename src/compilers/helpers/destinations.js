export function configureEntry(isDev, isServer, { entry, webpack, framework }) {
    const currentEntry = isServer ? entry.server : entry.client;
    const mainEntry = { main: [currentEntry] };

    if (!isServer && isDev && webpack.useHmr) {
        mainEntry.main = [
            ...mainEntry.main,
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo-false'
        ];
    }

    if (!isServer && framework.name === 'react' && framework.react.useHotLoader) {
        mainEntry.main = [
            'react-hot-loader',
            ...mainEntry.main
        ];
    }

    return mainEntry;
}

export function configureOutput(isDev, isServer, { output }) {
    return {
        libraryTarget: isServer ? 'commonjs2' : 'var',
        filename: isDev || isServer ? '[name].js' : '[name].[chunkhash].js',
        chunkFilename: isDev || isServer ? '[name].js' : '[name].[chunkhash].js',
        publicPath: output.publicPath,
        path: isServer ? output.server : output.client,
        pathinfo: isDev,
        crossOriginLoading: 'anonymous'
    };
}
