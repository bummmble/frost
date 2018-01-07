export function jsLoader(babelEnv, { babelOptions } = {}) {
    return [{
        loader: 'babel-loader',
        options: {
            ...babelOptions,
            forceEnv: babelEnv
        }
    }];
}

export function elmLoader() {
    return [{ loader: 'elm-webpack-loader' }]
}
export function rustLoader() {
    return [{ loader: 'rust-wasm-loader' }];
}
export function tsLoader() {
    return { loader: 'ts-loader' };
}
