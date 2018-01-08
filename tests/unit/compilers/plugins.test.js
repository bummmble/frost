import test from 'ava';
import { getPluginNames } from '../../helpers/compiler';
import { createExtractPlugin, createProvidedPlugin } from '../../../src/compilers/plugins';

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

