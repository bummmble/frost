export function configureEntry(isDev, isServer, { entry, webpack, framework }) {
    const mainEntry = isServer ? entry.server : entry.client;
    const entry = { main: [mainEntry] };

    if (!isServer && isDev && webpack.useHmr) {
        entry.main = [
            ...entry.main,
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo-false'
        ];
    }

    if (!isServer && framework.name === 'react' && framework.react.useHotLoader) {
        entry.main = [
            'react-hot-loader',
            ...entry.main
        ];
    }

    return entry;
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
