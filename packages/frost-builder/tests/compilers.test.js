import test from 'ava';
import { loadConfig } from '../src/core/config';
import BaseCompiler from '../src/compilers/base';
import ClientCompiler from '../src/compilers/client';
import ServerCompiler from '../src/compilers/server';

const devCli = {
    isDev: true,
    isProd: false,
    isClient: true,
    isServer: false,
    webpackTarget: 'web'
};

const prodCli = Object.assign(devCli, {
    isProd: true,
    isDev: false
});

const devServer = {
    isDev: true,
    isProd: false,
    isClient: false,
    isServer: true,
    webpackTarget: 'node'
};

const prodServer = Object.assign(devServer, {
    isProd: true,
    isDev: false
});

test('Builds a Development Base config for client', async t => {
    const { config } = await loadConfig('frost', {});
    const results = BaseCompiler(devCli, config);
    t.true(results.entry.main === null);
    t.true(Array.isArray(results.plugins) && results.plugins.length > 0);
});

test('Builds a Production Base config for client', async t => {
    const { config } = await loadConfig('frost', {});
    const results = BaseCompiler(prodCli, config);
    const pluginNames = results.plugins.map(plugin => plugin.constructor.name);
    t.true(pluginNames.includes('BundleAnalyzerPlugin'));
});

test('Base Compiler should produce a default performance when config is true', async t => {
    const { config } = await loadConfig('frost', {});
    config.build.performance = true;
    const result = BaseCompiler(prodCli, config);
    t.true(result.performance.maxEntryPointSize === 1000000);
});

test('Builds a Development Client config', async t => {
    const { config } = await loadConfig('frost', {});
    const result = ClientCompiler(devCli, config);
    t.true(result.entry.main === config.entry.client);
});

test('Builds a Development Server config', async t => {
    const { config } = await loadConfig('frost', {});
    const result = ServerCompiler(devServer, config);
    t.true(result.name === 'server');
    t.true(result.target === 'node');
    t.true(result.entry.main === config.entry.server);
    t.true(result.plugins.map(plugin => plugin.constructor.name).includes('LimitChunkCountPlugin'));
});


// --- Client branches ---- //

test('Client uses HotModule Replacement in Development', async t => {
    const { config } = await loadConfig('frost', {});
    config.build.useHmr = true;

    // weird hack fix
    const result = ClientCompiler({ isDev: true, isProd: false, isClient: true, isServer: false, webpackTarget: 'web' }, config);
    t.true(result.plugins.map(plugin => plugin.constructor.name).includes('HotModuleReplacementPlugin'));
});

test('Client Builder uses babili compression when specified', async t => {
    const { config } = await loadConfig('frost', {});
    config.build.compression.kind = 'babili';
    const result = ClientCompiler(prodCli, config);
    t.true(result.plugins.map(plugin => plugin.constructor.name).includes('BabelMinifyPlugin'));
});

test('Client Compiler uses uglify compression when specified', async t => {
    const { config } = await loadConfig('frost', {});
    config.build.compression.kind = 'uglify';
    const result = ClientCompiler(prodCli, config);
    t.true(result.plugins.map(plugin => plugin.constructor.name).includes('UglifyJsPlugin'));
});

test('Client Compiler should handle vendor Entries', async t => {
    const { config } = await loadConfig('frost', {});
    config.entry.vendor = ['react', '/es6-promise/'];
    const result = ClientCompiler(prodCli, config);
    const chunks = result.plugins
        .map(plugin => plugin.constructor.name)
        .filter(name => name === 'CommonsChunkPlugin');
    console.log(chunks);
    t.true(result.entry.vendor === config.entry.vendor);
    t.true(chunks.length === 2);

})
