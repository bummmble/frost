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

