import test from 'ava';
import testConfig from '../../helpers/test.config';

import { getPluginNames } from '../../helpers/compiler';
import { createExtractPlugin, createProvidedPlugin, createCommonChunks } from '../../../src/compilers/plugins';
import { createBasicCommons } from '../../../src/compilers/plugins/commons';

// -- Extract Plugin --
// createExtractPlugin(isDev, config)
test('Should return false when extract is not provided', t => {
    const config = {
        styles: {
            extract: 'none',
            extractOptions: {}
        }
    };
    const extract = createExtractPlugin(true, config);
    t.true(extract === false);
});

test('Should return proper file name defaults for environment', t => {
    const config = {
        styles: {
            extract: 'text',
            extractOptions: {}
        }
    };
    const dev = createExtractPlugin(true, config);
    const prod = createExtractPlugin(false, config);
    t.true(dev.filename === '[name].css');
    t.true(prod.filename === '[name]-[contenthash:base62:8].css');
})
test('Should apply extract options', t => {
    const config = {
        styles: {
            extract: 'text',
            extractOptions: {
                filename: 'test.css'
            }
        }
    };
    const extract = createExtractPlugin(true, config);
    t.true(extract.filename === 'test.css');
});

test('Should return a plugin instance from a string', t => {
    const config = {
        plugins: {
            client: ['stats-webpack-plugin']
        }
    };
    const plugins = createProvidedPlugin('client', config);
    const names = getPluginNames(plugins);
    t.true(names.includes('StatsPlugin'));
});

// The follow tests are mostly fluff and are incredibly fragile
// The CommonsChunkPlugin is well tested, but trying to mock it
// for coverage is a waste of time, but this impacts coverage in a
// very annoying way if left out since the client compiler is so small

test('Should the appropriate commonsChunkPlugins', t => {
    const config = {
        ...testConfig,
        entry: {
            ...testConfig.entry,
            vendor: ['react']
        }
    };
    const plugins = createCommonChunks(true, config);
    const [commons] = plugins;

    t.true(plugins.length === 3);
    t.true(commons.filenameTemplate === '[name].js');
});

test('Commons Chunk should handle resources properly', t => {
    const config = {
        ...testConfig,
        entry: {
            ...testConfig.entry,
            vendor: ['path']
        }
    };
    const plugin = createBasicCommons(false, config);
    const item = { resource: 'tests/fixtures/node_modules/path/path.js' };
    t.true(plugin.filenameTemplate === '[name].[chunkhash].js');
    t.true(plugin.minChunks(item) === false);
});

