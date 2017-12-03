import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';

export default function loadStyles({ isServer, isClient }, { build }) {
    const { sourceMaps, css } = build;

    let postcssLoader;
    if (css.postcss) {
        postcssLoader = { loader: 'postcss-loader' };
        if (typeof css.postcss === 'object') {
            postcssLoader.options = build.postcss;
        }
    }


    let cssLoaderOptions = {
        modules: true,
        localIdentName: '[local]-[hash:base62:8]',
        minimize: css.postcss ? false : true
    };

    if (css.cssLoader && typeof css.cssLoader === 'object') {
        cssLoaderOptions = css.cssLoader;
    }

    const cssLoader = isClient ? {
        loader: 'css-loader',
        options: cssLoaderOptions
    } : {
        loader: 'css-loader/locals',
        options: cssLoaderOptions
    };

    const sassLoader = css.preprocessor === 'sass' || css.preprocessor === 'scss'
        ? { loader: 'sass-loader' }
        : false;
    const lessLoader = css.preprocessor === 'less'
        ? { loader: 'less-loader' }
        : false;
    const stylusLoader = css.preprocessor === 'stylus'
        ? { loader: 'stylus-loader' }
        : false;

    const loaders = [postcssLoader, sassLoader, lessLoader, stylusLoader].filter(Boolean);

    if (css.extract && isClient) {
        if (css.extract === 'text') {
            return ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    cssLoader,
                    ...loaders
                ]
            });
        } else if (css.extract === 'chunks') {
            return ExtractCssChunks.extract({
                use: [
                    cssLoader,
                    ...loaders
                ]
            });
        }
    }
    return [cssLoader, ...loaders];
}
