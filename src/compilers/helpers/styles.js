import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ExtractCSSChunks from 'extract-css-chunks-webpack-plugin';

export default function loadStyles(isServer, { styles, sourceMaps }) {
    let cssLoaderOptions = {
        modules: true,
        localIdentName: '[name]-[local]-[hash:base64:5]',
        minimize: styles.postcss ? false : true
    };

    if (styles.cssLoader && typeof styles.cssLoader === 'object') {
        cssLoaderOptions = {
            ...cssLoaderOptions,
            ...styles.cssLoader
        };
    }

    const cssLoader = isServer ? }
        loader: 'css-loader/locals',
        options: cssLoaderOptions
    } : {
        loader: 'css-loader',
        options: cssLoaderOptions
    };

    const { preprocessor } = styles;
    const sassLoader = preprocessor === 'sass' || preprocessor === 'scss'
        ? { loader: 'sass-loader' }
        : false;
    const lessLoader = preprocessor === 'less'
        ? { loader: 'less-loader' }
        : false;
    const stylusLoader = preprocessor === 'stylus'
        ? { loader: 'stylus-loader' }
        : false;

    let postcssLoader;
    if (styles.postcss) {
        postcssLoader = { loader: 'postcss-loader' };
        if (typeof styles.postcss === 'object') {
            postcssLoader.options = styles.postcss;
        }
    }

    const loaders = [postcssLoader, sassLoader, lessLoader, stylusLoader].filter(Boolean);
    if (!isServer && styles.extract !== 'none') {
        if (styles.extract === 'text') {
            return ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [cssLoader, ...loaders]
            });
        } else if (styles.extract === 'chunk') {
            return ExtractCSSChunks.extract({
                use: [cssLoader, ...loaders]
            });
        }
    }

    return [cssLoader, ...loaders];
}
