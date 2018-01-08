import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ExtractCSSChunks from 'extract-css-chunks-webpack-plugin';

export function createExtractPlugins(isDev, { styles }) {
    let options = { filename: isDev ? '[name].css' : '[name]-[contenthash:base62:8].css' };
    if (styles.extractOptions) {
        options = {
            ...options,
            ...styles.extractOptions
        };
    }

    if (styles.extract === 'text') {
        return new ExtractTextPlugin(options);
    }
    if (styles.extract === 'chunks') {
        return new ExtractCSSChunks(options);
    }

    return false;
}
