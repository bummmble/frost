import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ExtractCSSChunks from 'extract-css-chunks-webpack-plugin';

import { isObject } from '../../utils';

export function generateCssLoader(isDev, isServer, { postcss, cssLoader }) {
    let loaderOptions = {
        modules: true,
        localIdentName: '[name]-[local]-[hash:base64:5]',
        minimize: postcss || isDev ? false : true
    };

    if (isObject(cssLoader)) {
        loaderOptions = {
            ...loaderOptions,
            ...cssLoader
        };
    }

    return {
        loader: isServer ? 'css-loader/locals' : 'css-loader',
        options: loaderOptions
    };
}

export function generatePostcssLoader({ postcss }) {
    return {
        loader: 'postcss-loader',
        options: isObject(postcss) ? postcss : {}
    };
}

export const generateSassLoader = () => ({
    loader: 'sass-loader',
    options: { indentedSyntax: true }
});

export const generateScssLoader = () => ({ loader: 'sass-loader' });
export const generateLessLoader = () => ({ loader: 'less-loader' });
export const generateStylusLoader = () => ({ loader: 'stylus-loader' });

export const preprocessorMap = {
    'sass': generateSassLoader,
    'scss': generateScssLoader,
    'less': generateLessLoader,
    'stylus': generateStylusLoader,
    'styl': generateStylusLoader
};

export default function loadStyles(isDev, isServer, { styles }) {
    const cssLoader = generateCssLoader(isDev, isServer, styles);
    const postcssLoader = styles.postcss ? generatePostcssLoader(styles) : false;
    const loaders = [cssLoader, postcssLoader].filter(Boolean);

    const preprocessor = styles.preprocessor;
    if (preprocessor !== 'none') {
        loaders.push(preprocessorMap[preprocessor]());
    }

    if (!isServer && styles.extract !== 'none') {
        if (styles.extract === 'text') {
            return ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: loaders
            });
        }
        if (styles.extract === 'chunks') {
            return ExtractCSSChunks.extract({
                use: loaders
            });
        }
    }

    return loaders;
}
