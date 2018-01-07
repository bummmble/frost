import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ExtractCSSChunks from 'extract-css-chunks-webpack-plugin';

export default function createExtractPlugins(isDev, { styles }) {
    if (styles.extract === 'text') {
        return new ExtractTextPlugin({
            filename: isDev ? '[name].css' : '[name]-[contenthash:base62:8].css'
        });
    } else if (styles.extract === 'chunks') {
        return new ExtractCSSChunks({
            filename: isDev ? '[name].css' : '[name]-[contenthash:base62:8].css'
        });
    }

    return false;
}
