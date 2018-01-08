import createStyleLoader from './styles';
import { objectRemoveEmpty } from '../../utils';

export function createJsLoader(babelEnv, { babelOptions } = {}) {
    return [{
        loader: 'babel-loader',
        options: {
            ...babelOptions,
            forceEnv: babelEnv
        }
    }];
}

export function createElmLoader() {
    return [{ loader: 'elm-webpack-loader' }];
}

export function createRustLoader() {
    return [{ loader: 'rust-wasm-loader' }];
}
export function createTsLoader() {
    return [{ loader: 'ts-loader' }];
}

export default function createLoaders(isDev, isServer, babelEnv, config) {
    return objectRemoveEmpty({
        js: createJsLoader(babelEnv, config),
        ts: config.useTypescript ? createTsLoader() : '',
        elm: config.useElm ? createElmLoader() : '',
        rust: config.useRust ? createRustLoader() : '',
        styles: createStyleLoader(isDev, isServer, config)
    });
}
