import test from 'ava';
import { getPluginNames, getLoaders } from '../../helpers/compiler';
import testConfig from '../../helpers/test.config';
import BaseCompiler from '../../../src/compilers/base';

const props = {
    isDev: true,
    isProd: false,
    isClient: true,
    isServer: false
};

// --- Main Compiler Functions ---
// BaseCompiler(props, config)

test('Should create a valid development compiler for client', t => {
    const base = BaseCompiler(props, testConfig);
    const names = getPluginNames(base.plugins.filter(Boolean));
    t.true(base.entry.main.includes('tests/fixtures/client/index.js'));
    t.true(names.includes('NamedModulesPlugin'));
    t.true(names.includes('NoEmitOnErrorsPlugin'));
});

test('Should create a valid production compiler for client', t => {
    const base = BaseCompiler({
        ...props,
        isDev: false,
        isProd: true
    }, testConfig);
    const names = getPluginNames(base.plugins.filter(Boolean));
    t.true(names.includes('HashedModuleIdsPlugin'));
    t.true(names.includes('ModuleConcatenationPlugin'));
    t.true(names.includes('BundleAnalyzerPlugin'));
});

test('Should create a valid development compiler for server', t => {
    const base = BaseCompiler({
        ...props,
        isClient: false,
        isServer: true
    }, testConfig);
    const names = getPluginNames(base.plugins.filter(Boolean));
    t.true(base.entry.main.includes('tests/fixtures/server/index.js'));
});

test('Should create a valid production compiler for server', t => {
    const base = BaseCompiler({
        isDev: false,
        isProd: true,
        isServer: true,
        isClient: false
    }, testConfig);
    const names = getPluginNames(base.plugins.filter(Boolean));
    t.true(names.includes('HashedModuleIdsPlugin'));
    t.true(names.includes('BundleAnalyzerPlugin'));
});


// --- Config Options ---

test('Should create the proper loaders without happypack', t => {
    const config = {
        ...testConfig,
        useElm: true,
        useTypescript: true,
        useRust: true,
        styles: {
            ...testConfig.styles,
            cssLoader: true
        }
    };
    const base = BaseCompiler(props, config);
    const loaders = getLoaders(base.module.rules, false);
    t.true(loaders.includes('elm-webpack-loader'));
    t.true(loaders.includes('ts-loader'));
    t.true(loaders.includes('rust-wasm-loader'));
});

test('Should create the prop loaders with happypack enabled', t => {
    const config = {
        ...testConfig,
        useElm: true,
        useTypescript: true,
        useRust: true,
        webpack: {
            ...testConfig.webpack,
            useHappyPack: true
        }
    };
    const base = BaseCompiler(props, config);
    const loaders = getLoaders(base.module.rules, true);
    const names = getPluginNames(base.plugins.filter(Boolean));
    const prefix = 'happypack/loader?id='
    t.true(loaders.includes(`${prefix}js`));
    t.true(loaders.includes(`${prefix}styles`));
    t.true(loaders.includes(`${prefix}elm`));
    t.true(loaders.includes(`${prefix}rust`));
    t.true(loaders.includes(`${prefix}ts`));

    let happyCount = 0;
    names.forEach(name => { if (name === 'HappyPlugin') happyCount++ });
    t.true(happyCount === 5);
});

test('Should only apply happypack to styles if they are not being extracted', t => {
    const config = {
        ...testConfig,
        useElm: true,
        useTypescript: true,
        useRust: true,
        webpack: {
            ...testConfig.webpack,
            useHappyPack: true
        },
        styles: {
            ...testConfig.styles,
            cssLoader: true,
            extract: 'text'
        }
    };
    const base = BaseCompiler(props, config);
    const loaders = getLoaders(base.module.rules, true);
    const names = getPluginNames(base.plugins.filter(Boolean));
    t.true(!loaders.includes('happypack/loader?id=styles'));

    let happyCount = 0;
    names.forEach(name => {
        if (name === 'HappyPlugin') {
            happyCount++;
        }
    });
    t.true(happyCount === 4);
});
