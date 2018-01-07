import { isString, isBoolean } from '../../utils';

export default function createDevtool(isProd, { sourceMaps, compression, useTypescript }) {
    let devtool = false;

    if (isBoolean(sourceMaps)) {
        if (sourceMaps === true) {
            devtool = isProd ? 'source-map' : 'eval';
        }
    }

    if (isString(sourceMaps)) {
        devtool = sourceMaps;
    }

    // There is currently an issue that seems to
    // be related to this plugin using an outdated
    // version of webpack sources. This is a workaround
    // for that temporarily.
    // See more: https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/68
    if (compression.kind === 'babili') {
        devtool = 'cheap-source-map';
    }

    // Typescript will output inline source-maps to our
    // compiled files, so we need to tell webpack to execute
    // these inline maps
    // See: https://webpack.js.org/guides/typescript/#source-maps
    if (useTypescript) {
        devtool = 'inline-source-map';
    }

    return devtool;

}
