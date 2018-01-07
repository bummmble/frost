import test from 'ava';
import { configurePerformance, configureDevtool, configureEntry, configureOutput } from '../../../src/compilers/helpers';
import testConfig from '../../helpers/test.config';

// --- Performance ---
// configurePerformance(isDev, isServer, config)

test('Should return false is performance option is false', t => {
    const performance = configurePerformance(false, false, testConfig);
    t.true(performance === false);
});

test('Should evaluate performance option if is object', t => {
    const config = {
        ...testConfig,
        webpack: { ... testConfig.webpack, performance: { hints: 'warning' } }
    };
    const performance = configurePerformance(false, false, config);
    t.true(typeof performance === 'object');
});

test('Should evaluate performance if passed a function', t => {
    const config = {
        ...testConfig,
        webpack: {
            ...testConfig.webpack,
            performance: function(isDev, isServer) {
                return {
                    maxAssetSize: isServer ? 50 : false,
                    hints: isDev ? 'warning' : false
                }
            }
        }
    };

    const performance = configurePerformance(true, true, config);
    t.true(performance.maxAssetSize == 50);
    t.true(performance.hints == 'warning');
});


// --- Devtool ---
// configureDevtool(isProd, config)

test('Should create appropriate sourcemaps for a true option in any environment', t => {
    const config = {
        ...testConfig,
        sourceMaps: true
    };
    const dev = configureDevtool(false, config);
    const prod = configureDevtool(true, config);
    t.true(dev == 'eval');
    t.true(prod == 'source-map');
});

test('Should return false if sourceMaps is false', t => {
    const config = {
        ...testConfig,
        sourceMaps: false
    };
    const tool = configureDevtool(false, config);
    t.true(tool === false);
});

test('Should directly apply devtool is sourcemaps is a string', t => {
    const config = {
        ...testConfig,
        sourceMaps: 'cheap-eval-source-map'
    };
    const tool = configureDevtool(false, config);
    t.true(tool == 'cheap-eval-source-map');
});

test('If babili compression is enabled then devtool should be changed', t => {
    const config = {
        ...testConfig,
        sourceMaps: true,
        compression: {
            ...testConfig.compression,
            kind: 'babili'
        }
    };
    const tool = configureDevtool(false, config);
    t.true(tool == 'cheap-source-map');
});

test('If typesript is enabled then devtool should be changed', t => {
    const config = {
        ...testConfig,
        sourceMaps: true,
        useTypescript: true
    };
    const tool = configureDevtool(false, config);
    t.true(tool == 'inline-source-map');
});
