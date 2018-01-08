import test from 'ava';
import testConfig from '../../helpers/test.config';

import createLoaders, {
    createJsLoader,
    createElmLoader,
    createRustLoader,
    createTsLoader
} from '../../../src/compilers/helpers/loaders';

// -- Main Loaders --
// createLoaders(isDev, isServer, babelEnv, config)

test('Should create loaders if specified in config', t => {
    const config = {
        ...testConfig,
        useElm: true,
        useRust: true
    };
    const loaders = createLoaders(false, false, 'test', config);
    const keys = Object.keys(loaders);
    t.true(keys.length === 4);
    t.true(keys.includes('js'));
    t.true(!keys.includes('ts'));
    t.true(keys.includes('elm'));
    t.true(keys.includes('rust'));
    t.true(keys.includes('styles'));
});

test('Should only create the loaders that are specified', t => {
    const config = {
        ...testConfig,
        useTypescript: true
    };
    const loaders = createLoaders(false, false, 'test', config);
    const keys = Object.keys(loaders);
    t.true(keys.length === 3);
    t.true(keys.includes('ts'));
    t.true(!keys.includes('elm'));
    t.true(!keys.includes('rust'));
});

// --- JS Loader ---
// createJsLoader(babelEnv, config)
test('Should create a loader and apply config options', t => {
    const config = {
        babelOptions: {
            loose: true
        }
    };
    const [loader] = createJsLoader('test', config);
    t.true(loader.options.loose === true);
    t.true(loader.options.forceEnv == 'test');
});

// --- Other Loaders ---
test('Should create other loaders', t => {
    const [elm] = createElmLoader();
    const [rust] = createRustLoader();
    const [ts] = createTsLoader();
    t.true(elm.loader === 'elm-webpack-loader');
    t.true(rust.loader === 'rust-wasm-loader');
    t.true(ts.loader === 'ts-loader');
});
